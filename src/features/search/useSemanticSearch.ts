import { useEffect, useState } from	'react'
import { embed } from '../../ai/aiClient'
import type { INote } from '../../db/db'
import { useDebounce } from '../../lib/useDebounce'
import { hybridSearch } from '../../lib/similarity'

const MIN_SCORE = 0.3;

export function useSemanticSearch(query: string, notes: INote[] | undefined)
{
	const debounced = useDebounce(query.trim());
	const [result, setResult] = useState<{ query: string, vector: Float32Array | null } | null>(null);

	useEffect(() =>
	{
		if(!debounced) return;
		let cancelled = false;

		embed(debounced)
			.then(vector => 
			{
				if(!cancelled) setResult({ query: debounced, vector });
			})
			.catch(() =>
			{
				if(!cancelled) setResult({ query: debounced, vector: null });
			});

		return () => {cancelled = true};
	}, [debounced]);

	const active = debounced !== '';
	const current = result?.query === debounced ? result : null;

	return {
		active,
		loading: active && current === null,
		failed: current !== null && current.vector === null,
		matches: active ? hybridSearch(debounced, current?.vector ?? null, notes ?? [], MIN_SCORE) : [],
	};
}