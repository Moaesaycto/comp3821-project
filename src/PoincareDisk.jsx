import React, { useState, useEffect, useContext } from 'react';
import { Point, Polygon, Curve } from './objects/shapes';
import { POINCARE_WIDTH, POINCARE_HEIGHT } from './objects/globals';
import { SchlafliParams } from "./App"; 
import { PolygonTree } from './math/tree';

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

    /*      for (let i in polyPoints) {
            console.log(polyPoints[i]);
        }
     */

        // Implementation for submission
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

    return (
        <div>
            <svg
                width={POINCARE_WIDTH}
                height={POINCARE_HEIGHT}
                // style={{ border: '1px solid black', borderRadius: '100%' }}
            >
                <circle cx={POINCARE_WIDTH / 2} cy={POINCARE_HEIGHT / 2} r={POINCARE_WIDTH / 2} fill="white" />
                {polygons.map(polygon => polygon.toSVG())}
            </svg>
        </div>
    );
};

export default PoincareDisk;