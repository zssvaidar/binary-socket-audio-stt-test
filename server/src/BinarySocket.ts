import { isNil } from  'lodash';
import IOC from 'sosise-core/build/ServiceProviders/IOC';
import dotenv from 'dotenv';
dotenv.config();

var binaryServer = require('binaryjs').BinaryServer,
    https = require('https'),
    connect = require('connect'),
    fs = require('fs'),
    wav = require('wav')

var app = connect();
var options = {
    key:    fs.readFileSync('ssl/server.key'),
    cert:   fs.readFileSync('ssl/server.crt'),
};
var server = https.createServer(options,app);

server.listen(9192);

var server = binaryServer({server:server});

server.on('connection', function(client) {

    console.log("new connection...");
    var fileWriter = null;
    var writeStream = null;

    client.on('stream', function(stream, meta) {
        console.log(meta.sampleRate);
        var fileName = "" + new Date().getTime();
        
        fileWriter = new wav.FileWriter(fileName + ".wav", {
            channels: 1,
            sampleRate: meta.sampleRate,
            bitDepth: 16 });
        stream.pipe(fileWriter);
    });

    client.on('close', function() {
        if ( fileWriter != null ) {
            fileWriter.end();
        } else if ( writeStream != null ) {
            writeStream.end();
        }
        console.log("Connection Closed");
    });
})

