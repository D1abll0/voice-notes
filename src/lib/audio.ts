const SAMPLE_RATE = 16000;

export async function blobToFloat32(blob: Blob): Promise<Float32Array>
{
	const arrayBuffer = await blob.arrayBuffer();
	const ctx = new AudioContext({ sampleRate: SAMPLE_RATE });
	try
	{
		const decoded = await ctx.decodeAudioData(arrayBuffer);
		return decoded.getChannelData(0).slice();
	}
	finally
	{
		await ctx.close();
	}
}