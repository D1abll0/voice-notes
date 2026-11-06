import { useEffect, useState } from 'react'
import { useRecorder } from './useRecorder'
import { blobToFloat32 } from '../../lib/audio'
import { createNote } from '../notes/noteService'
import { transcribeSpeech } from '../voice/speech'

import { MicIcon, StopIcon, PauseIcon, PlayIcon } from '../../components/icons'

const formatTime = (ms: number):string =>
{
	const total = Math.floor(ms / 1000)
	const m = Math.floor(total / 60)
	const s = total % 60
	return `${m}:${String(s).padStart(2, '0')}`
}

export default function RecorderPanel()
{
	const [busy, setBusy] = useState(false);
	const [notice, setNotice] = useState<string | null>(null);
	const [time, setTime] = useState(0);

	const { isRecording, isPaused, error, start, stop, pause, resume } = useRecorder(async blob =>
	{
		setBusy(true);
		setNotice(null);

		try
		{
			const audio = await blobToFloat32(blob);
			const text = await transcribeSpeech(audio);
			if(text) await createNote({ text, origin: 'voice' });
			else setNotice('No speech detected.');
		}
		catch(e)
		{
			setNotice(e instanceof Error ? e.message : 'Transcription failed');
		}
		finally { setBusy(false); }
	});

	useEffect(() =>
	{
		if(!isRecording || isPaused) return;
		const id = setInterval(() => setTime(prev => prev + 1000), 1000);
		return () => clearInterval(id);
	}, [isRecording, isPaused]);

	const handleStart = () =>
	{
		setTime(0);
		start();
	}

	return (
		<section className = "space-y-3">
			<div className = "flex flex-col items-center gap-3">
				<div className = "flex items-center justify-center gap-5">
					{isRecording && (
						<button
							type = "button"
							onClick = {isPaused ? resume : pause}
							aria-label = {isPaused ? 'Resume recording' : 'Pause recording'}
							className = "cursor-pointer flex size-14 items-center justify-center rounded-full border-2 border-gray-900 bg-white text-gray-900"
						>
							{isPaused ? <PlayIcon /> : <PauseIcon />}
						</button>
					)}
					<button
						type = "button"
						onClick = {isRecording ? stop : handleStart}
						disabled = {busy}
						aria-label = {isRecording ? 'Stop recording' : 'Start recording'}
						className = "cursor-pointer flex size-24 items-center justify-center rounded-full bg-red-600 text-white shadow-[0_0_0_10px_#FDE7E5] disabled:opacity-50"
					>
						{isRecording ? <StopIcon /> : <MicIcon />}
					</button>
					{isRecording && <span className = "size-14" aria-hidden = "true" />}
				</div>
				<p role = "status" className = "text-[15px] text-gray-700">
					{
						isRecording
						? (
							isPaused
							? `Paused ${formatTime(time)} · tap ▶ to resume`
							: `Recording... ${formatTime(time)} · tap ❚❚ to pause`
						)
						: ( busy ? 'Transcribing…' : 'Tap to record' )
					}
				</p>
				{(error ?? notice) && <p role = "alert" className = "text-sm text-red-700">{error ?? notice}</p>}
			</div>
		</section>

	);
}