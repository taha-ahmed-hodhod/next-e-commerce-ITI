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
    const body = await request.json();
    delete body.role;
    delete body.password;

    const updated = await User.findByIdAndUpdate(user.id, { $set: body }, { new: true, select: "-password -__v" });
    return successResponse({ user: updated });
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}
