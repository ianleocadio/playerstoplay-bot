function createListOfPermissions(functions){
	var map = new Map();
	functions.map(function(f){
		map.set(f.name, {
			"function": f,
			"roles": new Map()
		});
	});
	return map;
}


function uuid(){
	const uuidv4 = require('uuid/v4');
	return uuidv4();
}

function convertEta(interval){
	interval = interval.split(" ");
	m = interval[0].replace("m", "");
	s = interval[1].replace("s", "");
	interval = m*60000 + s*1000;
	return interval;
}
function formatDate(d = new Date()) {
		minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
		hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
		ampm = d.getHours() >= 12 ? 'pm' : 'am',
		months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
		days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	return {
		dayString: days[d.getDay()],
		day: d.getDay(),
		monthString: months[d.getMonth()],
		month: d.getMonth(),
		year: d.getFullYear(),
		hours: hours,
		minutes: minutes,
		ampm: ampm
	}
}

module.exports = {
	"createListOfPermissions": createListOfPermissions,
	"uuid": uuid,
	"convertEta": convertEta,
	"formatDate": formatDate
}