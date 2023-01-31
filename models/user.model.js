const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    full_name: { type: String},
    DOB: { type: Date},
    email: { type: String,  },
    phone_number: { type: String },
    profile_image :{type:String},
    password:{type:String}
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", User);
