#!/usr/bin/nodejs

var http = require('http');

var json_rpc_id = 0;
function json_call(method, params, callback)
{
	// On créé une requête HTTP de type POST.
	http.request(
		{
			'hostname': 'localhost',
			'port':     8080,
			'method':   'POST',
		},
		function(resp) {
			// Nous avons reçu un début de réponse.

			resp.bind('data', function(data) {
				// Nous avons reçu le corps de la réponse, on le parse
				// et appelle la fonction callback() avec son
				// résultat.
				callback(JSON.parse(data).result);
			});
		}
	).end( // On envoie notre requête avec la requête JSON-RPC.
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
	json_call('add_host', [label], function() {
		console.log('The host has been added.');
	});
}

function rm_host(label)
{
	json_call('rm_host', [label], function() {
		console.log('The host has been removed.');
	});
}

function listen_host(label)
{

}

function listen_all_hosts()
{

}

//////////////////////////////////////////////////////////////////////

var args = process.argv.slice(2);

if (!args.length)
{
	console.error('missing argument(s)');
	return;
}

// --add-host <host> --rm-host <host> --listen-host <host> --listen-all-hosts
for (var i = 0, n = args.length; i < n; ++i)
{
	// todo
}
