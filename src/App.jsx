import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Library from "./pages/Library/Library";
import Login from "./pages/Login/Login";
import { logoutUser } from "./services/rifflyApi";
import "./App.css";
const SESSION_KEY = "riffly_user";
const SESSION_EVENT = "riffly:session-expired";

function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(SESSION_KEY);

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);

        if (
          parsedUser?.email &&
          parsedUser?.token &&
          parsedUser?.authenticated === true
        ) {
          setUser(parsedUser);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar sessão:", err);

      localStorage.removeItem(SESSION_KEY);
    } finally {
      setCheckingSession(false);
    }
  }, []);

  useEffect(() => {
    function handleSessionExpired() {
      localStorage.removeItem(SESSION_KEY);

      setUser(null);

      toast.error("Sua sessão expirou. Entre novamente.", {
        id: "session-expired",
      });
    }

    window.addEventListener(SESSION_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(SESSION_EVENT, handleSessionExpired);
    };
  }, []);

  function handleLogin(authenticatedUser) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(authenticatedUser));

    setUser(authenticatedUser);
  }

  async function handleLogout() {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Erro ao encerrar sessão:", err);
    } finally {
      localStorage.removeItem(SESSION_KEY);

      setUser(null);
    }
  }

  if (checkingSession) {
    return null;
  }

  return (
    <>
      {user ? (
        <Library user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}

      <Toaster
        position="bottom-right"
        gutter={7}
        containerStyle={{
          bottom: 18,
          right: 18,
        }}
        toastOptions={{
          duration: 2800,

          style: {
            maxWidth: "320px",
            padding: "9px 11px",
            border: "1px solid #e4e9ef",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#475569",
            fontSize: "9px",
            fontWeight: 560,
            lineHeight: 1.4,
            boxShadow: "0 8px 26px rgba(15, 23, 42, 0.08)",
          },

          success: {
            duration: 2400,

            iconTheme: {
              primary: "#16a36a",
              secondary: "#ffffff",
            },

            style: {
              border: "1px solid #dcefe5",
            },
          },

          error: {
            duration: 3800,

            iconTheme: {
              primary: "#dc2626",
              secondary: "#ffffff",
            },

            style: {
              border: "1px solid #f1dddd",
            },
          },

          loading: {
            style: {
              border: "1px solid #dce6f5",
            },

            iconTheme: {
              primary: "#2563eb",
              secondary: "#dbeafe",
            },
          },
        }}
      />
    </>
  );
}

export default App;
