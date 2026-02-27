import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
    stock: "",
  });

  // ======== NEW FEATURES ========
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Change this for page size

  // ================= FETCH USER =================
  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) return;
      try {
        const res = await axios.get("http://127.0.0.1:8000/auth/me", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [token]);

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/products/");
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= FETCH CART =================
  const fetchCart = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;
    try {
      const res = await axios.get("http://127.0.0.1:8000/cart/", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setCartItems(res.data);
      setShowCart(true);
      setShowOrders(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= FETCH ORDERS =================
  const fetchOrders = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;
    try {
      const res = await axios.get("http://127.0.0.1:8000/orders/", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setOrders(res.data);
      setShowOrders(true);
      setShowCart(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= ADD TO CART =================
  const addToCart = async (productId) => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    try {
      await axios.post(
        "http://127.0.0.1:8000/cart/",
        { product_id: productId, quantity },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      alert("Added to cart 🛒");
      setQuantity(1);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= UPDATE CART =================
  const updateCart = async (itemId, newQty) => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    // Update UI immediately
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: newQty > 0 ? newQty : 0 }
          : item
      )
    );

    try {
      if (newQty <= 0) {
        await axios.delete(`http://127.0.0.1:8000/cart/${itemId}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
      } else {
        await axios.put(
          `http://127.0.0.1:8000/cart/${itemId}`,
          { quantity: newQty },
          { headers: { Authorization: `Bearer ${storedToken}` } }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ================= PLACE ORDER =================
  const placeOrder = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;
    try {
      await axios.post(
        "http://127.0.0.1:8000/orders/",
        {},
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      alert("Order placed 🎉");
      fetchCart();
      setShowCart(false);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= UPDATE ORDER STATUS =================
  const updateOrderStatus = async (orderId, status) => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;
    try {
      await axios.put(
        `http://127.0.0.1:8000/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  // ================= ADD PRODUCT (ADMIN ONLY) =================
  const addProduct = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;
    try {
      await axios.post(
        "http://127.0.0.1:8000/products/",
        newProduct,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      alert("Product Added ✅");
      setShowAddProduct(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        image_url: "",
        category: "",
        stock: "",
      });
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  // ================= DELETE PRODUCT =================
const deleteProduct = async (productId) => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) return;

  try {
    await axios.delete(`http://127.0.0.1:8000/products/${productId}`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    });
    fetchProducts();
  } catch (error) {
    console.error(error);
  }
};

// ================= UPDATE PRODUCT =================
const updateProduct = async () => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken || !selectedProduct) return;

  try {
    await axios.put(
      `http://127.0.0.1:8000/products/${selectedProduct.id}`,
      selectedProduct,
      { headers: { Authorization: `Bearer ${storedToken}` } }
    );
    setIsEditing(false);
    fetchProducts();
  } catch (error) {
    console.error(error);
  }
};
  // ================= RENDER LOGIN/REGISTER =================
  if (!token) {
    return showRegister ? (
      <Register goToLogin={() => setShowRegister(false)} />
    ) : (
      <Login setToken={setToken} goToRegister={() => setShowRegister(true)} />
    );
  }

  // ================= TOTAL AMOUNT =================
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find((p) => p.id === item.product_id);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  // ================= FILTERED PRODUCTS (SEARCH + PRICE) =================
  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((p) =>
      (minPrice === "" || p.price >= parseFloat(minPrice)) &&
      (maxPrice === "" || p.price <= parseFloat(maxPrice))
    );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ================= ADMIN STATS =================
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>BlushBasket</h1>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => { localStorage.removeItem("token"); setToken(""); }}>Logout</button>{" "}
        <button onClick={fetchCart}>View Cart 🛒</button>{" "}
        <button onClick={fetchOrders}>My Orders 📦</button>{" "}
        {user?.role === "admin" && <button onClick={() => setShowAddProduct(true)}>Add Product 👑</button>}
      </div>

      {/* ========== ADMIN STATS ========== */}
      {user?.role === "admin" && !showAddProduct && (
        <div style={{ marginBottom: "15px" }}>
          <strong>Total Products:</strong> {totalProducts} |{" "}
          <strong>Total Orders:</strong> {totalOrders} |{" "}
          <strong>Total Cart Items:</strong> {totalCartItems}
        </div>
      )}

      {/* ========== SEARCH & PRICE FILTER ========== */}
      {!showCart && !showOrders && !selectedProduct && (
        <div style={{ marginBottom: "15px" }}>
          <input
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{ marginRight: "5px" }}
          />
          <input
            placeholder="Min Price"
            type="number"
            value={minPrice}
            onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }}
            style={{ width: "80px", marginRight: "5px" }}
          />
          <input
            placeholder="Max Price"
            type="number"
            value={maxPrice}
            onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
            style={{ width: "80px" }}
          />
        </div>
      )}

      {/* ================= ADMIN ADD PRODUCT ================= */}
      {showAddProduct && user?.role === "admin" && (
        <div>
          <h2>Add Product</h2>
          <input placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
          <input placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
          <input placeholder="Price" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
          <input placeholder="Image URL" value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} />
          <input placeholder="Category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
          <input placeholder="Stock" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
          <div style={{ marginTop: "10px" }}>
            <button onClick={addProduct}>Save</button>{" "}
            <button onClick={() => setShowAddProduct(false)}>⬅ Back</button>
          </div>
        </div>
      )}

      {/* ================= CART ================= */}
      {showCart && (
        <div>
          <h2>Your Cart</h2>
          {cartItems.length === 0 && <p>Cart is empty.</p>}
          {cartItems.map((item) => {
            const product = products.find((p) => p.id === item.product_id);
            return (
              <div key={item.id} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <img src={product?.image_url} width="60" height="60" alt="" />
                <div style={{ marginLeft: "10px", flex: 1 }}>
                  <p>{product?.name}</p>
                  <p>₹ {product?.price}</p>
                  <div>
                    <button onClick={() => updateCart(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>{" "}
                    {item.quantity}{" "}
                    <button onClick={() => updateCart(item.id, item.quantity + 1)}>+</button>{" "}
                    <button onClick={() => updateCart(item.id, 0)}>Remove</button>
                  </div>
                </div>
              </div>
            );
          })}
          {cartItems.length > 0 && (
            <>
              <h3>Total: ₹ {calculateTotal()}</h3>
              <button onClick={placeOrder}>Place Order</button>
            </>
          )}
          <div style={{ marginTop: "20px" }}>
            <button onClick={() => setShowCart(false)}>⬅ Back to Products</button>
          </div>
        </div>
      )}

      {/* ================= ORDERS ================= */}
      {showOrders && (
        <div>
          <h2>My Orders</h2>
          {orders.length === 0 && <p>No orders found.</p>}
          {orders.map((order) => (
            <div key={order.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
              <h3>Order #{order.id}</h3>
              <p>Status: {order.status}</p>
              <div>
                {order.items?.map((item) => {
                  const product = products.find((p) => p.id === item.product_id);
                  return (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                      <img src={product?.image_url} width="60" height="60" alt="" />
                      <div style={{ marginLeft: "10px" }}>
                        <p>{product?.name}</p>
                        <p>Qty: {item.quantity}</p>
                        <p>₹ {product?.price * item.quantity}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p>Total: ₹ {order.items?.reduce((sum, item) => {
                const product = products.find((p) => p.id === item.product_id);
                return sum + (product?.price || 0) * item.quantity;
              }, 0)}</p>

              {user?.role === "admin" && order.status === "Pending" && (
                <div>
                  <button onClick={() => updateOrderStatus(order.id, "Confirmed")}>Approve</button>{" "}
                  <button onClick={() => updateOrderStatus(order.id, "Cancelled")}>Cancel</button>
                </div>
              )}
            </div>
          ))}
          <div style={{ marginTop: "20px" }}>
            <button onClick={() => setShowOrders(false)}>⬅ Back to Products</button>
          </div>
        </div>
      )}

      {/* ================= PRODUCT LIST WITH PAGINATION ================= */}
      {!showCart && !showOrders && !selectedProduct && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
          {displayedProducts.map((product) => (
            <div key={product.id} style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", padding: "15px", cursor: "pointer", width: "360px", minHeight: "120px" }}
              onClick={() => setSelectedProduct(product)}>
              <img src={product.image_url} width="100" height="100" alt="" />
              <div style={{ marginLeft: "15px" }}>
                <h3 style={{ margin: 0 }}>{product.name}</h3>
                <p style={{ margin: 0 }}>₹ {product.price}</p>
                {user?.role === "admin" && (
  <div style={{ marginTop: "10px" }}>
    <button
      onClick={(e) => {
        e.stopPropagation();
        setSelectedProduct(product);
        setIsEditing(true);
      }}
    >
      Edit
    </button>{" "}
    <button
      onClick={(e) => {
        e.stopPropagation();
        deleteProduct(product.id);
      }}
    >
      Delete
    </button>
  </div>
)}
              </div>
            </div>
          ))}

          {/* Pagination Buttons */}
          <div>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} onClick={() => setCurrentPage(i + 1)} style={{ margin: "2px", backgroundColor: currentPage === i + 1 ? "#ccc" : "#fff" }}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= PRODUCT DETAILS ================= */}
      {selectedProduct && (
        <div>
          <img src={selectedProduct.image_url} width="250" alt="" />
          {user?.role === "admin" && isEditing ? (
  <>
    <input
      value={selectedProduct.name}
      onChange={(e) =>
        setSelectedProduct({ ...selectedProduct, name: e.target.value })
      }
    />
    <input
      value={selectedProduct.description}
      onChange={(e) =>
        setSelectedProduct({ ...selectedProduct, description: e.target.value })
      }
    />
    <input
      type="number"
      value={selectedProduct.price}
      onChange={(e) =>
        setSelectedProduct({ ...selectedProduct, price: e.target.value })
      }
    />
    <input
      value={selectedProduct.image_url}
      onChange={(e) =>
        setSelectedProduct({ ...selectedProduct, image_url: e.target.value })
      }
    />
    <input
      value={selectedProduct.category}
      onChange={(e) =>
        setSelectedProduct({ ...selectedProduct, category: e.target.value })
      }
    />
    <input
      type="number"
      value={selectedProduct.stock}
      onChange={(e) =>
        setSelectedProduct({ ...selectedProduct, stock: e.target.value })
      }
    />
  </>
) : (
  <>
    <h2>{selectedProduct.name}</h2>
    <p>{selectedProduct.description}</p>
    <p>₹ {selectedProduct.price}</p>
  </>
)}

          <div>
            <button onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>-</button>{" "}
            {quantity}{" "}
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          <div style={{ marginTop: "10px" }}>
            <button onClick={() => addToCart(selectedProduct.id)}>Add to Cart 🛒</button>
            {user?.role === "admin" && isEditing && (
  <div style={{ marginTop: "10px" }}>
    <button onClick={updateProduct}>Update Product</button>
  </div>
)}
          </div>

          <div style={{ marginTop: "20px" }}>
            <button onClick={() => { setSelectedProduct(null); setQuantity(1); }}>⬅ Back to Products</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;