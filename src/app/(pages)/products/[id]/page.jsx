"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentProduct, setProductsLoading, selectCurrentProduct, selectProductsLoading } from "@/store/slices/dataSlices";
import { setCart } from "@/store/slices/cartSlice";
import { selectIsLoggedIn } from "@/store/slices/authSlice";
import { productsAPI, cartAPI, reviewsAPI } from "@/lib/api";
import { FiStar, FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ProductDetailPage({ params }) {
  const dispatch = useDispatch();
  const product = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductsLoading);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    dispatch(setProductsLoading(true));
    productsAPI.getById(params.id)
      .then((r) => dispatch(setCurrentProduct(r.data.data.product)))
      .catch(() => toast.error("Product not found"))
      .finally(() => dispatch(setProductsLoading(false)));

    reviewsAPI.getByProduct(params.id)
      .then((r) => setReviews(r.data.data.reviews))
      .catch(() => {});
  }, [params.id, dispatch]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) { toast.error("Please login first"); return; }
    setAdding(true);
    try {
      await cartAPI.add(product._id, qty);
      const res = await cartAPI.get();
      dispatch(setCart(res.data.data.cart));
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setAdding(false); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await reviewsAPI.add(params.id, reviewForm);
      setReviews([res.data.data.review, ...reviews]);
      setReviewForm({ rating: 5, comment: "" });
      toast.success("Review submitted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10 animate-pulse">
      <div className="bg-gray-200 rounded-xl h-96" />
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );

  if (!product) return <div className="text-center py-20 text-gray-400">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 mb-16">
        <div>
          <div className="bg-gray-100 rounded-xl h-80 mb-3 overflow-hidden flex items-center justify-center">
            {product.images?.[activeImage] ? (
              <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : <div className="text-7xl text-gray-300">📦</div>}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${activeImage === i ? "border-primary" : "border-transparent"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-primary text-sm font-medium mb-1">{product.category?.name}</p>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {[1,2,3,4,5].map((s) => <FiStar key={s} className={s <= Math.round(product.ratingsAverage) ? "fill-yellow-400" : ""} />)}
            </div>
            <span className="text-gray-500 text-sm">{product.ratingsAverage} ({product.ratingsCount} reviews)</span>
          </div>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <p className="text-4xl font-bold mb-4">${product.price}</p>
          <p className={`text-sm font-medium mb-6 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.stock > 0 ? `✓ ${product.stock} in stock` : "✗ Out of stock"}
          </p>

          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-gray-100"><FiMinus /></button>
                <span className="px-4 py-2 font-medium">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2 hover:bg-gray-100"><FiPlus /></button>
              </div>
              <button onClick={handleAddToCart} disabled={adding} className="btn-primary flex items-center gap-2 px-8 py-3">
                <FiShoppingCart /> {adding ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          )}
          <p className="text-sm text-gray-500">Sold by: <span className="font-medium">{product.seller?.username}</span></p>
        </div>
      </div>

      {/* Reviews */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        {isLoggedIn && (
          <form onSubmit={handleReviewSubmit} className="card mb-8 p-6">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            <div className="flex gap-2 mb-4">
              {[1,2,3,4,5].map((s) => (
                <button type="button" key={s} onClick={() => setReviewForm({ ...reviewForm, rating: s })}>
                  <FiStar className={`text-2xl ${s <= reviewForm.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
            <textarea className="input-field mb-4" rows={3} placeholder="Share your experience..." value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} required />
            <button type="submit" className="btn-primary">Submit Review</button>
          </form>
        )}
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="card p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {r.user?.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{r.user?.username}</p>
                    <div className="flex text-yellow-400 text-sm">
                      {[1,2,3,4,5].map((s) => <FiStar key={s} className={s <= r.rating ? "fill-yellow-400" : ""} />)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
