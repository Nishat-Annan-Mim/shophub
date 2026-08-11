import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-brand-700">
          ShopHub
        </Link>
        <div className="flex items-center gap-5 text-sm font-medium">
          <Link to="/" className="hover:text-brand-600">Products</Link>
          {user && (
            <Link to="/orders" className="hover:text-brand-600">My Orders</Link>
          )}
          {user?.role === "ADMIN" && (
            <Link to="/admin" className="hover:text-brand-600">Admin</Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-slate-500">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-1.5 rounded-lg hover:bg-slate-100">
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
