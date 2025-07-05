// src/pages/Cart.jsx
import { useCart } from "../context/CartContext";
import { auth, db } from "../firebaseConfig";
import { ref, push } from "firebase/database";

export default function Cart() {
  const { cartItems, removeFromCart } = useCart();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login first");
      return;
    }

    const orderRef = ref(db, 'orders');
    await push(orderRef, {
      uid: user.uid,
      items: cartItems,
      total,
      createdAt: Date.now()
    });

    alert("Order placed!");
    localStorage.removeItem("cart");
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? <p>Cart is empty</p> : (
        <>
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between border-b py-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p>Quantity: {item.qty}</p>
              </div>
              <div>
                <p>৳ {item.price * item.qty}</p>
                <button className="text-red-500" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="mt-4">
            <p className="text-lg font-bold">Total: ৳ {total}</p>
            <button className="bg-blue-600 text-white px-4 py-2 mt-2" onClick={handleCheckout}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
