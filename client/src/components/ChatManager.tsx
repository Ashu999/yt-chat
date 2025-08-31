import { ChatInterface } from "./ChatInterface";
import { useChat } from "../hooks/useChat";
import type { TranscriptResponse } from "../lib/api";

interface ChatManagerProps {
	currentVideo: TranscriptResponse;
	onTimestampClick: (timestamp: number) => void;
}

export function ChatManager({ currentVideo, onTimestampClick }: ChatManagerProps) {
	const { messages, chatMutation, handleSendMessage } = useChat();

	const onSendMessage = (message: string) => {
		handleSendMessage(message, currentVideo.video_id);
	};

	return (
		<ChatInterface
			videoInfo={{
				title: currentVideo.title,
				url: "",
				duration:
					currentVideo.transcript.length > 0
						? Math.max(
							...currentVideo.transcript.map(
								(t) => t.start + t.duration,
							),
						)
						: undefined,
			}}
			messages={messages}
			onSendMessage={onSendMessage}
			isLoading={chatMutation.isPending}
			onTimestampClick={onTimestampClick}
		/>
	);
}