import { connectDB } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiHelpers";
import { authenticate, authorizeRoles } from "@/lib/authMiddleware";
import User from "@/models/user.model";

export async function PATCH(request, { params }) {
  await connectDB();
  const { user, error } = authenticate(request);
  if (error) return error;
  if (user.role !== "ADMIN") {
    return errorResponse("You are not allowed to access this route", 403);
  }

  try {
    const dbUser = await User.findById(params.id);
    if (!dbUser) return errorResponse("User not found", 404);
    dbUser.isActive = !dbUser.isActive;
    await dbUser.save();
    return successResponse({ message: `User is now ${dbUser.isActive ? "active" : "suspended"}` });
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}
