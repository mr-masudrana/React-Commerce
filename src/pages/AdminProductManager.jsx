// src/pages/AdminProductManager.jsx
import { useEffect, useState } from "react";
import { ref, push, set, remove, onValue } from "firebase/database";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function AdminProductManager() {
  const { admin } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', image: '' });
  const [editKey, setEditKey] = useState(null);

  useEffect(() => {
    const productRef = ref(db, 'products');
    onValue(productRef, (snapshot) => {
      const data = snapshot.val() || {};
      const loaded = Object.entries(data).map(([key, val]) => ({ key, ...val }));
      setProducts(loaded);
    });
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.image) return alert("All fields required");

    if (editKey) {
      await set(ref(db, `products/${editKey}`), form);
      setEditKey(null);
    } else {
      const newRef = push(ref(db, 'products'));
      await set(newRef, form);
    }

    setForm({ name: '', price: '', image: '' });
  };

  const handleEdit = (product) => {
    setForm({ name: product.name, price: product.price, image: product.image });
    setEditKey(product.key);
  };

  const handleDelete = (key) => {
    remove(ref(db, `products/${key}`));
  };

  if (!admin) return <p className="p-4 text-red-500">Access Denied</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Product Manager</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Name" className="border p-2" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="text" placeholder="Price" className="border p-2" value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input type="text" placeholder="Image URL" className="border p-2" value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
          {editKey ? "Update Product" : "Add Product"}
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.key} className="border p-3 rounded shadow">
            <img src={p.image} alt={p.name} className="h-40 w-full object-cover" />
            <h3 className="font-semibold">{p.name}</h3>
            <p>৳ {p.price}</p>
            <div className="space-x-2 mt-2">
              <button onClick={() => handleEdit(p)} className="text-blue-600">Edit</button>
              <button onClick={() => handleDelete(p.key)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
