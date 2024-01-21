class Segment {
	constructor(pointA, pointB) {
		this.points = [pointA, pointB];
	}

	getLastPoint() {
		return this.points[1];
	}

	updateLastPoint(point) {
		this.points[1] = point;
	}
}
