import fs from 'fs';

const dishes = JSON.parse(fs.readFileSync('./dishes.json', 'utf-8'));
const API_KEY = process.env.TOGETHER_API_KEY;

async function run() {
  if (!fs.existsSync('./images')) fs.mkdirSync('./images');

  for (const dish of dishes) {
    console.log(`Generating ${dish.name}...`);
    
    try {
      const res = await fetch("https://api.together.xyz/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "black-forest-labs/FLUX.1-schnell",
          prompt: `Commercial food photography of ${dish.name}, close-up angle, natural studio lighting, modern ceramic dish, shallow depth of field, appetizing restaurant presentation, 4k resolution, clean background`,
          width: 1024,
          height: 1024,
          steps: 4,
          n: 1,
          response_format: "b64_json"
        })
      });
      
      const data = await res.json();
      
      if (data.data && data.data[0]) {
        fs.writeFileSync(`./images/${dish.id}.png`, Buffer.from(data.data[0].b64_json, 'base64'));
        console.log(`✅ Saved ${dish.id}.png`);
      } else {
        console.log(`❌ API Error for ${dish.name}:`, JSON.stringify(data));
      }
    } catch (e) {
      console.log(`❌ Script Error:`, e.message);
    }
    
    // Wait 4 seconds to respect rate limits
    await new Promise(r => setTimeout(r, 4000));
  }
}
run();
