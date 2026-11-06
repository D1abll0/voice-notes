import type { TNoteWithScore } from '../../lib/similarity'
import NoteItem from './NoteItem'

interface INoteListProps
{
	notes?: TNoteWithScore[],
	emptyMessage?: string,
	onDelete: (id: number) => void,
	onUpdate: (id: number, title: string, text: string) => void,
};

export default function NoteList({ notes, emptyMessage = 'No notes yet.', onDelete, onUpdate }: INoteListProps)
{
	if(notes === undefined) return <p className = "text-gray-500">loading...</p>;
	if(!notes.length) return <p className = "text-gray-500">{emptyMessage}</p>;

	return (
		<>
			<p className = "text-gray-500">
				Notes count: {notes.length}
			</p>
			<ul>
				{
					notes.map(note => <NoteItem key = {note.id} note = {note} onDelete = {onDelete} onUpdate = {onUpdate} />)
				}
			</ul>
		</>
	);
}