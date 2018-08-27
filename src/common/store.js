
let storeData = {};

function get(key) {
	return storeData[key]?storeData[key]:'';
}

function set(key, value) {
	storeData[key] = value;
}

let store = {
	get,
	set
};

export default store;
