import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { type TranscriptEntry } from "../lib/api";

interface TranscriptViewerProps {
	transcript: TranscriptEntry[];
	onTimestampClick?: (timestamp: number) => void;
}

export function TranscriptViewer({
	transcript,
	onTimestampClick,
}: TranscriptViewerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const filteredTranscript = transcript.filter((entry) =>
		entry.text.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<Card>
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CollapsibleTrigger asChild>
					<CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<h3 className="font-semibold text-lg">Transcript</h3>
								<Badge variant="secondary" className="text-xs">
									{transcript.length} entries
								</Badge>
							</div>
							<ChevronDown
								className={`h-5 w-5 transition-transform duration-200 ${
									isOpen ? "rotate-180" : ""
								}`}
							/>
						</div>
					</CardHeader>
				</CollapsibleTrigger>
				
				<CollapsibleContent>
					<CardContent className="pt-0">
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
						<ScrollArea className="h-80">
							<div className="space-y-3">
								{filteredTranscript.length === 0 ? (
									<div className="text-center text-muted-foreground py-8">
										{searchQuery ? "No matching entries found" : "No transcript available"}
									</div>
								) : (
									filteredTranscript.map((entry, index) => (
										<div
											key={`${entry.start}-${index}`}
											className="group p-3 rounded-lg border hover:bg-muted/50 transition-colors"
										>
											<div className="flex items-start gap-3">
												<Badge
													variant="outline"
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
									))
								)}
							</div>
						</ScrollArea>
					</CardContent>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
}