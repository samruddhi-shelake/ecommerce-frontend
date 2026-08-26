import { useEffect, useState } from "react";
import "./App.css";

const PRODUCT_API = "http://localhost:8082/products";
const ORDER_API = "http://localhost:8083/orders";

function App() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(PRODUCT_API);

      if (!response.ok) {
        throw new Error("Product API failed");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Product API error:", error);
      setProducts([]);
    }
  };

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    setMessage(`${product.name} added to cart!`);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  };

  const buyNow = async (product) => {
    const order = {
      productId: product.id,
      quantity: 1,
      totalPrice: product.price,
    };

    try {
      const response = await fetch(ORDER_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        setMessage("Order placed successfully!");

        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        setMessage("Unable to place order.");
      }
    } catch (error) {
      console.error("Order API error:", error);
      setMessage("Order service is not available.");
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    const productName = product.name?.toLowerCase() || "";
    const description = product.description?.toLowerCase() || "";
    const category = product.category?.toLowerCase() || "";

    const matchesSearch =
      productName.includes(searchText) ||
      description.includes(searchText) ||
      category.includes(searchText);

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const cartTotal = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="app">

      {/* NAVBAR */}

      <header className="navbar">

        <div className="logo">
          ShopKart
        </div>

        <div className="search-box">

          <input
            type="text"
            placeholder="Search for products, brands and more..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="button">
            🔍
          </button>

        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#categories">Categories</a>
          <a href="#products">Products</a>
        </nav>

        <div className="nav-actions">

          <button type="button" className="account-btn">
            👤
            <span>Account</span>
          </button>

          <button type="button" className="wishlist-btn">
            ♡
            <span>Wishlist</span>
          </button>

          <a href="#cart" className="cart-btn">
            🛒
            <span>Cart</span>

            {cartCount > 0 && (
              <b>{cartCount}</b>
            )}
          </a>

        </div>

      </header>

      {/* MESSAGE */}

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {/* CART */}

      {cart.length > 0 && (
        <section className="cart-section" id="cart">

          <div className="cart-container">

            <div className="cart-header">

              <h2>
                🛒 My Cart
              </h2>

              <button
                type="button"
                onClick={() => setCart([])}
              >
                Clear Cart
              </button>

            </div>

            <div className="cart-items">

              {cart.map((item) => (

                <div
                  className="cart-item"
                  key={item.id}
                >

                  <div className="cart-item-image">
                    🛍️
                  </div>

                  <div className="cart-item-info">

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      {item.category}
                    </p>

                    <strong>
                      ₹{item.price}
                    </strong>

                  </div>

                  <div className="cart-quantity">
                    Qty: {item.quantity}
                  </div>

                  <button
                    type="button"
                    className="remove-cart"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    Remove
                  </button>

                </div>

              ))}

            </div>

            <div className="cart-total">

              <span>
                Total
              </span>

              <strong>
                ₹{cartTotal}
              </strong>

            </div>

            <button
              type="button"
              className="checkout-button"
              onClick={() =>
                setMessage("Checkout feature coming next!")
              }
            >
              Proceed to Checkout →
            </button>

          </div>

        </section>
      )}

      {/* HERO */}

      <section className="hero" id="home">

        <div className="hero-content">

          <p className="small-title">
            WELCOME TO SHOPKART
          </p>

          <h1>
            Big Deals.
            <br />
            <span>Better Shopping.</span>
          </h1>

          <p>
            Discover the latest products, amazing deals
            and everyday essentials — all in one place.
          </p>

          <a
            href="#products"
            className="shop-button"
          >
            Shop Now →
          </a>

        </div>

        <div className="hero-card">

          <div className="hero-offer">

            <span>
              SALE
            </span>

            <strong>
              UP TO
            </strong>

            <b>
              50% OFF
            </b>

          </div>

          <div className="hero-emoji">
            🛍️
          </div>

          <p>
            Limited Time Offers
          </p>

        </div>

      </section>

      {/* CATEGORIES */}

      <section
        className="category-section"
        id="categories"
      >

        <div className="section-heading">

          <p>
            EXPLORE
          </p>

          <h2>
            Shop By Category
          </h2>

        </div>

        <div className="categories">

          <button
            type="button"
            className={
              selectedCategory === "All"
                ? "category active"
                : "category"
            }
            onClick={() => setSelectedCategory("All")}
          >
            <span>🛍️</span>
            <strong>All</strong>
            <small>View All</small>
          </button>

          <button
            type="button"
            className={
              selectedCategory === "Electronics"
                ? "category active"
                : "category"
            }
            onClick={() =>
              setSelectedCategory("Electronics")
            }
          >
            <span>💻</span>
            <strong>Electronics</strong>
            <small>Latest Gadgets</small>
          </button>

          <button
            type="button"
            className={
              selectedCategory === "Fashion"
                ? "category active"
                : "category"
            }
            onClick={() =>
              setSelectedCategory("Fashion")
            }
          >
            <span>👕</span>
            <strong>Fashion</strong>
            <small>Trending Styles</small>
          </button>

          <button
            type="button"
            className={
              selectedCategory === "Beauty"
                ? "category active"
                : "category"
            }
            onClick={() =>
              setSelectedCategory("Beauty")
            }
          >
            <span>💄</span>
            <strong>Beauty</strong>
            <small>Beauty & Care</small>
          </button>

          <button
            type="button"
            className={
              selectedCategory === "Home"
                ? "category active"
                : "category"
            }
            onClick={() =>
              setSelectedCategory("Home")
            }
          >
            <span>🏠</span>
            <strong>Home</strong>
            <small>Home Essentials</small>
          </button>

        </div>

      </section>

      {/* PRODUCTS */}

      <section
        className="products-section"
        id="products"
      >

        <div className="products-top">

          <div className="section-heading left">

            <p>
              OUR COLLECTION
            </p>

            <h2>
              {selectedCategory === "All"
                ? "Featured Products"
                : selectedCategory}
            </h2>

          </div>

          <span className="product-count">
            {filteredProducts.length} Products
          </span>

        </div>

        <div className="product-grid">

          {filteredProducts.length > 0 ? (

            filteredProducts.map((product) => (

              <div
                className="product-card"
                key={product.id}
              >

                <div className="product-image">

                  <div className="image-placeholder">
                    🛍️
                  </div>

                  <button
                    type="button"
                    className="wishlist"
                  >
                    ♡
                  </button>

                  {product.category && (
                    <span className="product-category">
                      {product.category}
                    </span>
                  )}

                </div>

                <div className="product-info">

                  <p className="brand">
                    ShopKart
                  </p>

                  <h3>
                    {product.name}
                  </h3>

                  <p className="description">
                    {product.description ||
                      "Premium quality product"}
                  </p>

                  <div className="rating">
                    ⭐ 4.5
                    <span>
                      {" "} | 120 Ratings
                    </span>
                  </div>

                  <div className="price-row">

                    <strong>
                      ₹{product.price}
                    </strong>

                    <span className="old-price">
                      ₹
                      {Math.round(
                        Number(product.price) * 1.15
                      )}
                    </span>

                    <span className="discount">
                      15% OFF
                    </span>

                  </div>

                  <div className="product-buttons">

                    <button
                      type="button"
                      className="add-cart"
                      onClick={() =>
                        addToCart(product)
                      }
                    >
                      🛒 Add to Cart
                    </button>

                    <button
                      type="button"
                      className="buy-now"
                      onClick={() =>
                        buyNow(product)
                      }
                    >
                      Buy Now
                    </button>

                  </div>

                </div>

              </div>

            ))

          ) : (

            <div className="no-products">

              <div>
                🔍
              </div>

              <h3>
                No products found
              </h3>

              <p>
                Try another search or category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
              >
                View All Products
              </button>

            </div>

          )}

        </div>

      </section>

      {/* FEATURES */}

      <section className="features">

        <div className="feature">

          <span>
            🚚
          </span>

          <div>
            <h3>
              Free Delivery
            </h3>

            <p>
              On orders above ₹499
            </p>
          </div>

        </div>

        <div className="feature">

          <span>
            🔒
          </span>

          <div>
            <h3>
              Secure Payments
            </h3>

            <p>
              100% secure checkout
            </p>
          </div>

        </div>

        <div className="feature">

          <span>
            ↩️
          </span>

          <div>
            <h3>
              Easy Returns
            </h3>

            <p>
              Simple return policy
            </p>
          </div>

        </div>

        <div className="feature">

          <span>
            💬
          </span>

          <div>
            <h3>
              24/7 Support
            </h3>

            <p>
              We're here to help
            </p>
          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer>

        <div className="footer-main">

          <div className="footer-brand">

            <h2>
              ShopKart
            </h2>

            <p>
              Your one-stop destination for
              quality products and amazing deals.
            </p>

          </div>

          <div>

            <h3>
              Shop
            </h3>

            <a href="#products">
              All Products
            </a>

            <a href="#categories">
              Categories
            </a>

            <a href="#products">
              Best Deals
            </a>

          </div>

          <div>

            <h3>
              Customer Care
            </h3>

            <a href="#home">
              Help Center
            </a>

            <a href="#home">
              Returns
            </a>

            <a href="#home">
              Contact Us
            </a>

          </div>

          <div>

            <h3>
              Follow Us
            </h3>

            <p>
              Instagram
            </p>

            <p>
              Facebook
            </p>

            <p>
              Twitter
            </p>

          </div>

        </div>

        <div className="footer-bottom">

          <p>
            © 2026 ShopKart. All rights reserved.
          </p>

          <p>
            Secure • Reliable • Easy Shopping
          </p>

        </div>

      </footer>

    </div>
  );
}

export default App;