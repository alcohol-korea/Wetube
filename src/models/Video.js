import mongoose from "mongoose";

 /*export const formatHashtags = (hashtags) =>
 hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
 vidoeSchema.pre("save",async function(){
     this hashtags = this hastags[0].split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
 })
*/
const videoSchema = new mongoose.Schema({
    title: {type:String, required: true, trim: true, maxlength:90},
    description: {type:String, required: true, trim: true, minlength:20},
    createdAt: {type:Date, required: true, default: Date.now },
    hashtags: [{type: String, trim: true}],
    meta: {
        views: {type:Number, default:0, required: true},
        rating: {type:Number, default:0, required: true},
    },
});

videoSchema.static("formatHashtags", function (hashtags){
   return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
});


const movieModel = mongoose.model("Video", videoSchema);
export default movieModel;//upload시 title description hasgtags를 보여줌