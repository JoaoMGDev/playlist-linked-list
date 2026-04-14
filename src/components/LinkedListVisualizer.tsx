import { SongData } from "@/lib/LinkedList";
import { ArrowRight } from "lucide-react";

interface Props {
  songs: SongData[];
  highlightId: string | null;
}

export const LinkedListVisualizer = ({ songs, highlightId }: Props) => {
  if (songs.length === 0) return null;

  return (
    <div className="rounded-lg bg-card p-4">
      <h3 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Visualização da Lista Encadeada (Head → Tail)
      </h3>
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        <span className="shrink-0 rounded bg-primary/20 px-2 py-1 text-[10px] font-mono text-primary">
          HEAD
        </span>
        <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
        {songs.map((song, i) => (
          <div key={song.id} className="flex items-center gap-1">
            <div
              className={`shrink-0 rounded border px-2 py-1 text-[10px] font-mono transition-colors ${
                highlightId === song.id
                  ? "border-highlight bg-highlight/10 text-highlight"
                  : "border-border bg-secondary text-foreground"
              }`}
            >
              <div className="font-semibold truncate max-w-[80px]">{song.title}</div>
              <div className="text-muted-foreground">next →</div>
            </div>
            {i < songs.length - 1 && (
              <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
            )}
          </div>
        ))}
        <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
        <span className="shrink-0 rounded bg-destructive/20 px-2 py-1 text-[10px] font-mono text-destructive">
          NULL
        </span>
      </div>
    </div>
  );
};
