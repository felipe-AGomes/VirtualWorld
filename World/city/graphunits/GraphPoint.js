class GraphPoint {
	points = [];
	hovered = null;
	selected = null;
	isDragging = false;

	constructor(ctx) {
		this.ctx = ctx;
	}

	addPoint(point) {
		this.points.push(point);
		this.setSelected(point);
		this.setHovered(point);

		console.log(this.points);
	}

	setSelected(point) {
		this.selected = point;
	}

	setHovered(point) {
		this.hovered = point;
	}

	isOpenPoint(point) {
		return !this.points.some((p) => p === point);
	}

	draw() {
		for (const point of this.points) {
			if (point == this.selected) {
				this.drawSelectedPoint();
			} else if (point == this.hovered) {
				this.drawHoveredPoint();
			} else {
				this.drawPoint(point);
			}
		}
	}

	drawPoint(point) {
		this.paintPoint(point);
	}

	drawHoveredPoint() {
		this.paintPoint(this.hovered);
		this.paintPoint(this.hovered, { color: 'yellow', rayPercent: 0.4 });
	}

	drawSelectedPoint() {
		this.paintPoint(this.selected);
		this.paintPoint(this.selected, { color: 'yellow', rayPercent: 0.6 });
		this.paintPoint(this.selected, { rayPercent: 0.4 });
	}

	paintPoint(point, { color = 'black', rayPercent = 1 } = {}) {
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.arc(point.x, point.y, point.ray * rayPercent, 0, Math.PI * 2);
		this.ctx.fill();
	}

	tryGetPointClose(x, y) {
		for (const point of this.points) {
			if (isNearToPoint(x, y, point.x, point.y, 12)) {
				return point;
			}
		}
	}

	deletePoint(point) {
		if (!point) {
			return;
		}

		this.points = this.points.filter((p) => p !== point);
	}

	deleteHoveredPoint() {
		if (this.hovered) {
			this.points = this.points.filter((p) => p !== this.hovered);
		}
	}
}
