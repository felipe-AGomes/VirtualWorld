class Graph {
	constructor(ctx, viewPort, graphPoint, graphSegment) {
		this.ctx = ctx;
		this.graphPoint = graphPoint;
		this.graphSegment = graphSegment;
		this.viewPort = viewPort;
	}

	onMousemoveEvent(event, mouse) {
		const x = this.viewPort.getPozitionWithZoom(event.offsetX);
		const y = this.viewPort.getPozitionWithZoom(event.offsetY);

		this.graphPoint.setHovered(
			this.graphPoint.tryGetPointClose(x, y, this.viewPort.getZoom()),
		);

		if (mouse.mousePoint) {
			mouse.updatePoint(x, y);
		}
	}

	onMouseupEvent(mouse) {
		if (mouse.mousePoint && this.graphPoint.hovered) {
			const isOpenPoint = this.graphPoint.isOpenPoint(mouse.mousePoint);

			if (isOpenPoint) {
				this.updateCurrentSegment(this.graphPoint.hovered);
			}

			if (!isOpenPoint) {
				this.updateSegmentsForPoint(
					this.graphPoint.selected,
					this.graphPoint.hovered,
				);
				this.deletePoint(this.graphPoint.selected);
			}

			this.graphPoint.setSelected(this.graphPoint.hovered);
		} else if (mouse.mousePoint && this.isNotSelectedPoint(mouse.mousePoint)) {
			this.addPoint(mouse.mousePoint);
		}

		this.graphSegment.setDotted(null);
		mouse.setMousePoint(null);
	}

	updateCurrentSegment(point) {
		this.graphSegment.updateCurrentSegment(point);
	}

	updateSegmentsForPoint(oldPoint, newPoint) {
		this.graphSegment.updateAllSegmentsOfPoint(oldPoint, newPoint);
	}

	isNotSelectedPoint(point) {
		if (point !== this.graphPoint.selected) {
			return true;
		}

		return false;
	}

	addPoint(point) {
		this.graphPoint.addPoint(point);
	}

	onMousedownEvent(event, mouse) {
		if (event.button === 2) {
			this.rightButtonEvent();
		} else if (event.button === 0) {
			this.leftButtonEvent(event, mouse);
		}
	}

	rightButtonEvent() {
		if (this.graphPoint.hovered) {
			this.deleteSegmentsOfPoint(this.graphPoint.hovered);
			this.deletePoint(this.graphPoint.hovered);
		}
	}

	deleteSegmentsOfPoint(point) {
		this.graphSegment.deleteSegmentsOfPoint(point);
	}

	deletePoint(point) {
		this.graphPoint.deletePoint(point);
	}

	leftButtonEvent(event, mouse) {
		const x = this.viewPort.getPozitionWithZoom(event.offsetX);
		const y = this.viewPort.getPozitionWithZoom(event.offsetY);

		if (this.graphPoint.hovered || this.isOnSelectedPoint({ x, y })) {
			const pointToSet = this.graphPoint.hovered
				? this.graphPoint.hovered
				: this.graphPoint.selected;

			this.setSelected(pointToSet);
			this.setMousePoint(mouse, pointToSet);
			this.graphPoint.setHovered(null);
		} else if (this.graphPoint.points.length === 0) {
			this.addPoint(new Point(x, y));
		} else {
			this.addMousePoint(mouse, { x, y });
			this.addSegment(mouse.mousePoint);
		}
	}

	isOnSelectedPoint({ x, y }) {
		if (this.graphPoint.tryGetSelectedPointClose(x, y)) {
			return true;
		}

		return false;
	}

	setSelected(point) {
		this.graphPoint.setSelected(point);
	}

	setMousePoint(mouse, point) {
		mouse.setMousePoint(point);
	}

	addMousePoint(mouse, { x, y }) {
		mouse.setMousePoint(new Point(x, y));
	}

	addSegment(point) {
		this.graphSegment.addSegment(new Segment(this.graphPoint.selected, point));
	}

	draw() {
		this.clearRect();
		this.graphSegment.draw();
		this.graphPoint.draw();
	}

	load(strPoints, strSegments) {
		this.graphPoint.load(strPoints);
		const points = this.graphPoint.points;
		strSegments.segments = strSegments.segments.map((segment) => {
			segment.points = segment.points.map((point) => {
				return points.find((p) => p.x === point.x && p.y === point.y);
			});

			return segment;
		});

		this.graphSegment.load(strSegments);
	}

	clearPoints() {
		this.graphPoint.clear();
	}

	clearSegments() {
		this.graphSegment.clear();
	}

	clearRect() {
		const width = this.viewPort.getPozitionWithZoom(this.ctx.canvas.width);
		const height = this.viewPort.getPozitionWithZoom(this.ctx.canvas.height);

		this.ctx.clearRect(0, 0, width, height);
	}
}
