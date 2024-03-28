import React from 'react';
import { POINCARE_WIDTH, POINCARE_HEIGHT, POINT_RADIUS, POINT_COLOR, LINE_COLOR, LINE_WIDTH } from './globals';

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
        let p1Inverted = pDiskInvert(p1);
        let x11 = p1.x, y11 = p1.y, x12 = p1Inverted.x, y12 = p1Inverted.y;
        let m1 = Math.abs(x12 - x11) === 0 ? Infinity : -(y12 - y11) / (x12 - x11);
        let b1 = (y12 + y11) / 2 - m1 * (x12 + x11) / 2;
    
        let p2Inverted = pDiskInvert(p2);
        let x21 = p2.x, y21 = p2.y, x22 = p2Inverted.x, y22 = p2Inverted.y;
        let m2 = Math.abs(x22 - x21) === 0 ? Infinity : -(y22 - y21) / (x22 - x21);
        let b2 = (y22 + y21) / 2 - m2 * (x22 + x21) / 2;
    
        if (m1 === m2) {
            return null;
        }
    
        let x, y;
        if (m1 === Infinity) {
            x = (x11 + x12) / 2;
            y = m2 * x + b2;
        } else if (m2 === Infinity) {
            x = (x21 + x22) / 2;
            y = m1 * x + b1;
        } else {
            x = (b2 - b1) / (m1 - m2);
            y = m1 * x + b1;
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
    
        const vector1 = { x: svgP1X - svgCenterX, y: svgP1Y - svgCenterY };
        const vector2 = { x: svgP2X - svgCenterX, y: svgP2Y - svgCenterY };

        const crossProduct = vector1.x * vector2.y - vector1.y * vector2.x;
    
        const sweepFlag = crossProduct > 0 ? 1 : 0; // Correctly facing arc
    
        const largeArcFlag = 0; // Minor arc only
    
        const path = `M${svgP1X},${svgP1Y} A${svgRadius},${svgRadius} 0 ${largeArcFlag},${sweepFlag} ${svgP2X},${svgP2Y}`;
        return <path d={path} stroke={LINE_COLOR} fill="none" strokeWidth={LINE_WIDTH.toString()} />;
    }

    // For testing
/*     toSVG() {
        if (!this.center) {
            return null;
        }
    
        const svgCenterX = POINCARE_WIDTH * (this.center.x + 1) / 2;
        const svgCenterY = POINCARE_HEIGHT * (1 - this.center.y) / 2;
        const svgRadius = this.radius * POINCARE_WIDTH / 2;
    
        return <circle cx={svgCenterX} cy={svgCenterY} r={svgRadius} stroke={LINE_COLOR} fill="none" strokeWidth={LINE_WIDTH.toString()} />;
    } */
}

export class Polygon {
    constructor(points) {
        this.points = points;
        this.curves = this.getCurves(points);
    }

    getCurves(points) {
        const curves = [];
        for (let i = 0; i < points.length; i++) {
            curves.push(new Curve(points[i], points[(i + 1) % points.length]));
        }
        return curves;
    }

    toSVG() {
        return this.curves.map(curve => curve.toSVG());
    }

}

// HELPERS

const pDiskInvert = (p) => {
    return new Point(p.x / (p.x * p.x + p.y * p.y), p.y / (p.x * p.x + p.y * p.y));
}

const circleInvert = (p, c, r) => {
    const alpha = r*r/((p.x - c.x) * (p.x - c.x) + (p.y - c.y) * (p.y - c.y))
    return new Point(alpha*(p.x - c.x) + c.x, alpha*(p.y - c.y) + c.y)
}
