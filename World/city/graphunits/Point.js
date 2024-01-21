class Point {
	constructor(x, y, ray = 10) {
		this.x = x;
		this.y = y;
		this.ray = ray;
	}

	updatePoint(x, y) {
		this.x = x;
		this.y = y;
	}
}
