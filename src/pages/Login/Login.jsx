import { useState } from "react";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { loginUser } from "../../services/rifflyApi";
import "./Login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Informe seu e-mail.");

      return;
    }

    const toastId = toast.loading("Entrando...");

    try {
      setLoading(true);

      const user = await loginUser(normalizedEmail);

      toast.success("Bem-vindo ao Navy!", {
        id: toastId,
      });

      onLogin(user);
    } catch (err) {
      console.error(err);

      toast.error(err.message || "Não foi possível entrar.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-shell">

        <div className="login-card">
          <div className="login-content">
            <span className="login-eyebrow">ACESSO PRIVADO</span>

            <h1>Sua biblioteca de tablaturas</h1>

            <p>Entre com um e-mail autorizado para acessar sua biblioteca.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="login-email">E-mail</label>

              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="voce@email.com"
                value={email}
                disabled={loading}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              <span>{loading ? "Entrando..." : "Entrar"}</span>

              {!loading && <ArrowRight size={13} />}
            </button>
          </form>
        </div>

        <p className="login-footer">Biblioteca pessoal de tablaturas.</p>
      </div>
    </main>
  );
}