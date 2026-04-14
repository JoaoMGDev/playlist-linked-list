import { SongData } from "@/lib/LinkedList";
import { Trash2, ChevronUp, ChevronDown, Music2, Clock, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  songs: SongData[];
  highlightId: string | null;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onPlay: (song: SongData) => void;
  totalSize: number;
}

const SortableRow = ({
  song,
  index,
  highlightId,
  onRemove,
  onMove,
  onPlay,
  totalSize,
}: {
  song: SongData;
  index: number;
  highlightId: string | null;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onPlay: (song: SongData) => void;
  totalSize: number;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: song.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onPlay(song)}
      className={`song-row grid grid-cols-[28px_40px_1fr_120px_80px_100px] items-center gap-2 px-4 py-2.5 cursor-pointer ${
        highlightId === song.id ? "song-row-highlight" : ""
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab rounded p-0.5 text-muted-foreground hover:text-foreground active:cursor-grabbing"
        title="Arrastar para reordenar"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="text-sm text-muted-foreground">{index + 1}</span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{song.title}</p>
        <p className="truncate text-xs text-muted-foreground md:hidden">{song.artist}</p>
      </div>
      <span className="truncate text-sm text-muted-foreground hidden md:block">{song.artist}</span>
      <span className="text-sm text-muted-foreground">{song.duration}</span>
      <div className="flex items-center justify-end gap-0.5" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onMove(song.id, "up")}
          disabled={index === 0}
          className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          title="Mover para cima"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          onClick={() => onMove(song.id, "down")}
          disabled={index === totalSize - 1}
          className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          title="Mover para baixo"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
        <button
          onClick={() => onRemove(song.id)}
          className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="Remover"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export const PlaylistView = ({ songs, highlightId, onRemove, onMove, onReorder, onPlay, totalSize }: Props) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = songs.findIndex((s) => s.id === active.id);
    const toIndex = songs.findIndex((s) => s.id === over.id);
    if (fromIndex !== -1 && toIndex !== -1) {
      onReorder(fromIndex, toIndex);
    }
  };

  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-card py-16 text-muted-foreground">
        <Music2 className="mb-3 h-12 w-12 opacity-30" />
        <p className="text-sm">Playlist vazia</p>
        <p className="text-xs mt-1">Adicione músicas usando o formulário ao lado</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-card overflow-hidden">
      <div className="grid grid-cols-[28px_40px_1fr_120px_80px_100px] items-center gap-2 border-b border-border px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <span />
        <span>#</span>
        <span>Título</span>
        <span>Artista</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /></span>
        <span className="text-right">Ações</span>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={songs.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {songs.map((song, index) => (
            <SortableRow
              key={song.id}
              song={song}
              index={index}
              highlightId={highlightId}
              onRemove={onRemove}
              onMove={onMove}
              onPlay={onPlay}
              totalSize={totalSize}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
