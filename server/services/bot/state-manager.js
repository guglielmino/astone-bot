export default class StateManager {

	constructor() {
		this.storage = {}
	}

	setState(key, value) {
		this.storage[key] = value;
	}

	getState(key) {
		return this.storage[key];
	}

	updateState(key, value) {
		if(typeof value !== "object") {
			throw Error("\'value\' must be an object");
		}

		let stored = this.storage[key];
		this.storage[key] = Object.assign(stored, value);
		
		return this.storage[key];
	}

	exists(key) {
		return this.storage.hasOwnProperty(key)
	}
}