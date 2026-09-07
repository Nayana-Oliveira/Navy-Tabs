import { FileText, Gauge, Pencil, X } from "lucide-react";
import "./SongDetailsModal.css";

export default function SongDetailsModal({ isOpen, song, onClose, onEdit }) {
  if (!isOpen || !song) {
    return null;
  }

  function getStatusLabel() {
    switch (String(song.status).toLowerCase()) {
      case "learning":
        return "Aprendendo";

      case "learned":
        return "Aprendida";

      default:
        return "Quero aprender";
    }
  }

  function getDifficultyLabel() {
    switch (String(song.difficulty).toLowerCase()) {
      case "easy":
        return "Fácil";

      case "medium":
        return "Média";

      case "hard":
        return "Difícil";

      case "very-hard":
        return "Muito difícil";

      default:
        return "Não informada";
    }
  }

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function handleEdit() {
    if (onEdit) {
      onEdit(song);
    }
  }

  function openPdf() {
    if (!song.pdfUrl) {
      return;
    }

    window.open(song.pdfUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="song-details-overlay" onMouseDown={handleOverlayClick}>
      <div className="song-details-modal">
        <div className="song-details-header">
          <div className="song-details-title">
            <span className={`song-details-status ${song.status || "todo"}`}>
              {getStatusLabel()}
            </span>

            <h2>{song.title || "Sem título"}</h2>

            <p>{song.artist || "Artista não informado"}</p>
          </div>

          <button
            type="button"
            className="song-details-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={15} />
          </button>
        </div>

        <div className="song-details-info">
          <div className="song-detail-item">
            <span>Gênero</span>

            <strong>{song.genre || "Não informado"}</strong>
          </div>

          <div className="song-detail-item">
            <span>Afinação</span>

            <strong>{song.tuning || "Não informada"}</strong>
          </div>

          <div className="song-detail-item">
            <span>Dificuldade</span>

            <strong>{getDifficultyLabel()}</strong>
          </div>

          <div className="song-detail-item">
            <span>BPM</span>

            <strong className="song-detail-bpm">
              {song.bpmOriginal ? (
                <>
                  <Gauge size={11} />
                  {song.bpmOriginal}
                </>
              ) : (
                "Não informado"
              )}
            </strong>
          </div>
        </div>

        <div className="song-details-section">
          <span className="song-details-label">Notas</span>

          <div className="song-details-notes">
            {song.notes ? (
              <p>{song.notes}</p>
            ) : (
              <p className="empty-notes">Nenhuma nota adicionada.</p>
            )}
          </div>
        </div>

        <div className="song-details-footer">
          <div>
            {song.pdfUrl ? (
              <button
                type="button"
                className="song-details-pdf"
                onClick={openPdf}
              >
                <FileText size={13} />
                Abrir PDF
              </button>
            ) : (
              <span className="song-details-no-pdf">Sem PDF</span>
            )}
          </div>

          <button
            type="button"
            className="song-details-edit"
            onClick={handleEdit}
          >
            <Pencil size={12} />
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}