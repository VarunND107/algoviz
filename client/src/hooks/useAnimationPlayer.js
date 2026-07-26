import { useCallback, useEffect, useRef, useState } from "react";

// Steps are precomputed upfront (arrays are small demo sizes), so play/pause/speed
// and scrubbing back and forth are just index changes over a fixed timeline.
export function useAnimationPlayer(steps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef(null);

  const total = steps.length;
  const current = total ? steps[Math.min(index, total - 1)] : null;

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [steps]);

  useEffect(() => {
    if (!playing) return undefined;
    if (index >= total - 1) {
      setPlaying(false);
      return undefined;
    }
    const delay = Math.max(600 / speed, 30);
    timerRef.current = setTimeout(() => setIndex((i) => Math.min(i + 1, total - 1)), delay);
    return () => clearTimeout(timerRef.current);
  }, [playing, index, speed, total]);

  const play = useCallback(() => {
    if (total > 0) setPlaying(true);
  }, [total]);
  const pause = useCallback(() => setPlaying(false), []);
  const toggle = useCallback(() => setPlaying((p) => !p), []);
  const stepForward = useCallback(() => setIndex((i) => Math.min(i + 1, total - 1)), [total]);
  const stepBack = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);
  const reset = useCallback(() => {
    setIndex(0);
    setPlaying(false);
  }, []);
  const seek = useCallback((i) => setIndex(Math.min(Math.max(i, 0), Math.max(total - 1, 0))), [total]);

  return {
    index,
    total,
    current,
    playing,
    speed,
    setSpeed,
    play,
    pause,
    toggle,
    stepForward,
    stepBack,
    reset,
    seek,
    isDone: total > 0 && index >= total - 1,
  };
}
