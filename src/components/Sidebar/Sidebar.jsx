import { BookOpen, LogOut, X } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar({ isOpen, user, onClose, onLogout }) {
  async function handleLogout() {
    onClose();
    await onLogout();
  }

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onMouseDown={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`sidebar ${isOpen ? "open" : ""}`}
        aria-hidden={!isOpen}
      >
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <div className="sidebar-brand-text">
              <strong>Navy</strong>

              <span>Tablature Library</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X size={15} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className="sidebar-nav-item active"
            onClick={onClose}
          >
            <BookOpen size={14} />

            <span>Biblioteca</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">

            <div className="sidebar-user-info">
              <span>CONECTADO COMO</span>

              <strong title={user?.email}>{user?.email || "Usuário"}</strong>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <LogOut size={13} />

            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}