import { useEffect, useRef, useState } from 'react'
import { transcribeSpeech } from './speech'
import { parseCommand } from './commands'
import type { TCommandKind } from './commands'
import { useSpeechSegments } from './useSpeechSegments'

const AWAIT_TIMEOUT_MS = 10_000;
const MAX_IN_FLIGHT = 2;

interface IVoiceHandlers
{
	onAdd: (text: string) => void,
	onSearch: (text: string) => void,
};

export default function useVoiceCommands(enabled: boolean, handlers: IVoiceHandlers)
{
	const [awaiting, setAwaiting] = useState<TCommandKind | null>(null);
	const [heard, setHeard] = useState('');

	const awaitingRef = useRef<TCommandKind | null>(null);
	const inFlight = useRef(0);
	const timer = useRef<number | undefined>(undefined);
	const handlersRef = useRef(handlers);

	useEffect(() =>
	{
		handlersRef.current = handlers;
	});

	useEffect(() =>
	{
		return () => window.clearTimeout(timer.current)
	}, []);

	function setAwaitingState(kind: TCommandKind | null)
	{
		awaitingRef.current = kind;
		setAwaiting(kind);
		window.clearTimeout(timer.current);
		if(kind)
			timer.current = window.setTimeout(() => setAwaitingState(null), AWAIT_TIMEOUT_MS);
	}

	async function handleSegment(audio: Float32Array)
	{
		if(inFlight.current >= MAX_IN_FLIGHT) return;
		inFlight.current++;

		try
		{
			const transcript = (await transcribeSpeech(audio));
			if(!transcript) return
			setHeard(transcript);

			const command = parseCommand(transcript);
			const kind = command?.kind ?? awaitingRef.current;
			const text = command ? command.text : transcript;
			if(!kind) return;

			if(!text)
			{
				setAwaitingState(kind);
				return;
			}

			setAwaitingState(null);

			
			switch(kind)
			{
				case 'add':
					handlersRef.current.onAdd(text);
					break;
				case 'search':
					handlersRef.current.onSearch(text);
					break;
			}
		}
		catch(error)
		{
			console.error(`[Error] ${error}`);
		}
		finally{ inFlight.current--; }
	}

	const { listening, error } = useSpeechSegments(enabled, handleSegment);

	return { listening, error, awaiting, heard };
}