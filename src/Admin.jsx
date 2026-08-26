import { useEffect, useState } from "react";
import "./Admin.css";

const PRODUCT_API = "http://localhost:8082/products";

function Admin() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch(PRODUCT_API);

      if (!response.ok) {
        throw new Error("Could not load products");
      }

      const data = await response.json();
      setProducts(data);
      setError("");
    } catch (err) {
      console.error("Fetch products error:", err);
      setError("Products load झाले नाहीत.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (quantity === "" || Number(quantity) < 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    const product = {
      name: name.trim(),
      category,
      price: Number(price),
      quantity: Number(quantity),
      description: description.trim(),
      imageUrl: null,
    };

    try {
      setLoading(true);

      const response = await fetch(PRODUCT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error(
          `Product could not be added. Status: ${response.status}`
        );
      }

      await response.json();

      setMessage("Product added successfully!");

      setName("");
      setCategory("Electronics");
      setPrice("");
      setQuantity("");
      setDescription("");

      await fetchProducts();
    } catch (err) {
      console.error("Add product error:", err);
      setError(err.message || "Product add करताना problem आला.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${PRODUCT_API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Product could not be deleted");
      }

      setMessage("Product deleted successfully!");

      await fetchProducts();
    } catch (err) {
      console.error("Delete product error:", err);
      setError("Product delete करताना problem आला.");
    }
  };

  return (
    <div className="admin-page">

      {/* TOP NAVBAR */}
      <header className="admin-navbar">

        <div className="admin-logo">
          ShopKart
          <span>ADMIN</span>
        </div>

        <a href="/" className="back-store">
          ← View Store
        </a>

      </header>

      {/* MESSAGE */}
      {message && (
        <div className="admin-message success">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="admin-message error">
          ✕ {error}
        </div>
      )}

      <div className="admin-layout">

        {/* SIDEBAR */}
        <aside className="admin-sidebar">

          <h2>ShopKart Admin</h2>

          <button className="active">
            📊 Dashboard
          </button>

          <button
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            📦 Products
          </button>

          <button
            onClick={() =>
              document
                .getElementById("add-product")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            ➕ Add Product
          </button>

        </aside>

        {/* MAIN CONTENT */}
        <main className="admin-content">

          {/* TITLE */}
          <div className="admin-title">
            <p>SHOPKART ADMIN</p>

            <h1>
              Dashboard
            </h1>
          </div>

          {/* DASHBOARD CARDS */}
          <div className="dashboard-cards">

            <div className="dashboard-card">
              <span>📦</span>

              <div>
                <small>Total Products</small>
                <strong>{products.length}</strong>
              </div>
            </div>

            <div className="dashboard-card">
              <span>💰</span>

              <div>
                <small>Store Status</small>
                <strong>Active</strong>
              </div>
            </div>

            <div className="dashboard-card">
              <span>🛒</span>

              <div>
                <small>Inventory</small>
                <strong>
                  {products.reduce(
                    (total, product) =>
                      total + Number(product.quantity || 0),
                    0
                  )}
                </strong>
              </div>
            </div>

          </div>

          {/* PRODUCTS + ADD FORM */}
          <div className="admin-grid">

            {/* ADD PRODUCT */}
            <section
              className="admin-form-card"
              id="add-product"
            >

              <h2>
                Add New Product
              </h2>

              <p>
                Add products to your ShopKart store
              </p>

              <form onSubmit={addProduct}>

                <label>
                  Product Name *
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="e.g. HP Laptop"
                />

                <label>
                  Category *
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                >
                  <option value="Electronics">
                    Electronics
                  </option>

                  <option value="Fashion">
                    Fashion
                  </option>

                  <option value="Beauty">
                    Beauty
                  </option>

                  <option value="Home">
                    Home
                  </option>
                </select>

                <label>
                  Price *
                </label>

                <input
                  type="number"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                  placeholder="₹ Enter price"
                  min="1"
                />

                <label>
                  Quantity *
                </label>

                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(e.target.value)
                  }
                  placeholder="Enter quantity"
                  min="0"
                />

                <label>
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Describe your product..."
                />

                <button
                  type="submit"
                  className="add-product-btn"
                  disabled={loading}
                >
                  {loading
                    ? "Adding Product..."
                    : "＋ Add Product"}
                </button>

              </form>

            </section>

            {/* PRODUCTS */}
            <section
              className="admin-products-card"
              id="products"
            >

              <div className="card-heading">

                <div>
                  <h2>
                    Products
                  </h2>

                  <p>
                    Manage your store products
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchProducts}
                >
                  ↻ Refresh
                </button>

              </div>

              {products.length === 0 ? (

                <div className="empty-admin">

                  <div className="empty-icon">
                    📦
                  </div>

                  <h3>
                    No Products Yet
                  </h3>

                  <p>
                    Add your first product using the form.
                  </p>

                </div>

              ) : (

                <div className="product-list">

                  {products.map((product) => (

                    <div
                      className="admin-product-row"
                      key={product.id}
                    >

                      <div className="admin-product-icon">
                        {product.category === "Electronics"
                          ? "💻"
                          : product.category === "Fashion"
                          ? "👕"
                          : product.category === "Beauty"
                          ? "💄"
                          : "🏠"}
                      </div>

                      <div className="admin-product-details">

                        <h3>
                          {product.name}
                        </h3>

                        <p>
                          {product.description ||
                            "Premium quality product"}
                        </p>

                        <span>
                          {product.category}
                        </span>

                        <strong>
                          ₹{product.price}
                        </strong>

                      </div>

                      <div className="product-stock">

                        <small>
                          Stock
                        </small>

                        <strong>
                          {product.quantity}
                        </strong>

                      </div>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          deleteProduct(product.id)
                        }
                      >
                        🗑
                      </button>

                    </div>

                  ))}

                </div>

              )}

            </section>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Admin;