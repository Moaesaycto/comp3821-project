import React, { createContext, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import PoincareDisk from './PoincareDisk';
import Options from './Options';
import { DEFAULT_P, DEFAULT_Q } from './objects/globals';

export const SchlafliParams = createContext({});

function App() {
  const [p, setP] = useState(DEFAULT_P);
  const [q, setQ] = useState(DEFAULT_Q);
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
