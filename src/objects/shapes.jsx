import React from 'react';
import { POINCARE_WIDTH, POINCARE_HEIGHT, POINT_RADIUS, POINT_COLOR, LINE_COLOR, LINE_WIDTH } from './globals';

const EPSILON = 1e-10;

export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toSVG() {
        return <circle cx={POINCARE_WIDTH * (this.x + 1) / 2} cy={POINCARE_HEIGHT * (1 - this.y) / 2} r={POINT_RADIUS.toString()} fill={POINT_COLOR} />;
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
        this.radius = this.center ? this.calculateRadius(this.center, p1) : null;
    }

    calculateRadius(center, point) {
        const dx = point.x - center.x;
        const dy = point.y - center.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getCenter(p1, p2) {
        if (p2.x < 0 && Math.abs(p2.y) < EPSILON) [p1, p2] = [p2, p1];

        const [Px, Py, Qx, Qy] = [p1.x, p1.y, p2.x, p2.y];

        if (Math.abs(Px * Qy - Py * Qx) < EPSILON) {
            return null;
        }

        const [iP, iQ] = [pDiskInvert(p1), pDiskInvert(p2)];
        const [Mx, My, Nx, Ny] = [(Px + iP.x) / 2, (Py + iP.y) / 2, (Qx + iQ.x) / 2, (Qy + iQ.y) / 2];

        const mp = Math.abs(Py - My) < EPSILON ? Infinity : -(Px - Mx) / (Py - My);
        const mq = Math.abs(Qy - Ny) < EPSILON ? Infinity : -(Qx - Nx) / (Qy - Ny);
        const bp = My - (mp === Infinity ? 0 : mp * Mx);
        const bq = Ny - (mq === Infinity ? 0 : mq * Nx);

        if (Math.abs(mp - mq) < EPSILON) return null;

        const x = mp === Infinity ? Mx : mq === Infinity ? Nx : (bq - bp) / (mp - mq);
        const y = mp === Infinity ? mq * x + bq : mp * x + bp;

        return new Point(x, y);
    }

    reflect(point) {
        if (!this.center) {
            return reflectAcrossLine(point, this.p1, this.p2);
        }
        return circleInvert(point, this.center, this.radius);
    }

    reflectPolygon(polygon) {
        const reflectedPoints = polygon.points.map(point => this.reflect(point));
        return new Polygon(reflectedPoints);
    }

    toSVG() {
        if (!this.center) {
            return (
                <line
                    x1={POINCARE_WIDTH * (this.p1.x + 1) / 2}
                    y1={POINCARE_HEIGHT * (1 - this.p1.y) / 2}
                    x2={POINCARE_WIDTH * (this.p2.x + 1) / 2}
                    y2={POINCARE_HEIGHT * (1 - this.p2.y) / 2}
                    stroke={LINE_COLOR}
                    strokeWidth={LINE_WIDTH.toString()}
                />
            );
        }

        const [svgP1X, svgP1Y] = [POINCARE_WIDTH * (this.p1.x + 1) / 2, POINCARE_HEIGHT * (1 - this.p1.y) / 2];
        const [svgP2X, svgP2Y] = [POINCARE_WIDTH * (this.p2.x + 1) / 2, POINCARE_HEIGHT * (1 - this.p2.y) / 2];
        const [svgCenterX, svgCenterY] = [POINCARE_WIDTH * (this.center.x + 1) / 2, POINCARE_HEIGHT * (1 - this.center.y) / 2];
        const svgRadius = this.radius * POINCARE_WIDTH / 2;

        if (!isFinite(svgRadius) || isNaN(svgRadius)) return null;

        const vector1 = { x: svgP1X - svgCenterX, y: svgP1Y - svgCenterY };
        const vector2 = { x: svgP2X - svgCenterX, y: svgP2Y - svgCenterY };

        const crossProduct = vector1.x * vector2.y - vector1.y * vector2.x;
        const sweepFlag = crossProduct > 0 ? 1 : 0;

        const angleBetweenPoints = Math.atan2(vector2.y, vector2.x) - Math.atan2(vector1.y, vector1.x);
        if (!isFinite(angleBetweenPoints) || isNaN(angleBetweenPoints)) return null;
        const largeArcFlag = (((angleBetweenPoints % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) > Math.PI ? 0 : 0;

        const path = `M${svgP1X},${svgP1Y} A${svgRadius},${svgRadius} 0 ${largeArcFlag * 1.5},${sweepFlag} ${svgP2X},${svgP2Y}`;
        return <path d={path} stroke={LINE_COLOR} fill="none" strokeWidth={LINE_WIDTH.toString()} />;
    }
}

const reflectAcrossLine = (p, l1, l2) => {
    const [dx, dy] = [l2.x - l1.x, l2.y - l1.y];
    const dot = ((p.x - l1.x) * dx + (p.y - l1.y) * dy) / (dx * dx + dy * dy);
    return new Point(2 * (l1.x + dot * dx) - p.x, 2 * (l1.y + dot * dy) - p.y);
};

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
        return this.curves.map((curve, index) => (
            <React.Fragment key={index}>
                {curve.toSVG()}
            </React.Fragment>
        ));
    }
}

const pDiskInvert = (p) => {
    return circleInvert(p, new Point(0, 0), 1);
};

const circleInvert = (p, c, r) => {
    const dx = p.x - c.x;
    const dy = p.y - c.y;
    const denom = dx * dx + dy * dy;
    if (Math.abs(denom) < EPSILON) return new Point(c.x, c.y);
    const alpha = r * r / denom;
    return new Point(alpha * dx + c.x, alpha * dy + c.y);
};

