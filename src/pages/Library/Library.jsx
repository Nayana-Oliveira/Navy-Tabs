import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Guitar, SlidersHorizontal, Menu } from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../../components/Sidebar/Sidebar";
import StatCard from "../../components/StatCard/StatCard";
import SongCard from "../../components/SongCard/SongCard";
import AddSongModal from "../../components/AddSongModal/AddSongModal";
import EditSongModal from "../../components/EditSongModal/EditSongModal";
import DeleteSongModal from "../../components/DeleteSongModal/DeleteSongModal";
import SongDetailsModal from "../../components/SongDetailsModal/SongDetailsModal";
import { getSongs, createSong, updateSong, deleteSong} from "../../services/rifflyApi";
import "./Library.css";

export default function Library({ user, onLogout }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [tuningFilter, setTuningFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [deletingSong, setDeletingSong] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadSongs();
  }, []);

  async function loadSongs() {
    try {
      setLoading(true);
      setError(null);

      const data = await getSongs();

      setSongs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError("Não foi possível carregar suas tablaturas.");

      toast.error("Erro ao carregar as tablaturas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSong(songData) {
    const toastId = toast.loading("Adicionando tablatura...");

    try {
      const newSong = await createSong(songData);

      setSongs((prev) => [...prev, newSong]);

      toast.success("Tablatura adicionada.", {
        id: toastId,
      });

      return newSong;
    } catch (err) {
      console.error(err);

      toast.error(err.message || "Não foi possível adicionar a tablatura.", {
        id: toastId,
      });

      throw err;
    }
  }

  async function handleUpdateSong(id, data) {
    const toastId = toast.loading("Salvando alterações...");

    try {
      const updatedSong = await updateSong(id, data);

      setSongs((prev) =>
        prev.map((song) => (song.id === id ? updatedSong : song)),
      );

      setSelectedSong((prev) => {
        if (!prev) {
          return prev;
        }

        if (prev.id !== id) {
          return prev;
        }

        return updatedSong;
      });

      toast.success("Tablatura atualizada.", {
        id: toastId,
      });

      return updatedSong;
    } catch (err) {
      console.error(err);

      toast.error(err.message || "Não foi possível atualizar a tablatura.", {
        id: toastId,
      });

      throw err;
    }
  }

  function handleRequestDelete(song) {
    setSelectedSong(null);
    setDeletingSong(song);
  }

  async function handleConfirmDelete(song) {
    const toastId = toast.loading("Excluindo tablatura...");

    try {
      setDeleting(true);

      await deleteSong(song.id);

      setSongs((prev) => prev.filter((item) => item.id !== song.id));

      setDeletingSong(null);
      setSelectedSong(null);

      toast.success("Tablatura excluída.", {
        id: toastId,
      });
    } catch (err) {
      console.error(err);

      toast.error(err.message || "Não foi possível excluir a tablatura.", {
        id: toastId,
      });
    } finally {
      setDeleting(false);
    }
  }

  function handleOpenSong(song) {
    setSelectedSong(song);
  }

  function handleEditFromDetails(song) {
    setSelectedSong(null);
    setEditingSong(song);
  }

  function clearAdvancedFilters() {
    setGenreFilter("all");
    setTuningFilter("all");
    setDifficultyFilter("all");
  }

  const todoSongs = songs.filter(
    (song) => String(song.status).toLowerCase() === "todo",
  );

  const learningSongs = songs.filter(
    (song) => String(song.status).toLowerCase() === "learning",
  );

  const learnedSongs = songs.filter(
    (song) => String(song.status).toLowerCase() === "learned",
  );

  const genres = useMemo(() => {
    return [
      ...new Set(
        songs.map((song) => String(song.genre || "").trim()).filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [songs]);

  const tunings = useMemo(() => {
    return [
      ...new Set(
        songs.map((song) => String(song.tuning || "").trim()).filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [songs]);

  const filteredSongs = useMemo(() => {
    const term = search.trim().toLowerCase();

    const result = songs.filter((song) => {
      const matchesSearch =
        !term ||
        [
          song.title,
          song.artist,
          song.genre,
          song.tuning,
          song.difficulty,
          song.status,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(term),
        );

      const status = String(song.status || "todo").toLowerCase();

      const matchesStatus = statusFilter === "all" || status === statusFilter;

      const matchesGenre =
        genreFilter === "all" || String(song.genre || "") === genreFilter;

      const matchesTuning =
        tuningFilter === "all" || String(song.tuning || "") === tuningFilter;

      const difficulty = String(song.difficulty || "").toLowerCase();

      const matchesDifficulty =
        difficultyFilter === "all" || difficulty === difficultyFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesGenre &&
        matchesTuning &&
        matchesDifficulty
      );
    });

    return result.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return String(a.title || "").localeCompare(
            String(b.title || ""),
            "pt-BR",
          );

        case "artist":
          return String(a.artist || "").localeCompare(
            String(b.artist || ""),
            "pt-BR",
          );

        case "bpm":
          return Number(a.bpmOriginal || 0) - Number(b.bpmOriginal || 0);

        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);

        case "recent":
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });
  }, [
    songs,
    search,
    statusFilter,
    genreFilter,
    tuningFilter,
    difficultyFilter,
    sortBy,
  ]);

  const hasAdvancedFilters =
    genreFilter !== "all" ||
    tuningFilter !== "all" ||
    difficultyFilter !== "all";

  return (
    <div className="library-layout">
      <Sidebar
        isOpen={sidebarOpen}
        user={user}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
      />

      <main className="library-page">
        <div className="library-container">
          <div className="library-top-navigation">
            <button
              type="button"
              className="menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu size={15} />
            </button>
          </div>

          <header className="library-header">
            <div className="library-heading">
              <h1>Biblioteca</h1>

              <p>
                {songs.length === 0
                  ? "Sua coleção está vazia."
                  : `${songs.length} ${
                      songs.length === 1 ? "tablatura" : "tablaturas"
                    } na sua coleção.`}
              </p>
            </div>

            <button
              type="button"
              className="add-song-button"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={13} />
              Nova tablatura
            </button>
          </header>

          <section className="stats-grid">
            <StatCard label="Total" value={songs.length} />

            <StatCard label="Para aprender" value={todoSongs.length} />

            <StatCard label="Aprendendo" value={learningSongs.length} />

            <StatCard label="Aprendidas" value={learnedSongs.length} />
          </section>

          <section className="library-content">
            <div className="library-topbar">
              <div className="section-heading-row">
                <div className="section-icon">
                  <Guitar size={13} />
                </div>

                <div>
                  <h2>Tablaturas</h2>

                  <p>
                    {filteredSongs.length}{" "}
                    {filteredSongs.length === 1 ? "resultado" : "resultados"}
                  </p>
                </div>
              </div>

              <div className="library-tools">
                <div className="search-box">
                  <Search size={13} />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar música ou artista"
                  />

                  {search && (
                    <button
                      type="button"
                      className="clear-search"
                      onClick={() => setSearch("")}
                    >
                      ×
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  className={`advanced-filter-button ${
                    showAdvancedFilters || hasAdvancedFilters ? "active" : ""
                  }`}
                  onClick={() => setShowAdvancedFilters((prev) => !prev)}
                >
                  <SlidersHorizontal size={13} />
                  Filtros
                </button>
              </div>
            </div>

            <div className="status-filters">
              <button
                type="button"
                className={statusFilter === "all" ? "active" : ""}
                onClick={() => setStatusFilter("all")}
              >
                Todas
              </button>

              <button
                type="button"
                className={statusFilter === "todo" ? "active" : ""}
                onClick={() => setStatusFilter("todo")}
              >
                Quero aprender
              </button>

              <button
                type="button"
                className={statusFilter === "learning" ? "active" : ""}
                onClick={() => setStatusFilter("learning")}
              >
                Aprendendo
              </button>

              <button
                type="button"
                className={statusFilter === "learned" ? "active" : ""}
                onClick={() => setStatusFilter("learned")}
              >
                Aprendidas
              </button>
            </div>

            {showAdvancedFilters && (
              <div className="advanced-filters">
                <div className="filter-field">
                  <label>Gênero</label>

                  <select
                    value={genreFilter}
                    onChange={(event) => setGenreFilter(event.target.value)}
                  >
                    <option value="all">Todos</option>

                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-field">
                  <label>Afinação</label>

                  <select
                    value={tuningFilter}
                    onChange={(event) => setTuningFilter(event.target.value)}
                  >
                    <option value="all">Todas</option>

                    {tunings.map((tuning) => (
                      <option key={tuning} value={tuning}>
                        {tuning}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-field">
                  <label>Dificuldade</label>

                  <select
                    value={difficultyFilter}
                    onChange={(event) =>
                      setDifficultyFilter(event.target.value)
                    }
                  >
                    <option value="all">Todas</option>

                    <option value="easy">Fácil</option>

                    <option value="medium">Média</option>

                    <option value="hard">Difícil</option>

                    <option value="very-hard">Muito difícil</option>
                  </select>
                </div>

                <div className="filter-field">
                  <label>Ordenar</label>

                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    <option value="recent">Mais recentes</option>

                    <option value="oldest">Mais antigas</option>

                    <option value="title">Música A-Z</option>

                    <option value="artist">Artista A-Z</option>

                    <option value="bpm">BPM crescente</option>
                  </select>
                </div>

                {hasAdvancedFilters && (
                  <button
                    type="button"
                    className="clear-filters-button"
                    onClick={clearAdvancedFilters}
                  >
                    Limpar
                  </button>
                )}
              </div>
            )}

            {loading && (
              <div className="library-state">
                <div className="loader" />

                <p>Carregando tablaturas...</p>
              </div>
            )}

            {error && !loading && (
              <div className="library-state">
                <h3>Erro ao carregar</h3>

                <p>{error}</p>

                <button
                  type="button"
                  className="retry-button"
                  onClick={loadSongs}
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {!loading && !error && filteredSongs.length > 0 && (
              <div className="songs-grid">
                {filteredSongs.map((song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    onOpen={handleOpenSong}
                    onEdit={setEditingSong}
                    onDelete={handleRequestDelete}
                  />
                ))}
              </div>
            )}

            {!loading && !error && songs.length === 0 && (
              <div className="library-empty">
                <div className="empty-icon">
                  <Guitar size={20} />
                </div>

                <h3>Nenhuma tablatura</h3>

                <p>Adicione sua primeira tablatura à biblioteca.</p>

                <button
                  type="button"
                  className="add-song-button"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus size={12} />
                  Nova tablatura
                </button>
              </div>
            )}

            {!loading &&
              !error &&
              songs.length > 0 &&
              filteredSongs.length === 0 && (
                <div className="library-empty compact">
                  <div className="empty-icon">
                    <Search size={18} />
                  </div>

                  <h3>Nada encontrado</h3>

                  <p>Tente outra busca ou altere os filtros.</p>
                </div>
              )}
          </section>
        </div>
      </main>

      <AddSongModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreate={handleCreateSong}
      />

      <EditSongModal
        isOpen={Boolean(editingSong)}
        song={editingSong}
        onClose={() => setEditingSong(null)}
        onSave={handleUpdateSong}
      />

      <DeleteSongModal
        isOpen={Boolean(deletingSong)}
        song={deletingSong}
        loading={deleting}
        onClose={() => setDeletingSong(null)}
        onConfirm={handleConfirmDelete}
      />

      <SongDetailsModal
        isOpen={Boolean(selectedSong)}
        song={selectedSong}
        onClose={() => setSelectedSong(null)}
        onEdit={handleEditFromDetails}
      />
    </div>
  );
}