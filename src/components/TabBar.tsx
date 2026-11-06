import type { KeyboardEvent } from 'react'

export interface ITab<T extends string>
{
	id: T,
	label: string
};

interface ITabBarProps<T extends string>
{
	tabs: ITab<T>[],
	active: T,
	onChange: (id: T) => void
};

export default function TabBar<T extends string>({ tabs, active, onChange }: ITabBarProps<T>)
{
	const handleKeyDown = (e: KeyboardEvent, index: number) =>
	{
		if(e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
		const step = e.key === 'ArrowLeft' ? -1 : 1;
		const next = tabs[(index + step + tabs.length) % tabs.length];
		onChange(next.id);
		document.getElementById(`tab-${next.id}`)?.focus();
	};

	return (
		<div
			role = "tablist"
			aria-label = "Sections"
			className = "flex gap-2 rounded-xl bg-gray-100 p-1"
		>
			{
				tabs.map((tab, index) =>
				{
					const selected = tab.id === active
					return (
						<button
							key = {tab.id}
							id = {`tab-${tab.id}`}
							type = "button"
							role = "tab"
							aria-selected = {selected}
							aria-controls = {`panel-${tab.id}`}
							tabIndex = {selected ? 0 : -1}
							onClick = {() => onChange(tab.id)}
							onKeyDown = {e => handleKeyDown(e, index)}
							className = {`min-h-11 flex-1 rounded-[9px] outline-none ${selected ? 'bg-white font-bold text-gray-900' : 'text-gray-700'}`}
						>
							{tab.label}
						</button>
					)
				})
			}
		</div>
	);
}