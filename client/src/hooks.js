//simple tutorial on react hooks -- not part of project
import React, { useState } from 'react';
//completedTodo(index) takes in index to know which todo to mark as completed
//line through the todo is completed
//style={{textDecoration: todo.isCompleted ? 'line-through'
//{todo, index} these are destructed from the props. they rep props

//create Todo component
function Todo({todo, index, completedTodo, removeTodo }){
  return<div style={{textDecoration: todo.isCompleted ? 'line-through' : ''}} 
  className="todo">
  {todo.text}
  <div>
    <button onClick={() => completedTodo(index)}>Complete</button>
    <button onClick={() => removeTodo(index)}>x</button>
  </div>
  </div>
}

//create TodoForm component.  takes in a prop called addTodo
function TodoForm({addTodo}){
  const [value, setValue] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    //prevent submission of empty value
    if(!value) return;
    addTodo(value);
    setValue('');//clear the form
  }
  return(
    <form onSubmit={handleSubmit}>
        <input type="text" value={value} onChange={e => setValue(e.target.value)}/>
    </form>
  )
}

//todos reps the state, just like this.state = todos in a class based component
//, setTodos is the method that updates the state just like setState i class components
function App() {
 const [todos, setTodos] = useState([
   {
     text: 'call eniye',
     isCompleted: false
   },
   {
    text: 'call mum',
    isCompleted: true
  },
  {
    text: 'call dad',
    isCompleted: true
  }
 ]);


 const addTodo = text => {
   //update the state
   //add the text into the existing todos array
   //which is copied using the spread operator
   const newTodos = [...todos, {text}];
    setTodos(newTodos);
 };
 //the prop addTodo calls a methos called addTodo above

 const completedTodo = index => {
    const newTodos = [...todos];
    newTodos[index].isCompleted = true;//mark completed
    setTodos(newTodos);
 };

const removeTodo = index => {
  const newTodos = [...todos];
  newTodos.splice(index, 1);
  setTodos(newTodos);
};

 return (
   <div className="app">
     <div className="todo-list">
        {todos.map((todo, index) => (
          <Todo 
          key={index} 
          index={index} 
          todo={todo}
          completedTodo={completedTodo} 
          removeTodo={removeTodo}/>
        ))}
        <TodoForm addTodo={addTodo} />
     </div>
   </div>
 )
}

export default App;
