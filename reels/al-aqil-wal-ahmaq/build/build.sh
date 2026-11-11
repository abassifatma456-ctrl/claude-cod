#!/usr/bin/env bash
# Rebuilds the reel: paper texture -> foley -> voice loudness -> animation -> final mp4.
# Usage: ./build.sh <voiceover-video-or-audio-file>
set -euo pipefail
cd "$(dirname "$0")"
SRC="${1:?Pfad zur Sprachaufnahme angeben}"
[ -d node_modules ] || npm install
python3 paper.py
python3 sfx.py
ffmpeg -v error -y -i "$SRC" -vn -ac 2 -ar 44100 \
  -af "highpass=f=75,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=120:makeup=2" voice_pre.wav
MI=$(ffmpeg -hide_banner -i voice_pre.wav -af loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json -f null - 2>&1 \
  | sed -n '/^{/,/^}/p' | python3 -c "import json,sys;d=json.load(sys.stdin);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
ffmpeg -v error -y -i voice_pre.wav -af "loudnorm=I=-14:TP=-1.5:LRA=9:$MI:linear=true,aresample=44100" voice.wav
ffmpeg -v error -y -i voice.wav -i sfx.wav -filter_complex \
  "[0:a][1:a]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.89:level=false[a]" -map "[a]" -ar 44100 mix.wav
mkdir -p ../out
node render.js video ../out/video_silent.mp4 30 69.31
ffmpeg -v error -y -i ../out/video_silent.mp4 -i mix.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart ../out/reel_al-aqil-wal-ahmaq.mp4
echo "fertig: ../out/reel_al-aqil-wal-ahmaq.mp4"
