# Vates-NodeJS

Vates-NodeJS is a tiny Client/Server program using [Node.js technology](http://nodejs.org/).

## Installation

1. Download the code, you may use git `git clone git://github.com/julien-f/vates-nodejs-1.git`.
2. Then run it using Node.js.

## How to use

Run the server before using the client.

	./server/main.js

Currently, only 4 commands can be use with the client:

	./client/main.js --add-host <label>

Use this command to add an host on distant server with the name *label*.

***

	./client/main.js --rm-host <label>
Use this command to remove an host on distant server with the name *label*.

***

	./client/main.js --listen-host <label>

Use this command to track any command apply on the host *label*.

***

	./client/main.js --listen-all-hosts

Use this command to track any command for any host.

## Example

Use **_--add-host &lt;label>_**:

	./client/main.js --add-host Machine1

Client prompt response:

	command: --add-host argument: Machine1
	The host has been added.

Server prompt reponse:

	Host: Machine1 has been added

***

Use **_--rm-host &lt;label>_**:

	node main.js --rm-host Machine1

Client prompt response:

	command: --rm-host argument: Machine1
	The host has been deleted.

Server prompt reponse:

	Host: Machine1 has been deleted

***

Use **_--listen-host &lt;label>_**:

	./client/main.js --listen-host Machine2

Client prompt response:

	command: --listen-host argument: Machine2
	A new commande: --add-host was done for: Machine2

Client promt who make a new command for Machine2

	command: --add-host argument: Machine2
	The host has been added.

Server prompt reponse:

	Host: Machine2 has been added

***

Use **_--listen-all-hosts_**:

	./client/main.js --listen-all-hosts

Client prompt response:

	command: --listen-all-hosts
	A new commande: --rm-host was done for: Machine2

Client promt who make a new command for any host

	command: --rm-host argument: Machine2
	The host has been added.

Server prompt reponse:

	Host: Machine2 has been deleted

## About vates-nodejs

### Why?

This program has been made to discover the new technology [Node.js](http://nodejs.org/) and who make a simple Client/Server communication.

### How does it work?

[JSON-RPC](http://www.jsonrpc.org/) over [HTTP](http://en.wikipedia.org/wiki/HTTP) calls are used to send a client request to the server.

The server will received, parse the JSON-RPC request it contains and process it.

Finally, the server send the answer to then client also encoded in JSON-RPC.
