import { Schema, model } from "mongoose";

let lyricsSchema = new Schema({
    spotifyUser: String,
    trackTitle: String,
    trackId: String,
    content: String,
    reports: { // when user reports bad lyrics
        type: Number,
        default: 0
    }
})

let Lyrics = model("Lyrics", lyricsSchema);
export default Lyrics;
 


