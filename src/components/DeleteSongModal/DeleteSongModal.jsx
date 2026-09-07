import { AlertTriangle, Trash2, X } from "lucide-react";
import "./DeleteSongModal.css";

export default function DeleteSongModal({ isOpen, song, loading, onClose, onConfirm }) {
  if (!isOpen || !song) {
    return null;
  }

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget && !loading) {
      onClose();
    }
  }

  async function handleDelete() {
    await onConfirm(song);
  }

  return (
    <div className="delete-song-overlay" onMouseDown={handleOverlayClick}>
      <div className="delete-song-modal">
        <div className="delete-song-header">
          <div className="delete-song-icon">
            <AlertTriangle size={16} />
          </div>

          <button
            type="button"
            className="delete-song-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Fechar"
          >
            <X size={15} />
          </button>
        </div>

        <div className="delete-song-content">
          <h2>Excluir tablatura?</h2>

          <p>
            Você está prestes a excluir <strong>{song.title}</strong>. Essa ação
            não pode ser desfeita.
          </p>
        </div>

        <div className="delete-song-footer">
          <button
            type="button"
            className="delete-song-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="delete-song-confirm"
            onClick={handleDelete}
            disabled={loading}
          >
            <Trash2 size={12} />

            {loading ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}