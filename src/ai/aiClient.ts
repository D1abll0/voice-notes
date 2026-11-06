import { useAiStore } from '../store/aiStore'
import type { FromWorker, ToWorker } from './protocol'

const worker = new Worker(new URL('./ai.worker.ts', import.meta.url), { type: 'module' });

interface IPending<T>
{
	resolve: (value: T) => void;
	reject: (error: Error) => void;
}

const pendingText = new Map<string, IPending<string>>();
const pendingVectors = new Map<string, IPending<Float32Array>>();

function rejectRequest(id: string, message: string)
{
	const error = new Error(message);
	pendingText.get(id)?.reject(error);
	pendingText.delete(id);
	pendingVectors.get(id)?.reject(error);
	pendingVectors.delete(id);
}

worker.onmessage = (e: MessageEvent<FromWorker>) =>
{
	const msg = e.data;
	switch(msg.type)
	{
		case 'progress':
			useAiStore.setState(s => ({
				status: 'loading',
				progress: { ...s.progress, [msg.model]: msg.percent }
			}));
			break;
		case 'ready':
			useAiStore.setState({ status: 'ready', device: msg.device, progress: { speech: 100, search: 100 } });
			break;
		case 'transcript':
			pendingText.get(msg.id)?.resolve(msg.text);
			pendingText.delete(msg.id);
			break;
		case 'embedding':
			pendingVectors.get(msg.id)?.resolve(msg.vector);
			pendingVectors.delete(msg.id);
			break;
		case 'error':
			if(msg.id) rejectRequest(msg.id, msg.message);
			else useAiStore.setState({ status: 'error', error: msg.message });
			break;
	}
};

function post(msg: ToWorker, transfer: Transferable[] = [])
{
	worker.postMessage(msg, transfer);
}

export function loadModel()
{
	void navigator.storage?.persist?.();
	useAiStore.setState({ status: 'loading', progress: { speech: 0, search: 0 }, error: null });
	post({ type: 'load' });
}

let queue: Promise<unknown> = Promise.resolve();

function runTranscription(audio: Float32Array): Promise<string>
{
	const id = crypto.randomUUID();
	return new Promise((resolve, reject) =>
	{
		pendingText.set(id, { resolve, reject });
		post({ type: 'transcribe', id, audio }, [audio.buffer as ArrayBuffer]);
	});
}

export function transcribe(audio: Float32Array): Promise<string>
{
	const task = queue.then(() => runTranscription(audio));
	queue = task.catch(() => {});
	return task;
}

export function embed(text: string): Promise<Float32Array>
{
	const id = crypto.randomUUID();
	return new Promise((resolve, reject) =>
	{
		pendingVectors.set(id, { resolve, reject });
		post({ type: 'embed', id, text });
	});
}