export type Device = 'webgpu' | 'wasm';

export type TModelKind = 'speech' | 'search';

export type ToWorker =
	| { type: 'load' }
	| { type: 'transcribe'; id: string; audio: Float32Array }
	| { type: 'embed'; id: string; text: string };

export type FromWorker = 
	| { type: 'ready'; device: Device}
	| { type: 'transcript'; id: string; text: string }
	| { type: 'embedding'; id: string; vector: Float32Array }
	| { type: 'error'; id?: string; message: string }
	| { type: 'progress', model: TModelKind, percent: number };
