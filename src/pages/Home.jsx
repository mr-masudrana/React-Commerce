// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebaseConfig';
import { useCart } from '../context/CartContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const productRef = ref(db, 'products');
    onValue(productRef, (snapshot) => {
      const data = snapshot.val() || {};
      const loaded = Object.entries(data).map(([key, val]) => ({
        id: key,
        ...val
      }));
      setProducts(loaded);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Our Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border p-3 rounded">
            <img src={p.image} className="w-full h-40 object-cover" alt={p.name} />
            <h3 className="font-semibold">{p.name}</h3>
            <p>৳ {p.price}</p>
            <button onClick={() => addToCart(p)} className="bg-green-500 text-white px-3 py-1 mt-2">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
