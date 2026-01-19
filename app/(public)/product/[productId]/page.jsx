'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function Product() {

    const { productId } = useParams();
    const [product, setProduct] = useState();


    const fetchProduct = async () => {
  const res = await fetch(`/api/products/${productId}`, {
    cache: "no-store", // 🚨 critical
  });

  if (!res.ok) return;

  const data = await res.json();
  setProduct(data.product);
};


    useEffect(() => {
  if (productId) {
    fetchProduct();
    scrollTo(0, 0);
  }
}, [productId]);


    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrums */}
                <div className="  text-gray-600 text-sm mt-8 mb-5">
                    Home / Products / {product?.category}
                </div>

                {/* Product Details */}
                {product && (<ProductDetails product={product} />)}

                {/* Description & Reviews */}
                {product && (<ProductDescription product={product} />)}


            </div>
        </div>
    );
}