import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface YouTubeInputProps {
	onSubmit: (url: string) => void;
	isLoading?: boolean;
	error?: string;
}

export function YouTubeInput({
	onSubmit,
	isLoading = false,
	error,
}: YouTubeInputProps) {
	const [url, setUrl] = useState("");

	const isValidYouTubeUrl = (url: string): boolean => {
		const regex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
		return regex.test(url);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (url.trim() && isValidYouTubeUrl(url.trim())) {
			onSubmit(url.trim());
		}
	};

	const isValid = url.trim() === "" || isValidYouTubeUrl(url.trim());

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>YouTube Chat</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Input
							type="url"
							placeholder="Enter YouTube URL (e.g., https://youtube.com/watch?v=...)"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							className={!isValid ? "border-red-500" : ""}
							disabled={isLoading}
						/>
						{!isValid && (
							<p className="text-sm text-red-600">
								Please enter a valid YouTube URL
							</p>
						)}
						{error && <p className="text-sm text-red-600">{error}</p>}
					</div>
					<Button
						type="submit"
						disabled={!url.trim() || !isValid || isLoading}
						className="w-full"
					>
						{isLoading ? "Loading transcript..." : "Load Video"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
