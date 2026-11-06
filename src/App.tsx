import { useEffect, useState, useRef } from 'react'
import { loadModel } from './ai/aiClient'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db/db'
import { deleteNote } from './db/notesRepo'
import { createNote, editNote } from './features/notes/noteService'
import { useSemanticSearch } from './features/search/useSemanticSearch'
import { useBackfillEmbeddings } from './features/notes/useBackfillEmbeddings'
import NoteForm from './features/notes/NoteForm'
import NoteList from './features/notes/NoteList'
import RecorderPanel from './features/recorder/RecorderPanel'
import ModelStatus from './features/status/ModelStatus'
import SearchBox from './features/search/SearchBox'
import PrivacyBadge from './features/status/PrivacyBadge'
import useVoiceCommands from './features/voice/useVoiceCommands'
import SettingsPanel from './features/settings/SettingsPanel'
import { SettingsIcon } from './components/icons'
import { useView } from './lib/useView'
import TabBar from './components/TabBar'
import type { ITab } from './components/TabBar'
import VoicePanel from './features/voice/VoicePanel'

type TTab = 'notes' | 'search' | 'voice';

export default function App()
{
	const notes = useLiveQuery(() => db.notes.orderBy('createdAt').reverse().toArray());

	useBackfillEmbeddings(notes);

	const [query, setQuery] = useState('');
	const [undo, setUndo] = useState<{ id: number, text: string } | null>(null);
	const [tab, setTab] = useState<TTab>('notes');
	const [voiceEnabled, setVoiceEnabled] = useState(false);

	const search = useSemanticSearch(query, notes);

	const undoTimer = useRef<number | undefined>(undefined);
	const handleVoiceAdd = async (text: string) =>
	{
		const id = await createNote({ text, origin: 'voice' });
		setUndo({ id, text });
		window.clearTimeout(undoTimer.current);
		undoTimer.current = window.setTimeout(() => setUndo(null), 6000);
	};

	const tabs: ITab<TTab>[] = [
		{id: 'notes', label: 'Notes'},
		{id: 'search', label: 'Search'},
		{id: 'voice', label: voiceEnabled ? 'Voice: On' : 'Voice: Off'},
	];

	const [view, setView] = useView();
	const voice = useVoiceCommands(voiceEnabled && view === 'notes', {
		onAdd: text => void handleVoiceAdd(text),
		onSearch: text =>
		{
			setQuery(text);
			setTab('search');
		}
	});

	useEffect(() =>
	{
		loadModel();
	}, []);

	if( view === 'settings') return <SettingsPanel onBack = {() => window.history.back()} />

	return (
		<main className = "mx-auto max-w-xl space-y-6 p-6">
			<div className = "flex items-center justify-between">
				<h1 className = "text-2xl font-semibold">Voice Notes</h1>
				<button
					type = "button"
					aria-label = "Settings"
					onClick = {() => setView('settings')}
					className = "size-11 rounded-full border border-gray-300 flex items-center justify-center"
				>
					<SettingsIcon size = {24}/>
				</button>
			</div>

			<ModelStatus />
			<PrivacyBadge />
			<RecorderPanel />

			<TabBar tabs = {tabs} active = {tab} onChange = {setTab}/>

			{
				undo &&
				<p role = "status" className = "text-sm">
					Added "{undo.text}"
					<button
						type = "button"
						className = "underline"
						onClick = {() => 
						{
							void deleteNote(undo.id);
							setUndo(null);
						}}
					>
						Undo
					</button>
				</p>
			}

			<section
				id = "panel-notes"
				role = "tabpanel"
				aria-labelledby = "tab-notes"
				hidden = {tab !== 'notes'}
			>
				<div className = "flex flex-col gap-4">
					<NoteForm onAdd = {({title, text}) => void createNote({ title, text })} />
					<NoteList notes = {notes} onDelete = {deleteNote} onUpdate = {editNote} />
				</div>
			</section>

			<section
				id = "panel-search"
				role = "tabpanel"
				aria-labelledby = "tab-search"
				hidden = {tab !== 'search'}
			>
				<div className = "flex flex-col gap-3">
					<SearchBox value = {query} onChange = {setQuery} />
					{
						search.active && <p className = "text-sm text-gray-600">Results match by words and by meaning.</p>
					}
					{
						search.active 
						? (
							<>
								{search.loading && <p className = "text-sm text-gray-500">Looking for related notes…</p>}
								{search.failed && <p className = "text-sm text-red-500">Search by meaning is unavailable. Showing exact matches only.</p>}
								<NoteList
									notes = {search.matches}
									emptyMessage = {search.loading ? '' : "No matching notes."}
									onDelete = {deleteNote}
									onUpdate = {editNote}
								/>
							</>
						)
						: ( <NoteList notes = {notes} onDelete = {deleteNote} onUpdate = {editNote} /> )
					}
				</div>
			</section>

			<section
				id = "panel-voice"
				role = "tabpanel"
				aria-labelledby = "tab-voice"
				hidden = {tab !== 'voice'}
			>
				<VoicePanel
					enabled = {voiceEnabled}
					onToggle = {() => setVoiceEnabled(prev => !prev)}
					listening = {voice.listening}
					awaiting = {voice.awaiting}
					heard = {voice.heard}
					error = {voice.error}
				/>
			</section>
		</main>
	);
}