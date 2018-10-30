import { Schema, model } from "mongoose";

let suggestionSchema = new Schema({
    lyrics: { // mongoose model lyrics
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lyrics"
    }, 
    lyricsAccepted: { // when the admin accepts the lyrics
        type: boolean,
        default: false
    },
})

let Suggestion = model("Suggestion", suggestionSchema);
export default Suggestion;
 
