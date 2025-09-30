import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  { 
    fullName: String,
    email: String,
    password: String,
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/dgbgwmqet/image/upload/v1759241069/user-default.3ff115bb_bcqres.png"
    },
    token: String,
    status: {
      type: String,
      default: "active"
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema, "users");

export default User;