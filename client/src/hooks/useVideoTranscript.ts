import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { serverApi, type TranscriptResponse } from "../lib/api";

export function useVideoTranscript() {
	const [currentVideo, setCurrentVideo] = useState<TranscriptResponse | null>(
		null,
	);

	const transcriptMutation = useMutation({
		mutationFn: serverApi.getTranscript,
		onSuccess: (data) => {
			if (data.success) {
				setCurrentVideo(data);
			}
		},
	});

	const handleVideoSubmit = (url: string) => {
		transcriptMutation.mutate(url);
	};

	const handleStartOver = () => {
		setCurrentVideo(null);
	};

	return {
		currentVideo,
		transcriptMutation,
		handleVideoSubmit,
		handleStartOver,
	};
}