import type { TCommandKind } from './commands'

interface IVoicePanelProps
{
	enabled: boolean,
	onToggle: () => void,
	listening: boolean,
	awaiting: TCommandKind | null,
	heard: string,
	error: string | null
};

export default function VoicePanel({ enabled, onToggle, listening, awaiting, heard, error }: IVoicePanelProps)
{
	return (
		<div className = "flex flex-col gap-3">
			<button
				type = "button"
				role = "switch"
				aria-checked = {enabled}
				onClick = {onToggle}
				className = "flex min-h-12 w-full items-center justify-between rounded-[10px] border border-gray-300 px-4"
			>
				<span className = "font-medium">Voice commands</span>
				<span className = {`h-6 w-11 rounded-full p-0.5 ${enabled ? "bg-red-600" : "bg-gray-500"}`}>
					<span className = {`block size-5 rounded-full bg-white transition-transform ${enabled ? "translate-x-5" : ''}`}></span>
				</span>
				
			</button>

			{error && <p role = "alert" className = "text-sm text-red-700">{error}</p>}
			{listening && !awaiting && <p role = "status" className = "text-sm text-green-700">Listening...</p>}
			{
				awaiting &&
				<p role = "status" className = "text-sm font-medium text-green-700">
					{awaiting === 'add' ? 'Say your note...' : 'Say what to look for...'}
				</p>
			}
			{heard && <p className = "text-sm text-gray-600">Heard: {heard}</p>}
		
			<ul className = "list-disc pl-5 text-sm text-gray-700">
				<li>"Add new note" and then your text</li>
				<li>"Find note" and then what to look for</li>
			</ul>
		</div>
	);
}