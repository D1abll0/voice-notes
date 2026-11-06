import { useEffect, useRef, useState } from 'react'
import { rms } from '../../lib/audioLevel'
import { useSettings } from '../settings/settingsStore'

const SAMPLE_RATE = 16_000;
const PREROLL_MS = 300;

const toSamples = (ms: number) => Math.round(ms / 1000 * SAMPLE_RATE);

function concat(chunks: Float32Array[], total: number): Float32Array
{
	const out = new Float32Array(total);
	let offset = 0;

	for(const chunk of chunks)
	{
		out.set(chunk, offset);
		offset += chunk.length;
	}

	return out;
}

export function useSpeechSegments(enabled: boolean, onSegment: (audio: Float32Array) => void)
{
	const [listening, setListening] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const onSegmentRef = useRef(onSegment);

	useEffect(() =>
	{
		onSegmentRef.current = onSegment;
	});

	useEffect(() =>
	{
		if(!enabled) return;

		let cancelled = false;
		let cleanup = () => {};

		void (async () =>
		{
			try
			{
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: {
						echoCancellation: true,
						noiseSuppression: true
					}
				});

				if(cancelled)
				{
					stream.getTracks().forEach(track => track.stop());
					return;
				}

				const ctx = new AudioContext({ sampleRate: SAMPLE_RATE });
				await ctx.audioWorklet.addModule(`${import.meta.env.BASE_URL}pcm-processor.js`);
				if(cancelled)
				{
					stream.getTracks().forEach(track => track.stop());
					void ctx.close();
					return;
				}

				const source = ctx.createMediaStreamSource(stream);
				const node = new AudioWorkletNode(ctx, 'pcm-processor');
				const mute = ctx.createGain();

				mute.gain.value = 0;
				source.connect(node);
				node.connect(mute);
				mute.connect(ctx.destination);

				const prerollMax = toSamples(PREROLL_MS);

				let preroll: Float32Array[] = [];
				let prerollSamples = 0;
				let segment: Float32Array[] = [];
				let total = 0;
				let silence = 0;
				let speaking = false;

				const finish = () =>
				{
					const { minSpeechMs } = useSettings.getState();
					const voiced = total - silence;
					if(voiced >= toSamples(minSpeechMs))
						onSegmentRef.current(concat(segment, total));

					segment = [];
					total = 0;
					silence = 0;
					speaking = false;
				};

				node.port.onmessage = (e: MessageEvent<Float32Array>) =>
				{
					const { startRms, silenceMs, maxSpeechMs } = useSettings.getState();

					const chunk = e.data;
					const loud = rms(chunk) > startRms;

					if(!speaking)
					{
						preroll.push(chunk);
						prerollSamples += chunk.length;

						while(prerollSamples > prerollMax)
						{
							const first = preroll.shift();
							if(first) prerollSamples -= first.length;
						}

						if(loud)
						{
							speaking = true;
							segment = preroll;
							total = prerollSamples;
							silence = 0;
							preroll = [];
							prerollSamples = 0;
						}

						return;
					}

					segment.push(chunk);
					total += chunk.length;
					silence = loud ? 0 : silence + chunk.length;
					if(silence >= toSamples(silenceMs) || total >= toSamples(maxSpeechMs)) finish();
				};

				cleanup = () =>
				{
					node.port.onmessage = null;
					node.disconnect();
					source.disconnect();
					stream.getTracks().forEach(track => track.stop());
					void ctx.close();
				};

				setError(null);
				setListening(true);
			}
			catch
			{
				setError('Microphone is unavailable or access was denied.');
			}
		})();

		return () =>
		{
			cancelled = true;
			cleanup();
			setListening(false);
		};
	}, [enabled]);

	return { listening, error };
}