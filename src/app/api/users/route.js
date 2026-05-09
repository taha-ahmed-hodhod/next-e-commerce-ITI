import { connectDB } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiHelpers";
import { authenticate, authorizeRoles } from "@/lib/authMiddleware";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function GET(request) {
  await connectDB();
  const { user, error } = authenticate(request);
  if (error) return error;
 if (user.role !== "ADMIN") {
    return errorResponse("You are not allowed to access this route", 403);
  }
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 50;
    const users = await User.find({}, { password: 0, __v: 0 }).limit(limit);
    return successResponse({ users });
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}
