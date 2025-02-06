import React, { useState, useContext } from "react";
import { SchlafliParams } from "./App";
import { MathJax } from "better-react-mathjax";
import { DEFAULT_P, DEFAULT_Q } from "./objects/globals";

const Options = () => {
    const [p, setP] = useState(DEFAULT_P.toString());
    const [q, setQ] = useState(DEFAULT_Q.toString());
    const [type, setType] = useState("r");
    const [hasError, setHasError] = useState(false);
    void setType;

    const { setP: setGlobalP, setQ: setGlobalQ, setType: setGlobalType } = useContext(SchlafliParams);

    const validateInputs = () => {
        const pVal = parseInt(p);
        const qVal = parseInt(q);

        if (isNaN(pVal) || isNaN(qVal) || 1 / pVal + 1 / qVal >= 0.5) {
            setHasError(true);
            return false;
        } else {
            setHasError(false);
            return true;
        }
    };

    const schlafliSubmit = (event) => {
        event.preventDefault();
        if (validateInputs()) {
            const pVal = parseInt(p);
            const qVal = parseInt(q);
            setGlobalP(pVal);
            setGlobalQ(qVal);
            setGlobalType(type);
        }
    };

    const adjustInputWidth = (input) => {
        const span = document.createElement("span");
        span.style.visibility = "hidden";
        span.style.position = "absolute";
        span.style.whiteSpace = "pre";
        span.style.font = window.getComputedStyle(input).font;
        span.textContent = input.value || input.placeholder || " ";
        document.body.appendChild(span);
        input.style.width = `${span.offsetWidth + 10}px`;
        document.body.removeChild(span);
    };

    return (
        <div className="options-menu" style={{ position: "relative" }}>
            <h1>Schläfli Symbols</h1>
            <MathJax dynamic={true}>
                <p>
                    Define your custom tiling Schläfli symbol of the form \({"\\{p,q\\}"}\) such that \({"\\displaystyle \\dfrac{1}{p} + \\dfrac{1}{q} < \\dfrac{1}{2}"}\) must hold.
                </p>
            </MathJax>
            <div className="options-form">
                <p>{"{"}</p>
                <input
                    type="text"
                    id="schlafli-1"
                    className={hasError ? "error" : "no-error"}
                    value={p}
                    onChange={(e) => {
                        setP(e.target.value);
                        adjustInputWidth(e.target);
                    }}
                    style={{ width: `${p.length + 1}ch` }} // Dynamic width
                />
                <p>,</p>
                <input
                    type="text"
                    id="schlafli-2"
                    className={hasError ? "error" : ""}
                    value={q}
                    onChange={(e) => {
                        setQ(e.target.value);
                        adjustInputWidth(e.target);
                    }}
                    style={{ width: `${q.length + 1}ch` }} // Dynamic width
                />
                <p>{"}"}</p>
                <button type="submit" onClick={schlafliSubmit}>
                    <i className="fa fa-check"></i>
                </button>
            </div>
            <a
                href="https://moaesaycto.github.io/"
                className="moae-button"
                style={{
                    position: "absolute",
                    bottom: "10px",
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
        </div>
    );
};

export default Options;
