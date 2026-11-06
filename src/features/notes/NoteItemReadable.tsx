import type { TNoteWithScore } from '../../lib/similarity'

interface INoteItemReadableProps
{
	note: TNoteWithScore,
	onDelete: (id: number) => void,
	onToggleState: () => void,
}

const STYLES = {
	note: `w-full p-2`,
	text: `whitespace-pre-wrap break-words 
		max-h-70 
		overflow-y-auto 
		[scrollbar-width:none]
		[&::-webkit-scrollbar]:hidden
		mb-[7px]
	`,
};

export default function NoteItemReadable({ note, onDelete, onToggleState }: INoteItemReadableProps)
{
	return (
		<div className = {STYLES.note}>
			<div className = "min-w-0 flex-1">
				{note.title && <h3 className="text-[17px] font-bold break-words">{note.title}</h3>}
				<p className = {STYLES.text}>{note.text}</p>
				<p className = "text-sm text-gray-500">
					{new Date(note.createdAt).toLocaleString()}
					{note.origin === 'voice' && ` · voice`}
				</p>
				{
					note.exact
					? <p className = "text-sm text-green-700">exact match</p>
					: (
						note.score !== undefined && 
						<p className = "text-sm text-gray-600">similarity {(note.score * 100).toFixed(1)}%</p>
					)
				}
			</div>
			<div className = "flex gap-4">
				<button
					type = "button"
					onClick = {onToggleState}
					className = "text-sm text-green-700"
				>
					Edit
				</button>
				<button
					type = "button"
					onClick = {() => onDelete(note.id)}
					className = "text-sm text-red-600"
				>
					Delete
				</button>
			</div>
		</div>
	);
}