import { useEffect, useState } from "react";
import { FileText, Save, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { uploadPdf } from "../../services/blobApi";
import "./EditSongModal.css";

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

export default function EditSongModal({ isOpen, song, onClose, onSave }) {
  const [form, setForm] = useState(initialForm);

  const [selectedPdf, setSelectedPdf] = useState(null);

  const [uploadProgress, setUploadProgress] = useState(0);

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

    setSelectedPdf(null);
    setUploadProgress(0);
  }, [song, isOpen]);

  if (!isOpen || !song) {
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

      await onSave(song.id, {
        ...form,

        title: form.title.trim(),

        artist: form.artist.trim(),

        genre: form.genre.trim(),

        bpmOriginal: form.bpmOriginal ? Number(form.bpmOriginal) : "",

        pdfUrl,

        notes: form.notes.trim(),
      });

      setSelectedPdf(null);
      setUploadProgress(0);

      onClose();
    } catch (error) {
      console.error("Erro ao editar:", error);

      toast.error(error.message || "Não foi possível salvar a tablatura.");
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

            <h2>Editar música</h2>

            <p>Atualize os dados da tablatura.</p>
          </div>

          <button
            type="button"
            className="edit-song-close"
            onClick={handleClose}
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
              placeholder="Ex: Master of Puppets"
              autoFocus
              disabled={saving}
            />
          </div>

          <div className="edit-song-field full">
            <label htmlFor="edit-artist">Artista</label>

            <input
              id="edit-artist"
              type="text"
              value={form.artist}
              onChange={(event) => updateField("artist", event.target.value)}
              placeholder="Ex: Metallica"
              disabled={saving}
            />
          </div>

          <div className="edit-song-field">
            <label htmlFor="edit-genre">Gênero</label>

            <input
              id="edit-genre"
              type="text"
              value={form.genre}
              onChange={(event) => updateField("genre", event.target.value)}
              placeholder="Ex: Metal"
              disabled={saving}
            />
          </div>

          <div className="edit-song-field">
            <label htmlFor="edit-tuning">Afinação</label>

            <select
              id="edit-tuning"
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

          <div className="edit-song-field">
            <label htmlFor="edit-difficulty">Dificuldade</label>

            <select
              id="edit-difficulty"
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

          <div className="edit-song-field">
            <label htmlFor="edit-status">Status</label>

            <select
              id="edit-status"
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
              disabled={saving}
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
              placeholder="Ex: 120"
              disabled={saving}
            />
          </div>

          <div className="edit-song-field">
            <label>PDF</label>

            <label className="edit-song-upload">
              <input
                type="file"
                accept="application/pdf,.pdf"
                disabled={saving}
                onChange={handlePdfChange}
              />

              <Upload size={12} />

              <span>{form.pdfUrl ? "Trocar PDF" : "Selecionar PDF"}</span>
            </label>
          </div>

          {form.pdfUrl && !selectedPdf && (
            <div className="edit-song-pdf-info full">
              <div className="edit-song-pdf-name">
                <FileText size={13} />

                <span>PDF atual</span>

                <button
                  type="button"
                  onClick={() =>
                    window.open(form.pdfUrl, "_blank", "noopener,noreferrer")
                  }
                  disabled={saving}
                >
                  Abrir
                </button>
              </div>
            </div>
          )}

          {selectedPdf && (
            <div className="edit-song-pdf-info full">
              <div className="edit-song-pdf-name">
                <FileText size={13} />

                <span>{selectedPdf.name}</span>

                <strong>
                  {(selectedPdf.size / 1024 / 1024).toFixed(1)}
                  {" MB"}
                </strong>
              </div>

              {saving && uploadProgress > 0 && (
                <div className="edit-song-progress">
                  <div className="edit-song-progress-track">
                    <div
                      className="edit-song-progress-bar"
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

          <div className="edit-song-field full">
            <label htmlFor="edit-notes">Notas</label>

            <textarea
              id="edit-notes"
              rows="4"
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Observações sobre a tablatura..."
              disabled={saving}
            />
          </div>
        </div>

        <div className="edit-song-footer">
          <button
            type="button"
            className="edit-song-cancel"
            onClick={handleClose}
            disabled={saving}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="edit-song-submit"
            disabled={saving || !form.title.trim()}
          >
            <Save size={12} />

            {saving
              ? selectedPdf && uploadProgress < 100
                ? `Enviando ${uploadProgress}%`
                : "Salvando..."
              : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
