import { SongData } from "@/lib/LinkedList";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Music2, Play, Pause, SkipBack, SkipForward, Repeat, Shuffle } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";

const COVER_GRADIENTS = [
  "from-rose-500/60 to-purple-700/80",
  "from-emerald-500/60 to-cyan-700/80",
  "from-amber-500/60 to-red-700/80",
  "from-sky-500/60 to-indigo-700/80",
  "from-fuchsia-500/60 to-pink-700/80",
  "from-teal-500/60 to-emerald-700/80",
  "from-violet-500/60 to-blue-700/80",
  "from-orange-500/60 to-rose-700/80",
];

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
  }
  return Math.abs(hash);
}

interface Props {
  song: SongData | null;
  songs: SongData[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeSong: (song: SongData) => void;
}

export const NowPlayingDialog = ({ song, songs, open, onOpenChange, onChangeSong }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const parseDuration = (dur: string) => {
    const [m, s] = dur.split(":").map(Number);
    return m * 60 + s;
  };

  const currentIndex = song ? songs.findIndex((s) => s.id === song.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < songs.length - 1;

  const gradient = useMemo(
    () => (song ? COVER_GRADIENTS[hashString(song.id) % COVER_GRADIENTS.length] : COVER_GRADIENTS[0]),
    [song]
  );

  useEffect(() => {
    if (!open) {
      setIsPlaying(false);
      setProgress(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [open]);

  // Reset progress when song changes
  useEffect(() => {
    setProgress(0);
    setIsPlaying(false);
  }, [song?.id]);

  useEffect(() => {
    if (isPlaying && song) {
      const total = parseDuration(song.duration);
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setIsPlaying(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            // Auto-next
            if (hasNext) {
              setTimeout(() => onChangeSong(songs[currentIndex + 1]), 300);
            }
            return 100;
          }
          return p + 100 / total;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, song]);

  if (!song) return null;

  const totalSeconds = parseDuration(song.duration);
  const currentSeconds = Math.floor((progress / 100) * totalSeconds);
  const currentMin = Math.floor(currentSeconds / 60);
  const currentSec = currentSeconds % 60;
  const currentTime = `${currentMin}:${currentSec.toString().padStart(2, "0")}`;

  const skipPrev = () => {
    if (hasPrev) onChangeSong(songs[currentIndex - 1]);
  };
  const skipNext = () => {
    if (hasNext) onChangeSong(songs[currentIndex + 1]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card p-0 sm:max-w-md overflow-hidden">
        {/* Album art with colored gradient */}
        <div className={`relative flex items-center justify-center aspect-square w-full bg-gradient-to-br ${gradient}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card" />
          <div className="relative flex flex-col items-center gap-2">
            <Music2 className="h-20 w-20 text-foreground/30" />
            <span className="text-xs font-medium uppercase tracking-widest text-foreground/40">
              {song.artist}
            </span>
          </div>
        </div>

        {/* Song info */}
        <div className="px-6 pt-2 pb-1">
          <h2 className="text-lg font-bold text-foreground truncate">{song.title}</h2>
          <p className="text-sm text-muted-foreground">{song.artist}</p>
        </div>

        {/* Progress bar */}
        <div className="px-6 flex flex-col gap-1">
          <div
            className="relative h-1 w-full rounded-full bg-muted overflow-hidden cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setProgress(((e.clientX - rect.left) / rect.width) * 100);
            }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{currentTime}</span>
            <span>{song.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5 px-6 pb-6 pt-2">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Shuffle className="h-4 w-4" />
          </button>
          <button
            onClick={skipPrev}
            disabled={!hasPrev}
            className="text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </button>
          <button
            onClick={skipNext}
            disabled={!hasNext}
            className="text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <SkipForward className="h-5 w-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Repeat className="h-4 w-4" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
