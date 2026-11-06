import { pipeline } from '@huggingface/transformers'
import type { Device, TModelKind, FromWorker, ToWorker } from './protocol'
import { WHISPER_MODEL, EMBED_MODEL } from './models'

let activeDevice: Device = 'wasm';

interface IProgressEvent {
	status: string,
	progress?: number
};

type Transcriber = (
	audio: Float32Array,
	options: Record<string, unknown>,
) => Promise<{ text: string } | { text: string }[]>;

type Embedder = (
	text: string,
	options: Record<string, unknown>
) => Promise<{data: Float32Array}>;

const send = (msg: FromWorker, transfer: Transferable[] = []) => self.postMessage(msg, { transfer });

function createProgressReporter(model: TModelKind)
{
	let last = 0;

	return (p: IProgressEvent) =>
	{
		if(p.status !== 'progress_total' || p.progress === undefined) return;
	
		const percent = Math.max(last, Math.round(p.progress));
		if(percent === last) return;

		last = percent;
		send({ type: 'progress', model, percent });
	};
}

async function detectDevice(): Promise<Device>
{
	const gpu = (navigator as unknown as { gpu?: {requestAdapter(): Promise<unknown>} }).gpu;
	if(!gpu) return 'wasm';
	try
	{
		return (await gpu.requestAdapter()) ? 'webgpu' : 'wasm';
	}
	catch
	{
		return 'wasm';
	}
}

async function createTranscriber(): Promise<Transcriber>
{
	activeDevice = await detectDevice();
	const transcriber = await pipeline('automatic-speech-recognition', WHISPER_MODEL,
	{
		device: activeDevice,
		progress_callback: createProgressReporter('speech')
	});
	return transcriber as unknown as Transcriber;
}

async function createEmbedder(): Promise<Embedder>
{
	const embedder = await pipeline('feature-extraction', EMBED_MODEL, {
		progress_callback: createProgressReporter('search')
	});
	return embedder as unknown as Embedder;
}

function lazy<T>(factory: () => Promise<T>): () => Promise<T>
{
	let promise: Promise<T> | null = null;
	return () =>
	(promise ??= factory().catch((err) =>
	{
		promise = null
		throw err
	}));
}

const getTranscriber = lazy(createTranscriber);
const getEmbedder = lazy(createEmbedder);

self.onmessage = async (e: MessageEvent<ToWorker>) =>
{
	const msg = e.data;
	try
	{
		switch(msg.type)
		{
			case 'load':
				await Promise.all([getTranscriber(), getEmbedder()]);
				send({ type: 'ready', device: activeDevice });
				break;
			case 'transcribe':
			{
				const transcriber = await getTranscriber();
				const out = await transcriber(msg.audio, {
					chunk_length_s: 30,
					stride_length_s: 5,
					language: 'english', /*optionally*/
					task: 'transcribe'
				});
				const text = Array.isArray(out) ? out.map(o => o.text).join(' ') : out.text;
				send({ type: 'transcript', id: msg.id, text: text.trim() });
				break;
			}
			case 'embed':
			{
				
				const embedder = await getEmbedder();
				const out = await embedder(msg.text, { pooling: 'mean', normalize: true });
				const vector = new Float32Array(out.data);
				send({ type: 'embedding', id: msg.id, vector }, [vector.buffer as ArrayBuffer]);
				break;
			}
		}
	}
	catch(err)
	{
		send({ 
			type: 'error', 
			id: msg.type === 'load' ? undefined : msg.id,
			message: err instanceof Error ? err.message : String(err)
		});
	}
};