import { connectDB } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiHelpers";
import { authenticate, authorizeRoles } from "@/lib/authMiddleware";
import Order from "@/models/order.model";
import Cart from "@/models/cart.model";
import Product from "@/models/product.model";

export async function GET(request) {
  await connectDB();
  const { user, error } = authenticate(request);
  if (error) return error;

    if (user.role !== "ADMIN") {
      return errorResponse("You are not allowed to access this route", 403);
    }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit")) || 50;

    let filter = {};
    if (status) filter.orderStatus = status;

    const orders = await Order.find(filter)
      .populate("user", "username email")
      .populate("items.product", "name")
      .limit(limit)
      .sort({ createdAt: -1 });

    return successResponse({ orders });
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}

export async function POST(request) {
  await connectDB();
  const { user, error } = authenticate(request);
  if (error) return error;

  try {
    const { shippingAddress, paymentMethod } = await request.json();

    const cart = await Cart.findOne({ user: user.id }).populate("items.product");
    if (!cart || cart.items.length === 0) return errorResponse("Cart is empty", 400);

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return errorResponse(`Not enough stock for ${item.product.name}`, 400);
      }
    }

    const finalPrice = cart.totalPrice - (cart.discount || 0);

    const order = await Order.create({
      user: user.id,
      items: cart.items.map((i) => ({ product: i.product._id, quantity: i.quantity, price: i.price })),
      totalPrice: cart.totalPrice,
      discount: cart.discount || 0,
      finalPrice,
      shippingAddress,
      paymentMethod,
    });

    // Reduce stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }

    // Clear cart
    await Cart.findByIdAndUpdate(cart._id, { items: [], totalPrice: 0, discount: 0 });

    return successResponse({ order }, 201);
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}
