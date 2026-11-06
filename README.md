# Private Voice Notes

Voice notes that are transcribed and searched **entirely in your browser**.
No server, no API keys, no account. Audio and notes never leave your device.

**[Live demo](https://voice-notes-gules.vercel.app)** · Works offline after the first load.

## Examples of voice recognition
https://github.com/user-attachments/assets/df71b650-3220-40e9-b1f7-4889c750558b

https://github.com/user-attachments/assets/041f3c89-bd4b-471f-a268-9043706d7e42

https://github.com/user-attachments/assets/bef55c6b-1b96-40f3-9bb0-16c93835a98a

https://github.com/user-attachments/assets/822796bb-1e88-449c-8876-1d60d9c1ca0e

## Features
- Record from the microphone with pause and resume, or type a note with an optional title
- Speech-to-text with Whisper in a Web Worker (WebGPU, with WASM fallback)
- Search by words and by meaning (local embeddings)
- Voice commands: "add new note ..." and "find note ..."
- Settings for voice detection and a microphone check
- Installable PWA, notes stored in IndexedDB

## How privacy works
The speech and search models and the ONNX runtime are downloaded once
(from Hugging Face and jsDelivr) and cached. After that the app works without
a network, and audio and text are never sent anywhere. To verify: DevTools →
Network → Offline, then record a note.

## Architecture
UI (React) → aiClient (promises over postMessage) → Web Worker
(Whisper + embeddings) · Notes in IndexedDB (Dexie) · App shell cached by a
Service Worker.

Decisions worth knowing:
- Inference runs in a Web Worker, so the UI never freezes
- A typed message protocol (discriminated unions) between UI and worker
- Embeddings store the model name, so a model change re-indexes notes
  instead of silently returning wrong results
- Hybrid search: exact word matches first, then semantic matches above a
  relative threshold

## Tech
React, TypeScript, Vite, Tailwind CSS v4, Zustand, Dexie, Transformers.js,
vite-plugin-pwa, Vitest

## Limitations
- First load downloads about 280 MB of models (plus the search model)
- Without WebGPU, transcription runs on WASM and is noticeably slower
- English only; the search model is English
- Voice commands transcribe every detected phrase, so background talk costs
  GPU time, and a command may be misheard
- Search compares every note on each query

## Run locally
git clone https://github.com/D1abll0/voice-notes.git \
cd voice-notes\
npm install\
npm run dev
