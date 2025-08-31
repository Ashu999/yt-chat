import { useState } from "react";
import { ChatManager } from "./ChatManager";
import { TranscriptViewer } from "./TranscriptViewer";
import { StartOverButton } from "./StartOverButton";
import type { TranscriptResponse } from "../lib/api";

interface MainLayoutProps {
	currentVideo: TranscriptResponse;
	onTimestampClick: (timestamp: number) => void;
	onStartOver: () => void;
}

export function MainLayout({ currentVideo, onTimestampClick, onStartOver }: MainLayoutProps) {
	const [activeTimestamp, setActiveTimestamp] = useState<number | undefined>();

	const handleTimestampClick = (timestamp: number) => {
		setActiveTimestamp(timestamp);
		onTimestampClick(timestamp);
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<StartOverButton onStartOver={onStartOver} />
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<ChatManager
					currentVideo={currentVideo}
					onTimestampClick={handleTimestampClick}
				/>
				<TranscriptViewer
					transcript={currentVideo.transcript}
					onTimestampClick={handleTimestampClick}
					activeTimestamp={activeTimestamp}
				/>
			</div>
		</div>
	);
}