from abc import ABC, abstractmethod

from app.core.config import settings


class AIService(ABC):
    provider_name: str

    @abstractmethod
    async def summarize(self, title: str, content: str) -> str:
        raise NotImplementedError

    @abstractmethod
    async def questions(self, title: str, content: str) -> str:
        raise NotImplementedError


class MockAIService(AIService):
    provider_name = "mock"

    async def summarize(self, title: str, content: str) -> str:
        first_line = content.strip().splitlines()[0] if content.strip() else title
        return f"{title}: {first_line[:160]}"

    async def questions(self, title: str, content: str) -> str:
        _ = content
        return "\n".join(
            [
                f"1. {title}의 핵심 개념은 무엇인가?",
                "2. 직접 구현할 때 확인해야 할 조건은 무엇인가?",
                "3. 다음 학습에서 보완할 점은 무엇인가?",
            ]
        )


class OpenAITextService(AIService):
    provider_name = "openai"

    async def _generate(self, instruction: str, title: str, content: str) -> str:
        if not settings.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY is required when AI_PROVIDER=openai")

        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=settings.openai_api_key)
        response = await client.responses.create(
            model=settings.openai_model,
            instructions=instruction,
            input=f"제목: {title}\n\n본문:\n{content}",
        )
        return response.output_text

    async def summarize(self, title: str, content: str) -> str:
        return await self._generate("학습노트를 5문장 이하로 요약한다.", title, content)

    async def questions(self, title: str, content: str) -> str:
        return await self._generate("학습 확인 질문 3개를 번호 목록으로 작성한다.", title, content)


def get_ai_service() -> AIService:
    if settings.ai_provider == "openai":
        return OpenAITextService()
    return MockAIService()

