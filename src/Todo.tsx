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
            // Change field to test different types
            inlineType: {
                attributeExists: false
            }
        }
    });
    setTodos(items);

    const { data: items2 } = await client.models.Todo.list({
        filter: {
            // Change field to test different types
            inlineType: {
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
      // Generate todos with and without these fields randomly
      ...(needsReference ? {
        reference: randomString,
        inlineEnum: 'test3',
        inlineType: { type: 'test' },
        refEnum: 'test2',
        refType: { test: 'testing' },
    } : {})
    });

    fetchTodos();
  }

  return (
    <div>
      <button onClick={createTodo}>Add new todo</button>
      <div>
        <h2>Todo without:</h2>
        <ul>
            {refTodos.map(({ id, content, reference }) => (
            <li key={id}>{content} ({reference})</li>
            ))}
        </ul>
      </div>
      <div>
        <h2>Todo with:</h2>
        <ul>
            {todos.map(({ id, content, reference }) => (
            <li key={id}>{content} ({reference})</li>
            ))}
        </ul>
      </div>
    </div>
  );
}