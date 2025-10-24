import json
import logging
import os
import re
from typing import Union

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

cors_origins = os.getenv("CORS_ORIGINS").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for transcripts (per session)
transcript_storage = {}

# Initialize Groq client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


class YouTubeURLRequest(BaseModel):
    url: str


class TranscriptEntry(BaseModel):
    text: str
    start: float
    duration: float


class TranscriptResponse(BaseModel):
    video_id: str
    title: str
    transcript: list[TranscriptEntry]
    success: bool
    error: str | None = None


class ChatRequest(BaseModel):
    video_id: str
    question: str


class ChatResponse(BaseModel):
    response: str
    timestamps: list[float]
    success: bool
    error: str | None = None


def extract_video_id(url: str) -> str:
    """Extract YouTube video ID from URL."""
    patterns = [
        r"(?:youtube\.com\/watch\?v=)([\w-]+)",
        r"(?:youtu\.be\/)([\w-]+)",
        r"(?:youtube\.com\/embed\/)([\w-]+)",
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)

    raise ValueError("Invalid YouTube URL")


@app.get("/")
def read_root() -> dict[str, str]:
    """Test endpoint."""
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None) -> dict[str, Union[int, str]]:
    """Test endpoint with input."""
    return {"item_id": item_id, "q": q}


@app.post("/api/transcript")
def get_transcript(request: YouTubeURLRequest) -> TranscriptResponse:
    """Extract transcript from YouTube video."""
    try:
        video_id = extract_video_id(request.url)

        # Create instance and fetch transcript
        ytt_api = YouTubeTranscriptApi()
        transcript_list = ytt_api.fetch(video_id, languages=["en"])

        # Convert to our format
        transcript = [
            TranscriptEntry(
                text=entry.text,
                start=entry.start,
                duration=entry.duration,
            )
            for entry in transcript_list.snippets
        ]

        # Store in memory (in real app, you'd use session management)
        transcript_storage[video_id] = transcript

        # For now, use video ID as title (in real app, you'd fetch video metadata)
        title = f"Video {video_id}"

        return TranscriptResponse(
            video_id=video_id,
            title=title,
            transcript=transcript,
            success=True,
        )

    except Exception as e:
        logger.error(
            f"Error extracting transcript for URL {request.url}: {e!s}",
            exc_info=True,
        )
        error_msg = str(e)
        if "No transcripts were found" in error_msg:
            error_msg = (
                "No transcript available for this video. Please try another video."
            )
        elif "Video unavailable" in error_msg:
            error_msg = "Video is unavailable or private."
        else:
            error_msg = (
                "Failed to extract transcript. Please check the URL and try again."
            )

        return TranscriptResponse(
            video_id="",
            title="",
            transcript=[],
            success=False,
            error=error_msg,
        )


@app.post("/api/chat")
def chat_with_video(request: ChatRequest) -> ChatResponse:
    """Process chat question about video."""
    try:
        # Get transcript from storage
        if request.video_id not in transcript_storage:
            return ChatResponse(
                response="",
                timestamps=[],
                success=False,
                error="Video transcript not found. Please load the video first.",
            )

        transcript = transcript_storage[request.video_id]

        # Create context from complete transcript
        context = "\n".join(
            [
                f"[{entry.start:.1f}s] {entry.text}"
                for entry in transcript
            ],
        )

        # Prepare prompt for Groq
        system_prompt = (
            "You are a helpful AI assistant that answers questions "
            "about YouTube video content.\n\n"
            "You will be provided with a video transcript that includes "
            "timestamps in the format [XX.Xs].\n\n"
            "When answering questions:\n"
            "1. Base your answers on the transcript content\n"
            "2. When referencing specific information, identify relevant timestamps\n"
            "3. Return your response in JSON format with:\n"
            '   - "answer": Your detailed answer to the question\n'
            '   - "timestamps": Array of relevant timestamp values '
            "(just numbers, like [45.2, 67.8])\n\n"
            "Be accurate and helpful. If the question cannot be answered "
            "from the transcript, say so."
        )

        user_prompt = f"""Video Transcript:
{context}

Question: {request.question}

Please provide your answer in JSON format."""

        # Call Groq API
        completion = groq_client.chat.completions.create(
            model="moonshotai/kimi-k2-instruct",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=1000,
        )

        response_text = completion.choices[0].message.content

        # Clean markdown code blocks if present
        cleaned_response = response_text.strip()
        if cleaned_response.startswith("```json"):
            # Remove ```json from start and ``` from end
            cleaned_response = cleaned_response[7:]  # Remove "```json"
            if cleaned_response.endswith("```"):
                cleaned_response = cleaned_response[:-3]  # Remove ending "```"
            cleaned_response = cleaned_response.strip()
        elif cleaned_response.startswith("```"):
            # Handle generic code blocks
            lines = cleaned_response.split('\n')
            if len(lines) > 2 and lines[-1].strip() == "```":
                cleaned_response = '\n'.join(lines[1:-1]).strip()

        # Try to parse JSON response
        try:
            parsed_response = json.loads(cleaned_response)
            answer = parsed_response.get("answer", cleaned_response)
            timestamps = parsed_response.get("timestamps", [])
        except json.JSONDecodeError as e:
            # Fallback if JSON parsing fails
            logger.warning(f"Failed to parse cleaned response as JSON: {e}. Cleaned response: {cleaned_response}")
            answer = cleaned_response
            timestamps = []

        return ChatResponse(
            response=answer,
            timestamps=timestamps,
            success=True,
        )

    except Exception as e:
        logger.error(f"Error processing chat request: {e!s}", exc_info=True)
        error_msg = str(e)
        if "API key" in error_msg.lower():
            error_msg = "AI service configuration error. Please check API keys."
        elif (
            "context" in error_msg.lower() 
            or "token" in error_msg.lower() 
            or "length" in error_msg.lower()
        ):
            error_msg = (
                "The video transcript is too long for processing. "
                "Please try asking about specific parts of the video."
            )
        else:
            error_msg = "Failed to process your question. Please try again."

        return ChatResponse(
            response="",
            timestamps=[],
            success=False,
            error=error_msg,
        )
