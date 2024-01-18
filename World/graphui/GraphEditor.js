class GraphEditor {
	constructor(canvas) {
		this.canvas = canvas;
		this.graph = new Graph(this.canvas.getContext('2d'));

		this.#addEventListeners();
	}

	#onMousedownEvent(event) {
		this.graph.onMousedownEvent(event);
	}

	#onMousemoveEvent(event) {
		this.graph.onMousemoveEvent(event);
	}

	#onMouseupEvent() {
		this.graph.onMouseupEvent();
	}

	#addEventListeners() {
		this.canvas.addEventListener('mousedown', this.#onMousedownEvent.bind(this));
		this.canvas.addEventListener('mousemove', this.#onMousemoveEvent.bind(this));
		this.canvas.addEventListener('mouseup', this.#onMouseupEvent.bind(this));
		this.canvas.addEventListener('contextmenu', (event) => {
			event.preventDefault();
		});
	}
}
