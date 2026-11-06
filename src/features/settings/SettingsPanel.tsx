import { useRef } from 'react'
import { useSettings } from './settingsStore'
import type { IVoiceSettings } from './settingsStore'
import { METER_MAX_RMS, useMicCheck } from './useMicCheck'
import { ArrowBackIcon } from '../../components/icons'

interface IField
{
	key: keyof IVoiceSettings,
	label: string,
	min: number,
	max: number,
	step: number,
	format: (value: number) => string,
	hint: string
};

const seconds = (ms: number) => `${(ms / 1000).toFixed(1)} s`;

const FIELDS: IField[] = [
	{
		key: 'startRms',
		label: 'Minimum voice level',
		min: 0.005,
		max: 0.1,
		step: 0.005,
		format: v => v.toFixed(3),
		hint: 'Raise it if background noise starts recordings.'
	},
	{
		key: 'silenceMs',
		label: 'Pause that ends a phrase',
		min: 300,
		max: 2000,
		step: 100,
		format: seconds,
		hint: 'How long you stay silent before a phrase is sent.'
	},
	{
		key: 'minSpeechMs',
		label: 'Shortest phrase',
		min: 200,
		max: 1000,
		step: 100,
		format: seconds,
		hint: 'Shorter sounds, like clicks, are ignored'
	},
	{
		key: 'maxSpeechMs',
		label: 'Longest phrase',
		min: 5000,
		max: 30000,
		step: 1000,
		format: seconds,
		hint: 'Long speech is cut and sent in parts.'
	},

];

interface ISettingsPanelProps
{
	onBack: () => void
};

export default function SettingsPanel({ onBack }: ISettingsPanelProps)
{
	const settings = useSettings();
	const [mic, micBarRef] = useMicCheck();
	const audioRef = useRef<HTMLAudioElement>(null);
	const markerLeft = Math.min(settings.startRms / METER_MAX_RMS, 1) * 100;

	return (
		<main className = "mx-auto flex max-w-xl flex-col gap-4 p-6">
			<div className = "flex items-center justify-between">
				<h1 className = "text-2xl font-semibold">Settings</h1>
				<button
					type = "button"
					onClick = {onBack}
					aria-label = "Back"
					className = "size-11 rounded-full border border-gray-300 text-lg flex items-center justify-center"
				>
					<ArrowBackIcon />
				</button>
			</div>

			<h2 className = "text-[15px] text-gray-700">Voice detection</h2>
			{
				FIELDS.map(f =>
				{
					const id = `settings-${f.key}`;
					return (
						<div key = {f.key}>
							<div className = "flex justify-between">
								<label htmlFor={id} className = "font-medium">{f.label}</label>
								<span className = "text-gray-700">{f.format(settings[f.key])}</span>
							</div>
							<input id = {id} type="range" min = {f.min} max = {f.max} step = {f.step}
								value = {settings[f.key]}
								onChange = {e => settings.update(f.key, Number(e.target.value))}
								className = "min-h-9 w-full accent-red-600"
							/>
							<p className = "text-gray-600">{f.hint}</p>
						</div>
					);
				})
			}

			<section className = "flex flex-col gap-2.5 border-t border-gray-200 pt-3.5">
				<h2 className = "text-[15px] text-gray-700">Microphone check</h2>
				<div>
					<div className = "mb-1.5 flex justify-between text-sm text-gray-700">
						<span>Input level</span>
						<span>marker = minimum voice level</span>
					</div>
					<div className = "relative h-3.5 rounded-full bg-gray-200">
						<div ref = {micBarRef} className = "h-3.5 w-0 rounded-full bg-gray-700"></div>
						<div
							className = "absolute -top-1 h-[22px] w-[3px] bg-red-600"
							style = {{left: `${markerLeft}%`}}
						></div>
					</div>
				</div>
				<div className = "flex gap-2">
					<button
						type = "button"
						onClick = {mic.start}
						disabled = {mic.status === 'recording'}
						className = "min-h-12 flex-1 rounded-[10px] bg-red-600 font-bold text-white disabled:opacity-50"
					>
						{mic.status === 'recording' ? 'Recording...' : 'Record 4 s test'}
					</button>
					<button
						type = "button"
						onClick = {() => void audioRef.current?.play()}
						disabled = {!mic.url}
						className = "min-h-12 flex-1 rounded-[10px] border-2 border-gray-900 font-bold disabled:opacity-40"
					>
						Play back
					</button>
				</div>
				<audio ref = {audioRef} src = {mic.url ?? undefined} />
				{mic.error &&  <p role = "alert" className = "text-sm text-red-700">{mic.error}</p>}
				{
					mic.peak !== null &&
					<p className = "text-sm text-gray-700">
						Your loudest moment: {mic.peak.toFixed(3)}. If it stays below the marker, lower the minimum level.
					</p>
				}
				<p className = "text-sm text-gray-600">Speak normally, then listen to yourself. Nothing leaves this device.</p>
			</section>
			<button
				type = "button"
				onClick = {settings.reset}
				className = "min-h-11 rounded-[10px] border border-gray-300"
			>
				Reset to defaults
			</button>
		</main>
	);
}