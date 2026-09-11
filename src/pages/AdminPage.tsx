import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"

import { useProducts } from "../context/ProductContext"

import { readOrders, writeOrders } from "../data/orders"

import type { Order, OrderStatus } from "../data/orders"

import type { Product } from "../data/products"

import { supabase, hasSupabase } from "../lib/supabase"

import AdminSettings from "../components/AdminSettings"

const ADMIN_PHONE = "+212603821176"
const ADMIN_PASSWORD = "XLCX6E6ndi"

const blankProduct: Product = {
  id: "",
  ref: "",
  name: { fr: "", en: "", ar: "" },
  price: 0,
  category: "men",
  images: [],

  description: { fr: "", en: "", ar: "" },
  specs: {
    movement: "",
    diameter: "",
    thickness: "",
    waterResistance: "",
    crystal: "",
    strap: "",
    caseMaterial: "",
    dialColor: "",
  },
  stock: 0,
  inStock: false,
}

export default function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const location = useLocation()
  const navigate = useNavigate()

  const [authenticated, setAuthenticated] = useState(false)

  const [adminNumber, setAdminNumber] = useState("")
  const [password, setPassword] = useState("")

  const [editing, setEditing] = useState<Product | null>(null)

  const [orders, setOrders] = useState<Order[]>(readOrders)

  const [error, setError] = useState("")

  useEffect(() => {
    if (!authenticated && location.pathname === "/admin") {
      navigate("/admin/login", { replace: true })
      return
    }
    if (!hasSupabase || !supabase) return

    supabase.auth.getUser().then(({ data }) => {
      const userPhone = data.user?.phone?.replace(/\D/g, "")
      const isCorrectPhone = userPhone === "212603821176"
      const isAdmin = isCorrectPhone && (data.user?.app_metadata?.role === "admin" || data.user?.user_metadata?.role === "admin")
      setAuthenticated(isAdmin)
      if (isAdmin) navigate("/admin", { replace: true })
    })
  }, [authenticated, location.pathname, navigate])

  useEffect(() => {
    if (!hasSupabase || !supabase || !authenticated) return
    supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }).then(({ data }) => {
      if (!data) return
      setOrders(data.map((order) => ({
        id: order.order_number,
        createdAt: order.created_at,
        status: (order.status === "new" ? "pending" : order.status) as OrderStatus,
        customer: order.customer,
        items: (order.order_items || []).map((item) => ({ product: item.product_snapshot, quantity: item.quantity })),
        total: Number(order.total),
      })))
    })
  }, [authenticated])

  function login(event: React.FormEvent) {
    event.preventDefault()

    const normalizedNumber = adminNumber.replace(/\s/g, "").replace(/^0/, "+212")
    if (normalizedNumber !== ADMIN_PHONE || password !== ADMIN_PASSWORD) {
      setError("Invalid admin number or password")
      return
    }

    setAuthenticated(true)
    navigate("/admin", { replace: true })
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#F7F4EF] flex items-center justify-center px-5">
        <form
          onSubmit={login}
          className="w-full max-w-sm bg-[#1C1C1C] p-8 text-white"
        >
          <h1
            className="text-2xl mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            AUREX Admin
          </h1>
          <input
            aria-label="Admin number"
            type="tel"
            inputMode="numeric"
            autoComplete="username"
            required
            value={adminNumber}
            onChange={(event) => setAdminNumber(event.target.value)}
            className="w-full bg-transparent border-b border-white/30 py-3 outline-none mb-4"
            placeholder="0603821176"
          />
          <input
            aria-label="Admin password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className="w-full bg-transparent border-b border-white/30 py-3 outline-none mb-4"
            placeholder="Password"
          />
          <button className="w-full bg-[#C4A265] text-[#1C1C1C] py-3 disabled:opacity-50">
            LOGIN
          </button>
          {error && (
            <p role="alert" className="text-red-300 text-sm mt-3">
              {error}
            </p>
          )}
        </form>
      </main>
    )
  }

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault()

    if (
      !editing ||
      !editing.id ||
      !editing.ref ||
      !editing.name.fr ||
      editing.price < 0 ||
      editing.stock < 0
    ) {
      setError("Complete the required product fields.")
      return
    }

    const normalized = { ...editing, inStock: editing.status !== 'out_of_stock' && editing.status !== 'coming_soon' && editing.stock > 0 }

    try {
      if (products.some((product) => product.id === normalized.id))
        await updateProduct(normalized)
      else
        await addProduct(normalized)
    } catch (err) {
      setError("Failed to save product. Please try again.")
      return
    }

    setEditing(null)
    setError("")
  }

  async function uploadImages(files: FileList | null) {
    if (!editing || !files) return

    const images = await Promise.all(
      Array.from(files).map(
        async (file) => {
          if (supabase) {
            const path = `${editing.id}/${crypto.randomUUID()}-${file.name}`
            const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file, { upsert: true })
            if (!uploadError) return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl
          }
          return new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = () => resolve(String(reader.result))
            reader.readAsDataURL(file)
          })
        },
      ),
    )
    setEditing((previous) => previous ? { ...previous, images: [...previous.images, ...images] } : previous)
  }

  function updateStatus(order: Order, status: OrderStatus) {
    const next = orders.map((item) =>
      item.id === order.id ? { ...item, status } : item,
    )

    setOrders(next)
    writeOrders(next)
    if (supabase) supabase.from("orders").update({ status: status === "pending" ? "new" : status }).eq("order_number", order.id)
  }

  return (
    <main className="min-h-screen bg-[#F7F4EF] px-5 md:px-10 py-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <h1
            className="text-4xl"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Admin Dashboard
          </h1>
          <button
            onClick={() => {
              if (supabase) supabase.auth.signOut()
              setAuthenticated(false)
            }}
            className="border border-[#1C1C1C]/20 px-4 py-2"
          >
            LOG OUT
          </button>
        </div>
        <AdminSettings />
        <section className="mb-12">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl">Watches</h2>
            <button
              onClick={() =>
                setEditing({ ...blankProduct, id: `p${Date.now()}` })
              }
              className="bg-[#1C1C1C] text-white px-4 py-3"
            >
              ADD WATCH
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="bg-white p-4 border border-black/10"
              >
                <div className="aspect-square bg-[#EDE8E0] mb-3">
                  {product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name.fr}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <h3 className="font-medium">{product.name.fr || product.id}</h3>
                <p className="text-sm opacity-60">
                  {product.price} MAD · Stock {product.stock}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setEditing(product)}
                    className="text-sm underline"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-sm text-red-600 underline"
                  >
                    DELETE
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xl mb-5">Orders</h2>
          <div className="overflow-x-auto bg-white">
            {orders.length === 0 ? (
              <p className="p-5 opacity-60">No orders yet.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-3">Order</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="p-3">{order.id}</td>
                      <td className="p-3">
                        {order.customer.firstName} {order.customer.lastName}
                      </td>
                      <td className="p-3">{order.total} MAD</td>
                      <td className="p-3">
                        <select
                          value={order.status}
                          onChange={(event) =>
                            updateStatus(
                              order,
                              event.target.value as OrderStatus,
                            )
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto">
          <form
            onSubmit={saveProduct}
            className="max-w-3xl mx-auto mt-8 bg-[#F7F4EF] p-6 md:p-8"
          >
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl">
                {products.some((product) => product.id === editing.id)
                  ? "Edit Watch"
                  : "Add Watch"}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label="Close"
              >
                X
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                value={editing.ref}
                onChange={(event) =>
                  setEditing({ ...editing, ref: event.target.value })
                }
                placeholder="Reference"
                className="p-3 border"
              />
              <input
                required
                type="number"
                min="0"
                value={editing.price}
                onChange={(event) =>
                  setEditing({ ...editing, price: Number(event.target.value) })
                }
                placeholder="Price"
                className="p-3 border"
              />
              <input
                type="number"
                min="0"
                value={editing.originalPrice || ""}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    originalPrice: Number(event.target.value) || undefined,
                  })
                }
                placeholder="Old price (sale)"
                className="p-3 border"
              />
              <input
                required
                type="number"
                min="0"
                value={editing.stock}
                onChange={(event) =>
                  setEditing({ ...editing, stock: Number(event.target.value) })
                }
                placeholder="Stock"
                className="p-3 border"
              />
              <input
                required
                value={editing.name.fr}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    name: { ...editing.name, fr: event.target.value },
                  })
                }
                placeholder="French name"
                className="p-3 border"
              />
              <input
                value={editing.name.en}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    name: { ...editing.name, en: event.target.value },
                  })
                }
                placeholder="English name"
                className="p-3 border"
              />
              <input
                value={editing.name.ar}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    name: { ...editing.name, ar: event.target.value },
                  })
                }
                placeholder="Arabic name"
                dir="rtl"
                className="p-3 border"
              />
              <select
                value={editing.category}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    category: event.target.value as Product["category"],
                  })
                }
                className="p-3 border"
              >
                <option value="men">MEN</option>
                <option value="women">WOMEN</option>
              </select>
              <select
                value={editing.status || (editing.stock > 0 ? "in_stock" : "out_of_stock")}
                onChange={(event) => setEditing({ ...editing, status: event.target.value as Product["status"] })}
                className="p-3 border"
              >
                <option value="in_stock">IN STOCK</option>
                <option value="low_stock">LOW STOCK</option>
                <option value="out_of_stock">OUT OF STOCK</option>
                <option value="coming_soon">COMING SOON</option>
              </select>
              <textarea
                value={editing.description.fr}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    description: {
                      ...editing.description,
                      fr: event.target.value,
                    },
                  })
                }
                placeholder="Description"
                className="p-3 border md:col-span-2"
                rows={3}
              />
              <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <label>
                  <input
                    type="checkbox"
                    checked={editing.newArrival || editing.badge === "new"}
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        newArrival: event.target.checked,
                        badge: event.target.checked
                          ? "new"
                          : editing.badge === "new"
                            ? undefined
                            : editing.badge,
                      })
                    }
                  />{" "}
                  New Arrival
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={!!editing.featured}
                    onChange={(event) =>
                      setEditing({ ...editing, featured: event.target.checked })
                    }
                  />{" "}
                  Featured
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={
                      editing.bestseller || editing.badge === "bestseller"
                    }
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        bestseller: event.target.checked,
                        badge: event.target.checked
                          ? "bestseller"
                          : editing.badge === "bestseller"
                            ? undefined
                            : editing.badge,
                      })
                    }
                  />{" "}
                  Bestseller
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={
                      !!editing.originalPrice &&
                      editing.originalPrice > editing.price
                    }
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        originalPrice: event.target.checked
                          ? Math.max(
                              editing.price + 1,
                              editing.originalPrice || editing.price + 1,
                            )
                          : undefined,
                      })
                    }
                  />{" "}
                  Sale
                </label>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => uploadImages(event.target.files)}
                className="md:col-span-2"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button className="bg-[#1C1C1C] text-white px-5 py-3">
                SAVE WATCH
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="border px-5 py-3"
              >
                CANCEL
              </button>
            </div>
            {error && (
              <p role="alert" className="text-red-600 text-sm mt-3">
                {error}
              </p>
            )}
          </form>
        </div>
      )}
    </main>
  )
}
