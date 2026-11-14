import { useState } from "react";
import "./style.css";

const dishes = [
  { name: "Andhra Chicken Curry", category: "Curries", price: 249, image: "photo-1603894584373-5ac82b2ae398" },
  { name: "Gongura Chicken Curry", category: "Curries", price: 269, image: "photo-1567620905732-2d1ec7ab7445" },
  { name: "Andhra Mutton Curry", category: "Curries", price: 329, image: "photo-1545247181-516773cae754" },
  { name: "Paneer Butter Masala", category: "Curries", price: 229, image: "photo-1631452180519-c014fe946bc7" },
  { name: "Guntur Chicken Fry", category: "Starters", price: 279, image: "/images/guntur-chicken-fry.jpg" },
  { name: "Chicken Kebab", category: "Starters", price: 249, image: "/images/chicken-kebab.jpg" },
  { name: "Chicken Tikka", category: "Starters", price: 259, image: "photo-1599487488170-d11ec9c172f0" },
  { name: "Paneer Tikka", category: "Starters", price: 219, image: "photo-1567188040759-fb8a883dc6d8" },
  { name: "Andhra Kodi Pulao", category: "Biryani", price: 299, image: "photo-1563379091339-03246963d96c" },
  { name: "Hyderabadi Chicken Biryani", category: "Biryani", price: 289, image: "photo-1589302168068-964664d93dc0" },
  { name: "Mutton Dum Biryani", category: "Biryani", price: 349, image: "photo-1589302168068-964664d93dc0" },
  { name: "Special Veg Pulao", category: "Vegetarian", price: 189, image: "photo-1512058564366-18510be2db19" },
  { name: "Paneer Fried Rice", category: "Vegetarian", price: 199, image: "photo-1603133872878-684f208fb84b" },
  { name: "Veg Biryani", category: "Vegetarian", price: 179, image: "photo-1589302168068-964664d93dc0" },
  { name: "Mushroom Masala", category: "Vegetarian", price: 209, image: "photo-1505576399274-565b52d4ac71" },
  { name: "Andhra Veg Meals", category: "Meals", price: 199, image: "photo-1547592180-85f173990554" },
  { name: "Andhra Chicken Meals", category: "Meals", price: 249, image: "photo-1547592180-85f173990554" },
  { name: "South Indian Mini Meals", category: "Meals", price: 159, image: "photo-1547592180-85f173990554" },
  { name: "Special Palace Meals", category: "Meals", price: 279, image: "photo-1547592180-85f173990554" }
];

const categories = [
  "All Dishes", "Starters", "Biryani", "Curries", "Vegetarian", "Meals"
];

