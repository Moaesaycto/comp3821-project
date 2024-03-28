import React, { useState, useEffect, useContext } from 'react';
import { Point, Polygon } from './objects/shapes';
import { POINCARE_WIDTH, POINCARE_HEIGHT } from './objects/globals';
import { SchlafliParams } from "./App"; 

const PoincareDisk = () => {
    const { p, q, type } = useContext(SchlafliParams);

    const [polygons, setPolygons] = useState([]);

    useEffect(() => {
        console.log('SchlafliParams context changed:', { p, q, type });
        generateCurves(p, q, type);
    }, [p, q, type]);


/*     let x = 1, y = 1;
    const handleClick = (event) => {
        const rect = event.target.getBoundingClientRect();
            x = (event.clientX - rect.left - POINCARE_WIDTH / 2) / (POINCARE_WIDTH / 2);
            y = -(event.clientY - rect.top - POINCARE_HEIGHT / 2) / (POINCARE_HEIGHT / 2);

        if (x*x + y*y > 1) {
            return;
        }

        const newPoint = new Point(x, y);
        const newPoints = [...points, newPoint];
        setPoints(newPoints);
    
        if (newPoints.length === 2) {
            setCurve(new Curve(newPoints[0], newPoints[1]));
        } else if (newPoints.length > 2) {
            const curve = new Curve(newPoints[newPoints.length - 2], newPoints[newPoints.length - 1]);
            setPoints(newPoints.slice(-2));
            setCurve(curve);
        }
    }; */
    
    const generateCurves = (p, q, type) => {
        const d = Math.sqrt((Math.tan(Math.PI / 2 - Math.PI / q) - Math.tan(Math.PI / p)) / (Math.tan(Math.PI / 2 - Math.PI / q) + Math.tan(Math.PI / p)))
        
        const polyPoints = [];
        for (let i = 0; i <= p; i++) {
            const x = d * Math.cos(2 * Math.PI * i / p);
            const y = d * Math.sin(2 * Math.PI * i / p);
            polyPoints.push(new Point(x, y));
        }
    
        const newPolygon = new Polygon(polyPoints);
        const newPolygons = [newPolygon];
    
        newPolygons.push(newPolygon.curves[0].reflectPolygon(newPolygon));
        console.log(newPolygon.curves[0]);
/*         newPolygon.curves.forEach(curve => {
            newPolygons.push(curve.reflectPolygon(newPolygon));
        }); */
    
    
        setPolygons(newPolygons);
    }

    return (
        <div>
            <svg
                // onClick={handleClick}
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