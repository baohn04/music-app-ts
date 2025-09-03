import mongoose from "mongoose";

const forgotPasswordSchema = new mongoose.Schema(
  { 
    email: String,
    otp: String,
    expireAt: { 
      type: Date,  
      expires: 0 // Giá trị truyền vào cộng thêm expires sẽ xóa bản ghi
    }
  },
  {
    timestamps: true
  }
);

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema, "forgot-password");

export default ForgotPassword;