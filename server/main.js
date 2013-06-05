#!/usr/bin/nodejs

var http = require('http');
var EventEmitter = require('events').EventEmitter;


Array.prototype.unset = function(val){
	var index = this.indexOf(val)
	if(index > -1){
		this.splice(index,1)
	}
}

var hosts = [];
var signal = new EventEmitter();

///////////////////////////////////////

http.createServer(function(req, res) {
	//On recupère la requete du client qui contient des informations en JSONRPC
	req.on('data', function(data) {
		//On partitionne l'information envoyer après avoir transformer en string le buffer reçu
		data = JSON.parse(data.toString());

		////////////////////////////////////////

		if ('add_host' === data.method) //Si dans le Data reçu, la méthode envoyé est --add-host
		{
			if (-1 === hosts.indexOf(data.params[0])) // Si l'host n'existe pas dans notre tableau
			{
				hosts.push(data.params[0]); // On ajoute l'host dans le tableau des hosts
				console.log('Host: ' + data.params[0] + ' has been added');

				signal.emit('add_host', data.params[0]); // Un evènement add_host à été fait

				res.end( // On retourne une réponse positive au client
					JSON.stringify({
						'jsonrpc': '2.0',
						'result': true,
						'id': data.id,
					})
				);
			}
			else // Si l'host existe déja dans notre tableau
			{
				res.end( // On retourne une réponse négative au client
					JSON.stringify({
						'jsonrpc': '2.0',
						'result': false,
						'id': data.id,
					})
				);
			}
		}

		////////////////////////////////////////

		else if('rm_host' === data.method) // Si dans le Data reçu, la méthode envoyé est --rm-host
		{
			if (-1 === hosts.indexOf(data.params[0])) // Si l'host n'existe pas dans notre tableau
			{
				res.end( // On retourne une réponse négative au client
					JSON.stringify({
						'jsonrpc': '2.0',
						'result': false,
						'id': data.id,
					})
				);
			}
			else // Si l'host existe déja dans notre tableau
			{
				hosts.unset(data.params[0]); // On retire l'host dans le tableau des hosts
				console.log('Host:' + data.params[0] + ' has been deleted');

				signal.emit('rm_host', data.params[0]); // Un evènement

				res.end( // On retourne une réponse positive au client
					JSON.stringify({
						'jsonrpc': '2.0',
						'result': true,
						'id': data.id,
					})
				);
			}
		}

		////////////////////////////////////////

		else if('listen_host' === data.method)
		{
			var add_host_listener = function (host) {
				if (data.params[0] === host)
				{
					res.end(
						JSON.stringify({
							'jsonrpc': '2.0',
							'result': host,
							'id': data.id,
						})
					);
					signal.removeListener('add-host', add_host_listener);
					signal.removeListener('rm-host', rm_host_listener);
				}
			};

			var rm_host_listener = function (host) {
				if (data.params[0] === host)
				{
					res.end(
						JSON.stringify({
							'jsonrpc': '2.0',
							'result': host,
							'id': data.id,
						})
					);
					signal.removeListener('add_host', add_host_listener);
					signal.removeListener('rm_host', rm_host_listener);
				}
			};

			signal.on('add_host', add_host_listener);
			signal.on('rm_host', rm_host_listener);
		}

		////////////////////////////////////////

		else if('listen_all_host' === data.method)
		{
			var add_host_listener = function (host) {
				res.end(
					JSON.stringify({
						'jsonrpc': '2.0',
						'result': ['--add-host', host],
						'id': data.id,
					})
				);
				signal.removeListener('add-host', add_host_listener);
				signal.removeListener('rm-host', rm_host_listener);
			};

			var rm_host_listener = function (host) {
				res.end(
					JSON.stringify({
						'jsonrpc': '2.0',
						'result': ['--rm-host', host],
						'id': data.id,
					})
				);
				signal.removeListener('add_host', add_host_listener);
				signal.removeListener('rm_host', rm_host_listener);
			};

			signal.on('add_host', add_host_listener);
			signal.on('rm_host', rm_host_listener);
		}
	});
}).listen(8080);
