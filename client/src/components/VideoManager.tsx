import { YouTubeInput } from "./YouTubeInput";

interface VideoManagerProps {
	onSubmit: (url: string) => void;
	isLoading: boolean;
	error?: string;
}

export function VideoManager({ onSubmit, isLoading, error }: VideoManagerProps) {
	return (
		<div className="max-w-2xl mx-auto">
			<YouTubeInput
				onSubmit={onSubmit}
				isLoading={isLoading}
				error={error}
			/>
		</div>
	);
}