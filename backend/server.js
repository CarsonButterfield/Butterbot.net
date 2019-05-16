console.log('Server Starting')

let mongoose = require("mongoose")
const express = require("express")
var cors = require('cors');
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const mongodb = require("mongodb")
const API_PORT = 3001;
const app = express();
app.use(cors());

function voiceStats(channel, usage) {
    this.channel = channel
    this.usage = usage
}
var mClient
let tokenList = require("./tokens.json")
const router = express.Router();

// this is our MongoDB database
const dbRoute = tokenList.mongoToken

// connects our back end code with the database

var MongoClient = require('mongodb').MongoClient;

mClient = new MongoClient(dbRoute, {
    useNewUrlParser: true
});
mClient.connect(function(err) {
    ;
    if (err) {
        throw err
    }
})




mClient.on("connect", function() {

    console.log("connected")
});
// checks if connection with the database is successful
mClient.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(logger("dev"));

// this is our get method
// this method fetches all available data in our database
router.get("/popularChannels", (req, res) => {
    console.log(`db:${req.query.db} collection ${req.query.logType}`)
    let db = mClient.db(req.query.db)
    async function getLogs() {
        if (mClient.isConnected()) {
            console.log("requesting data")
            let cursor = db.collection(req.query.logType).find({})

            let logArray = await cursor.toArray()

            return logArray
        } else(console.log("client isnt connected"))
    }
    getLogs().then(logs => {
        if (req.query.logType === "voiceLogs") {
            let channels = []

            for (let x = 0; x < logs.length; x++) {
                let thisLog = logs[x]
                let thisChannel = channels.find(function(channel) {
                    channel.id === thisLog.channelid
                })

                if (!thisChannel){channels.push(new voiceStats(thisLog.voiceChannel,thisLog.timeLeave - thisLog.timeJoin))}
                else(thisChannel.usage +=thisLog.timeLeave-thisLog.timeJoin  )


            }
            console.log(channels)
        }
        return res.json({
            success: true,
            data: logs
        });


    })
})



// this is our update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
    const {
        id,
        update
    } = req.body;
    Data.findOneAndUpdate(id, update, err => {
        if (err) return res.json({
            success: false,
            error: err
        });
        return res.json({
            success: true
        });
    });
});

// this is our delete method
// this method removes existing data in our database


// this is our create methid
// this method adds new data in our database

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
