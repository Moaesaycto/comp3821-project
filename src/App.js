import React, { createContext, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import PoincareDisk from './PoincareDisk';
import Options from './Options';

export const SchlafliParams = createContext({});

function App() {
  const [p, setP] = useState(5);
  const [q, setQ] = useState(6);
  const [type, setType] = useState("r");

  return (
    <div className="App">
      <SchlafliParams.Provider value={{ p, q, type, setP, setQ, setType }}>
        <PoincareDisk />
        <Options />
      </SchlafliParams.Provider>
    </div>
  );
}

export default App;
