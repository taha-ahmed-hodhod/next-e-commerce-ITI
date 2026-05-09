import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import { successResponse, errorResponse } from "@/lib/apiHelpers";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function POST(request) {
  await connectDB();
  try {
    const { email, password } = await request.json();
    if (!email || !password) return errorResponse("Email and password are required", 400);

    const user = await User.findOne({ email });
    if (!user) return errorResponse("Invalid email or password", 401);
    if (!user.isActive) return errorResponse("Your account is suspended", 403);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return errorResponse("Invalid email or password", 401);

    const token = generateToken({ id: user._id, email: user.email, role: user.role });

    return successResponse({ token });
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}
