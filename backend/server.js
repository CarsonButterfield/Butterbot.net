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
var db
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
  mClient.connect(function(err){
    db = mClient.db('136337269291220993');
    if(err){throw err}
  })






mClient.on("connect", function(){

 console.log("connected")
  }
);
// checks if connection with the database is successful
mClient.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {


async function getLogs(){
if (mClient.isConnected()){
let cursor = db.collection('voiceLogs').find({})
let logArray = await cursor.toArray()

 return logArray
  }}
getLogs().then(logs => {
  return res.json({ success: true, data: logs });


})})



// this is our update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res) => {
  let data = new Data();

  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.message = message;
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
