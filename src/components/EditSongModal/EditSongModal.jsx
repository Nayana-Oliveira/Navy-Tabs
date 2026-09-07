import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import "./EditSongModal.css";

export default function EditSongModal({ isOpen, song, onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    artist: "",
    genre: "",
    tuning: "E Standard",
    difficulty: "",
    status: "todo",
    bpmOriginal: "",
    pdfUrl: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!song) {
      return;
    }

    setForm({
      title: song.title || "",
      artist: song.artist || "",
      genre: song.genre || "",
      tuning: song.tuning || "E Standard",
      difficulty: song.difficulty || "",
      status: song.status || "todo",
      bpmOriginal: song.bpmOriginal || "",
      pdfUrl: song.pdfUrl || "",
      notes: song.notes || "",
    });
  }, [song]);

  if (!isOpen || !song) {
    return null;
  }

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget && !saving) {
      onClose();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    try {
      setSaving(true);

      await onSave(song.id, {
        ...form,
        title: form.title.trim(),
        artist: form.artist.trim(),
        genre: form.genre.trim(),
        bpmOriginal: form.bpmOriginal ? Number(form.bpmOriginal) : "",
        pdfUrl: form.pdfUrl.trim(),
        notes: form.notes.trim(),
      });

      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="edit-song-overlay" onMouseDown={handleOverlayClick}>
      <form className="edit-song-modal" onSubmit={handleSubmit}>
        <div className="edit-song-header">
          <div>
            <span className="edit-song-eyebrow">EDITAR TABLATURA</span>

            <h2>{song.title}</h2>

            <p>Atualize os dados da música.</p>
          </div>

          <button
            type="button"
            className="edit-song-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Fechar"
          >
            <X size={15} />
          </button>
        </div>

        <div className="edit-song-form-grid">
          <div className="edit-song-field full">
            <label htmlFor="edit-title">Música</label>

            <input
              id="edit-title"
              type="text"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
            />
          </div>

          <div className="edit-song-field full">
            <label htmlFor="edit-artist">Artista</label>

            <input
              id="edit-artist"
              type="text"
              value={form.artist}
              onChange={(event) => updateField("artist", event.target.value)}
            />
          </div>

          <div className="edit-song-field">
            <label htmlFor="edit-genre">Gênero</label>

            <input
              id="edit-genre"
              type="text"
              value={form.genre}
              onChange={(event) => updateField("genre", event.target.value)}
            />
          </div>

          <div className="edit-song-field">
            <label htmlFor="edit-tuning">Afinação</label>

            <select
              id="edit-tuning"
              value={form.tuning}
              onChange={(event) => updateField("tuning", event.target.value)}
            >
              <option value="E Standard">E Standard</option>

              <option value="Eb Standard">Eb Standard</option>

              <option value="Drop D">Drop D</option>

              <option value="D Standard">D Standard</option>

              <option value="Drop C">Drop C</option>

              <option value="Drop B">Drop B</option>
            </select>
          </div>

          <div className="edit-song-field">
            <label htmlFor="edit-difficulty">Dificuldade</label>

            <select
              id="edit-difficulty"
              value={form.difficulty}
              onChange={(event) =>
                updateField("difficulty", event.target.value)
              }
            >
              <option value="">Não informada</option>

              <option value="easy">Fácil</option>

              <option value="medium">Média</option>

              <option value="hard">Difícil</option>

              <option value="very-hard">Muito difícil</option>
            </select>
          </div>

          <div className="edit-song-field">
            <label htmlFor="edit-status">Status</label>

            <select
              id="edit-status"
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
            >
              <option value="todo">Quero aprender</option>

              <option value="learning">Aprendendo</option>

              <option value="learned">Aprendida</option>
            </select>
          </div>

          <div className="edit-song-field">
            <label htmlFor="edit-bpm">BPM original</label>

            <input
              id="edit-bpm"
              type="number"
              min="1"
              value={form.bpmOriginal}
              onChange={(event) =>
                updateField("bpmOriginal", event.target.value)
              }
            />
          </div>

          <div className="edit-song-field">
            <label htmlFor="edit-pdf">Link do PDF</label>

            <input
              id="edit-pdf"
              type="url"
              value={form.pdfUrl}
              onChange={(event) => updateField("pdfUrl", event.target.value)}
            />
          </div>

          <div className="edit-song-field full">
            <label htmlFor="edit-notes">Notas</label>

            <textarea
              id="edit-notes"
              rows="4"
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
            />
          </div>
        </div>

        <div className="edit-song-footer">
          <button
            type="button"
            className="edit-song-cancel"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="edit-song-submit"
            disabled={saving || !form.title.trim()}
          >
            <Save size={13} />

            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}