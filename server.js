var express = require('express');
var fs = require('fs');
var util = require('util');
var https = require('https');
;
var options = {
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt'),
    ca: fs.readFileSync('ssl/ca.crt'),
    requestCert: true,
    rejectUnauthorized: false,
    passphrase: "koko"
};

var auth = function(req, res, next) {

    var cert = req.client.getPeerCertificate ? req.client.getPeerCertificate() : {};

    var msg = [];
    msg.push(req.client.authorized ? "approved" : "denny");
    if(cert.fingerprint) msg.push(cert.fingerprint);
    if(cert.subject) msg.push(cert.subject.L);

    util.log(msg.join("\t"));

    if(req.client.authorized) next();
    else res.json({"status":"denied"}, 401);
}

var app = express();
var http = express();
var appServer = https.createServer(options, app); 

app.use(auth);

app.get('*', function(req, res) {
    res.json({"status":"approved"});
});


//redirect to ssl
http.all('*',function(req,res){  
    res.redirect('https://127.0.0.1:5678'+req.url);
})

appServer.listen(5678);
http.listen(5677);