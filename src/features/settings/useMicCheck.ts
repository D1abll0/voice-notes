import { useEffect, useRef, useState } from 'react'
import { rms } from '../../lib/audioLevel'

const TEST_MS = 4_000;
export const METER_MAX_RMS = 0.1;

type TStatus = 'idle' | 'recording' | 'ready';

export function useMicCheck()
{
	const [status, setStatus] = useState<TStatus>('idle');
	const [error, setError] = useState<string | null>(null);
	const [url, setUrl] = useState<string | null>(null);
	const [peak, setPeak] = useState<number | null>(null);

	const barRef = useRef<HTMLDivElement>(null);
	const urlRef = useRef<string | null>(null);
	const stopRef = useRef<() => void>(() => {});

	useEffect(() =>
	{
		return () =>
		{
			stopRef.current();
			if(urlRef.current) URL.revokeObjectURL(urlRef.current);
		};
	}, []);

	const start = async () =>
	{
		setError(null);

		try
		{
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					echoCancellation: true,
					noiseSuppression: true
				}
			});
			const ctx = new AudioContext();
			const analyser = ctx.createAnalyser();
			analyser.fftSize = 2048;
			ctx.createMediaStreamSource(stream).connect(analyser);
			const samples = new Float32Array(analyser.fftSize);

			const recorder = new MediaRecorder(stream);
			const chunks: Blob[] = [];
			let frame = 0;
			let maxLevel = 0;

			const tick = () =>
			{
				analyser.getFloatTimeDomainData(samples);
				const level = rms(samples);
				maxLevel = Math.max(maxLevel, level);
				if(barRef.current) barRef.current.style.width = `${Math.min(level / METER_MAX_RMS, 1) * 100}%`;
				frame = requestAnimationFrame(tick);
			};

			recorder.ondataavailable = e =>
			{
				if(e.data.size > 0)
					chunks.push(e.data);
			};

			recorder.onstop = () =>
			{
				cancelAnimationFrame(frame);
				stream.getTracks().forEach(track => track.stop());
				void ctx.close();
				if(barRef.current) barRef.current.style.width = '0%';

				if(urlRef.current) URL.revokeObjectURL(urlRef.current);
				const next = URL.createObjectURL(new Blob(chunks, {type: recorder.mimeType}));
				urlRef.current = next;
				setUrl(next);
				setPeak(maxLevel);
				setStatus('ready');
			};

			const timer = window.setTimeout(() => recorder.stop(), TEST_MS);
			stopRef.current = () =>
			{
				window.clearTimeout(timer);
				if(recorder.state !== 'inactive') recorder.stop();
			};

			recorder.start();
			setStatus('recording');
			tick();
		}
		catch
		{
			setError('Microphone is unavailable or access was denied.');
			setStatus('idle');
		}
	};

	// return { status, error, url, peak, bar: barRef, start };
	return [
		{ status, error, url, peak, start },
		barRef
	] as const;
}