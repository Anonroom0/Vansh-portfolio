import { useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { supabase } from "../lib/supabase";

export type PlaylistTrack = {
  id: string;
  title: string;
  artist: string | null;
  audio_url: string;
  artwork_url: string | null;
  sort_order: number;
};

export function MusicIsland() {
  const [tracks, setTracks] = useState<PlaylistTrack[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    supabase
      .from("playlist")
      .select("*")
      .order("sort_order")
      .then(({ data }) => setTracks((data as PlaylistTrack[]) || []));
  }, []);

  const track = tracks[index];

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    audio.loop = false;
    audio.preload = "auto";
    const onEnded = () => setPlaying(false);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  useEffect(() => {
    if (!track || !audioRef.current) return;
    audioRef.current.src = track.audio_url;
    if (playing) audioRef.current.play().catch(() => setPlaying(false));
  }, [index, track]);

  useEffect(() => {
    if (!track || started.current) return;
    const tryStart = () => {
      const el = audioRef.current;
      if (started.current || !el) return;
      started.current = true;
      el.src = track.audio_url;
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
      window.removeEventListener("pointerdown", tryStart);
    };
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.audio_url;
    audio
      .play()
      .then(() => {
        started.current = true;
        setPlaying(true);
      })
      .catch(() => {
        window.addEventListener("pointerdown", tryStart, { once: true });
      });
    return () => window.removeEventListener("pointerdown", tryStart);
  }, [track]);

  const toggle = async () => {
    if (!audioRef.current || !track) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      await audioRef.current.play();
      setPlaying(true);
    }
  };

  const prev = () => setIndex((i) => (tracks.length ? (i - 1 + tracks.length) % tracks.length : 0));
  const next = () => setIndex((i) => (tracks.length ? (i + 1) % tracks.length : 0));

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full overflow-hidden border-2 border-[var(--line)] shrink-0"
        aria-label="Music"
        title={track ? `${track.title}` : "No playlist yet"}
      >
        <div
          className={`w-full h-full ${playing ? "spin-disc" : ""}`}
          style={{
            background: track?.artwork_url
              ? `url(${track.artwork_url}) center/cover`
              : "conic-gradient(#222 0 25%, #888 0 50%, #222 0 75%, #888 0)",
          }}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-[80] island px-3 py-2 flex items-center gap-2 min-w-[240px]">
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/20">
            <div
              className={`w-full h-full ${playing ? "spin-disc" : ""}`}
              style={{
                background: track?.artwork_url
                  ? `url(${track.artwork_url}) center/cover`
                  : "conic-gradient(#333, #999, #333)",
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold truncate">{track?.title || "Empty playlist"}</div>
            <div className="text-[10px] text-white/60 truncate">{track?.artist || "Add tracks in admin"}</div>
          </div>
          <button onClick={prev} className="p-1 disabled:opacity-30" disabled={!tracks.length} aria-label="Previous">
            <SkipBack className="w-4 h-4" />
          </button>
          <button onClick={toggle} className="p-1 disabled:opacity-30" disabled={!tracks.length} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button onClick={next} className="p-1 disabled:opacity-30" disabled={!tracks.length} aria-label="Next">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
