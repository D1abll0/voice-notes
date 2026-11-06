import { useEffect, useRef } from 'react'
import { embed } from '../../ai/aiClient'
import type { INote } from '../../db/db'
import { setEmbedding } from '../../db/notesRepo'
import { hasCurrentEmbedding } from '../../lib/similarity'
import { useAiStore } from '../../store/aiStore'

export function useBackfillEmbeddings(notes: INote[] | undefined)
{
	const status = useAiStore(s => s.status);
	const running = useRef(false);

	useEffect(() =>
	{
		if(status !== 'ready' || !notes || running.current) return;
		
		const missing = notes.filter(note => !hasCurrentEmbedding(note));
		if(!missing.length) return;

		running.current = true;
		void (async () =>
		{
			try
			{
				for(const note of missing)
				{
					const vector = await embed(note.text);
					await setEmbedding(note.id, vector);
				}
			}
			catch(error)
			{
				console.error(`[Error]: ${error}`);
			}
			finally { running.current = false; }
		})();
	}, [status, notes]);
}