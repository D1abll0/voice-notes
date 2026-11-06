import { useSyncExternalStore } from 'react'

export type TView = 'notes' | 'settings';

function subscribe(onChange: () => void)
{
	window.addEventListener('hashchange', onChange);
	return () => window.removeEventListener('hashchange', onChange);
}

export function useView(): [TView, (next: TView) => void]
{
	const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => '');
	const view: TView = hash === '#settings' ? 'settings' : 'notes';
	const setView = (next: TView) =>
	{
		window.location.hash = next === 'settings' ? 'settings' : '';
	};

	return [view, setView];
}