'use client'
import { Suspense, useMemo, useState, useEffect } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import Loading from "@/components/Loading"

function ShopContent() {

  const router = useRouter()
  const searchParams = useSearchParams()

  const search = searchParams.get('search')
  const sort = searchParams.get('sort')
  const categoryParams = searchParams.getAll('category')

  const products = useSelector(state => state.product.list)

  // 🔹 ONLY ADDITION
  const [loading, setLoading] = useState(true)

  /* ---------------- FILTER + SORT LOGIC ---------------- */

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (categoryParams.length > 0) {
      result = result.filter(p =>
        categoryParams.includes(p.category)
      )
    }

    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price)
    }
    if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [products, search, sort, categoryParams])

  /* ---------------- CATEGORY LIST ---------------- */

  const categories = useMemo(() => {
    return [...new Set(
      products
        .map(p => p.category)
        .filter(cat => cat !== 'Electronics')
    )]
  }, [products])

  /* ---------------- LOADING EFFECT (ONLY ADDITION) ---------------- */

  useEffect(() => {
    if (products && products.length > 0) {
      setLoading(false)
    }
  }, [products])

  /* ---------------- HANDLERS (UNCHANGED) ---------------- */

  const updateSearchParams = (key, value, multi = false) => {
    const params = new URLSearchParams(searchParams.toString())

    if (multi) {
      const values = params.getAll(key)
      if (values.includes(value)) {
        params.delete(key)
        values.filter(v => v !== value).forEach(v => params.append(key, v))
      } else {
        params.append(key, value)
      }
    } else {
      params.set(key, value)
    }

    router.push(`/shop?${params.toString()}`)
  }

  // 🔹 ONLY ADDITION
  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-[70vh] mx-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <h1
          onClick={() => router.push('/shop')}
          className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"
        >
          {search && <MoveLeftIcon size={20} />}
          All <span className="text-slate-700 font-medium">Products</span>
        </h1>

        {/* CONTROLS */}
        <div className="flex justify-between items-start mb-8">

          {/* SORT */}
          <div>
            <label className="text-sm text-slate-600 mb-2 block">
              Sort by price
            </label>
            <select
              value={sort || ''}
              onChange={(e) => updateSearchParams('sort', e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="">Default</option>
              <option value="price-asc">Low to High</option>
              <option value="price-desc">High to Low</option>
            </select>
          </div>

          {/* CATEGORIES */}
          <div className="flex flex-col gap-2">
            <p className="text-sm text-slate-600">Categories</p>
            {categories.map(category => (
              <label key={category} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={categoryParams.includes(category)}
                  onChange={() =>
                    updateSearchParams('category', category, true)
                  }
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        {/* RESULT COUNT */}
        <p className="text-sm text-slate-500 mb-4">
          Showing {filteredProducts.length} products
        </p>

        {/* PRODUCTS */}
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </div>
  )
}

export default function Shop() {
  return (
    <Suspense fallback={<Loading />}>
      <ShopContent />
    </Suspense>
  )
}
