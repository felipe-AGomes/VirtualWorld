class Mouse {
	mousePoint = null;
	dragging = false;

	constructor() {}

	toggleDragging() {
		this.dragging = !this.dragging;
	}

	isDragging() {
		return this.dragging;
	}

	setMousePoint(point) {
		this.mousePoint = point;
	}

	updatePoint(x, y) {
		this.mousePoint.updatePoint(x, y);
	}
}
