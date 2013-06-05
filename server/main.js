#!/usr/bin/nodejs
var http = require('http');
var EventEmitter = require('events').EventEmitter;


Array.prototype.unset = function(val){
	var index = this.indexOf(val)
	if(index > -1){
		this.splice(index,1)
	}
}

var host = new Array();
var signal = new EventEmitter();

///////////////////////////////////////
server = http.createServer(function(req, res)
{
	//On recup�re la requete du client qui contient des informations en JSONRPC
	req.on('data', function(data) {
	//On partitionne l'information envoyer apr�s avoir transformer en string le buffer re�u
	data = JSON.parse(data.toString());
	
		if (data.method=='--add-host') //Si dans le Data re�u, la m�thode envoy� est --add-host
		{
			if (host.indexOf(data.params[0])===-1) // Si l'host n'existe pas dans notre tableau
			{
				host.push(data.params[0]); //On ajoute l'host dans le tableau des host
				console.log('Host : ' + data.params[0] + ' has been added');
				
				signal.emit('--add-host-', data.params[0]);
					
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

		else if(data.method=='--rm-host') //Si dans le Data re�u, la m�thode envoy� est --rm-host
		{
			if (host.indexOf(data.params[0])===-1) // Si l'host n'existe pas dans notre tableau
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
				host.unset(data.params[0]);
				console.log('Host :' + data.params[0] + ' has been deleted');
				res.end( // On retourne une r�ponse positive au client
					JSON.stringify({
						'jsonrpc': '2.0',
						'result': true,
						'id': data.id,
					})
				);
			}
		}
		
		else if(data.method=='--listen-host')
		{
		
		
		
	});
});

server.listen(8080);


