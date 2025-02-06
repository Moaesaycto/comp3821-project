import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Point, Polygon } from './objects/shapes';
import { POINCARE_WIDTH, POINCARE_HEIGHT } from './objects/globals';
import { SchlafliParams } from "./App";

const PoincareDisk = () => {
    const { p, q, type } = useContext(SchlafliParams);
    const [polygons, setPolygons] = useState([]);

    const round = (num, decimals = 6) => Number(num.toFixed(decimals));

    const edgeKey = useCallback((p1, p2) => {
        const key1 = `${round(p1.x)}_${round(p1.y)}`;
        const key2 = `${round(p2.x)}_${round(p2.y)}`;
        return (key1 < key2) ? `${key1}_${key2}` : `${key2}_${key1}`;
    }, []);

    const polygonKey = useCallback((polygon) => {
        const keys = polygon.points.map(p => `${round(p.x)}_${round(p.y)}`);
        keys.sort();
        return keys.join('|');
    }, []);

    const computeMaxDepth = (p) => {
        const C = 7;
        const k = 0.5;
        return Math.max(1, Math.floor(C - k * p));
    };

    const generatePolygons = useCallback((p, q) => {
        const d = Math.sqrt((Math.tan(Math.PI / 2 - Math.PI / q) - Math.tan(Math.PI / p)) / (Math.tan(Math.PI / 2 - Math.PI / q) + Math.tan(Math.PI / p)));
        const polyPoints = Array.from({ length: p + 1 }, (_, i) => {
            const angle = 2 * Math.PI * i / p + (p % 2 ? 0 : Math.PI / p);
            return new Point(d * Math.cos(angle), d * Math.sin(angle));
        });
        const initialPolygon = new Polygon(polyPoints);
        const maxDepth = computeMaxDepth(p);
        const queue = [{ polygon: initialPolygon, depth: 0 }];
        const visitedEdges = new Set();
        const visitedPolygons = new Set([polygonKey(initialPolygon)]);
        const newPolygons = [initialPolygon];

        while (queue.length) {
            const { polygon, depth } = queue.shift();
            if (depth >= maxDepth) continue;

            polygon.curves.forEach(curve => {
                const key = edgeKey(curve.p1, curve.p2);
                if (visitedEdges.has(key)) return;
                visitedEdges.add(key);

                const reflectedPolygon = curve.reflectPolygon(polygon);
                const polyKey = polygonKey(reflectedPolygon);
                if (visitedPolygons.has(polyKey)) return;
                visitedPolygons.add(polyKey);
                newPolygons.push(reflectedPolygon);
                queue.push({ polygon: reflectedPolygon, depth: depth + 1 });
            });
        }
        setPolygons(newPolygons);
    }, [edgeKey, polygonKey]);

    useEffect(() => {
        generatePolygons(p, q, type);
    }, [p, q, type, generatePolygons]);

    return (
        <div>
            <svg width={POINCARE_WIDTH} height={POINCARE_HEIGHT}>
                <circle cx={POINCARE_WIDTH / 2} cy={POINCARE_HEIGHT / 2} r={POINCARE_WIDTH / 2} fill="white" />
                {polygons.map((polygon, index) => (
                    <React.Fragment key={index}>
                        {polygon.toSVG()}
                    </React.Fragment>
                ))}
            </svg>
        </div>
    );
};

export default PoincareDisk;
