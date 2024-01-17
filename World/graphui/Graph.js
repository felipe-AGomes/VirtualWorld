class Graph {
	points = [];
	segments = [];

	constructor(ctx) {
		const devicePixelRatio = window.devicePixelRatio || 1;
		this.ctx = ctx;
	}

	addPoint(point) {
		this.points.push(point);
		this.draw();
	}

	addSegment(segment) {
		this.segments.push(segment);
	}

	draw() {
		this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
		this.drawPoints();
		this.drawSegments();
	}

	drawPoints() {
		for (const point of this.points) {
			this.#paintPoint(point);
		}
	}

	drawSegments() {
		for (const segment of this.segments) {
			this.ctx.beginPath();
			this.ctx.moveTo(segment.points[0].x, segment.points[0].y);
			this.ctx.lineTo(segment.points[1].x, segment.points[1].y);
			this.ctx.lineWidth = 2;
			this.ctx.stroke();
		}
	}

	drawSelected(point) {
		this.#paintPoint(point, { color: 'yellow', rayPercent: 0.6 });
		this.#paintPoint(point, { rayPercent: 0.4 });
	}

	#paintPoint(point, { color = 'black', rayPercent = 1 } = {}) {
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.arc(point.x, point.y, point.ray * rayPercent, 0, Math.PI * 2);
		this.ctx.fill();
	}
}
