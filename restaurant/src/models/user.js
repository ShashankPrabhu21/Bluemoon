import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true }, // Primary Key
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  reset_password: { type: String },
  role: { 
    type: String, 
    enum: ["Admin", "Manager", "Chef", "Waiter", "Cashier"], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["Active", "Inactive"], 
    default: "Active" 
  },
  is_signed_up: { type: Boolean, default: false }, // Y/N or 0/1
  is_signed_in: { type: Boolean, default: false }, // Y/N or 0/1
  created_at: { type: Date, default: Date.now }, // YYYY-MM-DD hh:mm:ss
  last_login: { type: Date },
  login_time: { type: String },  // hh:mm:ss format
  logout_time: { type: String } // hh:mm:ss format
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
