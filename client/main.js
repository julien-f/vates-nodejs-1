#!/usr/bin/nodejs

//////////////////////////////////////////////////////////////////////

function add_host(label)
{

}

function rm_host(label)
{

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

# --add-host <host> --rm-host <host> --listen-host <host> --listen-all-hosts
for (var i = 0, n = args.length; i < n; ++i)
{
	// todo
}
