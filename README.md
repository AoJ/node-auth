# Client side SSL certificate authentication in Node.js

Includes 

 - `server.js`: Example HTTPS Node.js server that validates the client cert
 - `express-server.js`: Example [express](http://expressjs.com/) version
 - `client.sh`: A bash script that demonstrates using `curl` as a client
 - `client.js`: A Node.js client example
 - `ssl`: Directory with a bunch of sample certs

More coming soon.  Wanted to recreate the work I did to demonstrate [client cert auth in nginx](blog.nategood.com/client-side-certificate-authentication-in-ngi).  You can check it out for more info about the client side certs process.

Notes

 - The passphrase on these keys are all "password"
 - All examples run on port 5678 for the sake of simplicity (port 443 works just as well assuming you have access)
 - 
 

# Create certs #
1. Create the CA Key and Certificate for signing Client Certs
```bash
openssl genrsa -des3 -out ca.key 4096
openssl req -new -x509 -days 365 -key ca.key -out ca.crt
```

2. Create the Server Key, CSR, and Certificate
```bash
openssl genrsa -des3 -out server.key 1024
openssl req -new -key server.key -out server.csr
```

3. We're self signing our own server cert here.  This is a no-no in production.
```bash
openssl x509 -req -days 365 -in server.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out server.crt
```

4. Create the Client Key, remove pass and create CSR
```bash
openssl genrsa -des3 -out client.key 1024
openssl rsa -in client.key -out client.key
openssl req -new -key client.key -out client.csr
```

5. Sign the client certificate with our CA cert.  Unlike signing our own server cert, this is what we want to do.
```bash
openssl x509 -req -days 365 -in client.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out client.crt
```
