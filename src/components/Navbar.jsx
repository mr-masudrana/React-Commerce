import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function Navbar() {
  const { user, admin } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      <div className="space-x-4">
        <Link to="/" className="font-bold text-lg">E-Shop</Link>
        {user && <Link to="/orders">Orders</Link>}
        {admin && (
          <>
            <Link to="/admin">Admin</Link>
            <Link to="/admin/products">Products</Link>
          </>
        )}
      </div>

      <div className="space-x-4">
        <Link to="/cart">Cart ({cartItems.length})</Link>
        {user ? (
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
