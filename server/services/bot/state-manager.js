export default () => {

	let storage = {};

	return {
		setState: (key, value) => {
			storage[key] = value;
		},

		getState: (key) => {
			return storage[key];
		},

		updateState: (key, value) => {
			if (typeof value !== "object") {
				throw Error("\'value\' must be an object");
			}

			let stored = storage[key];
			storage[key] = Object.assign(stored, value);

			return storage[key];
		},

		exists: (key) => {
			return storage.hasOwnProperty(key)
		}
	}
}