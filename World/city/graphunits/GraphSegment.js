class GraphSegment {
	segments = [];

	constructor(ctx) {
		this.ctx = ctx;
	}

	addSegment(segment) {
		this.segments.push(segment);
		console.log(this.segments);
	}

	updateCurrentSegment(point) {
		this.segments[this.segments.length - 1].points[1] = point;
	}

	updateAllSegmentsOfPoint(oldPoint, newPoint) {
		this.segments = this.segments.map((segment) => {
			segment.points = segment.points.map((point) => {
				if (point === oldPoint) {
					return newPoint;
				}

				return point;
			});

			return segment;
		});
	}

	deleteSegmentsOfPoint(point) {
		this.segments = this.segments.filter(
			(segment) => segment.points[0] != point && segment.points[1] != point,
		);
	}

	draw() {
		for (const segment of this.segments) {
			this.ctx.beginPath();
			this.ctx.moveTo(segment.points[0].x, segment.points[0].y);
			this.ctx.lineTo(segment.points[1].x, segment.points[1].y);
			this.ctx.lineWidth = 2;
			this.ctx.stroke();
		}
	}
}
