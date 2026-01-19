'use client'
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"

export default function StoreManageProducts() {

    const { getToken } = useAuth()
    const { user } = useUser()

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])

    const [editedStocks, setEditedStocks] = useState({});
    const [updatingId, setUpdatingId] = useState(null);

    const handleStockInputChange = (productId, value) => {

            const newStock = Math.max(0, parseInt(value) || 0);

            setEditedStocks(prev => ({
                ...prev,
                [productId]: newStock
            }));
        };



    const fetchProducts = async () => {
        try {
             const token = await getToken()
             const { data } = await axios.get('/api/store/product', {headers: { Authorization: `Bearer ${token}` } })
             setProducts(data.products.sort((a, b)=> new Date(b.createdAt) - new Date(a.createdAt)));

                const stockMap = {};
                data.products.forEach(p => {
                stockMap[p.id] = p.stock;
                });
                setEditedStocks(stockMap);

        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
        setLoading(false)
    }

    const updateStock = async (productId) => {

        try {
            setUpdatingId(productId);
            const token = await getToken();

            const newStock = editedStocks[productId];

            const { data } = await axios.post(
            '/api/store/update-stock',
            { productId, stock: newStock },
            { headers: { Authorization: `Bearer ${token}` } }
            );

            setProducts(prev =>
            prev.map(p =>
                p.id === productId
                    ? { ...p, stock: newStock }
                    : p
            )
        );

            setEditedStocks(prev => ({
                ...prev,
                [productId]: newStock
            }));


            toast.success(data.message);
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message);
        } finally {
            setUpdatingId(null);
        }

    };


    

    useEffect(() => {
        if(user){
            fetchProducts()
        }  
    }, [user])

    if (loading) return <Loading />

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">Manage <span className="text-slate-800 font-medium">Products</span></h1>
            <table className="w-full max-w-4xl text-left ring ring-slate-200 rounded overflow-hidden text-sm">
                <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                    <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3 hidden md:table-cell">Description</th>
                        <th className="px-4 py-3 hidden md:table-cell">MRP</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Change</th>

                    </tr>
                </thead>
                <tbody className="text-slate-700">
                    {products.map((product) => (
                        <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <div className="flex gap-2 items-center">
                                    <Image width={40} height={40} className='p-1 shadow rounded cursor-pointer' src={product.images[0]} alt="" />
                                    {product.name}
                                </div>
                            </td>
                            <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell truncate">{product.description}</td>
                            <td className="px-4 py-3 hidden md:table-cell">{currency} {product.mrp.toLocaleString()}</td>
                            <td className="px-4 py-3">{currency} {product.price.toLocaleString()}</td>
                            {/* STOCK INPUT */}
                            <td className="px-4 py-3">
                            <input
                                type="number"
                                min="0"
                                value={editedStocks[product.id] ?? product.stock}
                                onChange={(e) =>
                                handleStockInputChange(product.id, e.target.value)
                                }
                                className="w-20 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-400"
                            />
                            </td>

                            {/* STATUS */}
                            <td className="px-4 py-3 text-center">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                (editedStocks[product.id] ?? product.stock) > 0
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                            >
                                {(editedStocks[product.id] ?? product.stock) > 0
                                ? 'Available'
                                : 'Out of Stock'}
                            </span>
                            </td>

                            {/* CHANGE BUTTON */}
                            <td className="px-4 py-3 text-center">
                            <button
                                disabled={
                                editedStocks[product.id] === product.stock ||
                                updatingId === product.id
                                }
                                onClick={() =>
                                toast.promise(updateStock(product.id), {
                                    loading: "Updating stock..."
                                })
                                }
                                className={`px-4 py-1.5 rounded text-xs font-medium transition ${
                                editedStocks[product.id] !== product.stock
                                    ? 'bg-slate-800 text-white hover:bg-slate-900'
                                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                }`}
                            >
                                Change
                            </button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}