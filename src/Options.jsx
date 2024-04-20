import React, { useState, useContext } from "react";
import { SchlafliParams } from "./App";

const Options = () => {
    const [p, setP] = useState("");
    const [q, setQ] = useState("");
    const [type, setType] = useState("r");
    const [hasError, setHasError] = useState(false);

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
            console.log({ p: pVal, q: qVal, type });
        }
    };

    return (
        <div className="options-menu">
            <h1>Schläfli Symbols</h1>
            <p>
                Define your custom tiling Schläfli symbol of the form \({"\\{p,q\\}"}\) such that \({"\\displaystyle \\dfrac{1}{p} + \\dfrac{1}{q} < \\dfrac{1}{2}"}\) must hold.
            </p>
            <div className="options-form">
                <p>{"{"}</p>
                <input
                    type="text"
                    id="schlafli-1"
                    className={hasError ? "error" : "no-error"}
                    value={p}
                    onChange={(e) => setP(e.target.value)}
                ></input>
                <p>,</p>
                <input
                    type="text"
                    id="schlafli-2"
                    className={hasError ? "error" : ""}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                ></input>
                <p>{"}"}</p>
                <button type="submit" onClick={schlafliSubmit}>
                    <i className="fa fa-check"></i>
                </button>
            </div>
        </div>
    );
};

export default Options;
