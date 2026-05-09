import mongoose from "mongoose";
import validator from "validator";
 
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "SELLER", "USER"], default: "USER" },
    avatar: { type: String, default: null },
    phone: { type: String, default: null },
    address: {
      street: String,
      city: String,
      country: String,
      zipCode: String,
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
