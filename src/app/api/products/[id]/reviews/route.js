import { connectDB } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiHelpers";
import { authenticate } from "@/lib/authMiddleware";
import Review from "@/models/review.model";

export async function GET(request, { params }) {
  await connectDB();
  try {
    const reviews = await Review.find({ product: params.id }).populate("user", "username avatar");
    return successResponse({ reviews });
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}

export async function POST(request, { params }) {
  await connectDB();
  const { user, error } = authenticate(request);
  if (error) return error;

  try {
    const { rating, comment } = await request.json();

    const existing = await Review.findOne({ user: user.id, product: params.id });
    if (existing) return errorResponse("You already reviewed this product", 400);

    const review = await Review.create({ user: user.id, product: params.id, rating, comment });
    return successResponse({ review }, 201);
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}
