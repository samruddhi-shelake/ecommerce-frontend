import { useState } from "react";
import "./Checkout.css";

const ORDER_API = "http://localhost:8083/orders";

function Checkout({
  cart,
  cartTotal,
  onBack,
  onOrderSuccess,
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deliveryCharge = cartTotal >= 499 ? 0 : 40;
  const finalTotal = cartTotal + deliveryCharge;

  const placeOrder = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !name.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !pincode.trim()
    ) {
      setError("Please fill all delivery details.");
      return;
    }

    if (phone.length !== 10) {
      setError("Please enter a valid 10 digit phone number.");
      return;
    }

    if (pincode.length !== 6) {
      setError("Please enter a valid 6 digit pincode.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      for (const item of cart) {
        const order = {
          productId: item.id,
          quantity: item.quantity,
          totalPrice:
            Number(item.price) * item.quantity,
        };

        const response = await fetch(ORDER_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        });

        if (!response.ok) {
          throw new Error("Order API failed");
        }
      }

      setLoading(false);
      onOrderSuccess();

    } catch (error) {
      console.error("Checkout error:", error);
      setLoading(false);
      setError(
        "Unable to place order. Please make sure Order Service is running."
      );
    }
  };

  return (
    <div className="checkout-page">

      {/* HEADER */}

      <header className="checkout-header">

        <div className="checkout-logo">
          ShopKart
        </div>

        <div className="secure-checkout">
          🔒 Secure Checkout
        </div>

      </header>

      {/* MAIN */}

      <main className="checkout-container">

        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          ← Back to Shopping
        </button>

        <div className="checkout-title">

          <p>
            SHOPKART
          </p>

          <h1>
            Checkout
          </h1>

          <span>
            Complete your order securely
          </span>

        </div>

        <div className="checkout-layout">

          {/* LEFT SIDE */}

          <div className="checkout-left">

            <form onSubmit={placeOrder}>

              {/* DELIVERY */}

              <section className="checkout-card">

                <div className="checkout-card-title">

                  <div className="step-number">
                    1
                  </div>

                  <div>
                    <h2>
                      Delivery Information
                    </h2>

                    <p>
                      Where should we deliver your order?
                    </p>
                  </div>

                </div>

                <div className="form-grid">

                  <div className="form-group full">

                    <label>
                      Full Name
                    </label>

                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Mobile Number
                    </label>

                    <input
                      type="tel"
                      placeholder="10 digit mobile number"
                      maxLength="10"
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          e.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Pincode
                    </label>

                    <input
                      type="text"
                      placeholder="6 digit pincode"
                      maxLength="6"
                      value={pincode}
                      onChange={(e) =>
                        setPincode(
                          e.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                    />

                  </div>

                  <div className="form-group full">

                    <label>
                      Complete Address
                    </label>

                    <textarea
                      placeholder="House No., Building, Street, Area"
                      rows="4"
                      value={address}
                      onChange={(e) =>
                        setAddress(e.target.value)
                      }
                    />

                  </div>

                  <div className="form-group full">

                    <label>
                      City
                    </label>

                    <input
                      type="text"
                      placeholder="Enter your city"
                      value={city}
                      onChange={(e) =>
                        setCity(e.target.value)
                      }
                    />

                  </div>

                </div>

              </section>

              {/* PAYMENT */}

              <section className="checkout-card">

                <div className="checkout-card-title">

                  <div className="step-number">
                    2
                  </div>

                  <div>
                    <h2>
                      Payment Method
                    </h2>

                    <p>
                      Choose your preferred payment option
                    </p>
                  </div>

                </div>

                <div className="payment-options">

                  <label
                    className={
                      paymentMethod === "COD"
                        ? "payment-option selected"
                        : "payment-option"
                    }
                  >

                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={
                        paymentMethod === "COD"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                    />

                    <span className="payment-icon">
                      💵
                    </span>

                    <div>

                      <strong>
                        Cash on Delivery
                      </strong>

                      <small>
                        Pay when your order arrives
                      </small>

                    </div>

                  </label>

                  <label
                    className={
                      paymentMethod === "UPI"
                        ? "payment-option selected"
                        : "payment-option"
                    }
                  >

                    <input
                      type="radio"
                      name="payment"
                      value="UPI"
                      checked={
                        paymentMethod === "UPI"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                    />

                    <span className="payment-icon">
                      📱
                    </span>

                    <div>

                      <strong>
                        UPI
                      </strong>

                      <small>
                        Google Pay, PhonePe, Paytm
                      </small>

                    </div>

                  </label>

                  <label
                    className={
                      paymentMethod === "CARD"
                        ? "payment-option selected"
                        : "payment-option"
                    }
                  >

                    <input
                      type="radio"
                      name="payment"
                      value="CARD"
                      checked={
                        paymentMethod === "CARD"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                    />

                    <span className="payment-icon">
                      💳
                    </span>

                    <div>

                      <strong>
                        Credit / Debit Card
                      </strong>

                      <small>
                        Visa, Mastercard, RuPay
                      </small>

                    </div>

                  </label>

                </div>

              </section>

              {/* ERROR */}

              {error && (
                <div className="checkout-error">
                  ⚠️ {error}
                </div>
              )}

              {/* PLACE ORDER */}

              <button
                type="submit"
                className="place-order-button"
                disabled={loading}
              >

                {loading
                  ? "Placing Order..."
                  : `Place Order • ₹${finalTotal}`}

              </button>

            </form>

          </div>

          {/* RIGHT SIDE */}

          <aside className="order-summary">

            <div className="summary-header">

              <h2>
                Order Summary
              </h2>

              <span>
                {cart.length} Items
              </span>

            </div>

            <div className="summary-products">

              {cart.map((item) => (

                <div
                  className="summary-product"
                  key={item.id}
                >

                  <div className="summary-product-image">
                    🛍️
                  </div>

                  <div className="summary-product-info">

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      {item.category}
                    </p>

                    <span>
                      Qty: {item.quantity}
                    </span>

                  </div>

                  <strong>
                    ₹
                    {Number(item.price) *
                      item.quantity}
                  </strong>

                </div>

              ))}

            </div>

            <div className="summary-line">
              <span>
                Subtotal
              </span>

              <strong>
                ₹{cartTotal}
              </strong>
            </div>

            <div className="summary-line">
              <span>
                Delivery
              </span>

              <strong>
                {deliveryCharge === 0
                  ? "FREE"
                  : `₹${deliveryCharge}`}
              </strong>
            </div>

            {deliveryCharge === 0 && (
              <p className="free-delivery-message">
                🎉 You got FREE delivery!
              </p>
            )}

            <div className="summary-total">

              <span>
                Total Amount
              </span>

              <strong>
                ₹{finalTotal}
              </strong>

            </div>

            <div className="secure-message">

              🔒

              <div>

                <strong>
                  Safe & Secure Payments
                </strong>

                <p>
                  Your payment information is protected.
                </p>

              </div>

            </div>

          </aside>

        </div>

      </main>

      {/* FOOTER */}

      <footer className="checkout-footer">

        <p>
          © 2026 ShopKart. All rights reserved.
        </p>

        <span>
          Secure • Reliable • Easy Shopping
        </span>

      </footer>

    </div>
  );
}

export default Checkout;