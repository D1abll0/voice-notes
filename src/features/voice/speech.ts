import { transcribe } from '../../ai/aiClient'
import { rms } from '../../lib/audioLevel'
import { useSettings } from '../settings/settingsStore'
import { isNoise } from './commands'

const WINDOW = 512;
const MIN_VOICE_WINDOWS = 3;

export function hasSpeech(audio: Float32Array, threshold: number): boolean
{
	let voiced = 0;
	for(let start = 0; start + WINDOW <= audio.length; start += WINDOW)
	{
		const level = rms(audio.subarray(start, start + WINDOW));
		if(level > threshold) voiced++;
		if(voiced >= MIN_VOICE_WINDOWS) return true;
	}

	return false;
}

export async function transcribeSpeech(audio: Float32Array): Promise<string | null>
{
	if(!hasSpeech(audio, useSettings.getState().startRms)) return null;
	const text = (await transcribe(audio)).trim();
	return !text || isNoise(text) ? null : text;
}