import { useOnlineStatus } from '../../lib/useOnlineStatus'

export default function PrivacyBadge()
{
	const online = useOnlineStatus();
	return (
		<p className = "text-sm text-gray-600">
			<span>Audio and notes stay in your browser</span>
			{!online && <span className = "ml-2 font-medium text-green-700">Offline Mode</span>}
		</p>
	);
}