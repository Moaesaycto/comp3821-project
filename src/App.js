import React, { createContext, useState } from 'react';
import './App.css';
import PoincareDisk from './PoincareDisk';
import Options from './Options';
import { DEFAULT_P, DEFAULT_Q } from './objects/globals';
import { MathJax, MathJaxContext } from "better-react-mathjax";


export const SchlafliParams = createContext({});

function App() {
  const [p, setP] = useState(DEFAULT_P);
  const [q, setQ] = useState(DEFAULT_Q);
  const [type, setType] = useState("r");

  return (
    <MathJaxContext>
      <div className="App">
        <SchlafliParams.Provider value={{ p, q, type, setP, setQ, setType }}>
          <PoincareDisk />
          <Options />
        </SchlafliParams.Provider>
      </div>
    </MathJaxContext>
  );
}

export default App;
