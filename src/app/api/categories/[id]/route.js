import { connectDB } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiHelpers";
import { authenticate, authorizeRoles } from "@/lib/authMiddleware";
import Category from "@/models/category.model";

export async function GET(request, { params }) {
  await connectDB();
  try {
    const category = await Category.findById(params.id);
    if (!category) return errorResponse("Category not found", 404);
    return successResponse({ category });
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}

export async function PATCH(request, { params }) {
  await connectDB();
  const { user, error } = authenticate(request);
  if (error) return error;
  if (user.role !== "ADMIN") {
    return errorResponse("You are not allowed to access this route", 403);
  }
  try {
    const body = await request.json();
    const updated = await Category.findByIdAndUpdate(params.id, { $set: body }, { new: true });
    if (!updated) return errorResponse("Category not found", 404);
    return successResponse({ category: updated });
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}

export async function DELETE(request, { params }) {
  await connectDB();
  const { user, error } = authenticate(request);
  if (error) return error;
  if (user.role !== "ADMIN") {
    return errorResponse("You are not allowed to access this route", 403);
  }

  try {
    const result = await Category.findByIdAndDelete(params.id);
    if (!result) return errorResponse("Category not found", 404);
    return successResponse(null);
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}
