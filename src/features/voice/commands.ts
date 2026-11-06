export type TCommandKind = 'add' | 'search';

export interface IVoiceCommand
{
	kind: TCommandKind,
	text: string
};

const COMMANDS = [
	{
		kind: 'add',
		pattern: /^\W*(?:add|create)\W+(?:a\W+)?(?:new\W+)?note\b[\s,.:;!?-]*/i,
	},
	{
		kind: 'search',
		pattern: /^\W*(?:find|search(?:\W+for)?)\W+(?:a\W+|my\W+)?notes?\b[\s,.:;!?-]*/i,
	},
] as const;

const NOISE = new Set(['you', 'thank you', 'thanks for watching', 'bye'])

export function isNoise(transcript: string): boolean
{
	if(/^\s*[[(].*[\])]\s*$/.test(transcript)) return true;
	const cleaned = transcript.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').trim();
	return cleaned.length < 2 || NOISE.has(cleaned);
}

export function parseCommand(transcript: string): IVoiceCommand | null
{
	for(const { kind, pattern } of COMMANDS)
	{
		const match = pattern.exec(transcript);
		if(match)
		{
			const rest = transcript.slice(match[0].length).trim();
			const result = {
				kind,
				text: kind === 'search' ? rest.replace(/[.,;:!?]+$/, '') : rest
			};
			return result;
		}
	}

	return null;
}
