const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
var voiceLogs = new Schema(
  {
    userid: String,
    voiceChannel: String,
    voiceChannelid: String,
    timeJoin:Number,
    guild :String,
    timeLeave: Number,
  },
  { timestamps: false,
  collection: 'voiceLogs' }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Data", voiceLogs);
