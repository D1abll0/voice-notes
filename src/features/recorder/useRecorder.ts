import { useEffect, useRef, useState } from 'react'

export function useRecorder(onFinish: (blob: Blob) => void)
{
	const [isRecording, setIsRecording] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const recorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	useEffect(() => () =>
	{
		const recorder = recorderRef.current;
		if(recorder && recorder.state !== 'inactive')
		{
			recorder.onstop = null;
			recorder.stream.getTracks().forEach(track => track.stop());
			recorder.stop();
		}
	}, []);

	const start = async () =>
	{
		if(recorderRef.current && recorderRef.current.state !== 'inactive') return;

		try
		{
			const stream = await navigator.mediaDevices.getUserMedia({audio: true});
			const recorder = new MediaRecorder(stream);
			chunksRef.current = [];

			recorder.ondataavailable = (e) =>
			{
				if(e.data.size > 0) chunksRef.current.push(e.data);
			};

			recorder.onpause = () => setIsPaused(true);
			recorder.onresume = () => setIsPaused(false);

			recorder.onstop = () =>
			{
				stream.getTracks().forEach(track => track.stop());
				onFinish(new Blob(chunksRef.current, {type: recorder.mimeType}));
				setIsRecording(false);
				setIsPaused(false);
			};

			recorder.start();
			recorderRef.current = recorder;
			setError(null);
			setIsRecording(true);
		}
		catch
		{
			setError('Microphone access was denied or is unavailable.');
		}
	};

	const stop = () => recorderRef.current?.stop();

	const pause = () =>
	{
		if(recorderRef.current?.state === 'recording')
			recorderRef.current.pause();
	};

	const resume = () =>
	{
		if(recorderRef.current?.state === 'paused')
			recorderRef.current.resume();
	};

	return { isRecording, isPaused, error, start, stop, pause, resume };
}