import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Send } from "lucide-react";

export interface ChatMessage {
	id: string;
	type: "user" | "assistant";
	content: string;
	timestamps?: number[];
}

export interface VideoInfo {
	title: string;
	duration?: number;
	url: string;
}

interface ChatInterfaceProps {
	videoInfo: VideoInfo;
	messages: ChatMessage[];
	onSendMessage: (message: string) => void;
	isLoading?: boolean;
	onTimestampClick?: (timestamp: number) => void;
}

export function ChatInterface({
	videoInfo,
	messages,
	onSendMessage,
	isLoading = false,
	onTimestampClick,
}: ChatInterfaceProps) {
	const [inputMessage, setInputMessage] = useState("");
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputMessage.trim() && !isLoading) {
			onSendMessage(inputMessage.trim());
			setInputMessage("");
		}
	};

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	});

	return (
		<div className="w-full max-w-4xl mx-auto space-y-4">
			{/* Video Info Header */}
			<Card>
				<CardContent className="pt-4">
					<div className="flex items-center gap-3">
						<div className="w-3 h-3 bg-green-500 rounded-full" />
						<div>
							<h3 className="font-semibold text-lg">{videoInfo.title}</h3>
							<p className="text-sm text-muted-foreground">
								{videoInfo.duration &&
									`Duration: ${formatTime(videoInfo.duration)}`}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Chat Messages */}
			<Card className="flex-1">
				<CardHeader>
					<CardTitle>Chat</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<ScrollArea className="h-96 px-4">
						<div className="space-y-4 py-4" ref={scrollAreaRef}>
							{messages.length === 0 ? (
								<div className="text-center text-muted-foreground py-8">
									Ask any question about the video content
								</div>
							) : (
								messages.map((message) => (
									<div
										key={message.id}
										className={`flex gap-3 ${
											message.type === "user" ? "justify-end" : "justify-start"
										}`}
									>
										{message.type === "assistant" && (
											<Avatar className="w-8 h-8 mt-1">
												<AvatarFallback>AI</AvatarFallback>
											</Avatar>
										)}
										<div
											className={`max-w-[80%] rounded-lg p-3 ${
												message.type === "user"
													? "bg-primary text-primary-foreground ml-auto"
													: "bg-muted"
											}`}
										>
											<p className="text-sm leading-relaxed">
												{message.content}
											</p>
											{message.timestamps && message.timestamps.length > 0 && (
												<div className="flex flex-wrap gap-1 mt-2">
													{message.timestamps.map((timestamp) => (
														<Badge
															key={timestamp}
															variant="secondary"
															className="cursor-pointer hover:bg-secondary/80 text-xs"
															onClick={() => onTimestampClick?.(timestamp)}
														>
															{formatTime(timestamp)}
														</Badge>
													))}
												</div>
											)}
										</div>
										{message.type === "user" && (
											<Avatar className="w-8 h-8 mt-1">
												<AvatarFallback>U</AvatarFallback>
											</Avatar>
										)}
									</div>
								))
							)}
							{isLoading && (
								<div className="flex gap-3 justify-start">
									<Avatar className="w-8 h-8 mt-1">
										<AvatarFallback>AI</AvatarFallback>
									</Avatar>
									<div className="bg-muted rounded-lg p-3 max-w-[80%]">
										<div className="flex space-x-1">
											<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
											<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
											<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
										</div>
									</div>
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>
					</ScrollArea>

					{/* Message Input */}
					<div className="border-t p-4">
						<form onSubmit={handleSubmit} className="flex gap-2">
							<Input
								placeholder="Ask a question about the video..."
								value={inputMessage}
								onChange={(e) => setInputMessage(e.target.value)}
								disabled={isLoading}
								className="flex-1"
							/>
							<Button
								type="submit"
								disabled={!inputMessage.trim() || isLoading}
								size="sm"
							>
								<Send className="w-4 h-4" />
							</Button>
						</form>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
