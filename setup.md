Now that you have installed the sandbox, you'll need to install:

- A nats-server that supports websockets (such as the one in the `websocket` branch)
- A set of certificates that is trusted by your browser


## TLS certificates
If you have your own certificates that are trusted by your browser,
simply edit the nats.conf and http.conf files.

Otherwise you'll need to generate TLS certificates that you can use 
that are trusted by your local environment. There are multiple ways 
you can generate certificates. One way is to use `mkcert`.

Install `mkcert` from [https://github.com/FiloSottile/mkcert](https://github.com/FiloSottile/mkcert).
Once installed, type `npm run install-certs`. This will create
a local CA, and generate a certificate (`cert.pem`) and key (`key.pem`) 
in the `certs`  directory of this project.

To uninstall them, simply enter `npm run uninstall-certs`. You'll need to
remove the files by hand.

## Installing a nats-server with websocket support

`npm run install-ns` will clone, build and install a nats-server with websocket support


## Starting the NATS Server
To run `npm run start-nats` will start the nats-server.

Alternatively, to start the nats-server manually:

- `cd` to this project's directory
- `nats-server -c server.conf`

## Starting a built-in http server
`npm run start-http` will start a built-in http server that serves files from `content`
