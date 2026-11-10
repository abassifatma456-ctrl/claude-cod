"""Transcribe the Arabic audio with word timestamps -> timings/words.json.

Usage: python3 scripts/transcribe.py assets/audio16k.wav timings/words.json
"""
import json
import sys
import wave

import numpy as np

from faster_whisper import WhisperModel

src, out = sys.argv[1], sys.argv[2]
# Prompt with the known wording so Whisper spells the key terms consistently.
prompt = (
    "فرق بين النحو والصرف. يقول الله، إن الله، أفي الله شك. "
    "كتب وزنها فعل، سمع وزنها فعل، يسمع وزنها يفعل. سيبويه."
)
model = WhisperModel("large-v3", device="cpu", compute_type="int8")
# Read the 16 kHz mono WAV directly (avoids PyAV version issues).
with wave.open(src) as wf:
    audio = np.frombuffer(wf.readframes(wf.getnframes()), np.int16).astype(np.float32) / 32768
segments, info = model.transcribe(
    audio, language="ar", word_timestamps=True, initial_prompt=prompt, beam_size=5
)
words = []
for seg in segments:
    for w in seg.words:
        words.append({"w": w.word.strip(), "s": round(w.start, 2), "e": round(w.end, 2)})
        print(f"{w.start:6.2f} {w.end:6.2f} {w.word.strip()}", flush=True)
with open(out, "w", encoding="utf-8") as f:
    json.dump(words, f, ensure_ascii=False, indent=1)
