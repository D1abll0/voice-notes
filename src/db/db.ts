import Dexie, { type EntityTable } from 'dexie'

export type TNoteOrigin = 'voice' | 'text';

export interface INote
{
	id: number,
	createdAt: number,
	title?: string,
	text: string,
	embedding?: Float32Array,
	embeddingModel?: string,
	origin?: TNoteOrigin
};

export const db = new Dexie('private-voice-notes') as Dexie & { notes: EntityTable<INote, 'id'> };

db.version(1).stores({
	notes: '++id, createdAt'
});