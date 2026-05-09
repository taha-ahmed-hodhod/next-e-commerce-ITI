import { connectDB } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiHelpers";
import { authenticate, authorizeRoles } from "@/lib/authMiddleware";
import Product from "@/models/product.model";
import Category from "@/models/category.model";
import User from "@/models/user.model";

export async function GET(request) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 10;
    const page = parseInt(searchParams.get("page")) || 1;
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "";

    let filter = { isActive: true };
    if (search) filter.name = { $regex: search, $options: "i" };
    if (category && category.trim() !== "") filter.category = category;
    if (
      (minPrice && minPrice.trim() !== "") ||
      (maxPrice && maxPrice.trim() !== "")
    ) {
      filter.price = {};
      if (minPrice && minPrice.trim() !== "")
        filter.price.$gte = parseFloat(minPrice);
      if (maxPrice && maxPrice.trim() !== "")
        filter.price.$lte = parseFloat(maxPrice);
    }

    let sortOption = {};
    if (sort === "price_asc") sortOption.price = 1;
    else if (sort === "price_desc") sortOption.price = -1;
    else if (sort === "rating") sortOption.ratingsAverage = -1;
    else sortOption.createdAt = -1;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("seller", "username email")
      .limit(limit)
      .skip(skip)
      .sort(sortOption)
      .lean();

    return successResponse({ total, page, products });
  } catch (err) {
    console.error("❌ Products API Error:", err);
    return errorResponse(err.message, 500);
  }
}

export async function POST(request) {
  await connectDB();
  const { user, error } = authenticate(request);
  if (error) return error;

  // const roleError = authorizeRoles("ADMIN", "SELLER")(user);
  // if (roleError) return roleError;
  if (user.role !== "SELLER" && user.role !== "ADMIN") {
    return errorResponse("You are not allowed to access this route", 403);
  }

  try {
    const body = await request.json();
    const product = await Product.create({ ...body, seller: user.id });
    return successResponse({ product }, 201);
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}
