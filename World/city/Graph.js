class Graph {
	constructor(ctx, graphPoint, graphSegment) {
		this.ctx = ctx;
		this.graphPoint = graphPoint;
		this.graphSegment = graphSegment;

		this.load();
	}

	load() {
		const city = JSON.parse(Storage.load('city'));

		if (!city) {
			return;
		}

		this.graphPoint.load(city.graphPoint);
		const points = this.graphPoint.points;
		city.graphSegment.segments = city.graphSegment.segments.map((segment) => {
			segment.points = segment.points.map((point) => {
				return points.find((p) => p.x === point.x && p.y === point.y);
			});

			return segment;
		});

		this.graphSegment.load(city.graphSegment);
	}

	onMousemoveEvent(event, mouse) {
		this.graphPoint.setHovered(
			this.graphPoint.tryGetPointClose(event.offsetX, event.offsetY),
		);

		if (mouse.mousePoint) {
			mouse.updatePoint(event.offsetX, event.offsetY);
		}
	}

	onMouseupEvent(mouse) {
		if (mouse.mousePoint && this.graphPoint.hovered) {
			const isOpenPoint = this.graphPoint.isOpenPoint(mouse.mousePoint);

			if (isOpenPoint) {
				this.graphSegment.updateCurrentSegment(this.graphPoint.hovered);
			}

			if (!isOpenPoint) {
				this.graphSegment.updateAllSegmentsOfPoint(
					this.graphPoint.selected,
					this.graphPoint.hovered,
				);
				this.graphPoint.deletePoint(this.graphPoint.selected);
			}

			this.graphPoint.setSelected(this.graphPoint.hovered);
		} else if (mouse.mousePoint && this.isNotSelectedPoint(mouse.mousePoint)) {
			this.graphPoint.addPoint(mouse.mousePoint);
		}

		this.graphSegment.setDotted(null);
		mouse.setMousePoint(null);
	}

	isNotSelectedPoint(point) {
		if (point !== this.graphPoint.selected) {
			return true;
		}

		return false;
	}

	onMousedownEvent(event, mouse) {
		if (event.button === 2) {
			this.rightButtonEvent();
		} else {
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
		const x = event.offsetX;
		const y = event.offsetY;

		if (this.graphPoint.hovered || this.isOnSelectedPoint({ x, y })) {
			const pointToSet = this.graphPoint.hovered
				? this.graphPoint.hovered
				: this.graphPoint.selected;

			this.setSelected(pointToSet);
			this.setMousePoint(mouse, pointToSet);
			this.graphPoint.setHovered(null);
		} else if (this.graphPoint.points.length === 0) {
			this.setFirstPoint({ x, y });
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

	setFirstPoint({ x, y }) {
		this.graphPoint.addPoint(new Point(x, y));
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

	clearRect() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	}

	clear() {
		this.graphPoint.clear();
		this.graphSegment.clear();
		Storage.remove('city');
	}

	save() {
		Storage.save(JSON.stringify(this), 'city');
	}
}
