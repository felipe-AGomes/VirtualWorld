class GraphEditor {
	constructor(canvas, graph, mouse, graphState) {
		this.canvas = canvas;
		this.graph = graph;
		this.mouse = mouse;
		this.viewPort = viewPort;
		this.graphState = graphState;

		this.load();
		this.addEventListeners();
	}

	load() {
		this.graphState.load(this.graph);
	}

	clear() {
		this.graphState.clear(this.graph);
	}

	save() {
		this.graphState.save(this.graph);
	}

	draw() {
		this.graph.draw();
	}

	onMousedownEvent(event) {
		this.graph.onMousedownEvent(event, this.mouse);
	}

	onMousemoveEvent(event) {
		this.graph.onMousemoveEvent(event, this.mouse);
	}

	onMouseupEvent() {
		this.graph.onMouseupEvent(this.mouse);
	}

	addEventListeners() {
		this.canvas.addEventListener('mousedown', this.onMousedownEvent.bind(this));
		this.canvas.addEventListener('mousemove', this.onMousemoveEvent.bind(this));
		this.canvas.addEventListener('mouseup', this.onMouseupEvent.bind(this));
		this.canvas.addEventListener('contextmenu', (event) => {
			event.preventDefault();
		});

		this.canvas.addEventListener('wheel', this.viewPort.onWheelEvent);
	}
}
