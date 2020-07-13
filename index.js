const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
var Candidate = require("./SmartContract/model/Candidate");

const firebase_app = require('./Util/firebase.config');

//firebase reference
const testRef = firebase_app.database().ref("/smartContract/");


const router = express.Router();


router.use(bodyParser.json());
router.use(cors());


// router.use(function(req, res, next) {
//
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

const ConnectionTracker = require("./connectionsTracker");
const ConnectedNodeStore = require("./connectedNodeStore");
const SmartContractRunner = require("./SmartContract/runner/SmartContractRunner")
const HalfNodeStore = require("./halfnodeConnectionStore")
let SmartContract = require('./SmartContract');

router.get("/", (req, res) => {
    res.send({response: "im alive"}).status(200);
});

router.get("/getConnectionDetails", async (req, res) => {
    const delay = ms => new Promise(res => setTimeout(res, ms));

    ConnectedNodeStore.removeAll();

    global.io.emit('requesting_connection_details');
    await delay(10000);
    res.send(ConnectedNodeStore.getConnectionDetails());
});

router.post("/createSmartContract", (req, res) => {
    console.log(req)

    const candidate1 =  new Candidate("Yes");
    const candidate2 =  new Candidate("No");

    const contractId = SmartContractRunner.startSmartContract("ALL",
        "ME",
        req.body.form.legislativeMatter,
        req.body.target,
        [candidate1, candidate2],
        req.body.form.description,
        req.body.form.startDate,
        req.body.form.endDate);

    const testObj =  SmartContractRunner.getSmartContract(contractId);
    // console.log("before firebase");
    // console.log(testObj);
    //
    // //generate new key
    // const _key = testRef.push().getKey();
    //
    // //set the data
    // //if you want your own key, just replace the _key with your value instead of generating the push ID
    // testRef.child(_key).set(testObj, function (error) {
    //
    //     if(error)
    //         //send a BadRequest status
    //         res.status(400).send("ERROR !" + error );
    //     else
            res.status(200).send("Test data saved successfully !");

    // })

    global.io.emit("new_election_created", SmartContractRunner.getSmartContract(contractId))


});


router.post("/addVote", (req, res) => {

    SmartContractRunner.addBlock(1,{"transcation": "62728nabvsjaimsjsw7s","vote":"Yes"})
    res.status(200).json("ok");
});

router.get("/read", async (req, res) => {
    let v = await SmartContractRunner.readResults(1);
    console.log(v);
    res.status(200).json(v);
});


router.get("/allContracts", async (req, res) => {
    res.status(200).json(SmartContractRunner.getAllContracts());

});


router.get("/getAllHalfNodes", async (req, res) => {
    res.status(200).json(HalfNodeStore.getAll());

});

router.get("/getVotes", async (req, res) => {
    global.io.emit("getVotes");
    res.status(200).json("ok");

});
router.get("/getMap", async (req, res) => {
    res.status(200).json(

        [{
            "id":"569872624731496448",
            "type":"tweet",
            "tweet_text":"Boat delayed because of the fog thx <strong>Obama<\/strong>",
            "created_dts":"2015\/02\/23 14:53:16",
            "geo_lat":"6.927079",
            "geo_long":"79.861244",
            "screen_name":"chaneldance_",
            "name":"Chanel",
            "profile_image_url":"http:\/\/pbs.twimg.com\/profile_images\/566067501537050624\/qRktD_R9_normal.jpeg",
            "is_rt":"0",
            "rt_id":"0"
        },
        {
            "id":"569872516149178368",
            "type":"tweet",
            "tweet_text":"We have every bodies six. Problem is we have an Idiot for president that hates our nation and wants to destroy it. <strong>putin<\/strong> still a TRAITOR!",
            "created_dts":"2015\/02\/23 14:52:50",
            "geo_lat":"6.927079",
            "geo_long":"79.864244",
            "screen_name":"leonpui_",
            "name":"Leon Puissegur",
            "profile_image_url":"http:\/\/pbs.twimg.com\/profile_images\/378800000784429180\/9381d5bed77668d5ac85ece91f8c72ca_normal.jpeg",
            "is_rt":"0",
            "rt_id":"0"
        }]

    );

});


module.exports = router;
