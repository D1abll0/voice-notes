import { embed } from '../../ai/aiClient'
import { addNote, getNote, updateNote, setTitle } from '../../db/notesRepo'
import type { TNoteOrigin } from '../../db/db'

interface INewNoteInput
{
	text: string,
	title?: string,
	origin?: TNoteOrigin
};

async function tryEmbed(text: string): Promise<Float32Array | undefined>
{
	try { return await embed(text); }
	catch { return undefined; }
}

export async function createNote({ text, title = '', origin = 'text' }: INewNoteInput)
{
	return addNote({ title, text, origin, embedding: await tryEmbed(text) });
}

export async function editNote(id: number, title: string, text: string)
{
	const current = await getNote(id);
	if(current?.text === text) return setTitle(id, title);
	return updateNote(id, { title, text, embedding: await tryEmbed(text) });
}