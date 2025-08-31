import { useQuery } from "@tanstack/react-query";
import { serverApi } from "./lib/api";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { VideoManager } from "./components/VideoManager";
import { MainLayout } from "./components/MainLayout";
import Header from "./components/Header";
import { useVideoTranscript } from "./hooks/useVideoTranscript";
import { useChat } from "./hooks/useChat";

function App() {
	const { currentVideo, handleStartOver, transcriptMutation, handleVideoSubmit } = useVideoTranscript();
	const { clearMessages } = useChat();

	// Health check
	const { error: healthError } = useQuery({
		queryKey: ["health"],
		queryFn: serverApi.getHealth,
		retry: 3,
		retryDelay: 1000,
	});

	const handleTimestampClick = (timestamp: number) => {
		console.log("Navigate to timestamp:", timestamp);
	};

	const onStartOver = () => {
		handleStartOver();
		clearMessages();
	};

	if (healthError) {
		return <ErrorDisplay healthError={healthError} itemError={null} />;
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />
			<div className="container mx-auto px-4 py-8">
				{!currentVideo ? (
					<VideoManager 
						onSubmit={handleVideoSubmit}
						isLoading={transcriptMutation.isPending}
						error={
							transcriptMutation.isError ||
							(transcriptMutation.data && !transcriptMutation.data.success)
								? transcriptMutation.data?.error ||
								"Failed to load transcript"
								: undefined
						}
					/>
				) : (
					<MainLayout
						currentVideo={currentVideo}
						onTimestampClick={handleTimestampClick}
						onStartOver={onStartOver}
					/>
				)}
			</div>
		</div>
	);
}

export default App;
