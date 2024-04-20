import React from 'react';
import { POINCARE_WIDTH, POINCARE_HEIGHT, POINT_RADIUS, POINT_COLOR, LINE_COLOR, LINE_WIDTH } from './globals';

const colors = ["blue" , "red", "green", "purple", "orange", "yellow", "pink", "brown", "cyan", "magenta", "lime", "indigo", "teal", "maroon", "olive", "navy", "aquamarine", "turquoise", "silver", "gray", "black"];

export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toSVG() {
        return <circle cx={POINCARE_WIDTH*(this.x + 1) / 2} cy={POINCARE_HEIGHT*(1 - this.y) / 2} r={POINT_RADIUS.toString()} fill={POINT_COLOR} />;
    }

    midpoint(p) {
        return new Point((this.x + p.x) / 2, (this.y + p.y) / 2);
    }

    pDiskInvert() {
        return new Point(this.x / (this.x * this.x + this.y * this.y), this.y / (this.x * this.x + this.y * this.y));
    }
}

export class Curve {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.center = this.getCenter(p1, p2);
        this.radius = this.center ? this.calculateRadius(this.center, p1) : 0;
    }

    calculateRadius(center, point) {
        const dx = point.x - center.x;
        const dy = point.y - center.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getCenter(p1, p2) {
        if (p2.x < 0 && p2.y === 0) {
            let temp = p1;
            p1 = p2;
            p2 = temp;
        }

        let Px = p1.x, Py = p1.y, Qx = p2.x, Qy = p2.y;
        let iP = pDiskInvert(p1), iQ = pDiskInvert(p2);
        let iPx = iP.x, iPy = iP.y, iQx = iQ.x, iQy = iQ.y;

        let Mx = (Px + iPx) / 2, My = (Py + iPy) / 2, Nx = (Qx + iQx) / 2, Ny = (Qy + iQy) / 2;
        let mp = -(Px - Mx) / (Py - My), mq = -(Qx - Nx) / (Qy - Ny);
        let bp = My - mp * Mx, bq = Ny - mq * Nx;

        if (Py === iPy) {
            mp = Infinity;
            bp = Mx; // For vertical lines, use x-intercept as 'b'
        } else {
            mp = -(Px - iPx) / (Py - iPy);
            bp = My - mp * Mx;
        }

        if (Qy === iQy) {
            mq = Infinity;
            bq = Nx; // For vertical lines, use x-intercept as 'b'
        } else {
            mq = -(Qx - iQx) / (Qy - iQy);
            bq = Ny - mq * Nx;
        }
        
        let x, y;
        if (mp === mq) {
            // Lines are parallel or coincident; handle as needed
            return null;
        } else if (mp === Infinity) {
            x = bp; // Vertical line, x is constant
            y = mq * x + bq;
        } else if (mq === Infinity) {
            x = bq; // Vertical line, x is constant
            y = mp * x + bp;
        } else {
            x = (bq - bp) / (mp - mq);
            y = mp * x + bp;
        }
    
        return new Point(x, y);
    }
    

    reflect = (point) => {
        return circleInvert(point, this.center, this.radius);
    }

    reflectPolygon = (polygon) => {
        const reflectedPoints = polygon.points.map(point => this.reflect(point));
        return new Polygon(reflectedPoints);
    }

    toSVG() {
        if (!this.center) {
            return null;
        }
    
        const svgP1X = POINCARE_WIDTH * (this.p1.x + 1) / 2;
        const svgP1Y = POINCARE_HEIGHT * (1 - this.p1.y) / 2;
        const svgP2X = POINCARE_WIDTH * (this.p2.x + 1) / 2;
        const svgP2Y = POINCARE_HEIGHT * (1 - this.p2.y) / 2;
        const svgCenterX = POINCARE_WIDTH * (this.center.x + 1) / 2;
        const svgCenterY = POINCARE_HEIGHT * (1 - this.center.y) / 2;
        const svgRadius = this.radius * POINCARE_WIDTH / 2;
    
        // Calculating vector from center to each point
        const vector1 = { x: svgP1X - svgCenterX, y: svgP1Y - svgCenterY };
        const vector2 = { x: svgP2X - svgCenterX, y: svgP2Y - svgCenterY };
    
        // Determining direction of arc (sweepFlag) using cross product
        const crossProduct = vector1.x * vector2.y - vector1.y * vector2.x;
        const sweepFlag = crossProduct > 0 ? 1 : 0;
    
        // Calculating the angle between vectors to determine if the arc should be large
        const angleBetweenPoints = Math.atan2(vector2.y, vector2.x) - Math.atan2(vector1.y, vector1.x);
        const normalizedAngle = ((angleBetweenPoints % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const largeArcFlag = normalizedAngle > Math.PI ? 0 : 0;
    
        // Creating SVG path
        const path = `M${svgP1X},${svgP1Y} A${svgRadius},${svgRadius} 0 ${largeArcFlag},${sweepFlag} ${svgP2X},${svgP2Y}`;
        return (
            <path d={path} stroke={LINE_COLOR} fill="none" strokeWidth={LINE_WIDTH.toString()} />
        );
    }
    

    // For testing purposes only, never used in the actual app
    toSVGCircle() {
        if (!this.center) {
            return null;
        }
    
        const svgCenterX = POINCARE_WIDTH * (this.center.x + 1) / 2;
        const svgCenterY = POINCARE_HEIGHT * (1 - this.center.y) / 2;
        const svgRadius = this.radius * POINCARE_WIDTH / 2;
    
        return <circle cx={svgCenterX} cy={svgCenterY} r={svgRadius} stroke={LINE_COLOR} fill="none" strokeWidth={LINE_WIDTH.toString()} />;
    }
}

export class Polygon {
    constructor(points) {
        this.points = points;
        this.curves = this.getCurves(points);
    }

    getCurves(points) {
        const curves = [];
        for (let i = 0; i < points.length - 1; i++) {
            curves.push(new Curve(points[i], points[(i + 1) % points.length]));
        }
        return curves;
    }

    toSVG() {
        return this.curves.map(curve => curve.toSVG()); //.concat(this.points.map(point => point.toSVG()));
    }

}

// HELPERS

const pDiskInvert = (p) => {
    return circleInvert(p, new Point(0, 0), 1);
}

const circleInvert = (p, c, r) => {
    const alpha = r*r/((p.x - c.x) * (p.x - c.x) + (p.y - c.y) * (p.y - c.y))
    return new Point(alpha*(p.x - c.x) + c.x, alpha*(p.y - c.y) + c.y)
}

function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}