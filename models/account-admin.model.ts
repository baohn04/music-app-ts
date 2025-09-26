import mongoose from "mongoose";

const accountAdminSchema = new mongoose.Schema(
  { 
    fullName: String,
    email: String,
    password: String,
    token: String,
    phone: String,
    avatar: String,
    role_id: String,
    status: String,
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

const AccountAdmin = mongoose.model('AccountAdmin', accountAdminSchema, "accounts-admin");

export default AccountAdmin;