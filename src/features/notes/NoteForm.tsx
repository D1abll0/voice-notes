import { useState } from 'react'
import type { FormEvent } from 'react'

export interface INoteDraft
{
	title: string,
	text: string
};

interface INoteFormProps
{
	onAdd: (note: INoteDraft) => void
};

const STYLES = {
	input: `w-full rounded-[10px] border border-gray-400 bg-white px-3.5 
		text-gray-900 min-h-11 font-medium outline-none`,
	textarea: `w-full rounded-[10px] border border-gray-400 bg-white 
		px-3.5 text-gray-900 resize-y py-3 leading-snug min-h-12 max-h-70
		overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
		outline-none
		field-sizing-content
	`,
	button: `cursor-pointer min-h-11 self-end rounded-[10px] bg-gray-900 px-9 font-bold text-white`
};

export default function NoteForm({ onAdd }: INoteFormProps)
{
	const [title, setTitle] = useState('');
	const [text, setText] = useState('');

	const handleSubmit = (e: FormEvent<HTMLFormElement>) =>
	{
		e.preventDefault();

		const trimmedTitle = title.trim();

		const trimmedText = text.trim();
		if(!trimmedText) return;

		onAdd({ title: trimmedTitle, text: trimmedText });

		setTitle('');
		setText('');
	};

	return (
		<form onSubmit = {handleSubmit} className = "flex flex-col gap-2">
			<div className = "flex gap-2">
				<input
					aria-label = "Title (optional)"
					placeholder = "Title (optional)"
					value = {title}
					onChange = {e => setTitle(e.target.value)}
					className = {STYLES.input}
				/>
				<button
					type = "submit"
					className = {STYLES.button}
				>
					Add
				</button>
			</div>
			<textarea
				aria-label = "Note"
				placeholder = "Write a note"
				// rows = {4}
				value = {text}
				onChange = {e => setText(e.target.value)}
				className = {STYLES.textarea}
			/>
		</form>
	)
}