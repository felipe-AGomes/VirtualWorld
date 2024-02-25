class ViewPort {
	constructor(mouse) {
		this.mouse = mouse;
		this.zoom = 1;
		this.offset = new Point(0, 0);
		this.end = new Point(0, 0);
		this.dragging = false;
	}

	getEnd() {
		return this.end;
	}

	onMousedownEvent(event) {
		if (event.button === 0) {
			console.log(event);
			this.start = new Point(event.offsetX, event.offsetY);
			this.dragging = true;
		}
	}

	onMousemoveEvent(event) {}

	onMouseupEvent(event) {
		this.end = new Point(event.offsetX, event.offsetY);
		this.dragging = false;
	}

	getZoom() {
		return this.zoom;
	}

	getPozitionWithZoom(position) {
		return position * this.zoom;
	}

	onWheelEvent = (event) => {
		const step = 0.1;
		const deltaY = Math.sign(event.deltaY);
		const newZoom = this.zoom + deltaY * step;
		this.zoom = Math.max(1, Math.min(5, newZoom));
	};
}
