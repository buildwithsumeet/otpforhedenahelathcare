import mongoose from "mongoose";
import { Schema } from "mongoose";

const frontPageSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
    },
    imageUrl: {
        type: String,
      
        trim: true,
    },
    videoUrl: {
        type: String,
        trim: true, // Optional field, can be empty
    },
  
}, {
    timestamps: true // createdAt and updatedAt automatically added
});

const frontPageModule = mongoose.model("FrontPage", frontPageSchema);

export default frontPageModule ;