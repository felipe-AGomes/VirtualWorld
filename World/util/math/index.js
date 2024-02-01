function isNearToPoint(x1, y1, x2, y2, distance = 10) {
	const dist = Math.hypot(x1 - x2, y1 - y2);
	return dist <= distance;
}
