class GraphState {
	constructor() {}

	load(graph) {
		const city = JSON.parse(Storage.load('city'));

		if (!city) {
			return;
		}

		graph.load(city.graphPoint, city.graphSegment);
	}

	clear(graph) {
		graph.clearPoints();
		graph.clearSegments();
		Storage.remove('city');
	}

	save(graph) {
		Storage.save(JSON.stringify(graph), 'city');
	}
}
