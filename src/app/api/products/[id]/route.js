import { connectDB } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiHelpers";
import { authenticate, authorizeRoles } from "@/lib/authMiddleware";
import Product from "@/models/product.model";

export async function GET(request, { params }) {
  await connectDB();
  try {
    const product = await Product.findById(params.id)
      .populate("category", "name")
      .populate("seller", "username email");
    if (!product) return errorResponse("Product not found", 404);
    return successResponse({ product });
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}

export async function PATCH(request, { params }) {
  await connectDB();
  const { user, error } = authenticate(request);
  if (error) return error;

  try {
    const body = await request.json();
    const product = await Product.findById(params.id);
    if (!product) return errorResponse("Product not found", 404);

    if (user.role !== "SELLER" && user.role !== "ADMIN") {
      return errorResponse("You are not allowed to access this route", 403);
    }

    if ( user.role === "SELLER" && product.seller.toString() !== user.id) {
      return errorResponse("Not authorized", 403);
    }

    const updated = await Product.findByIdAndUpdate(params.id, { $set: body }, { new: true });
    return successResponse({ product: updated });
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}

export async function DELETE(request, { params }) {
  await connectDB();
  const { user, error } = authenticate(request);
  if (error) return error;

  if (user.role !== "SELLER" && user.role !== "ADMIN") {
    return errorResponse("You are not allowed to access this route", 403);
  }

  try {
    const product = await Product.findById(params.id);
    if (!product) return errorResponse("Product not found", 404);
    
    if ( user.role === "SELLER" && product.seller.toString() !== user.id) {
      return errorResponse("Not authorized", 403);
    }

    if (user.role === "SELLER" && product.seller.toString() !== user.id) {
      return errorResponse("Not authorized", 403);
    }

    await Product.findByIdAndDelete(params.id);
    return successResponse(null);
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}
