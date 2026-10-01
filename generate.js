import fs from 'fs';
import fetch from 'node-fetch';

const dishes = JSON.parse(fs.readFileSync('./dishes.json', 'utf-8'));

async function run() {
  if (!fs.existsSync('./images')) fs.mkdirSync('./images');

  for (const dish of dishes) {
    console.log(`Generating ${dish.name}...`);
    
    // Encode the prompt so it can be sent as a web link
    const promptText = `Commercial food photography of ${dish.name}, close-up angle, natural studio lighting, modern ceramic dish, shallow depth of field, appetizing restaurant presentation, 4k resolution, clean background`;
    const encodedPrompt = encodeURIComponent(promptText);
    
    try {
      // Pollinations.ai generates high-quality images directly via URL for free
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;
      
      const res = await fetch(url);
      const buffer = await res.arrayBuffer();
      
      // Save the image
      fs.writeFileSync(`./images/${dish.id}.jpg`, Buffer.from(buffer));
      console.log(`✅ Saved ${dish.id}.jpg`);
      
      // Wait 3 seconds to be polite to the free server
      await new Promise(r => setTimeout(r, 3000));
    } catch (e) {
      console.log(`❌ Script Error for ${dish.name}:`, e.message);
    }
  }
}
run();
