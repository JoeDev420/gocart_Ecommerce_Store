'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

export default function Product() {

  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true); // 🔹 start loading

      const res = await fetch(`/api/products/${productId}`, {
        cache: "no-store",
      });

      if (!res.ok) return;

      const data = await res.json();
      setProduct(data.product);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false); // 🔹 stop loading (success or error)
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
      scrollTo(0, 0);
    }
  }, [productId]);

  // 🔹 Show loader while fetching
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-6">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumbs */}
        <div className="text-gray-600 text-sm mt-8 mb-5">
          Home / Products / {product?.category}
        </div>

        {/* Product Details */}
        {product && <ProductDetails product={product} />}

        {/* Description & Reviews */}
        {product && <ProductDescription product={product} />}

      </div>
    </div>
  );
}
