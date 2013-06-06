#!/usr/bin/nodejs

var http = require('http'); //Variable de type HTTP

var json_rpc_id = 0; // Variable pour l'ID des requètes en JSONRPC

function json_call(method, params, callback) //Fonction qui passe la méthode et le paramètre en JSON
{
	var option = {
		hostname: 'localhost',
		port: '8080',
		path: '/',
		method: 'POST',
	};

	// On créé une requête HTTP de type POST.
	var req = http.request(option,function(resp) {
		// Nous avons reçu un début de réponse.
		resp.on('data', function(data) {
			// Nous avons reçu le corps de la réponse, on le parse
			// et appelle la fonction callback() avec son
			// résultat.
			callback(JSON.parse(data.toString()).result);// Fonction callback avec le resultat de la réponse JSONRPC du serveur.
		});
	}).end( // On envoie notre requête avec la requête JSON-RPC.
		JSON.stringify({
			'jsonrpc': '2.0',
			'method':  method,
			'params':  params,
			'id':      json_rpc_id++,
		})
	);
}

//////////////////////////////////////////////////////////////////////

function add_host(label)
{
	json_call('add_host', [label], function(result) {
		if (result)
		{
			console.log('The host has been added.');
		}
		else
		{
			console.log('Error, the host name already exist');
		}
	});
}

function rm_host(label)
{
	json_call('rm_host', [label], function(result) {
		if (result)
		{
			console.log('The host has been deleted.');
		}
		else
		{
			console.log('Error, the host name doesn\'t exist');
		}
	});
}

function listen_host(label)
{
	json_call('listen_host', [label], function(result) {
		console.log('A new command: ' + result[0] + ' was done for: ' + label);
	});
}

function listen_all_hosts()
{
	json_call('listen_all_host', [0], function(result) {
		console.log('A new command: ' + result[0] + ' was done for: ' + result[1]);
	});
}

///////////////////////////////////////

var args = process.argv.slice(2);

if (!args.length)
{
	console.error('missing argument(s)');
	return;
}

// --add-host <host> --rm-host <host> --listen-host <host> --listen-all-hosts
for (var i = 0, n = args.length; i < n; ++i)
{
	if (args[i] === '--add-host') // If the argument is --add-host
	{
		console.log('command: ' +args[i] + ' argument: ' +args[i+1]);
		add_host(args[++i]);
	}
	else if (args[i] === '--rm-host')// If the argument is --rm-host
	{
		console.log('command: ' +args[i] + ' argument: ' +args[i+1]);
		rm_host(args[++i]);
	}
	else if(args[i] === '--listen-host')// If the argument is --listen-host
	{
		console.log('command: ' +args[i] + ' argument: ' +args[i+1]);
		listen_host(args[++i]);
	}
	else if(args[i] === '--listen-all-hosts')// If the argument is --listen-all-hosts
	{
		console.log('command: ' +args[i]);
		listen_all_hosts();
	}
	else // If one of all arguments doesn't exist.
	{
		console.log('Unknown command in argurment: ' + args[i]);
	}
}
