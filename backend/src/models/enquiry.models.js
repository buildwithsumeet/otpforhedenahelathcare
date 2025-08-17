import mongoose from "mongoose";

const { Schema } = mongoose;

const enquirySchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
    },
    companyName: {
        type: String,
        trim: true,
    },

    status: {
        type: String,
        enum: [
            "pending",
            "in_process",
            "number_busy",
            "switch_off",
            "demo_approved",
            "next_week",
            "next_month"
        ],
        default: "pending",
        required: true,
    },
    countryCode: {
        type: String,
        required: [true, "Country code is required"],
        trim: true,
    },
    demoApproveDate: {
        type: Date,
        default: null // Only set when demo is approved
    }
}, {
    timestamps: true // createdAt and updatedAt automatically added
});

const Enquiry = mongoose.model("Enquiry", enquirySchema);
export default Enquiry;
