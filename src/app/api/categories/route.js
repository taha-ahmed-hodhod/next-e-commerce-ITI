import { connectDB } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiHelpers";
import { authenticate, authorizeRoles } from "@/lib/authMiddleware";
import Category from "@/models/category.model";

export async function GET() {
  await connectDB();
  try {
    const categories = await Category.find({});
    return successResponse({ categories });
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}

export async function POST(request) {
  await connectDB();
  const { user, error } = authenticate(request);
  if (error) return error;
  if (user.role !== "ADMIN") {
    return errorResponse("You are not allowed to access this route", 403);
  }

  try {
    const body = await request.json();
    const existing = await Category.findOne({ name: body.name });
    if (existing) return errorResponse("Category already exists", 400);
    const category = await Category.create(body);
    return successResponse({ category }, 201);
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}
