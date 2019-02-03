function createListOfPermissions(functions) {
	var map = new Map();
	functions.map(function (f) {
		map.set(f.name, {
			"function": f,
			"roles": new Map()
		});
	});
	return map;
}

function uuid() {
	const uuidv4 = require("uuid/v4");
	return uuidv4();
}

function convertEta(interval) {
	interval = interval.split(" ");
	let m = interval[0].replace("m", "");
	let s = interval[1].replace("s", "");
	interval = m * 60000 + s * 1000;
	return interval;
}
function formatDate(d = new Date()) {
		let minutes = d.getMinutes().toString().length === 1 ? "0" + d.getMinutes() : d.getMinutes();
		let hours = d.getHours().toString().length === 1 ? "0" + d.getHours() : d.getHours();
		let ampm = d.getHours() >= 12 ? "pm" : "am";
		let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	return {
		"dayString": days[d.getDay()],
		"day": d.getDay(),
		"monthString": months[d.getMonth()],
		"month": d.getMonth(),
		"year": d.getFullYear(),
		hours,
		minutes,
		ampm
	};
}

function arrayToMap(array){
	if (typeof(array) === "undefined" || array === null || array.length === 0){
		return null;
	}
	let map = new Map();
	array.map((elem, i) => {
		map.set(i, elem);
	});
	return map;
}

module.exports = {
	createListOfPermissions,
	uuid,
	convertEta,
	formatDate,
	arrayToMap
};