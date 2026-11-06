export function rms(chunk: Float32Array): number
{
	let sum = 0;
	for(let i = 0; i < chunk.length; i++)
		sum += chunk[i] * chunk[i];
	return Math.sqrt(sum / chunk.length);
}