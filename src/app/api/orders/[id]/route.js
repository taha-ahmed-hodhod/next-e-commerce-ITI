import { connectDB } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiHelpers";
import { authenticate, authorizeRoles } from "@/lib/authMiddleware";
import Order from "@/models/order.model";
import Product from "@/models/product.model";

export async function GET(request, { params }) {
  await connectDB();
  const { user, error } = authenticate(request);
  if (error) return error;

  try {
    const order = await Order.findById(params.id)
      .populate("items.product", "name images price")
      .populate("user", "username email");
    if (!order) return errorResponse("Order not found", 404);

    if (user.role === "USER" && order.user._id.toString() !== user.id) {
      return errorResponse("Not authorized", 403);
    }
    return successResponse({ order });
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

    // Cancel order
    if (body.action === "cancel") {
      const order = await Order.findById(params.id);
      if (!order) return errorResponse("Order not found", 404);
      if (order.user.toString() !== user.id) return errorResponse("Not authorized", 403);
      if (["shipped", "delivered"].includes(order.orderStatus)) {
        return errorResponse("Cannot cancel this order", 400);
      }
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      }
      order.orderStatus = "cancelled";
      await order.save();
      return successResponse({ order });
    }

    // Update status (admin only)
    if (user.role !== "ADMIN") {
      return errorResponse("You are not allowed to access this route", 403);
    }

    const updated = await Order.findByIdAndUpdate(
      params.id,
      { $set: { orderStatus: body.orderStatus } },
      { new: true }
    );
    if (!updated) return errorResponse("Order not found", 404);
    return successResponse({ order: updated });
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}
