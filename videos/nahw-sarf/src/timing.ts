import data from '../timings/scenes.json';
import {FPS} from './theme';

export type Scene = {id: string; start: number; end: number; first?: string; light?: boolean};
export type Subtitle = {start: number; end: number; text: string};

export const T = data as unknown as {
  audio: string;
  audioEnd: number;
  outro: number;
  transition: number;
  scenes: Scene[];
  cues: Record<string, number>;
  credit: {start: number; end: number};
  subtitles: Subtitle[];
};

export const f = (sec: number) => Math.round(sec * FPS);

export const scene = (id: string): Scene => {
  const s = T.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown scene ${id}`);
  return s;
};

/** Cue time in frames, relative to the start of the given scene. */
export const cue = (name: string, sceneId: string) => {
  const c = T.cues[name];
  if (c === undefined) throw new Error(`Unknown cue ${name}`);
  return f(c) - f(scene(sceneId).start);
};

export const totalFrames = () => f(T.audioEnd + T.outro);
