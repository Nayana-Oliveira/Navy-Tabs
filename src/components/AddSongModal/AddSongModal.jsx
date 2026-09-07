import { useState } from "react";
import { Plus, X } from "lucide-react";
import "./AddSongModal.css";

const initialForm = {
  title: "",
  artist: "",
  genre: "",
  tuning: "E Standard",
  difficulty: "",
  status: "todo",
  bpmOriginal: "",
  pdfUrl: "",
  notes: "",
};

export default function AddSongModal({ isOpen, onClose, onCreate }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  if (!isOpen) {
    return null;
  }

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleClose() {
    if (saving) {
      return;
    }

    setForm(initialForm);
    onClose();
  }

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    try {
      setSaving(true);

      await onCreate({
        ...form,
        title: form.title.trim(),
        artist: form.artist.trim(),
        genre: form.genre.trim(),
        bpmOriginal: form.bpmOriginal ? Number(form.bpmOriginal) : "",
        pdfUrl: form.pdfUrl.trim(),
        notes: form.notes.trim(),
      });

      setForm(initialForm);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="add-song-overlay" onMouseDown={handleOverlayClick}>
      <form className="add-song-modal" onSubmit={handleSubmit}>
        <div className="add-song-header">
          <div>
            <span className="add-song-eyebrow">NOVA TABLATURA</span>

            <h2>Adicionar música</h2>

            <p>Preencha os dados principais da tablatura.</p>
          </div>

          <button
            type="button"
            className="add-song-close"
            onClick={handleClose}
            disabled={saving}
            aria-label="Fechar"
          >
            <X size={15} />
          </button>
        </div>

        <div className="add-song-form-grid">
          <div className="add-song-field full">
            <label htmlFor="add-title">Música</label>

            <input
              id="add-title"
              type="text"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Ex: Master of Puppets"
              autoFocus
            />
          </div>

          <div className="add-song-field full">
            <label htmlFor="add-artist">Artista</label>

            <input
              id="add-artist"
              type="text"
              value={form.artist}
              onChange={(event) => updateField("artist", event.target.value)}
              placeholder="Ex: Metallica"
            />
          </div>

          <div className="add-song-field">
            <label htmlFor="add-genre">Gênero</label>

            <input
              id="add-genre"
              type="text"
              value={form.genre}
              onChange={(event) => updateField("genre", event.target.value)}
              placeholder="Ex: Metal"
            />
          </div>

          <div className="add-song-field">
            <label htmlFor="add-tuning">Afinação</label>

            <select
              id="add-tuning"
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

          <div className="add-song-field">
            <label htmlFor="add-difficulty">Dificuldade</label>

            <select
              id="add-difficulty"
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

          <div className="add-song-field">
            <label htmlFor="add-status">Status</label>

            <select
              id="add-status"
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
            >
              <option value="todo">Quero aprender</option>

              <option value="learning">Aprendendo</option>

              <option value="learned">Aprendida</option>
            </select>
          </div>

          <div className="add-song-field">
            <label htmlFor="add-bpm">BPM original</label>

            <input
              id="add-bpm"
              type="number"
              min="1"
              value={form.bpmOriginal}
              onChange={(event) =>
                updateField("bpmOriginal", event.target.value)
              }
              placeholder="Ex: 120"
            />
          </div>

          <div className="add-song-field">
            <label htmlFor="add-pdf">Link do PDF</label>

            <input
              id="add-pdf"
              type="url"
              value={form.pdfUrl}
              onChange={(event) => updateField("pdfUrl", event.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="add-song-field full">
            <label htmlFor="add-notes">Notas</label>

            <textarea
              id="add-notes"
              rows="4"
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Observações sobre a tablatura..."
            />
          </div>
        </div>

        <div className="add-song-footer">
          <button
            type="button"
            className="add-song-cancel"
            onClick={handleClose}
            disabled={saving}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="add-song-submit"
            disabled={saving || !form.title.trim()}
          >
            <Plus size={13} />

            {saving ? "Adicionando..." : "Adicionar"}
          </button>
        </div>
      </form>
    </div>
  );
}