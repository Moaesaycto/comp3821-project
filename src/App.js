import React, { createContext, useState } from 'react';
import './App.css';
import PoincareDisk from './PoincareDisk';
import Options from './Options';
import { DEFAULT_P, DEFAULT_Q } from './objects/globals';
import { MathJaxContext } from "better-react-mathjax";


export const SchlafliParams = createContext({
  p: DEFAULT_P,
  q: DEFAULT_Q
});

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
      <a
                href="https://moaesaycto.github.io/"
                className="moae-button"
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    backgroundColor: "#6F7072",
                    color: "#fff",
                    textDecoration: "none",
                    borderRadius: "5px",
                    fontWeight: "bold"
                }}
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src={`${process.env.PUBLIC_URL}/moae-logo.png`}
                    alt="MOAE Logo"
                    style={{ marginRight: "5px", height: "20px", verticalAlign: "middle" }}
                />
                <span style={{ verticalAlign: "middle" }}>MOAE</span>
            </a>
    </MathJaxContext>
  );
}

export default App;
