const { Schema, model } = require("mongoose");
const bcrypt = require('bcrypt');


const adminSchema = new Schema(
  {
    firstName: {
      type: String, 
      required: [true, 'First name is required'],
    },
    lastName: {
      type: String, 
      required: [true, 'Last name is required'],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters long."]
    },
    role: {
      type: String,
      enum: ['admin'],
      default: "admin",
    },
  },
  { timestamps: true }
);

adminSchema.pre('save', async function (next) {
if (this.isModified('password')) {
  this.password = await bcrypt.hash(this.password, 10);
}
next();  
});

module.exports = mongoose.model('Admin', adminSchema);



// this is the longer version of the export
// const User = model("Admin", adminSchema);
// module.exports = Admin;
