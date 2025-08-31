import { env } from "../env";

const API_BASE_URL = env.VITE_SERVER_URL || "http://localhost:8000";

export interface ApiResponse<T> {
	data: T;
	success: boolean;
	error?: string;
}

class ApiClient {
	private baseUrl: string;

	constructor(baseUrl: string = API_BASE_URL) {
		this.baseUrl = baseUrl;
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {},
	): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;

		const config: RequestInit = {
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
			...options,
		};

		try {
			const response = await fetch(url, config);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error("API request failed:", error);
			throw error;
		}
	}

	async get<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, { method: "GET" });
	}

	async post<T>(endpoint: string, data?: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: "POST",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async put<T>(endpoint: string, data?: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: "PUT",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async delete<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, { method: "DELETE" });
	}
}

export const apiClient = new ApiClient();

export interface TranscriptEntry {
	text: string;
	start: number;
	duration: number;
}

export interface TranscriptResponse {
	video_id: string;
	title: string;
	transcript: TranscriptEntry[];
	success: boolean;
	error?: string;
}

export interface ChatRequest {
	video_id: string;
	question: string;
}

export interface ChatResponse {
	response: string;
	timestamps: number[];
	success: boolean;
	error?: string;
}

export const serverApi = {
	getHealth: () => apiClient.get<{ Hello: string }>("/"),
	getItem: (itemId: number, q?: string) =>
		apiClient.get<{ item_id: number; q: string | null }>(
			`/items/${itemId}${q ? `?q=${q}` : ""}`,
		),
	getTranscript: (url: string) =>
		apiClient.post<TranscriptResponse>("/api/transcript", { url }),
	sendChatMessage: (videoId: string, question: string) =>
		apiClient.post<ChatResponse>("/api/chat", { video_id: videoId, question }),
};
