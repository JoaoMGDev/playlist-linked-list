import { useState, useRef, useCallback } from "react";
import { LinkedList, SongData, OperationResult } from "@/lib/LinkedList";
import { ConsolePanel } from "@/components/ConsolePanel";
import { AddSongForm } from "@/components/AddSongForm";
import { PlaylistView } from "@/components/PlaylistView";
import { SearchBar } from "@/components/SearchBar";
import { LinkedListVisualizer } from "@/components/LinkedListVisualizer";
import { Music } from "lucide-react";
import { NowPlayingDialog } from "@/components/NowPlayingDialog";

const INITIAL_SONGS: Omit<SongData, "id">[] = [
  { title: "Bohemian Rhapsody", artist: "Queen", duration: "5:55" },
  { title: "Billie Jean", artist: "Michael Jackson", duration: "4:54" },
  { title: "Imagine", artist: "John Lennon", duration: "3:07" },
  { title: "Smells Like Teen Spirit", artist: "Nirvana", duration: "5:01" },
  { title: "Hotel California", artist: "Eagles", duration: "6:30" },
];

const Index = () => {
  const listRef = useRef(new LinkedList());
  const [songs, setSongs] = useState<SongData[]>([]);
  const [logs, setLogs] = useState<OperationResult<unknown>[]>([]);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [playingSong, setPlayingSong] = useState<SongData | null>(null);
  const initialized = useRef(false);

  const sync = useCallback(() => {
    setSongs(listRef.current.toArray());
  }, []);

  // Pre-load example songs
  useState(() => {
    if (!initialized.current) {
      initialized.current = true;
      INITIAL_SONGS.forEach((s) => {
        listRef.current.insert({ ...s, id: crypto.randomUUID() });
      });
      setSongs(listRef.current.toArray());
    }
  });

  const log = useCallback((op: OperationResult<unknown>) => {
    setLogs((prev) => [op, ...prev].slice(0, 20));
  }, []);

  const handleAdd = useCallback(
    (data: Omit<SongData, "id">) => {
      const song: SongData = { ...data, id: crypto.randomUUID() };
      const result = listRef.current.insert(song);
      log(result);
      sync();
    },
    [log, sync]
  );

  const handleRemove = useCallback(
    (id: string) => {
      const result = listRef.current.remove(id);
      log(result);
      if (highlightId === id) setHighlightId(null);
      sync();
    },
    [log, sync, highlightId]
  );

  const handleSearch = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setHighlightId(null);
        return;
      }
      const result = listRef.current.search(query);
      log(result);
      setHighlightId(result.result?.data.id ?? null);
    },
    [log]
  );

  const handleMove = useCallback(
    (id: string, direction: "up" | "down") => {
      const from = listRef.current.getIndexById(id);
      const to = direction === "up" ? from - 1 : from + 1;
      const result = listRef.current.moveNode(from, to);
      log(result);
      sync();
    },
    [log, sync]
  );

  const handleReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      const result = listRef.current.moveNode(fromIndex, toIndex);
      log(result);
      sync();
    },
    [log, sync]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Music className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Playlist</h1>
            <p className="text-xs text-muted-foreground">
              Estrutura de Dados — Lista Encadeada Simples
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {songs.length} música{songs.length !== 1 ? "s" : ""} • {listRef.current.size} nó{listRef.current.size !== 1 ? "s" : ""}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 p-6 lg:grid-cols-[340px_1fr]">
        {/* Left sidebar */}
        <aside className="flex flex-col gap-4">
          <AddSongForm onAdd={handleAdd} />
          <ConsolePanel logs={logs} />
        </aside>

        {/* Main content */}
        <section className="flex flex-col gap-4">
          <SearchBar onSearch={handleSearch} />
          <LinkedListVisualizer songs={songs} highlightId={highlightId} />
          <PlaylistView
            songs={songs}
            highlightId={highlightId}
            onRemove={handleRemove}
            onMove={handleMove}
            onReorder={handleReorder}
            totalSize={listRef.current.size}
            onPlay={setPlayingSong}
          />
          <NowPlayingDialog
            song={playingSong}
            songs={songs}
            open={!!playingSong}
            onOpenChange={(open) => !open && setPlayingSong(null)}
            onChangeSong={setPlayingSong}
          />
        </section>
      </main>
    </div>
  );
};

export default Index;