export default function App() {
  const [page, setPage] = useState("menu");
  const [category, setCategory] = useState("All Dishes");
  const [cart, setCart] = useState({});
  const [payment, setPayment] = useState("Cash on Delivery");
  const [customer, setCustomer] = useState({
    name: "", phone: "", address: ""
  });
  const [message, setMessage] = useState("");

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = dishes.reduce(
    (sum, d, i) => sum + d.price * (cart[i] || 0), 0
  );
  const gst = Math.round(subtotal * 0.05);
  const delivery = subtotal > 0 ? 30 : 0;
  const total = subtotal + gst + delivery;

  const visible = dishes
    .map((dish, i) => ({ ...dish, id: i }))
    .filter(d => category === "All Dishes" || d.category === category);

  function add(i, amount) {
    setCart(old => {
      const next = { ...old };
      next[i] = Math.max(0, (next[i] || 0) + amount);
      if (!next[i]) delete next[i];
      return next;
    });
  }

  function placeOrder(e) {
    e.preventDefault();
    if (!count) {
      setMessage("Please add food to your cart first.");
      return;
    }
    setMessage("");
    setPage("success");
  }

  return (
    <div className="palace-app">
      <header className="palace-header">
        <a className="logo" href="#home"
          onClick={e => { e.preventDefault(); setPage("menu"); }}>
          👑 CHOWDARY'S PALACE
        </a>
        <nav>
          <button onClick={() => setPage("menu")}>HOME</button>
          <button onClick={() => setPage("menu")}>OUR MENU</button>
          <button onClick={() => setPage("cart")}>🛒 CART ({count})</button>
        </nav>
      </header>

      {page === "menu" && (
        <main className="palace-main" id="home">
          <section className="palace-hero">
            <p>AUTHENTIC ANDHRA CUISINE</p>
            <h1>A Royal Feast Awaits</h1>
            <p>Traditional flavours. Fresh ingredients. Delivered with love.</p>
            <button className="palace-primary"
              onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>
              EXPLORE OUR MENU
            </button>
          </section>

          <section id="menu" className="palace-menu">
            <h2>Our Royal Menu</h2>
            <p>Discover your favourite dishes from Chowdary's Palace.</p>

            <div className="category-list">
              {categories.map(c => (
                <button key={c}
                  className={category === c ? "category active" : "category"}
                  onClick={() => setCategory(c)}>{c}</button>
              ))}
            </div>

            <div className="food-grid">
              {visible.map(d => (
                <article className="food-card" key={d.id}>
                  <img
                    className="food-image"
                    src={d.image.startsWith("/") ? d.image : `https://images.unsplash.com/${d.image}?auto=format&fit=crop&w=700&q=85`}
                    alt={d.name}
                    loading="lazy"
                    onError={e => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://placehold.co/700x450/f8ead7/702019?text=Chowdarys+Palace";
                    }}
                  />
                  <div className="dish-details">
                    <span className="dish-category">{d.category}</span>
                    <h3>{d.name}</h3>
                    <div className="dish-bottom">
                      <strong>₹{d.price}</strong>
                      {(cart[d.id] || 0) > 0 ? (
                        <div className="dish-quantity">
                          <button onClick={() => add(d.id, -1)}>−</button>
                          <span>{cart[d.id]}</span>
                          <button onClick={() => add(d.id, 1)}>+</button>
                        </div>
                      ) : (
                        <button className="add-dish" onClick={() => add(d.id, 1)}>
                          ADD +
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {count > 0 && (
              <button className="palace-primary"
                onClick={() => setPage("cart")}>
                VIEW CART · {count} ITEMS · ₹{subtotal}
              </button>
            )}
          </section>
        </main>
      )}

      {page === "cart" && (
        <main className="checkout-page">
          <button className="back-button" onClick={() => setPage("menu")}>
            ← Continue Shopping
          </button>
          <h1>Your Royal Feast</h1>
          {count === 0 ? (
            <p>Your cart is empty. Please add some delicious dishes.</p>
          ) : (
            <>
              {dishes.map((d, i) => cart[i] ? (
                <div className="checkout-row" key={d.name}>
                  <span>{d.name}</span>
                  <div className="dish-quantity">
                    <button onClick={() => add(i, -1)}>−</button>
                    <span>{cart[i]}</span>
                    <button onClick={() => add(i, 1)}>+</button>
                  </div>
                  <strong>₹{d.price * cart[i]}</strong>
                </div>
              ) : null)}
              <div className="bill-box">
                <p>Item subtotal <strong>₹{subtotal}</strong></p>
                <p>Estimated GST (5%) <strong>₹{gst}</strong></p>
                <p>Delivery fee <strong>₹{delivery}</strong></p>
                <h2>Grand Total <strong>₹{total}</strong></h2>
              </div>
              <button className="palace-primary full-button"
                onClick={() => { setMessage(""); setPage("checkout"); }}>
                PROCEED TO CHECKOUT →
              </button>
            </>
          )}
        </main>
      )}

      {page === "checkout" && (
        <main className="checkout-page">
          <button className="back-button" onClick={() => setPage("cart")}>
            ← Back to Cart
          </button>
          <h1>Checkout & Payment</h1>
          <p>Complete your delivery details to place your demo order.</p>

          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={placeOrder}>
              <h2>Delivery Details</h2>
              <label>Full Name</label>
              <input required value={customer.name} placeholder="Enter your name"
                onChange={e => setCustomer({ ...customer, name: e.target.value })}/>

              <label>Mobile Number</label>
              <input required type="tel" pattern="[0-9]{10}" maxLength="10"
                value={customer.phone} placeholder="10-digit mobile number"
                onChange={e => setCustomer({ ...customer, phone: e.target.value })}/>

              <label>Delivery Address</label>
              <textarea required rows="3" value={customer.address}
                placeholder="House number, street, city, PIN code"
                onChange={e => setCustomer({ ...customer, address: e.target.value })}/>

              <h2>Choose Payment Method</h2>
              {["UPI", "Credit / Debit Card", "Cash on Delivery"].map(method => (
                <label className="payment-option" key={method}>
                  <input type="radio" name="payment" value={method}
                    checked={payment === method}
                    onChange={() => setPayment(method)}/>
                  <span>{method}</span>
                  {method === "UPI" && <small>Google Pay · PhonePe · Paytm</small>}
                  {method === "Credit / Debit Card" && <small>Visa · Mastercard · RuPay</small>}
                  {method === "Cash on Delivery" && <small>Pay when your order arrives</small>}
                </label>
              ))}

              <p className="payment-notice">
                Demo only: UPI and card payments require a real payment gateway.
                No real payment will be taken.
              </p>
              {message && <p className="error-message">{message}</p>}
              <button className="palace-primary full-button" type="submit">
                PLACE DEMO ORDER · ₹{total}
              </button>
            </form>

            <aside className="bill-box checkout-bill">
              <h2>Order Summary</h2>
              {dishes.map((d, i) => cart[i] ? (
                <p key={d.name}>{d.name} × {cart[i]}
                  <strong>₹{d.price * cart[i]}</strong></p>
              ) : null)}
              <hr/>
              <p>Subtotal <strong>₹{subtotal}</strong></p>
              <p>Estimated GST (5%) <strong>₹{gst}</strong></p>
              <p>Delivery <strong>₹{delivery}</strong></p>
              <h2>Total <strong>₹{total}</strong></h2>
            </aside>
          </div>
        </main>
      )}

      {page === "success" && (
        <main className="checkout-page success-page">
          <h1>✓ Demo Order Confirmed!</h1>
          <p>Thank you, {customer.name}.</p>
          <p>Delivery address: {customer.address}</p>
          <p>Payment method: {payment}</p>
          <h2>Order total: ₹{total}</h2>
          <p className="payment-notice">
            This is a demonstration only. No payment was processed and no real
            delivery was arranged.
          </p>
          <button className="palace-primary"
            onClick={() => { setCart({}); setPage("menu"); }}>
            BACK TO MENU
          </button>
        </main>
      )}

      <footer className="palace-footer">
        <h2>CHOWDARY'S PALACE</h2>
        <p>Authentic Andhra Cuisine · Made with tradition and love</p>
        <small>© 2026 Chowdary's Palace · Demo website</small>
      </footer>
    </div>
  );
}
