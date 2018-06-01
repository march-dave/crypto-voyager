'use strict';
var CryptoJS = require("crypto-js");
var express = require("express");
var bodyParser = require('body-parser');

const chp = require('chainpoint-client');

var http_port = process.env.PORT || 3001;
////
// var p2p_port = process.env.P2P_PORT || 6001;
// var initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];
// var sockets = [];
// var MessageType = {
//     QUERY_LATEST: 0,
//     QUERY_ALL: 1,
//     RESPONSE_BLOCKCHAIN: 2
// };
// var blockchain = [getGenesisBlock()];
////
class Block {
    constructor(index, previousHash, timestamp, data, hash) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash.toString();
    }
}

// index: 0
// pervoiusHash: 0
// timestapm: 1520098489.815
// data: this genesis block!!
// hash: a9d9999af5983ce47ea33feee41a35a076a5c2c4cc6da73edac32227d046c0c6
var getGenesisBlock = () => {
    return new Block(0, "0", "1520098489.815", "this genesis block!!", "a9d9999af5983ce47ea33feee41a35a076a5c2c4cc6da73edac32227d046c0c6");
};

var blockchain = [getGenesisBlock()];

var initHttpServer = () => {
    var app = express();

    app.use(bodyParser.urlencoded());
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => {
        console.log('get' + JSON.stringify(blockchain));
        res.send(
            JSON.stringify(blockchain)
        )
    });
    app.post('/nextBlock', (req, res) => {

        const ret = runIt(CryptoJS.SHA256(newBlock).toString());

        // var newBlock = generateNextBlock(req.body.data + JSON.stringify(ret));
        var newBlock = generateNextBlock(req.body.data);
        addBlock(newBlock);
        console.log('block added: ' + JSON.stringify(newBlock))
        
        console.log('Proof Objects:----------- ' + JSON.stringify(ret) );

        res.send();
    });

    // app.post('/mineBlock', (req, res) => {
    //     var newBlock = generateNextBlock(req.body.data);
    //     addBlock(newBlock);

    //     console.log('block added: ' + JSON.stringify(newBlock));
    //     res.send();
    // });

    app.post('/addPeer', (req, res) => {
        connectToPeers([req.body.peer]);
        res.send();
    });
    // app.get('/perspectiveOrigin', (req, res) => {
    //     res.send(sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
    // });
    // app.post('/addPeer', (req, res) => {
    //     connectToPeers([req.body.peer]);
    //     console.log('block added: ' + JSON.stringify(req.body.peer));
    //     res.send();
    // });
    app.listen(http_port, () => console.log('Listening http on port: ' + http_port));
};

// var initP2PServer = () => {
//     var server = new WebSocket.Server({ port: p2p_port });
//     server.on('connection', ws => initConnection(ws));
//     console.log('listening websocket p2p port on: ' + p2p_port);
// };

var generateNextBlock = (blockData) => {
    var previousBlock = getLatestBlock();
    var nextIndex = previousBlock.index + 1;
    var nextTimestamp = new Date().getTime() / 1000;
    var nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash);
};

var calculateHashForBlock = (block) => {
    return calculateHash(block.index, block.previousHash, block.timestamp, block.data);
};

var calculateHash = (index, previousHash, timestamp, data) => {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
};

var addBlock = (newBlock) => {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
    }
};

var isValidNewBlock = (newBlock, previousBlock) => {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index');
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previoushash');
        return false;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log(typeof(newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
        console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return false;
    }
    return true;
};

var getLatestBlock = () => blockchain[blockchain.length - 1];
initHttpServer();


async function runIt (newBlock) {
  // A few sample SHA-256 proofs to anchor
  // let hashes = ['3d2a9e92b561440e8d27a21eed114f7018105db00262af7d7087f7dea9986b0a']
    let hashes = [newBlock];

  // Submit each hash to three randomly selected Nodes
  let proofHandles = await chp.submitHashes(hashes)
  console.log("Submitted Proof Objects: Expand objects below to inspect.")
  console.log(proofHandles)

  // Wait for Calendar proofs to be available
  console.log("Sleeping 12 seconds to wait for proofs to generate...")
  await new Promise(resolve => setTimeout(resolve, 12000))

  // Retrieve a Calendar proof for each hash that was submitted
  let proofs = await chp.getProofs(proofHandles)
  console.log("Proof Objects: Expand objects below to inspect.")
  console.log(proofs)

  // Verify every anchor in every Calendar proof
  let verifiedProofs = await chp.verifyProofs(proofs)
  console.log("Verified Proof Objects: Expand objects below to inspect.")
  console.log(verifiedProofs)
}

// var gomu = new Person('고무곰', 30);
// var gomuClone1 = new gomu.__proto__.consturctor('고무곰_클론1', 10);

// var gomuClone2 = new gomu.constructor('고무곰_클론2', 25);

//  var gomuProto = Object.getPrototypeOf(gomu);

//  var gomuClone3 = new gomuProto.constructor('고무곰_클론3', 20);

//  var gomuClone4 = new Person.prototype.constructor('고무곰_클론4', 15);