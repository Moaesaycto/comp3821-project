class PolyNode {
    constructor(coxSeq, polygon) {
        this.seq = coxSeq;
        this.polygon = polygon;
        this.left = null;
        this.right = null;
    }
}

class PolyTree {
    constructor(p, q) {
        this.root = null;
        this.p = p;
        this.q = q;
    }

    insert(coxSeq) {
        const newNode = new PolyNode(coxSeq);
        if (this.root === null) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
    }

    insertNode(node, newNode) {
        if (newNode.value < node.value) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }
}