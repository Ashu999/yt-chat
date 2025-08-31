interface StartOverButtonProps {
	onStartOver: () => void;
}

export function StartOverButton({ onStartOver }: StartOverButtonProps) {
	return (
		<button
			type="button"
			onClick={onStartOver}
			className="text-sm text-muted-foreground hover:text-foreground"
		>
			← Start over
		</button>
	);
}