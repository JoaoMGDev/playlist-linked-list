import { useState } from "react";
import { SongData } from "@/lib/LinkedList";
import { Plus } from "lucide-react";

interface Props {
  onAdd: (data: Omit<SongData, "id">) => void;
}

export const AddSongForm = ({ onAdd }: Props) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) return;
    onAdd({ title: title.trim(), artist: artist.trim(), duration: duration.trim() || "0:00" });
    setTitle("");
    setArtist("");
    setDuration("");
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-card p-4">
      <h2 className="mb-3 text-sm font-semibold text-foreground">Adicionar Música</h2>
      <div className="flex flex-col gap-2">
        <input
          className="rounded-md bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="rounded-md bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
          placeholder="Artista"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
        />
        <input
          className="rounded-md bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
          placeholder="Duração (ex: 3:45)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <button
          type="submit"
          className="mt-1 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="h-4 w-4" /> Adicionar
        </button>
      </div>
    </form>
  );
};
