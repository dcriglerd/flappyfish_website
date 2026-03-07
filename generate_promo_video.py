import os
import sys
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath(''))

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

# Load environment variables
load_dotenv('/app/backend/.env')

def generate_flappy_fish_video():
    """Generate Flappy Fish promotional video"""
    
    prompt = """A cute cartoon orange clownfish swimming through an underwater obstacle course in a side-scrolling video game style. 
    The fish taps upward to avoid green seaweed pipes/coral obstacles. 
    Bright blue ocean background with bubbles, coins floating to collect, and sunlight rays from above.
    Colorful, fun, mobile game aesthetic similar to Flappy Bird but underwater themed.
    The fish character is expressive and bouncy as it navigates through gaps in the obstacles.
    60fps smooth animation, vibrant colors, playful atmosphere."""
    
    output_path = '/app/flappy_fish_promo.mp4'
    
    print("Generating Flappy Fish promotional video...")
    print("This may take 3-5 minutes...")
    
    video_gen = OpenAIVideoGeneration(api_key=os.environ['EMERGENT_LLM_KEY'])
    
    # 16:9 aspect ratio, 4 seconds duration
    video_bytes = video_gen.text_to_video(
        prompt=prompt,
        model="sora-2",
        size="1280x720",  # 16:9 aspect ratio
        duration=4,
        max_wait_time=600
    )
    
    if video_bytes:
        video_gen.save_video(video_bytes, output_path)
        print(f"Video saved to: {output_path}")
        
        # Check file size
        file_size = os.path.getsize(output_path)
        print(f"File size: {file_size / 1024:.1f} KB")
        
        return output_path
    else:
        print("Video generation failed")
        return None

if __name__ == "__main__":
    result = generate_flappy_fish_video()
    if result:
        print(f"Success! Video at: {result}")
    else:
        print("Failed to generate video")
