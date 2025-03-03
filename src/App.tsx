import './App.css'
import TodoList from './Todo'
import config from '../amplify_outputs.json';
import { Amplify } from 'aws-amplify'
Amplify.configure(config);
function App() {

  return (
    <>
      <div>
        <TodoList />
      </div>
    </>
  )
}

export default App
