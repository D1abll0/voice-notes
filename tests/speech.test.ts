import { describe, expect, test } from 'vitest'
import { rms } from '../src/lib/audioLevel'

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

const THRESHOLD = 0.02;

function tone(samples: number, amplitude: number)
{
	const out = new Float32Array(samples);
	for(let i = 0; i < samples; i++)
		out[i] = amplitude * Math.sin(i / 10);
	return out;
}

describe('hasSpeech', () =>
{
	test('silence is not speech', () =>
	{
		expect(hasSpeech(new Float32Array(16000), THRESHOLD)).toBe(false);
	});

	test('quiet background noise is not speech', () =>
	{
		expect(hasSpeech(tone(16000, 0.005), THRESHOLD)).toBe(false);
	});

	test('a single short click is not speech', () =>
	{
		const audio = new Float32Array(16000);
		audio.set(tone(512, 0.5), 4000);
		expect(hasSpeech(audio, THRESHOLD)).toBe(false);
	});

	test('a loud tone is speech', () =>
	{
		expect(hasSpeech(tone(16000, 0.2), THRESHOLD)).toBe(true);
	});
});