import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, FileText, Gauge, Pencil, Trash2 } from "lucide-react";
import "./SongCard.css";

export default  function SongCard({ song, onOpen, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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
        return null;
    }
  }

  function handleOpen() {
    if (onOpen) {
      onOpen(song);
    }
  }

  function handleMenuClick(event) {
    event.stopPropagation();

    setMenuOpen((prev) => !prev);
  }

  function handleEdit(event) {
    event.stopPropagation();

    setMenuOpen(false);

    if (onEdit) {
      onEdit(song);
    }
  }

  function handleDelete(event) {
    event.stopPropagation();

    setMenuOpen(false);

    if (onDelete) {
      onDelete(song);
    }
  }

  function openPdf(event) {
    event.stopPropagation();

    if (!song.pdfUrl) {
      return;
    }

    window.open(song.pdfUrl, "_blank", "noopener,noreferrer");
  }

  const detailItems = [song.genre, song.tuning, getDifficultyLabel()].filter(
    Boolean,
  );

  return (
    <article className="song-card" onClick={handleOpen}>
      <div className="song-card-top">
        <div className="song-card-heading">
          <h3>{song.title || "Sem título"}</h3>

          <p>{song.artist || "Artista não informado"}</p>
        </div>

        <div className="song-menu-wrapper" ref={menuRef}>
          <button
            type="button"
            className="song-menu-button"
            onClick={handleMenuClick}
            aria-label="Opções da tablatura"
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <div
              className="song-menu"
              onClick={(event) => event.stopPropagation()}
            >
              <button type="button" onClick={handleEdit}>
                <Pencil size={13} />
                Editar
              </button>

              <button
                type="button"
                className="delete-option"
                onClick={handleDelete}
              >
                <Trash2 size={13} />
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      {detailItems.length > 0 && (
        <div className="song-card-details">
          {detailItems.map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      )}

      <div className="song-card-bottom">
        <div className="song-card-meta">
          <span className={`song-status ${song.status || "todo"}`}>
            {getStatusLabel()}
          </span>

          {song.bpmOriginal && (
            <span className="song-bpm">
              <Gauge size={12} />
              {song.bpmOriginal} BPM
            </span>
          )}
        </div>

        {song.pdfUrl ? (
          <button type="button" className="pdf-button" onClick={openPdf}>
            <FileText size={13} />
            PDF
          </button>
        ) : (
          <span className="no-pdf">Sem PDF</span>
        )}
      </div>
    </article>
  );
}