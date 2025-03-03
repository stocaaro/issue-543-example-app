import { useState, useEffect } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export default function TodoList() {
  const [refTodos, setRefTodos] = useState<Schema["Todo"]["type"][]>([]);
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);

  const fetchTodos = async () => {
    const { data: items } = await client.models.Todo.list({
        filter: {
            reference: {
                attributeExists: false
            }
        }
    });
    setTodos(items);

    const { data: items2 } = await client.models.Todo.list({
        filter: {
            reference: {
                attributeExists: true
            }
        }
    });
    setRefTodos(items2);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const createTodo = async () => {
    const randomString = Math.random().toString(36).substring(7);
    const needsReference =  Math.random() > 0.5
    await client.models.Todo.create({
      content: window.prompt("Todo content?"),
      ...(needsReference ? {reference: randomString} : {})
    });

    fetchTodos();
  }

  return (
    <div>
      <button onClick={createTodo}>Add new todo</button>
      <div>
        <h2>Todo without Ref:</h2>
        <ul>
            {refTodos.map(({ id, content, reference }) => (
            <li key={id}>{content} ({reference})</li>
            ))}
        </ul>
      </div>
      <div>
        <h2>Todo with Ref:</h2>
        <ul>
            {todos.map(({ id, content, reference }) => (
            <li key={id}>{content} ({reference})</li>
            ))}
        </ul>
      </div>
    </div>
  );
}