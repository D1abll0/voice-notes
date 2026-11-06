interface IIconProp
{
	size?: number
};

const base = {
	fill: 'currentColor',
	'aria-hidden': true,
	viewBox: '0 0 24 24'
} as const;

export function MicIcon({ size = 40 }: IIconProp)
{
	return (
		<svg {...base} width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
			<rect x="9" y="3" width="6" height="11" rx="3" />
			<path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
		</svg>
	);
}

export function StopIcon({ size = 32 }: IIconProp)
{
	return (
		<svg {...base} width={size} height={size}>
			<rect x="6" y="6" width="12" height="12" rx="2" />
		</svg>
	);
}

export function PauseIcon({ size = 22 }: IIconProp)
{
	return (
		<svg {...base} width={size} height={size}>
			<rect x="6" y="5" width="4" height="14" rx="1" />
			<rect x="14" y="5" width="4" height="14" rx="1" />
		</svg>
	);
}

export function PlayIcon({ size = 22 }: IIconProp)
{
	return (
		<svg {...base} width={size} height={size}>
			<path d="M8 5v14l11-7z" />
		</svg>
	);
}

export function SettingsIcon({ size = 24 }: IIconProp)
{
	return (
		<svg {...base} width={size} height={size} viewBox="0 0 640 640">
			<path d="M64 480C64 475.6 67.6 472 72 472L160.5 472C164.4 440.4 191.4 416 224 416C256.6 416 283.6 440.4 287.5 472L568 472C572.4 472 576 475.6 576 480C576 484.4 572.4 488 568 488L287.5 488C283.6 519.6 256.6 544 224 544C191.4 544 164.4 519.6 160.5 488L72 488C67.6 488 64 484.4 64 480zM272 480C272 453.5 250.5 432 224 432C197.5 432 176 453.5 176 480C176 506.5 197.5 528 224 528C250.5 528 272 506.5 272 480zM464 320C464 293.5 442.5 272 416 272C389.5 272 368 293.5 368 320C368 346.5 389.5 368 416 368C442.5 368 464 346.5 464 320zM416 256C448.6 256 475.6 280.4 479.5 312L568 312C572.4 312 576 315.6 576 320C576 324.4 572.4 328 568 328L479.5 328C475.6 359.6 448.6 384 416 384C383.4 384 356.4 359.6 352.5 328L72 328C67.6 328 64 324.4 64 320C64 315.6 67.6 312 72 312L352.5 312C356.4 280.4 383.4 256 416 256zM256 112C229.5 112 208 133.5 208 160C208 186.5 229.5 208 256 208C282.5 208 304 186.5 304 160C304 133.5 282.5 112 256 112zM319.5 152L568 152C572.4 152 576 155.6 576 160C576 164.4 572.4 168 568 168L319.5 168C315.6 199.6 288.6 224 256 224C223.4 224 196.4 199.6 192.5 168L72 168C67.6 168 64 164.4 64 160C64 155.6 67.6 152 72 152L192.5 152C196.4 120.4 223.4 96 256 96C288.6 96 315.6 120.4 319.5 152z"/>
		</svg>
	);
}

export function ArrowBackIcon({ size = 24 }: IIconProp)
{
	return (
		<svg {...base} width={size} height={size} viewBox="0 0 640 640">
			<path d="M34.3 314.3C31.2 317.4 31.2 322.5 34.3 325.6L186.3 477.6C189.4 480.7 194.5 480.7 197.6 477.6C200.7 474.5 200.7 469.4 197.6 466.3L59.3 328L600 328C604.4 328 608 324.4 608 320C608 315.6 604.4 312 600 312L59.3 312L197.7 173.7C200.8 170.6 200.8 165.5 197.7 162.4C194.6 159.3 189.5 159.3 186.4 162.4L34.4 314.4z"/>
		</svg>
	);
}