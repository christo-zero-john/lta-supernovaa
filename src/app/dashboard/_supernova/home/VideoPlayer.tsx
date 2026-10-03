"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import "./video-player.css";

/** How long the controls stay after the last movement while playing. */
const CONTROLS_STAY_MS = 2500;

function clock(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const ICONS = {
  play: <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />,
  pause: <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />,
  sound: (
    <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Zm11.5 2.5a3.5 3.5 0 0 0-2-3.15v6.3a3.5 3.5 0 0 0 2-3.15Zm-2-7.2v2.1a5.5 5.5 0 0 1 0 10.2v2.1a7.5 7.5 0 0 0 0-14.4Z" />
  ),
  muted: (
    <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Zm16.6 0-1.4-1.4-2.2 2.2-2.2-2.2-1.4 1.4 2.2 2.2-2.2 2.2 1.4 1.4 2.2-2.2 2.2 2.2 1.4-1.4-2.2-2.2 2.2-2.2Z" />
  ),
  expand: <path d="M5 5h5v2H7v3H5V5Zm9 0h5v5h-2V7h-3V5ZM5 14h2v3h3v2H5v-5Zm12 3v-3h2v5h-5v-2h3Z" />,
  shrink: <path d="M8 5h2v5H5V8h3V5Zm6 0h2v3h3v2h-5V5ZM5 14h5v5H8v-3H5v-2Zm9 0h5v2h-3v3h-2v-5Z" />,
};

/**
 * The dashboard's own video player: the picture, a large play button while
 * paused, and one control bar under it (play, time, seek, sound, full
 * screen). In full screen the bar floats over the picture and steps aside
 * while the video plays.
 */
export default function VideoPlayer({
  src,
  label,
  pictureRatio,
  onRatio,
}: {
  src: string;
  label: string;
  /**
   * Width / height of the picture when the file carries black bars round
   * it; the player then shows the picture only.
   */
  pictureRatio?: number;
  /** Called with the width / height the player shows, once it is known. */
  onRatio?: (ratio: number) => void;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [controlsHidden, setControlsHidden] = useState(false);

  // Any movement brings the controls back; they leave again while playing.
  const wake = () => {
    setControlsHidden(false);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (video.current && !video.current.paused) setControlsHidden(true);
    }, CONTROLS_STAY_MS);
  };
  useEffect(
    () => () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    },
    [],
  );
  // The keys work as soon as the player opens.
  useEffect(() => frame.current?.focus(), []);
  useEffect(() => {
    const onChange = () =>
      setFullScreen(document.fullscreenElement === frame.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) void el.play().catch(() => {});
    else el.pause();
    // The large play button leaves when playing; keep the keys working.
    frame.current?.focus();
    wake();
  };
  const seek = (to: number) => {
    const el = video.current;
    if (!el) return;
    el.currentTime = Math.min(Math.max(to, 0), duration || 0);
    setTime(el.currentTime);
    wake();
  };
  const changeVolume = (to: number) => {
    const el = video.current;
    if (!el) return;
    el.volume = Math.min(Math.max(to, 0), 1);
    el.muted = el.volume === 0;
    wake();
  };
  const toggleMuted = () => {
    const el = video.current;
    if (!el) return;
    el.muted = !el.muted;
    if (!el.muted && el.volume === 0) el.volume = 0.5;
    wake();
  };
  const toggleFullScreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void frame.current?.requestFullscreen().catch(() => {});
    wake();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // The sliders and buttons keep their own keys.
    const target = event.target as HTMLElement;
    if (target.tagName === "INPUT") return;
    const onButton = target.tagName === "BUTTON";
    const keys: Record<string, () => void> = {
      k: toggle,
      m: toggleMuted,
      f: toggleFullScreen,
      ArrowLeft: () => seek(time - 5),
      ArrowRight: () => seek(time + 5),
      ArrowUp: () => changeVolume(volume + 0.1),
      ArrowDown: () => changeVolume(volume - 0.1),
      ...(onButton ? {} : { " ": toggle }),
    };
    const action = keys[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  };

  const played = duration ? (time / duration) * 100 : 0;
  const loaded = duration ? (buffered / duration) * 100 : 0;
  const level = muted ? 0 : volume;

  return (
    <div
      ref={frame}
      className={`video-player ${controlsHidden ? "idle" : ""} ${pictureRatio ? "cropped" : ""}`}
      tabIndex={0}
      role="group"
      aria-label={label}
      onPointerMove={wake}
      onKeyDown={onKeyDown}
    >
      <div className="video-stage">
        <video
          ref={video}
          src={src}
          autoPlay
          playsInline
          onClick={toggle}
          onPlay={() => {
            setPlaying(true);
            wake();
          }}
          onPause={() => {
            setPlaying(false);
            setControlsHidden(false);
          }}
          onWaiting={() => setWaiting(true)}
          onPlaying={() => setWaiting(false)}
          onCanPlay={() => setWaiting(false)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onProgress={(e) => {
            const ranges = e.currentTarget.buffered;
            if (ranges.length) setBuffered(ranges.end(ranges.length - 1));
          }}
          onLoadedMetadata={(e) => {
            const el = e.currentTarget;
            setDuration(el.duration);
            if (pictureRatio) onRatio?.(pictureRatio);
            else if (el.videoWidth && el.videoHeight)
              onRatio?.(el.videoWidth / el.videoHeight);
          }}
          onVolumeChange={(e) => {
            setVolume(e.currentTarget.volume);
            setMuted(e.currentTarget.muted);
          }}
        />
        {waiting && <span className="video-spinner" aria-hidden="true" />}
        {!playing && !waiting && (
          <button
            className="video-big-play"
            onClick={toggle}
            aria-label="Play video"
          >
            <Glyph>{ICONS.play}</Glyph>
          </button>
        )}
      </div>
      <div className="video-controls">
        <button onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
          <Glyph>{playing ? ICONS.pause : ICONS.play}</Glyph>
        </button>
        <span className="video-time">
          {clock(time)} / {clock(duration)}
        </span>
        <input
          className="video-seek"
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          aria-label="Seek"
          aria-valuetext={`${clock(time)} of ${clock(duration)}`}
          style={
            {
              "--played": `${played}%`,
              "--loaded": `${Math.max(loaded, played)}%`,
            } as CSSProperties
          }
          onChange={(e) => seek(Number(e.target.value))}
        />
        <button onClick={toggleMuted} aria-label={level ? "Mute" : "Unmute"}>
          <Glyph>{level ? ICONS.sound : ICONS.muted}</Glyph>
        </button>
        <input
          className="video-volume"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={level}
          aria-label="Volume"
          style={
            {
              "--played": `${level * 100}%`,
              "--loaded": `${level * 100}%`,
            } as CSSProperties
          }
          onChange={(e) => changeVolume(Number(e.target.value))}
        />
        <button
          onClick={toggleFullScreen}
          aria-label={fullScreen ? "Leave full screen" : "Full screen"}
        >
          <Glyph>{fullScreen ? ICONS.shrink : ICONS.expand}</Glyph>
        </button>
      </div>
    </div>
  );
}
