import { useState } from 'react'
import type { INote } from '../../db/db'


interface INoteItemEditableProps
{
	note: INote,
	onToggleState: () => void,
	onUpdate: (id: number, title: string, text: string) => void
}

const STYLES = {
	input: `min-h-11 w-full rounded-[10px] border border-gray-400 px-3.5 font-medium`,
	textarea: `w-full resize-y rounded-[10px] border border-gray-400 px-3.5 
	py-3 leading-snug
	min-h-12 max-h-150 h-70
	resize-none 
	overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
	outline-none`,
};

export default function NoteItemEditable({ note, onToggleState, onUpdate }: INoteItemEditableProps)
{
	const [title, setTitle] = useState(note.title ?? '');
	const [text, setText] = useState(note.text);

	const save = () =>
	{
		const trimmedTitle = title.trim();

		const trimmedText = text.trim();
		if(!trimmedText) return;

		onUpdate(note.id, trimmedTitle, trimmedText);
		onToggleState();
	};

	return (
		<div className = "flex w-full flex-col gap-2">
			<input
				aria-label = "Title"
				placeholder = "Title (optional)"
				value = {title}
				onChange = {e => setTitle(e.target.value)}
				className = {STYLES.input}
			/>
			<textarea
				aria-label = "Note"
				rows = {4}
				value = {text}
				onChange = {e => setText(e.target.value)}
				className = {STYLES.textarea}
			/>
			<div className = "flex gap-4">
				<button type = "button" onClick = {save} className = "min-h-11 text-blue-600">Save</button>
				<button type = "button" onClick = {onToggleState} className = "min-h-11 text-gray-600">Cancel</button>
			</div>
		</div>
	);
}