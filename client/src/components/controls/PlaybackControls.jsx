import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

export default function PlaybackControls({ player, onShuffle }) {
  const { playing, toggle, stepForward, stepBack, reset, index, total, speed, setSpeed, isDone } = player;

  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button className="btn-ghost" onClick={reset} title="Reset">
          <RotateCcw size={18} />
        </button>
        <button className="btn-ghost" onClick={stepBack} disabled={index === 0} title="Step back">
          <SkipBack size={18} />
        </button>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={toggle}
          disabled={total === 0}
          title={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
          {playing ? "Pause" : isDone ? "Replay" : "Play"}
        </button>
        <button className="btn-ghost" onClick={stepForward} disabled={isDone} title="Step forward">
          <SkipForward size={18} />
        </button>

        {onShuffle && (
          <button className="btn-ghost ml-auto" onClick={onShuffle}>
            Shuffle
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400 w-14">Speed {speed}x</span>
        <input
          type="range"
          min="0.25"
          max="4"
          step="0.25"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="flex-1 accent-accent"
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400 w-14">
          Step {Math.min(index + 1, total)}/{total}
        </span>
        <input
          type="range"
          min="0"
          max={Math.max(total - 1, 0)}
          value={index}
          onChange={(e) => player.seek(Number(e.target.value))}
          className="flex-1 accent-accent"
        />
      </div>
    </div>
  );
}
