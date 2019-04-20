var net = require('net');
var server = net.createServer(function(client){

    console.log('Client connection:');
    console.log('   local socket %s:%s', client.localAddress, client.localPort);
    console.log('   remote socket %s:$s', client.remoteAddress, client.remotePort);
    
    client.setTimeout(500);
    client.setEncoding('utf8');

    client.on('data',function(data){
        console.log('Recieved data from client on port %d: %s', client.remotePort,data.toString());
        console.log('   Bytes recieve: ' + client.bytesRead);
        writeData(client, ' Sending: ' + data.toString());
        console.log('   Bytes sent: ' + client.bytesWritten);
    });

    client.on('end', function(){
        console.log('Client disconnected');
        server.getConnections(function(err, count){
            console.log('Reamining Connections: ' + count);
        });
    });

    client.on('error', function(err){
        console.log('Socket Error: ', JSON.stringify(err));
    });

    client.on('timeout',function(){
        console.log('Socket timed out');
    });
});

server.listen(8107, function(){
    console.log('Server listening: ' + JSON.stringify(server.address()));
    server.on('close', function(){
        console.log('server terminated');
    });
    server.on('error', function(err){
        console.log('Server error: ' + JSON.stringify(err));
    });
});

function writeData(socket, data){
    var success = !socket.write(data);
    if (!success){
        (function(socket, data){
            socket.once('drain',function(){
                writeData(socket, data);
            });
        })(socket,data);
    }
}