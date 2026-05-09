import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import { successResponse, errorResponse } from "@/lib/apiHelpers";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function POST(request) {
  await connectDB();
  try {
    const body = await request.json();
  

    const existing = await User.findOne({email: body.email });
    if (existing) return errorResponse("User already exists", 400);

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await User.create({ ...body, password:hashedPassword });

    const token = generateToken({ id: user._id, email: user.email, role: user.role });

    return successResponse({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    }, 201);
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}
