import { createContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../supabaseClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured) {
      // Check Supabase session
      supabase.auth.getSession()
        .then(({ data }) => {
          setUser(data?.session?.user || null);
        })
        .catch((err) => {
          console.warn("Supabase auth error:", err);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });

      try {
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user || null);
        });

        return () => listener?.subscription?.unsubscribe();
      } catch (err) {
        console.warn("Supabase listener error:", err);
      }
    } else {
      // Demo/Local session fallback
      try {
        const savedDemoUser = localStorage.getItem("mindspark_demo_user");
        if (savedDemoUser) {
          setUser(JSON.parse(savedDemoUser));
        }
      } catch (e) {
        console.warn("Failed to load demo user", e);
      }
      setLoading(false);
    }
  }, []);

  const loginDemoUser = (userData) => {
    localStorage.setItem("mindspark_demo_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("SignOut error", e);
      }
    }
    localStorage.removeItem("mindspark_demo_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, logout, loginDemoUser, isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
};
