import { connectDB } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiHelpers";
import { authenticate } from "@/lib/authMiddleware";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function PATCH(request) {
  await connectDB();
  const { user, error } = authenticate(request);
  if (error) return error;

  try {
    const { oldPassword, newPassword } = await request.json();
    const dbUser = await User.findById(user.id);
    const match = await bcrypt.compare(oldPassword, dbUser.password);
    if (!match) return errorResponse("Old password is incorrect", 400);

    dbUser.password = await bcrypt.hash(newPassword, 10);
    await dbUser.save();
    return successResponse({ message: "Password changed successfully" });
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}
