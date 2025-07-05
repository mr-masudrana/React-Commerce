// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { admin } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const orderRef = ref(db, 'orders');
    onValue(orderRef, (snapshot) => {
      const data = snapshot.val();
      const orderList = Object.entries(data || {});
      setOrders(orderList);
    });
  }, []);

  if (!admin) return <p className="p-4 text-red-600">Access Denied: You are not Admin</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>
      {orders.map(([key, order]) => (
        <div key={key} className="border p-4 rounded mb-4 shadow">
          <p><strong>Order ID:</strong> {key}</p>
          <p><strong>User ID:</strong> {order.uid}</p>
          <p><strong>Total:</strong> ৳{order.total}</p>
          <p><strong>Items:</strong></p>
          <ul className="list-disc pl-6">
            {order.items.map((item, idx) => (
              <li key={idx}>{item.name} × {item.qty}</li>
            ))}
          </ul>
          <p className="text-gray-500 text-sm mt-2">Time: {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
