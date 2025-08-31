import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { serverApi } from "../lib/api";
import type { ChatMessage } from "../components/ChatInterface";

export function useChat() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);

	const parseResponse = (response: string, fallbackTimestamps?: number[]) => {
		try {
			const parsed = JSON.parse(response);
			if (parsed && typeof parsed === 'object' && parsed.answer) {
				return {
					content: parsed.answer,
					timestamps: parsed.timestamps || fallbackTimestamps || [],
				};
			}
		} catch (e) {
			// If parsing fails, treat as plain text
		}
		
		// Fallback to original response as plain text
		return {
			content: response,
			timestamps: fallbackTimestamps || [],
		};
	};

	const chatMutation = useMutation({
		mutationFn: ({
			videoId,
			question,
		}: { videoId: string; question: string }) =>
			serverApi.sendChatMessage(videoId, question),
		onSuccess: (data) => {
			if (data.success) {
				const { content, timestamps } = parseResponse(data.response, data.timestamps);
				setMessages((prev) => [
					...prev,
					{
						id: Date.now().toString(),
						type: "assistant",
						content,
						timestamps,
					},
				]);
			} else {
				setMessages((prev) => [
					...prev,
					{
						id: Date.now().toString(),
						type: "assistant",
						content:
							data.error ||
							"Sorry, I encountered an error while processing your question.",
					},
				]);
			}
		},
		onError: () => {
			setMessages((prev) => [
				...prev,
				{
					id: Date.now().toString(),
					type: "assistant",
					content:
						"Sorry, I encountered an error while processing your question.",
				},
			]);
		},
	});

	const handleSendMessage = (message: string, videoId: string) => {
		const userMessage: ChatMessage = {
			id: Date.now().toString(),
			type: "user",
			content: message,
		};
		setMessages((prev) => [...prev, userMessage]);

		chatMutation.mutate({
			videoId,
			question: message,
		});
	};

	const clearMessages = () => {
		setMessages([]);
	};

	return {
		messages,
		chatMutation,
		handleSendMessage,
		clearMessages,
	};
}