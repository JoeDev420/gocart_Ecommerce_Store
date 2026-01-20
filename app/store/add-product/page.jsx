'use client'
import { assets } from "@/assets/assets"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"

export default function StoreAddProduct() {

  const categories = [
    'Electronics', 'Clothing', 'Home & Kitchen', 'Beauty & Health',
    'Toys & Games', 'Sports & Outdoors', 'Books & Media',
    'Food & Drink', 'Hobbies & Crafts', 'Others'
  ]

  const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
  const [productInfo, setProductInfo] = useState({
    name: "",
    description: "",
    mrp: 0,
    price: 0,
    category: "",
    stock: 0,
  })
  const [loading, setLoading] = useState(false)

  const { getToken } = useAuth()

  const onChangeHandler = (e) => {
    setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (key, file) => {
    setImages(prev => ({ ...prev, [key]: file }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      if (!Object.values(images).some(Boolean)) {
        return toast.error('Please upload at least one image')
      }

      setLoading(true)

      const formData = new FormData()
      formData.append('name', productInfo.name)
      formData.append('description', productInfo.description)
      formData.append('mrp', productInfo.mrp)
      formData.append('price', productInfo.price)
      formData.append('category', productInfo.category)
      formData.append('stock', productInfo.stock)

      Object.values(images).forEach(img => {
        img && formData.append('images', img)
      })

      const token = await getToken()
      const { data } = await axios.post(
        '/api/store/product',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast.success(data.message)

      setProductInfo({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
        stock: 0
      })
      setImages({ 1: null, 2: null, 3: null, 4: null })

    } catch (error) {
      toast.error(error?.response?.data?.error || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })}
      className="text-slate-500 mb-28"
    >
      <h1 className="text-2xl">
        Add New <span className="text-slate-800 font-medium">Products</span>
      </h1>

      <p className="mt-7">Product Images</p>

      <div className="flex gap-3 mt-4">
        {Object.keys(images).map((key) => (
          <label key={key} htmlFor={`images${key}`}>
            <Image
              width={300}
              height={300}
              className='h-15 w-auto border border-slate-200 rounded cursor-pointer'
              src={images[key] ? URL.createObjectURL(images[key]) : assets.upload_area}
              alt=""
            />
            <input
              type="file"
              accept="image/*"
              id={`images${key}`}
              onChange={e => handleImageUpload(key, e.target.files[0])}
              hidden
            />
          </label>
        ))}
      </div>

      <label className="flex flex-col gap-2 my-6">
        Name
        <input
          type="text"
          name="name"
          onChange={onChangeHandler}
          value={productInfo.name}
          placeholder="Enter product name"
          className="w-full max-w-sm p-2 px-4 border border-slate-200 rounded"
          required
        />
      </label>

      <label className="flex flex-col gap-2 my-6">
        Description
        <textarea
          name="description"
          onChange={onChangeHandler}
          value={productInfo.description}
          placeholder="Enter product description"
          rows={5}
          className="w-full max-w-sm p-2 px-4 border border-slate-200 rounded resize-none"
          required
        />
      </label>

      <div className="flex gap-5">
        <label className="flex flex-col gap-2">
          Actual Price ($)
          <input
            type="number"
            name="mrp"
            value={productInfo.mrp}
            onChange={onChangeHandler}
            className="p-2 px-4 border border-slate-200 rounded"
            required
          />
        </label>

        <label className="flex flex-col gap-2">
          Offer Price ($)
          <input
            type="number"
            name="price"
            value={productInfo.price}
            onChange={onChangeHandler}
            className="p-2 px-4 border border-slate-200 rounded"
            required
          />
        </label>
      </div>

      <label className="flex flex-col gap-2 my-6">
        Stock Quantity
        <input
          type="number"
          name="stock"
          min="0"
          value={productInfo.stock}
          onChange={onChangeHandler}
          className="p-2 px-4 border border-slate-200 rounded"
          required
        />
      </label>

      <select
        onChange={e => setProductInfo({ ...productInfo, category: e.target.value })}
        value={productInfo.category}
        className="w-full max-w-sm p-2 px-4 my-6 border border-slate-200 rounded"
        required
      >
        <option value="">Select a category</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <button
        disabled={loading}
        className="bg-slate-800 text-white px-6 py-2 rounded hover:bg-slate-900 transition"
      >
        Add Product
      </button>
    </form>
  )
}
