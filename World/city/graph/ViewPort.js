class ViewPort {
	constructor() {
		this.zoom = 1;
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
