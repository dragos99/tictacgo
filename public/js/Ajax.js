function Ajax() {

	this.name = 'meAjax';
	this.version = '0.1';


	this.get = function(url, data, callback) {
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(request.readyState === 4) {
				callback(JSON.parse(request.responseText).msg);
			}
		}
		
		var queryData = '';
		if(data)
			queryData = '?data=' + data;
		request.open('GET', url + queryData, true);
		request.send();
	}

	this.post = function(url, data, callback) {
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(request.readyState === 4) {
				callback(JSON.parse(request.responseText).msg);
			}
		};

		var msg = {
			data: data
		}


		request.open('POST', url, true);
		request.setRequestHeader("Content-type", "application/json");
		request.send(JSON.stringify(msg));
	}
}


var ajax = new Ajax();