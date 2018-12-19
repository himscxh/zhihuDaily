let parseTime = function (timestamp) {
	if(!timestamp) return;
	let week = ['日','一','二','三','四','五','六'];
	let date = String(timestamp).length < 11 ? new Date(timestamp * 1000) : new Date(timestamp);
	let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
	let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
	return {
	   year: date.getFullYear(),
	   month: date.getMonth() + 1,
	   day: date.getDate(),
	   time: hours + ':' + minutes,
	   week: week[date.getDay()]
	}
}


export {parseTime}