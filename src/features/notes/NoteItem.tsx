import type { TNoteWithScore } from '../../lib/similarity'
import { useState } from 'react'
import NoteItemReadable from './NoteItemReadable'
import NoteItemEditable from './NoteItemEditable'

interface INoteItemProps
{
	note: TNoteWithScore,
	onDelete: (id: number) => void,
	onUpdate: (id: number, title: string, text: string) => void
};

export default function NoteItem({ note, onDelete, onUpdate }: INoteItemProps)
{
	const [isEditing, setIsEditing] = useState(false)
	const toggleEditing = () => setIsEditing(prev => !prev)

	return (
		<li className = "flex items-start justify-between gap-4 border-b border-gray-200 py-3">
			{!isEditing && <NoteItemReadable note = {note} onDelete = {onDelete} onToggleState = {toggleEditing} />}
			{isEditing && <NoteItemEditable note = {note} onUpdate = {onUpdate} onToggleState = {toggleEditing} />}
		</li>
	);
}