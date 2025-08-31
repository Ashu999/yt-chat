import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { type TranscriptEntry } from "../lib/api";

interface TranscriptViewerProps {
	transcript: TranscriptEntry[];
	onTimestampClick?: (timestamp: number) => void;
	activeTimestamp?: number;
}

export function TranscriptViewer({
	transcript,
	onTimestampClick,
	activeTimestamp,
}: TranscriptViewerProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const entryRefs = useRef<{ [key: number]: HTMLDivElement }>({});

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const filteredTranscript = transcript.filter((entry) =>
		entry.text.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Scroll to active timestamp when it changes
	useEffect(() => {
		if (activeTimestamp !== undefined && entryRefs.current[activeTimestamp]) {
			entryRefs.current[activeTimestamp].scrollIntoView({
				behavior: 'smooth',
				block: 'center'
			});
		}
	}, [activeTimestamp]);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-2">
					<CardTitle>Transcript</CardTitle>
					<Badge variant="secondary" className="text-xs">
						{transcript.length} entries
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				{/* Search */}
				<div className="mb-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search transcript..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
					{searchQuery && (
						<p className="text-sm text-muted-foreground mt-2">
							{filteredTranscript.length} of {transcript.length} entries match
						</p>
					)}
				</div>

				{/* Transcript Entries */}
				<ScrollArea className="h-[calc(96vh-400px)] min-h-80" ref={scrollAreaRef}>
					<div className="space-y-3">
						{filteredTranscript.length === 0 ? (
							<div className="text-center text-muted-foreground py-8">
								{searchQuery ? "No matching entries found" : "No transcript available"}
							</div>
						) : (
							filteredTranscript.map((entry, index) => {
								const isActive = activeTimestamp === entry.start;
								return (
									<div
										key={`${entry.start}-${index}`}
										ref={(el) => {
											if (el) entryRefs.current[entry.start] = el;
										}}
										className={`group p-3 rounded-lg border transition-colors ${isActive
												? "bg-primary/10 border-primary/30"
												: "hover:bg-muted/50"
											}`}
									>
										<div className="flex items-start gap-3">
											<Badge
												variant={isActive ? "default" : "outline"}
												className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs flex-shrink-0 mt-0.5"
												onClick={() => onTimestampClick?.(entry.start)}
											>
												{formatTime(entry.start)}
											</Badge>
											<p className="text-sm leading-relaxed flex-1">
												{searchQuery ? (
													<span
														dangerouslySetInnerHTML={{
															__html: entry.text.replace(
																new RegExp(`(${searchQuery})`, "gi"),
																"<mark class='bg-yellow-200 dark:bg-yellow-900 px-1 rounded'>$1</mark>"
															),
														}}
													/>
												) : (
													entry.text
												)}
											</p>
										</div>
									</div>
								);
							})
						)}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}