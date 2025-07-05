import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email === "admin@gmail.com") {
        setAdmin(true);
      } else {
        setAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, admin }}>
      {children}
    </AuthContext.Provider>
  );
};
