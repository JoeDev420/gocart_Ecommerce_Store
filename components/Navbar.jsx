'use client'

import { PackageIcon, Search, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs"

const Navbar = () => {
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const router = useRouter()

  const [search, setSearch] = useState("")
  const cartCount = useSelector((state) => state.cart.total)

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
              className="hidden xl:flex items-center w-72 gap-2 bg-slate-100 px-4 py-2 rounded-full"
            >
              <Search size={18} />
              <input
                className="w-full bg-transparent outline-none"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
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
