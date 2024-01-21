class Storage {
	static save(obj, key) {
		localStorage.setItem(key, obj);
	}

	static load(key) {
		return localStorage.getItem(key);
	}

	static remove(key) {
		localStorage.removeItem(key);
	} 
}
