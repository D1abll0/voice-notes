import { EMBED_MODEL } from '../ai/models'
import type { INote } from '../db/db'

type TEmbeddedNote = INote & {embedding: Float32Array};
export type TNoteWithScore = INote & { score?: number; exact?: boolean };

export const hasCurrentEmbedding = (note: INote): note is TEmbeddedNote => 
{
	return note.embedding !== undefined && note.embeddingModel === EMBED_MODEL;
};

export function dot(a: Float32Array, b: Float32Array): number
{
	if(a.length !== b.length) return 0;

	let sum = 0;
	for(let i = 0; i < a.length; i++)
		sum += a[i] * b[i];
	return sum;
}

function matchesAllWords(text: string, query: string): boolean
{
	const words = query.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []
	if(words.length === 0) return false
	const lower = text.toLowerCase()
	return words.every(word => new RegExp(`(^|[^\\p{L}\\p{N}])${word}`, 'u').test(lower))
}

export function hybridSearch(
	queryText: string,
	queryVector: Float32Array | null,
	notes: INote[],
	minScore = 0.3,
	margin = 0.1,
	limit = 10
): TNoteWithScore[]
{
	const exactMatches: TNoteWithScore[] = [];
	const semantic: TNoteWithScore[] = [];

	for(const note of notes)
	{
		const exact = matchesAllWords(`${note.title ?? ''} ${note.text}`, queryText);
		const score = queryVector && hasCurrentEmbedding(note) ? dot(queryVector, note.embedding) : undefined;

		if(exact) exactMatches.push({ ...note, exact: true, score });
		else if(score !== undefined && score >= minScore)
			semantic.push({ ...note, score });
	}

	semantic.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
	exactMatches.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

	const best = semantic[0]?.score ?? 0;
	const cutoff = Math.max(minScore, best - margin);
	const related = semantic.filter(n => (n.score ?? 0) >= cutoff);

	return [...exactMatches, ...related].slice(0, limit);
}