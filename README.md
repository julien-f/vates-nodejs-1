# Vates-NodeJS

Vates-NodeJS is a tiny Client/Server program using [Node.js technologie](http://nodejs.org/)

## Installation

1. Download the code, you may either use git `git clone git://github.com/julien-f/vates-nodejs-1.git`
2. For run it, just use Node.js command prompt

## How to use

Run the server's main.js before using client's main.js

Currently, only 4 commands can be use for client's main.js :
	
	 --add-host <label>
Use this command to add an host on distant server with the name *label*.
***
	 --rm-host <label>
Use this command to remove an host on distant server with the name *label*.
***
	 --listen-host <label>
Use this command to track any command apply on the host *label*.
***
	 --listen-all-hosts
Use this command to track any command for any host.

## Example

Use **_--add-host [label]_** :
	`node main.js --add-host Machine1`

Client prompt response:

	 command: --add-host argument: Machine1
	 The host has been added.

Server prompt reponse:

	Host: Machine1 has been added

***

Use **_--rm-host [label]_** :
	`node main.js --rm-host Machine1`

Client prompt response:

	 command: --rm-host argument: Machine1
	 The host has been deleted.

Server prompt reponse:

	Host: Machine1 has been deleted

***

Use **_--listen-host [label]_** :
	`node main.js --listen-host Machine2`

Client prompt response:

	 command: --listen-host argument: Machine2
	 A new commande: --add-host was done for: Machine2

Client promt who make a new command for Machine2

	command: --add-host argument: Machine2
	The host has been added.

Server prompt reponse:

	Host: Machine2 has been added

***

Use **_--listen-all-hosts_** :
	`node main.js --listen-all-hosts`

Client prompt response:

	 command: --listen-all-hosts
	 A new commande: --rm-host was done for: Machine2

Client promt who make a new command for any host

	command: --rm-host argument: Machine2
	The host has been added.

Server prompt reponse:

	Host: Machine2 has been deleted

## About vates-nodejs

### Why made that ?

This program was make for discover the new technologie [Node.js](http://nodejs.org/) and who make a simple
Client/Server communication.

### How does work ?

To send a client's to information to server we use [JSONRPC](http://www.jsonrpc.org/) include in [POST (HTTP)](http://en.wikipedia.org/wiki/POST_(HTTP) request.
The server received this request, extract JSONRPC data and process it. After that, the server send to client an answer with the same Protocol.