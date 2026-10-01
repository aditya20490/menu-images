import fs from 'fs';
import fetch from 'node-fetch';

const dishes = JSON.parse(fs.readFileSync('./dishes.json', 'utf-8'));
const API_KEY = process.env.TOGETHER_API_KEY;

async function run() {
  // Create images folder
  if (!fs.existsSync('./images')) fs.mkdirSync('./images');

  for (const dish of dishes) {
    console.log(`Generating ${dish.name}...`);
    const prompt = `Commercial food photography of ${dish.name}, close-up angle, natural studio lighting, modern ceramic dish, shallow depth of field, appetizing restaurant presentation, 4k resolution, clean background`;

    try {
      const res = await fetch("https://api.together.xyz/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "black-forest-labs/FLUX.1-schnell",
          prompt: prompt,
          width: 1024,
          height: 1024,
          steps: 4,
          n: 1,
          response_format: "b64_json"
        })
      });
      
      const data = await res.json();
      if (data.data && data.data[0]) {
        const base64 = data.data[0].b64_json;
        // Save as PNG
        fs.writeFileSync(`./images/${dish.id}.png`, Buffer.from(base64, 'base64'));
        console.log(`Saved ${dish.id}.png`);
      }
      
      // Wait 3 seconds between each image to avoid getting blocked
      await new Promise(r => setTimeout(r, 3000));
    } catch (e) {
      console.log("Error generating " + dish.name, e);
    }
  }
}

run();
