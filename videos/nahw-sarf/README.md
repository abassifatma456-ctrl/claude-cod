# Naḥw vs. Ṣarf – Malakah-Animation (9:16)

Animierte Typografie über den Ton eines Ausschnitts von Šaiḵ Aiman Suwaid.

- `timings/scenes.json` – einzige Timing-Quelle (Szenen, Cues, Untertitel). Werte von Hand anpassbar.
- `timings/words.json` – Whisper-Wortzeitstempel (Referenz).
- `src/scenes/` – eine Datei pro Szene.

Lokal (nicht im Repo): `assets/source.mp4`, daraus `public/audio.wav`:

```
ffmpeg -i assets/source.mp4 -vn -af "aresample=192000,alimiter=limit=0.87:attack=1:release=50:level=false,aresample=48000" -ar 48000 public/audio.wav
ffmpeg -i assets/source.mp4 -vn -ac 1 -ar 16000 assets/audio16k.wav
python3 scripts/transcribe.py assets/audio16k.wav timings/words.json
npm install
npm run studio      # Remotion Studio
npm run render      # out/nahw_sarf.mp4
```
