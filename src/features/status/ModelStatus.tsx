import { useAiStore } from '../../store/aiStore'

export default function ModelStatus()
{
	const { status, progress, device, error } = useAiStore();

	if(status === 'error') return <p className = "text-sm text-red-600">Model error: {error}</p>;
	if(status === 'loading')
	{
		return (
			<p className="text-sm text-gray-500">
				Speech model {progress.speech}% · Search model {progress.search}%
			</p>
		);
	}
	if(status === 'ready') return <p className = "text-sm text-green-600">Model ready ({device})</p>;
	return null;
}