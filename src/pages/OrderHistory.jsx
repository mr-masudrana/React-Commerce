// src/pages/OrderHistory.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const orderRef = ref(db, 'orders');
    onValue(orderRef, (snapshot) => {
      const data = snapshot.val();
      const userOrders = Object.entries(data || {}).filter(([_, order]) => order.uid === user.uid);
      setOrders(userOrders);
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map(([key, order]) => (
          <div key={key} className="border mb-4 p-3 rounded shadow">
            <p><strong>Order ID:</strong> {key}</p>
            <p><strong>Total:</strong> ৳{order.total}</p>
            <p><strong>Items:</strong></p>
            <ul className="list-disc pl-6">
              {order.items.map((item, idx) => (
                <li key={idx}>{item.name} × {item.qty}</li>
              ))}
            </ul>
            <p className="text-sm text-gray-500 mt-2">Placed: {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}
