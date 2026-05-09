import { connectDB } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiHelpers";
import { authenticate } from "@/lib/authMiddleware";
import Cart from "@/models/cart.model";

const calcTotal = (items) => items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export async function PATCH(request, { params }) {
  await connectDB();
  const { user, error } = authenticate(request);
  if (error) return error;

  try {
    const { quantity } = await request.json();
    const cart = await Cart.findOne({ user: user.id });
    if (!cart) return errorResponse("Cart not found", 404);

    const item = cart.items.find((i) => i.product.toString() === params.productId);
    if (!item) return errorResponse("Item not in cart", 404);

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== params.productId);
    } else {
      item.quantity = parseInt(quantity);
    }

    cart.totalPrice = calcTotal(cart.items);
    await cart.save();
    return successResponse({ cart });
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}

export async function DELETE(request, { params }) {
  await connectDB();
  const { user, error } = authenticate(request);
  if (error) return error;

  try {
    const cart = await Cart.findOne({ user: user.id });
    if (!cart) return errorResponse("Cart not found", 404);

    cart.items = cart.items.filter((i) => i.product.toString() !== params.productId);
    cart.totalPrice = calcTotal(cart.items);
    await cart.save();
    return successResponse({ cart });
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}
