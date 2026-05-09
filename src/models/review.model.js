import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true },
);

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

reviewSchema.post("save", async function () {
  const Product = (await import("./product.model")).default;
  const stats = await this.constructor.aggregate([
    { $match: { product: this.product } },
    {
      $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } },
    },
  ]);
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(this.product, {
      ratingsAverage: parseFloat(stats[0].avg.toFixed(1)),
      ratingsCount: stats[0].count,
    });
  }
});

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
