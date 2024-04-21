import React, { useState, useEffect, useContext } from 'react';
import { Point, Polygon, Curve } from './objects/shapes';
import { POINCARE_WIDTH, POINCARE_HEIGHT } from './objects/globals';
import { SchlafliParams } from "./App"; 
import { PolygonTree } from './math/tree';
import { DownloadIcon } from '@radix-ui/react-icons';

const PoincareDisk = () => {
    const { p, q, type } = useContext(SchlafliParams);

    const [polygons, setPolygons] = useState([]);

    useEffect(() => {
        console.log('SchlafliParams context changed:', { p, q, type });
        generateCurves(p, q, type);
    }, [p, q, type]);
    
    const generateCurves = (p, q, type) => {
        const d = Math.sqrt((Math.tan(Math.PI / 2 - Math.PI / q) - Math.tan(Math.PI / p)) / (Math.tan(Math.PI / 2 - Math.PI / q) + Math.tan(Math.PI / p)));
        
        const polyPoints = [];
        for (let i = 0; i <= p; i++) {
            const x = d * Math.cos(2 * Math.PI * i / p + (p % 2 ? 0 : Math.PI / p)); // p % 2 ? 0 : Math.PI / p is a hack to make the polygon symmetric when p is even
            const y = d * Math.sin(2 * Math.PI * i / p + (p % 2 ? 0 : Math.PI / p)); // also solves a stupid bug when p is even
            polyPoints.push(new Point(x, y));
        }

        const newPolygon = new Polygon(polyPoints);
        const newPolygons = [newPolygon];
    
        newPolygon.curves.forEach(curve => {
            newPolygons.push(curve.reflectPolygon(newPolygon));
        });

        for (let i = 0; i < 1; i++) {
            newPolygons.forEach(polygon => {
                polygon.curves.forEach(curve => {
                    newPolygons.push(curve.reflectPolygon(polygon));
                });
            });
        }
    
        setPolygons(newPolygons);
    }

    const downloadSVG = () => {
        const svgElement = document.getElementById('poincare-svg');
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'poincare.svg';
        link.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div>
            <svg
                id="poincare-svg"
                width={POINCARE_WIDTH}
                height={POINCARE_HEIGHT}
            >
                <circle cx={POINCARE_WIDTH / 2} cy={POINCARE_HEIGHT / 2} r={POINCARE_WIDTH / 2} fill="white" />
                {polygons.map(polygon => polygon.toSVG())}
            </svg>
            <button onClick={downloadSVG} style={
                {
                    position: "absolute",
                    backgroundColor: "#b73333",
                    border: "none",
                    color: "white",
                    textAlign: "center",
                    textDecoration: "none",
                    display: "inline-block",
                    fontSize: "16px",
                    margin: "4px 2px",
                    cursor: "pointer",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    top: "0",
                    right: "0"    
                }
                }><DownloadIcon width={"30px"} height={"30px"}/></button>
        </div>
    );
};

export default PoincareDisk;