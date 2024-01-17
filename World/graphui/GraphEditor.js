class GraphEditor {
	constructor(ctx) {
		this.graph = new Graph(ctx);
		this.selected = null;
	}

	addPoint(point) {
		this.graph.addPoint(point);
	}

	addSegment(segment) {
		this.graph.addSegment(segment);
	}

	onMousedownEvent(event) {
		const point = new Point(event.offsetX, event.offsetY);
		this.addPoint(point);
		this.selected = point;
		this.graph.drawSelected(this.selected);
	}
}
