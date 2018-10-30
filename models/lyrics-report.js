import { Schema, model } from "mongoose";

let reportSchema = new Schema({
    spotifyUser: String,
    trackTitle: String,
    trackId: String,
})

let Report = model("Report", reportSchema);
export default Report;
 
