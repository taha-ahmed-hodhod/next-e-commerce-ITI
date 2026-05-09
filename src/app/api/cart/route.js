import { connectDB } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiHelpers";
import { authenticate } from "@/lib/authMiddleware";
import Cart from "@/models/cart.model";
import Product from "@/models/product.model";

const calcTotal = (items) => items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export async function GET(request) {
  await connectDB();
  const { user, error } = authenticate(request);
  if (error) return error;

  try {
    const cart = await Cart.findOne({ user: user.id }).populate("items.product", "name images price");
    if (!cart) return successResponse({ cart: { items: [], totalPrice: 0 } });
    return successResponse({ cart });
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}

export async function POST(request) {
  await connectDB();
  const { user, error } = authenticate(request);
  if (error) return error;

  try {
    const { productId, quantity = 1 } = await request.json();

    const product = await Product.findById(productId);
    if (!product) return errorResponse("Product not found", 404);
    if (product.stock < quantity) return errorResponse("Not enough stock", 400);

    let cart = await Cart.findOne({ user: user.id });
    if (!cart) cart = new Cart({ user: user.id, items: [] });

    const existingItem = cart.items.find((i) => i.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      cart.items.push({ product: productId, quantity: parseInt(quantity), price: product.price });
    }

    cart.totalPrice = calcTotal(cart.items);
    await cart.save();

    return successResponse({ cart });
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}

export async function DELETE(request) {
  await connectDB();
  const { user, error } = authenticate(request);
  if (error) return error;

  try {
    await Cart.findOneAndUpdate(
      { user: user.id },
      { items: [], totalPrice: 0, discount: 0 }
    );
    return successResponse(null);
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}
