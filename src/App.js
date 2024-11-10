import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

function App() {

  // State to hold multiple lists
  const [lists, setLists] = useState([
    {
      id: 1,
      name: 'Groceries',
      items: [
        { id: 1, name: 'Milk', completed: false },
        { id: 2, name: 'Bread', completed: true },
      ],
    },
    {
      id: 2,
      name: 'Second',
      items: [
        { id: 1, name: 'Milk', completed: false },
        { id: 2, name: 'Bread', completed: true },
      ],
    },
  ]);


  return (
      <div className="App">
        <h1>Shopping List App</h1>
        {/* Display the name of each list */}
        {lists.map((list) => (
          <div key={list.id}>
            <h2>{list.name}</h2>
            <ul>
              {list.items.map((item) => (
                <li key={item.id}>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => {}}
                  />
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );//END RETURN

  }//END APP

export default App;
