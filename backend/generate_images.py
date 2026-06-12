"""One-off script to generate hero images via Gemini Nano Banana and save to frontend/public/generated/."""
import asyncio
import base64
import os
from pathlib import Path
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv(Path(__file__).parent / ".env")
api_key = os.getenv("EMERGENT_LLM_KEY")

OUT_DIR = Path("/app/frontend/public/generated")
OUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPTS = {
    "hero_building": "A sleek cinematic 3D isometric mockup of an A-grade commercial office building resting on a floating glass platform. The building features sheer glass facades reflecting a soft sunset, surrounded by glowing data lines and financial charts circling the base. Premium, hyper-realistic, luxury tech aesthetic with deep navy blue (#0A2540) and emerald green (#10B981) ambient lighting. Clean white background.",
    "dashboard_mockup": "A futuristic clean financial dashboard interface floating in 3D space showing high-yield real estate investment charts, portfolio value, and IRR metrics. Soft glassmorphism UI elements, deep navy blue and emerald green accents, premium wealth management platform aesthetic. White background with subtle gradient.",
    "fractional_illustration": "An abstract premium 3D illustration showing a large commercial skyscraper being divided into glowing emerald green puzzle pieces or fractional cubes representing fractional ownership. Clean white background, luxury fintech styling, soft ambient occlusion shadows, navy blue accents.",
    "leverage_visual": "A stylized 3D visualization showing a stack of investment blocks being multiplied by a glowing emerald green lever. Represents financial leverage in real estate. Minimalist premium corporate aesthetic, white background, navy and green palette.",
}

async def gen_one(name: str, prompt: str):
    out_path = OUT_DIR / f"{name}.png"
    if out_path.exists():
        print(f"skip {name} (exists)")
        return
    chat = LlmChat(api_key=api_key, session_id=f"propverse-{name}", system_message="You are a premium visual designer.")
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    try:
        text, images = await chat.send_message_multimodal_response(UserMessage(text=prompt))
        if images:
            data = base64.b64decode(images[0]["data"])
            out_path.write_bytes(data)
            print(f"saved {name} ({len(data)} bytes)")
        else:
            print(f"no image for {name}")
    except Exception as e:
        print(f"error {name}: {e}")

async def main():
    for name, prompt in PROMPTS.items():
        await gen_one(name, prompt)

if __name__ == "__main__":
    asyncio.run(main())
