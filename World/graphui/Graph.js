class Graph {
	points = [];
	segments = [];

	constructor(ctx) {
		this.ctx = ctx;

		this.selected = null;
		this.hovered = null;
		this.isDragging = false;
		this.dotted = null;
	}

	onMousemoveEvent(event) {
		const x = event.offsetX;
		const y = event.offsetY;

		this.#setHovered(this.#tryGetPointClose(x, y));

		if (
			this.mouse ||
			(this.selected && this.isDragging && this.selected == this.hovered)
		) {
			if (!this.mouse) {
				this.#setMouse(this.selected);
			}

			this.mouse.setNewPosition(x, y);
		}

		this.#draw();
	}

	onMouseupEvent() {
		if (this.dotted) {
			this.#completeSegment();
		}

		this.#setIsDragging();
		this.mouse = null;
	}

	onMousedownEvent(event) {
		let point = null;
		this.#setIsDragging();

		if (event.button === 2) {
			this.#deletePoint();

			return;
		}

		if (this.hovered) {
			this.#setSelected(this.hovered);
			return;
		}

		if (!this.selected) {
			point = new Point(event.offsetX, event.offsetY);
			this.#addPoint(point);
			this.#setHovered(point);
			this.#setSelected(point);
		}

		if (!point) {
			this.#addDottedSegment(event.offsetX, event.offsetY);
		}
	}

	#addDottedSegment(x, y) {
		this.#setMouse(new Point(x, y));
		const segment = new Segment(this.selected, this.mouse);
		this.#setDotted(segment);
		this.#addSegment(segment);
	}

	#setMouse(point) {
		this.mouse = point;
	}

	#setDotted(segment) {
		this.dotted = segment;
	}

	#setHovered(point) {
		this.hovered = point;
		this.#draw();
	}

	#setIsDragging() {
		this.isDragging = !this.isDragging;
	}

	#setSelected(point) {
		this.selected = point;
		this.#draw();
	}

	#addPoint(point) {
		this.points.push(point);
		this.#draw();
	}

	#addSegment(segment) {
		this.segments.push(segment);
		this.#draw();
	}

	#draw() {
		this.#clearRect();
		this.#drawSegments();
		this.#drawPoints();
	}

	#completeSegment() {
		const point = new Point(
			this.dotted.getLastPoint().x,
			this.dotted.getLastPoint().y,
		);
		this.#addPoint(point);
		this.#setDotted(null);
		this.#updateSegment(point);
		this.#setSelected(point);
	}

	#updateSegment(point) {
		this.segments[this.segments.length - 1].updateLastPoint(point);
	}

	#drawPoints() {
		for (const point of this.points) {
			if (point == this.selected) {
				this.#drawSelectedPoint();
			} else if (point == this.hovered) {
				this.#drawHoveredPoint();
			} else {
				this.#drawPoint(point);
			}
		}
	}

	#drawPoint(point) {
		this.#paintPoint(point);
	}

	#drawHoveredPoint() {
		this.#paintPoint(this.hovered);
		this.#paintPoint(this.hovered, { color: 'yellow', rayPercent: 0.7 });
	}

	#drawSelectedPoint() {
		this.#paintPoint(this.selected);
		this.#paintPoint(this.selected, { color: 'yellow', rayPercent: 0.6 });
		this.#paintPoint(this.selected, { rayPercent: 0.4 });
	}

	#paintPoint(point, { color = 'black', rayPercent = 1 } = {}) {
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.arc(point.x, point.y, point.ray * rayPercent, 0, Math.PI * 2);
		this.ctx.fill();
	}

	#drawSegments() {
		for (const segment of this.segments) {
			if (segment == this.dotted) {
				this.ctx.beginPath();
				this.ctx.moveTo(segment.points[0].x, segment.points[0].y);
				this.ctx.lineTo(segment.points[1].x, segment.points[1].y);
				this.ctx.lineWidth = 2;
				this.ctx.setLineDash([5, 5]);
				this.ctx.stroke();
				this.ctx.setLineDash([]);
			} else {
				this.ctx.beginPath();
				this.ctx.moveTo(segment.points[0].x, segment.points[0].y);
				this.ctx.lineTo(segment.points[1].x, segment.points[1].y);
				this.ctx.lineWidth = 2;
				this.ctx.stroke();
			}
		}
	}

	#tryGetPointClose(x, y) {
		for (const point of this.points) {
			if (this.#isNearToPoint(x, y, point.x, point.y)) {
				return point;
			}
		}
	}

	#isNearToPoint(x1, y1, x2, y2, distance = 10) {
		const dist = Math.hypot(x1 - x2, y1 - y2);
		return dist <= distance;
	}

	#clearRect() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	}

	#deleteSegments(point) {
		for (let i = 0; i < this.segments.length; i++) {
			const segment = this.segments[i];
			for (let j = 0; j < segment.points.length; j++) {
				const segmentPoint = segment.points[j];
				if (segmentPoint == point) {
					this.segments.splice(i, 1);
					this.#draw();
				}
			}
		}
	}

	#deletePoint() {
		if (this.hovered) {
			for (let i = 0; i < this.points.length; i++) {
				const point = this.points[i];
				if (point === this.hovered) {
					this.points.splice(i, 1);
					this.#deleteSegments(point);
					this.#setHovered(null);
				}
			}
		}

		this.#draw();
	}
}
