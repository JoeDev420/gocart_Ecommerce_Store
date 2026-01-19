'use client'
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const Counter = ({ productId }) => {

    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);
    
    // Get the product to access stock
    const product = products.find(p => p.id === productId);
    const currentQuantity = cartItems[productId] || 0;

    const dispatch = useDispatch();

    const addToCartHandler = () => {
        // Check if product exists and has stock info
        if (!product) {
            toast.error("Product not found");
            return;
        }

        // Check if product is in stock
        if (!product.inStock || product.stock === 0) {
            toast.error(`${product.name} is out of stock`);
            return;
        }

        // Check if adding would exceed available stock
        if (currentQuantity >= product.stock) {
            toast.error(`Only ${product.stock} units available`);
            return;
        }

        dispatch(addToCart({ productId }))
    }

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId }))
    }

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
            <button onClick={removeFromCartHandler} className="p-1 select-none">-</button>
            <p className="p-1">{currentQuantity}</p>
            <button 
                onClick={addToCartHandler} 
                className={`p-1 select-none ${currentQuantity >= product?.stock ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentQuantity >= product?.stock}
            >
                +
            </button>
        </div>
    )
}

export default Counter