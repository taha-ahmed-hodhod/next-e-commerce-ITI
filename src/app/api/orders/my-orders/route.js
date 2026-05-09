import { connectDB } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiHelpers";
import { authenticate } from "@/lib/authMiddleware";
import Order from "@/models/order.model";

export async function GET(request) {
  await connectDB();
  const { user, error } = authenticate(request);
  if (error) return error;

  try {
    const orders = await Order.find({ user: user.id })
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 });
    return successResponse({ orders });
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}
