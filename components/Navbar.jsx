'use client'

import { PackageIcon, Search, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState,useEffect } from "react"
import { useSelector } from "react-redux"
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs"

const Navbar = () => {
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const router = useRouter()

  const [search, setSearch] = useState("")

  const [searchResults, setSearchResults] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);

  const [isSearching, setIsSearching] = useState(false);


  const SearchSpinner = () => (
  <div className="flex justify-center items-center py-4">
    <div className="h-5 w-5 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
  </div>
);




  const cartCount = useSelector((state) => state.cart.total)

  useEffect(() => {
  if (search.trim().length < 2) {
    setSearchResults([]);
    setShowDropdown(false);
    setIsSearching(false);
    return;
  }

  setShowDropdown(true);      // 👈 dropdown opens immediately
  setIsSearching(true);       // 👈 show spinner

  const timeout = setTimeout(async () => {
    try {
      const res = await fetch(`/api/search/products?q=${search}`);
      const data = await res.json();

      setSearchResults(data.products || []);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);  // 👈 stop spinner
    }
  }, 300); // debounce

  return () => clearTimeout(timeout);
}, [search]);



  const handleSearch = (e) => {
    e.preventDefault()
    router.push(`/shop?search=${search}`)
  }

  const UserMenu = () => (
    <UserButton>
      <UserButton.MenuItems>
        <UserButton.Action
          label="My Store"
          labelIcon={<PackageIcon size={16} />}
          onClick={() => router.push("/store")}
        />

        <UserButton.Action
          label="My Orders"
          labelIcon={<PackageIcon size={16} />}
          onClick={() => router.push("/orders")}
        />
      </UserButton.MenuItems>
    </UserButton>
  )

  return (
    <nav className="relative bg-white">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4">

          {/* LOGO */}
          <Link href="/" className="relative text-4xl font-semibold text-slate-700">
            <span className="text-green-600">go</span>cart
            <span className="text-green-600 text-5xl">.</span>
            <Protect plan="plus">
              <span className="absolute text-xs font-semibold -top-1 -right-8 px-3 py-0.5 rounded-full text-white bg-green-500">
                plus
              </span>
            </Protect>
          </Link>

          {/* DESKTOP */}
          <div className="hidden sm:flex items-center gap-6 text-slate-600">

            <Link href="/shop">Browse</Link>
            <a href="#contact">Contact Us</a>

            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-72 gap-2 bg-slate-100 px-4 py-2 rounded-full relative"
            >
              <Search size={18} />
              <input
                className="w-full bg-transparent outline-none"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => search.trim().length >= 2 && setShowDropdown(true)}

                />

                {showDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-50">

                    {/* Loading state */}
                    {isSearching && <SearchSpinner />}

                    {/* Results */}
                    {!isSearching && searchResults.length > 0 && (
                    searchResults.map((product) => (
                        <div
                        key={product.id}
                        onClick={() => {
                            setShowDropdown(false);
                            setSearch("");
                            router.push(`/product/${product.id}`);
                        }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 cursor-pointer"
                        >
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 object-contain"
                        />
                        <span className="text-sm text-slate-700">
                            {product.name}
                        </span>
                        </div>
                    ))
                    )}

                </div>
                )}


            </form>

            


            <Link href="/cart" className="relative flex items-center gap-2">
              <ShoppingCart size={18} />
              Cart
              <span className="absolute -top-1 left-3 text-[10px] bg-slate-600 text-white rounded-full px-1">
                {cartCount}
              </span>
            </Link>

            {user ? (
              <UserMenu />
            ) : (
              <button
                onClick={openSignIn}
                className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full"
              >
                Login
              </button>
            )}
          </div>

          {/* MOBILE */}
          <div className="sm:hidden">
            {user ? (
              <UserMenu />
            ) : (
              <button
                onClick={openSignIn}
                className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full"
              >
                Login
              </button>
            )}
          </div>

        </div>
      </div>

      <hr className="border-gray-300" />
    </nav>
  )
}

export default Navbar
