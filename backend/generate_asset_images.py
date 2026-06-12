"""Generate 8 hyper-real A-grade commercial real estate hero images via Gemini Nano Banana."""
import asyncio, base64, os
from pathlib import Path
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv(Path(__file__).parent / ".env")
api_key = os.getenv("EMERGENT_LLM_KEY")

OUT_DIR = Path("/app/frontend/public/generated/assets")
OUT_DIR.mkdir(parents=True, exist_ok=True)

BASE = "Hyper-realistic premium commercial real estate cinematic exterior photograph. Glass-facade A-grade office tower, golden hour sunlight, glossy reflective windows, manicured landscaping, sharp architectural lines, very polished investor-grade visual. Wide cinematic 16:9 framing, depth of field, cinematic color grade, navy + emerald accent lighting, premium fintech aesthetic. No people, no text, no logos, no watermarks."

PROMPTS = {
    "opp-blr-grade-a":
        f"{BASE} Setting: Bengaluru ORR business park with palm-lined boulevard, modernist mid-rise A-grade office building, evening twilight blue sky.",
    "opp-pune-premium":
        f"{BASE} Setting: Pune Kharadi IT corridor, sleek 12-storey premium commercial tower with glass curtain wall, late afternoon warm light.",
    "opp-hyd-tower":
        f"{BASE} Setting: Hyderabad Hitec City supertall 30-storey office tower, neon city backdrop, dusk skyline with light trails.",
    "opp-ncr-business-park":
        f"{BASE} Setting: Gurugram NCR pre-leased business park campus, multiple connected glass low-rises, dramatic dawn sky.",
    "opp-bkc-skyline":
        f"{BASE} Setting: Mumbai BKC marquee trophy tower, premium curtain wall facade, harbor view in distance, blue golden-hour light.",
    "opp-chen-marina":
        f"{BASE} Setting: Chennai OMR IT park with modern square office block and lush greenery, soft tropical evening light.",
    "opp-orr-prism":
        f"{BASE} Setting: Bengaluru ORR Prism prismatic angular glass office tower with sharp geometric facade, golden hour glow.",
    "opp-leverage-alpha":
        f"{BASE} Setting: Pan-India diversified portfolio aerial composite, cinematic skyline collage with three premium office towers in muted gradient, dusk cinematic.",
}

async def gen_one(name: str, prompt: str):
    out_path = OUT_DIR / f"{name}.png"
    if out_path.exists():
        print(f"skip {name} (exists)")
        return
    chat = LlmChat(api_key=api_key, session_id=f"pv-asset-{name}", system_message="You are a premium visual designer.")
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
