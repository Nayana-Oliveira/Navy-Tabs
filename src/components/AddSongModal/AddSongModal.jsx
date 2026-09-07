import { useState } from "react";
import { FileText, Plus, Upload, X } from "lucide-react";
import { uploadPdf } from "../../services/blobApi";
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
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
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
    setSelectedPdf(null);
    setUploadProgress(0);

    onClose();
  }

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  function handlePdfChange(event) {
    const file = event.target.files?.[0] || null;

    setSelectedPdf(file);
    setUploadProgress(0);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    try {
      setSaving(true);

      let pdfUrl = form.pdfUrl;

      if (selectedPdf) {
        const blob = await uploadPdf(selectedPdf, setUploadProgress);

        pdfUrl = blob.url;
      }

      await onCreate({
        ...form,

        title: form.title.trim(),

        artist: form.artist.trim(),

        genre: form.genre.trim(),

        bpmOriginal: form.bpmOriginal ? Number(form.bpmOriginal) : "",

        pdfUrl,

        notes: form.notes.trim(),
      });

      setForm(initialForm);
      setSelectedPdf(null);
      setUploadProgress(0);

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
              disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
            />
          </div>

          <div className="add-song-field">
            <label htmlFor="add-tuning">Afinação</label>

            <select
              id="add-tuning"
              value={form.tuning}
              onChange={(event) => updateField("tuning", event.target.value)}
              disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
            />
          </div>

          <div className="add-song-field">
            <label>PDF</label>

            <label className="add-song-upload">
              <input
                type="file"
                accept="application/pdf,.pdf"
                disabled={saving}
                onChange={handlePdfChange}
              />

              <Upload size={12} />

              <span>{selectedPdf ? "Trocar PDF" : "Selecionar PDF"}</span>
            </label>
          </div>

          {selectedPdf && (
            <div className="add-song-pdf-info full">
              <div className="add-song-pdf-name">
                <FileText size={13} />

                <span>{selectedPdf.name}</span>

                <strong>
                  {(selectedPdf.size / 1024 / 1024).toFixed(1)}
                  {" MB"}
                </strong>
              </div>

              {saving && uploadProgress > 0 && (
                <div className="add-song-progress">
                  <div className="add-song-progress-track">
                    <div
                      className="add-song-progress-bar"
                      style={{
                        width: `${uploadProgress}%`,
                      }}
                    />
                  </div>

                  <span>{uploadProgress}%</span>
                </div>
              )}
            </div>
          )}

          <div className="add-song-field full">
            <label htmlFor="add-notes">Notas</label>

            <textarea
              id="add-notes"
              rows="4"
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Observações sobre a tablatura..."
              disabled={saving}
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

            {saving
              ? selectedPdf && uploadProgress < 100
                ? `Enviando ${uploadProgress}%`
                : "Adicionando..."
              : "Adicionar"}
          </button>
        </div>
      </form>
    </div>
  );
}