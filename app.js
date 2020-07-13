"use strict";

var port;
var nodeType;

process.argv.forEach(function (val, index, array) {
    if(index === 2) {
        port = process.env.PORT;
    } else if(index === 3) {
        nodeType = 1
    } else if(index === 4 ) {
        global.globalString = "A1";
    }
});


const socketIo = require("socket.io");
const axios = require("axios");
const mongoose = require('mongoose');
const ip = require("ip")

const SERVER_ID = "03S"
var cors = require('cors');

const UserStore = require("./clientDataStore");
const ConnectedNodeStore = require("./connectedNodeStore")
const SmartContractRunner = require("./SmartContract/runner/SmartContractRunner")
const HalfNodeConnectionStore = require("./halfnodeConnectionStore");

/** Initiate Logging sequence */

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/1debug.log', {flags: 'w'});
var log_stdout = process.stdout;

console.log = function (d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};
/** express initialization */


const express = require("express");
const http = require("http");
const index = require("./index");

const app = express();
app.use(index);
app.use(cors());
app.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


/*
* Initiate the routes
 */
const testFirebaseRoutes = require("./Routes/test.routes");

//define the routes for app
app.use('/api/test', testFirebaseRoutes);

const firebase_app = require('./Util/firebase.config');

//firebase reference
const testRef = firebase_app.database().ref("/sessions/");


const server = http.createServer(app);
server.listen(port, () => console.log(`Create Listening on port ${server.address().port}`));

global.io = require('socket.io')(server);

    global.io.on('connection', function (socket) {
        console.log("Connected Socket = " + socket.id);

        socket.on('authenticate', (data) => {
                const _key = data.token;
                console.log(_key);
                var auth;

                const query = testRef.orderByChild("token").equalTo(_key);

                query.on('value',(snapshot) => {
                    auth = snapshot.val();
                    if(auth !== null) {
                        console.log("Auth request")

                        socket.emit('authenticated');

                    } else {
                        console.log("Unauthorized request")
                        socket.emit('unauthorized',"Unauthorized Token");
                        socket.disconnect()
                    }
                })

        });

        socket.on('client_connection_request', function (data) {
            console.log("client connection request" + data.ip + " " + data.customId);
            UserStore.add(socket.id, data.customId, data.ip, Date.now(), data.cluster);
            const address = leadershipSelectionAlgorithm(socket.id);
            if(SmartContractRunner.getAllContracts().length !== 0) {
                socket.emit('get_all_election_contracts', SmartContractRunner.getAllContracts());
            }
            socket.emit('redirect_url', address);
            ConnectedNodeStore.removeAll();
        });


        socket.on('own_client', function () {
            console.log("My client conected")
        });

        socket.on('disconnect', function () {
            console.log("Disconnected Socket = " + socket.id);
            UserStore.remove(socket.id);
            HalfNodeConnectionStore.remove(socket.id)
            ConnectedNodeStore.removeAll();
        });


        socket.on('server_client', function (data) {
            console.log("SERVER node id" + data)

        });

        socket.on('test_data', function () {
            socket.emit('test_get_info', UserStore.getAll());
            console.log("Pushed" + UserStore.getAll())
        });

        socket.on('getting_connected_node_details', function (data) {
            console.log("Node connection details | url : " + data.url + " Connection Data : " + data.childNodes);
            console.log(data);
            ConnectedNodeStore.add(data.url, data.childNodes, data.cluster);
        });

        socket.on('getting_connected_node_details_from_half_node', function (data) {
            console.log("Half Node connection details | url : " + data.url + " Connection Data : " + data.childNodes);
            ConnectedNodeStore.combineLists(data.url, data.childNodes );
        });

        socket.on('connected_to_directed_node', function (data) {
            // ConnectedNodeStore.removeAll();
            // io.emit('requesting_connection_details');
        });

        socket.on('half_node_connection', function (data) {
            console.log("connected to a half node");
            console.log(data);
            HalfNodeConnectionStore.add(socket.id,"",data,Date.now())
        });

        socket.on('eventToEmit', function(data, callback){
            console.log(data);
            callback('error', data.data);
        });

        socket.on('client_voted', function(data, callback){
            let voteArr = [];
            voteArr = data.data;
            const id = voteArr[0].conId
            SmartContractRunner.addToRecordPool(data, id).then(async () => {
                await SmartContractRunner.mineBlocks(id);
            });
            callback('error', "start_mining");
        });

    });



    if(nodeType === "2") {
        var socket1 = require('socket.io-client')("http://localhost:4003/", {
            forceNew: true
        });

        socket1.on('connect', function () {
            console.log("connected to main node");
            socket1.emit("half_node_connection",ip.address()+":"+port)
        });

        socket1.on('requesting_connection_details', async function () {
            console.log("main node asking connection details");
            global.io.emit('requesting_connection_details');
            const delay = ms => new Promise(res => setTimeout(res, ms));
            await delay(5000);

            socket1.emit('getting_connected_node_details_from_half_node', { "url" : global.globalString, "childNodes" : ConnectedNodeStore.getConnectionDetails()});
        });

        socket1.on('new_election_created', function (data) {
            console.log("Receiving to sub server ");
            io.emit('new_election_created',data);
        });


        socket1.on('disconnect', function () {
        });
    }


function leadershipSelectionAlgorithm(socketId) {

    if(UserStore.getAll().length <= 2 ){
        console.log("Kept the connection" + UserStore.getAll().length);
            return 1;
    } else {
        UserStore.remove(socketId);
        var byDate = UserStore.getAll().slice(0);
        byDate.sort(function(a,b) {
            return a.timestamp - b.timestamp;
        });
        console.log('by date:');
        console.log(byDate);

        byDate[0].timestamp = Date.now();
        console.log(byDate[0].url);
        return byDate[0].url;
    }

}


