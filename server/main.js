#!/usr/bin/nodejs

var http = require('http');
var EventEmitter = require('events').EventEmitter;


Array.prototype.unset = function(val){
	var index = this.indexOf(val)
	if(index > -1){
		this.splice(index,1)
	}
}

var hosts = new Array();
var signal = new EventEmitter();

///////////////////////////////////////
server = http.createServer(function(req, res) {
	//On recup�re la requete du client qui contient des informations en JSONRPC
	req.on('data', function(data) {
	//On partitionne l'information envoyer apr�s avoir transformer en string le buffer re�u
	data = JSON.parse(data.toString());
	
	////////////////////////////////////////

	if (data.method=='add_host') //Si dans le Data re�u, la m�thode envoy� est --add-host
		{
			if (hosts.indexOf(data.params[0])===-1) // Si l'host n'existe pas dans notre tableau
			{
				hosts.push(data.params[0]); //On ajoute l'host dans le tableau des hosts
				console.log('Host : ' + data.params[0] + ' has been added');
				
				signal.emit('add_host', data.params[0]); // Un ev�nement add_host � �t� fait
					
				res.end( // On retourne une r�ponse positive au client
					JSON.stringify({
						'jsonrpc': '2.0',
						'result': true,
						'id': data.id,
					})
				);
			}
			else // Si l'host existe d�ja dans notre tableau
			{
				res.end( // On retourne une r�ponse n�gative au client
					JSON.stringify({
						'jsonrpc': '2.0',
						'result': false,
						'id': data.id,
					})
				);
			}
		}

	////////////////////////////////////////

	else if(data.method=='rm_host') //Si dans le Data re�u, la m�thode envoy� est --rm-host
		{
			if (hosts.indexOf(data.params[0])===-1) // Si l'host n'existe pas dans notre tableau
			{
				res.end( // On retourne une r�ponse n�gative au client
					JSON.stringify({
						'jsonrpc': '2.0',
						'result': false,
						'id': data.id,
					})
				);
			}
			else // Si l'host existe d�ja dans notre tableau
			{
				hosts.unset(data.params[0]); // On retire l'host dans le tableau des hosts
				console.log('Host :' + data.params[0] + ' has been deleted');
				
				signal.emit('rm_host', data.params[0]); // Un ev�nement
							
				res.end( // On retourne une r�ponse positive au client
					JSON.stringify({
						'jsonrpc': '2.0',
						'result': true,
						'id': data.id,
					})
				);
			}
		}
		
	////////////////////////////////////////
	
		else if(data.method=='listen_host')
		{
			var add_host_listener = function (host) {
				if (data.params[0]==host)
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
				if (data.params[0]==host)
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
	
		else if(data.method=='listen_all_host')
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
});

server.listen(8080);


