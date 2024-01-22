class Graph {
	constructor(ctx, graphPoint, graphSegment, mouse) {
		this.ctx = ctx;
		this.graphPoint = graphPoint;
		this.graphSegment = graphSegment;
		this.mouse = mouse;

		this.load();
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
		if (mouse.mousePoint && mouse.mousePoint !== this.graphPoint.hovered) {
			if (this.graphPoint.hovered) {
				const isOpenPoint = this.graphPoint.isOpenPoint(mouse.mousePoint);
				if (isOpenPoint) {
					this.graphSegment.updateCurrentSegment(this.graphPoint.hovered);
				}

				if (mouse.mousePoint === this.graphPoint.selected && !isOpenPoint) {
					this.graphSegment.updateAllSegmentsOfPoint(
						this.graphPoint.selected,
						this.graphPoint.hovered,
					);
					this.graphPoint.deletePoint(this.graphPoint.selected);
				}

				this.graphPoint.setSelected(this.graphPoint.hovered);
			} else {
				this.graphPoint.addPoint(mouse.mousePoint);
			}
			this.graphSegment.setDotted(null);
		}

		mouse.setMousePoint(null);
	}

	onMousedownEvent(event, mouse) {
		if (event.button === 2) {
			if (this.graphPoint.hovered) {
				this.graphSegment.deleteSegmentsOfPoint(this.graphPoint.hovered);
				this.graphPoint.deleteHoveredPoint();
			}

			return;
		}

		if (this.graphPoint.hovered) {
			this.graphPoint.setSelected(this.graphPoint.hovered);
			mouse.setMousePoint(this.graphPoint.hovered);

			return;
		}

		if (this.graphPoint.points.length === 0) {
			this.graphPoint.addPoint(new Point(event.offsetX, event.offsetY));

			return;
		}

		mouse.setMousePoint(new Point(event.offsetX, event.offsetY));
		this.graphSegment.addSegment(
			new Segment(this.graphPoint.selected, mouse.mousePoint),
		);
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
}
