import { db } from './db'
import type { TNoteOrigin } from './db'
import { EMBED_MODEL } from '../ai/models'

interface INoteFields
{
	title?: string,
	text: string,
	embedding?: Float32Array
};

interface INewNote extends INoteFields
{
	origin: TNoteOrigin
};

export function addNote({ title = '', text, embedding, origin }: INewNote)
{
	const embeddingModel = embedding ? EMBED_MODEL : undefined;
	return db.notes.add({ createdAt: Date.now(), title, text, embedding, embeddingModel, origin });
}

export function updateNote(id: number, { title = '', text, embedding }: INoteFields)
{
	const embeddingModel = embedding ? EMBED_MODEL : undefined;
	return db.notes.update(id, { title, text, embedding, embeddingModel });
}

export function setTitle(id: number, title: string)
{
	return db.notes.update(id, { title });
}

export function getNote(id: number)
{
	return db.notes.get(id);
}

export function setEmbedding(id: number, embedding: Float32Array)
{
	return db.notes.update(id, {embedding, embeddingModel: EMBED_MODEL});
}

export function deleteNote(id: number)
{
	return db.notes.delete(id);
}

export function clearNotes()
{
	return db.notes.clear();
}