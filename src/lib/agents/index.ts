// 1. Photo Analysis Agent
// Analyzes uploaded photo for visible style-related details.
// MUST NOT judge beauty, body, attractiveness, weight, or physical flaws.
export const analyzePhoto = async (photoUrl: string) => {
  console.log("Analyzing photo:", photoUrl);
  
  // Simulated photo details extraction focusing purely on style and presentation
  const baseOutfits = [
    { clothingType: "Casual cotton t-shirt and denim", dominantColors: ["White", "Blue"] },
    { clothingType: "Structured blazer and smart trousers", dominantColors: ["Navy", "Grey"] },
    { clothingType: "Oversized hoodie and joggers", dominantColors: ["Black", "Charcoal"] },
    { clothingType: "Flowing linen dress", dominantColors: ["Beige", "Olive"] },
    { clothingType: "Knit sweater and chinos", dominantColors: ["Cream", "Brown"] }
  ];

  const detectedOutfit = baseOutfits[Math.floor(Math.random() * baseOutfits.length)];
  const hairstyles = ["Sleek shoulder-length bob", "Soft natural waves", "High bun", "Textured short cut", "Classic side-parted hairstyle"];
  
  return {
    detectedColors: detectedOutfit.dominantColors,
    currentStyle: detectedOutfit.clothingType,
    detectedHairstyle: hairstyles[Math.floor(Math.random() * hairstyles.length)],
    presentation: "Polished and comfortable structure",
    details: "The outfit selection demonstrates a strong appreciation for clean lines, basic layering, and functional style."
  };
};

// 2. Style Recommendation Agent
// Uses photo analysis and user preferences to suggest style identity, colors, and scoring.
export const getStyleRecommendations = async (analysis: any, preferences: any) => {
  console.log("Generating recommendations for:", { analysis, preferences });
  
  const vibeMap: Record<string, { identity: string; summary: string }> = {
    'Minimal': { 
      identity: 'Elevated Minimalist', 
      summary: 'Focuses on clean silhouettes, high-quality basics, and a cohesive monochrome-leaning palette that accentuates structure and form without visual noise.' 
    },
    'Cute': { 
      identity: 'Soft Playful Aesthetic', 
      summary: 'Features whimsical details, soft pastel coordinates, and relaxed, approachable shapes that balance comfort and a charming, youthful vibe.' 
    },
    'Classy': { 
      identity: 'Old Money Sophisticated', 
      summary: 'Emphasizes tailoring, traditional fits, and rich, timeless fabrics. The focus is on subtle luxury, structured jackets, and an impeccable, curated appearance.' 
    },
    'Bold': { 
      identity: 'Modern Power Dresser', 
      summary: 'Commands attention using high-contrast color choices, sharp structural cuts, and statement outer layers to project high energy and confidence.' 
    },
    'Streetwear': { 
      identity: 'Urban Neo-Classic', 
      summary: 'Blends relaxed oversized sportswear with high-fashion textures. Employs layered fits, technical items, and a balance of dark and pop colors.' 
    },
    'Elegant': { 
      identity: 'Refined Contemporary Grace', 
      summary: 'Centres on fluid, draped fabrics, high-end classic combinations, and subtle shimmering hardware accents, evoking clean luxury and effortless elegance.' 
    }
  };

  const selectedVibe = vibeMap[preferences.vibe] || vibeMap['Minimal'];

  // Base scores calculations, slightly randomized but high for reassurance
  const styleMatch = Math.floor(Math.random() * 8) + 88; // 88 - 95
  const colorHarmony = Math.floor(Math.random() * 10) + 85; // 85 - 94
  const occasionFit = Math.floor(Math.random() * 6) + 90; // 90 - 95

  return {
    styleIdentity: selectedVibe.identity,
    summary: `Your styling report points towards a ${selectedVibe.identity} direction. ${selectedVibe.summary} This configuration is perfectly optimized for your ${preferences.occasion} vibe and ${preferences.comfort} fit preferences.`,
    scores: {
      styleMatch,
      colorHarmony,
      occasionFit
    },
    preferences,
    analysis
  };
};

// 3. Final Report Agent
// Converts recommendations and metadata into a beautifully structured JSON style report.
export const generateFinalReport = async (recommendations: any) => {
  console.log("Formatting final JSON report...");
  const { vibe, occasion, comfort } = recommendations.preferences;

  // Curate 5-6 colors depending on the selected vibe
  const paletteMap: Record<string, Array<{ name: string; hex: string }>> = {
    'Minimal': [
      { name: 'Warm Ivory', hex: '#F8F3E7' },
      { name: 'Charcoal Black', hex: '#2E2E2E' },
      { name: 'Stone Grey', hex: '#A8A29E' },
      { name: 'Midnight Navy', hex: '#1F2A44' },
      { name: 'Muted Sand', hex: '#E7E5E4' },
      { name: 'Taupe', hex: '#B5A696' }
    ],
    'Cute': [
      { name: 'Pastel Pink', hex: '#FFD1DC' },
      { name: 'Lavender Blush', hex: '#FFF0F5' },
      { name: 'Butter Yellow', hex: '#FFFDD0' },
      { name: 'Soft Peach', hex: '#FFDAB9' },
      { name: 'Mint Green', hex: '#E8F5E9' },
      { name: 'Sky Blue', hex: '#E3F2FD' }
    ],
    'Classy': [
      { name: 'Rich Burgundy', hex: '#6b1122' },
      { name: 'Warm Camel', hex: '#C19A6B' },
      { name: 'Midnight Navy', hex: '#1F2A44' },
      { name: 'Vanilla Cream', hex: '#FAF9F6' },
      { name: 'Deep Forest', hex: '#1C352D' },
      { name: 'Classic Gold', hex: '#D4AF37' }
    ],
    'Bold': [
      { name: 'Crimson Red', hex: '#DC143C' },
      { name: 'Electric Cobalt', hex: '#0047AB' },
      { name: 'Solar Yellow', hex: '#FFD700' },
      { name: 'Vibrant Magenta', hex: '#FF007F' },
      { name: 'Obsidian Black', hex: '#0B0C10' },
      { name: 'Sterling Silver', hex: '#C0C0C0' }
    ],
    'Streetwear': [
      { name: 'Graphite Grey', hex: '#3E3E3E' },
      { name: 'Olive Drab', hex: '#556B2F' },
      { name: 'Safety Orange', hex: '#FF5F1F' },
      { name: 'Off-White', hex: '#F5F5F0' },
      { name: 'Cargo Khaki', hex: '#8B8589' },
      { name: 'Volt Yellow', hex: '#CEFF1A' }
    ],
    'Elegant': [
      { name: 'Champagne Pearl', hex: '#F3E5AB' },
      { name: 'Dusty Rose', hex: '#C9A0A0' },
      { name: 'Deep Emerald', hex: '#043927' },
      { name: 'Muted Platinum', hex: '#E5E4E2' },
      { name: 'Royal Sapphire', hex: '#082567' },
      { name: 'Rich Mocha', hex: '#4A3B32' }
    ]
  };

  const colorPalette = paletteMap[vibe] || paletteMap['Minimal'];

  // Curate 3-5 hairstyles depending on the vibe
  const hairstyleMap: Record<string, string[]> = {
    'Minimal': ["Sleek low ponytail", "Claw clip hairstyle", "Straight parting with open hair"],
    'Cute': ["Half-up space buns", "Messy bun with face-framing tendrils", "Soft double braids"],
    'Classy': ["Classic blowout", "Low structured chignon", "Polished side-parted waves"],
    'Bold': ["Sleek high snatched ponytail", "Textured bob with bangs", "Asymmetrical pixie style"],
    'Streetwear': ["Messy high top-knot", "Loose waves with bucket hat styling", "Clean curtain cut with texture"],
    'Elegant': ["Hollywood waves", "Soft romantic low bun", "Graceful French twist"]
  };

  const hairstyles = hairstyleMap[vibe] || hairstyleMap['Minimal'];

  // Curate 4-6 accessories depending on the vibe
  const accessoriesMap: Record<string, string[]> = {
    'Minimal': ["Small gold hoops", "Minimal silver chain", "Neutral structured tote bag", "Simple steel watch"],
    'Cute': ["Colorful claw clip", "Beaded pastel bracelet", "Fluffy mini backpack", "Ribbon bow hair tie", "Heart pendant necklet"],
    'Classy': ["Pearl stud earrings", "Silk neck scarf", "Structured leather handbag", "Gold band analog watch", "Oval sunglasses"],
    'Bold': ["Chunky metallic chain", "Oversized retro sunglasses", "Metallic silver shoulder bag", "Stackable chunky rings", "Wide leather corseted belt"],
    'Streetwear': ["Canvas crossbody messenger bag", "Nylon utility bucket hat", "Chunky platform sneakers", "Steel chain link necklace", "Digital sport watch"],
    'Elegant': ["Delicate diamond-cut hoops", "Embellished clutch", "Silk hair sash", "Dainty tennis bracelet", "Cat-eye designer glasses"]
  };

  const accessories = accessoriesMap[vibe] || accessoriesMap['Minimal'];

  // Curate 3-4 outfit ideas depending on Occasion and Vibe/Comfort
  // We make this dynamic so it outputs beautiful, realistic outfits.
  const outfitTemplates: Record<string, Array<{ title: string; top: string; bottom: string; footwear: string; accessories: string; whyItWorks: string }>> = {
    'Daily': [
      {
        title: "Clean Canvas Comfort",
        top: comfort === 'Oversized' ? "Oversized organic cotton tee" : "Fitted rib-knit tee",
        bottom: "Relaxed straight-leg light wash denim",
        footwear: "Classic low-top white leather sneakers",
        accessories: "Canvas tote and simple sunglasses",
        whyItWorks: "An effortless base style that values breathable fabrics, balanced volume, and complete daily flexibility."
      },
      {
        title: "Elevated Leisure",
        top: "Half-zip fleece sweatshirt layered over a micro-tee",
        bottom: comfort === 'Loose' ? "Wide-leg drawstring lounge trousers" : "Tapered utility joggers",
        footwear: "Neutral running shoes or platform trainers",
        accessories: "Minimal belt bag",
        whyItWorks: "Combines athletic comfort with street-ready structural lines, keeping you polished while running errands."
      },
      {
        title: "Structured Casual",
        top: "Breathable linen shirt worn open",
        bottom: "High-waisted tailored utility shorts or relaxed chinos",
        footwear: "Suede slide sandals or leather loafers",
        accessories: "Woven leather belt and gold studs",
        whyItWorks: "Perfect for warm-weather ease. The collar structure elevates the relaxed shorts, offering a clean, smart-casual finish."
      }
    ],
    'College': [
      {
        title: "Lecture Hall Chic",
        top: comfort === 'Oversized' ? "V-neck college sweater over white collared shirt" : "Slim-fit cropped crewneck sweater",
        bottom: "High-rise relaxed fit blue jeans",
        footwear: "Retro high-top sneakers",
        accessories: "Heavy-duty canvas backpack and water bottle sleeve",
        whyItWorks: "Classic collegiate layers provide effortless style, thermal comfort, and academic functionality."
      },
      {
        title: "Retro Utility",
        top: "Vintage graphic tee layered under a denim jacket",
        bottom: comfort === 'Loose' ? "Oversized utility cargo pants" : "Classic corduroy trousers",
        footwear: "Chunky platform trainers",
        accessories: "Retro wire-frame glasses and a corduroy tote",
        whyItWorks: "The contrast between the graphic tee and structural corduroy creates a highly trendy street vibe suitable for campus."
      },
      {
        title: "Lazy-Day Smart",
        top: "Soft grey crewneck sweatshirt",
        bottom: "Oversized relaxed fit knit pants or biker shorts",
        footwear: "Comfortable slip-on mules",
        accessories: "Sport cap and minimal watch",
        whyItWorks: "Ultra-comfy but color-coordinated, proving that comfortable lounge items look intentional when kept monochrome."
      }
    ],
    'Office': [
      {
        title: "The Professional Edge",
        top: comfort === 'Oversized' ? "Relaxed drop-shoulder oversized blazer" : "Tailored double-breasted suit blazer",
        bottom: "High-waisted tapered trousers matching the blazer",
        footwear: "Pointed-toe leather flats or low block heels",
        accessories: "Laptop tote bag and sleek silver watch",
        whyItWorks: "A strong corporate coordinate that balances contemporary fashion trends with professional office decorum."
      },
      {
        title: "Creative Corporate",
        top: "Mock-neck fine knit sweater under a light trench coat",
        bottom: "Pleated midi skirt or straight-leg ankle trousers",
        footwear: "Polished leather Chelsea boots",
        accessories: "Delicate layered necklace and a structured satchel",
        whyItWorks: "Sophisticated textures and intelligent layering create a creative, trustworthy, and modern office appearance."
      },
      {
        title: "Casual Friday Polish",
        top: "Crisp white button-down shirt tucked in",
        bottom: "Dark wash raw denim wide-leg jeans",
        footwear: "Classic leather loafers",
        accessories: "Fine leather belt and gold hoops",
        whyItWorks: "Elevates traditional denim by choosing a dark wash, combining it with high-end tailored shirting and loafers."
      }
    ],
    'Party': [
      {
        title: "Night Out Glow",
        top: "Satin cowl-neck halter top or sheer mesh bodysuit",
        bottom: comfort === 'Loose' ? "Sleek silk wide-leg trousers" : "High-waisted faux-leather mini skirt",
        footwear: "Strappy stiletto heels or platform boots",
        accessories: "Crystal drop earrings and metallic clutch",
        whyItWorks: "Reflects party lights beautifully and creates a high-fashion, festive silhouette designed to make an impact."
      },
      {
        title: "Sleek Street Statement",
        top: "Asymmetrical cut-out knit top",
        bottom: comfort === 'Oversized' ? "Oversized satin cargo pants" : "Fitted leather pants",
        footwear: "Contrast sole block-heel boots",
        accessories: "Chunky chain necklace and small shoulder bag",
        whyItWorks: "Edgy and high-contrast, blending party chic with urban streetwear elements for clubbing or dinner dates."
      },
      {
        title: "Midnight Monochrome",
        top: "Cropped blazer worn over a lace bralette",
        bottom: "Matching high-rise tailored wide-leg trousers",
        footwear: "Pointed slingback heels",
        accessories: "Sparkling silver bag and bold red lipstick",
        whyItWorks: "A sleek suit-style party look that channels modern power-dressing with a sultry, late-night edge."
      }
    ],
    'Wedding/Event': [
      {
        title: "Sophisticated Guest",
        top: "Draped one-shoulder chiffon top",
        bottom: "Matching flowy wide-leg palazzo pants or tailored skirt",
        footwear: "Lace-up block heels",
        accessories: "Pearl earrings and embroidered pouch bag",
        whyItWorks: "Flowing materials create beautiful movement, offering an elegant aesthetic perfect for formal celebrations."
      },
      {
        title: "Modern Gala Elegance",
        top: "Structured off-the-shoulder wrap blazer",
        bottom: "Tailored slim-fit cigarette trousers",
        footwear: "Patent leather court shoes",
        accessories: "Statement diamond-cut collar necklace",
        whyItWorks: "A sleek, gender-neutral formal look that commands attention through immaculate fit, precision tailoring, and high-end accessories."
      },
      {
        title: "Romantic Satin",
        top: "Satin slip dress or premium silk blouse",
        bottom: "Bias-cut silk maxi skirt",
        footwear: "Metallic open-toe sandals",
        accessories: "Delicate hair clip and thin gold bracelet",
        whyItWorks: "Emphasizes soft textures and luxurious draping, making it highly romantic and appropriate for a wedding reception."
      }
    ]
  };

  const outfits = outfitTemplates[occasion] || outfitTemplates['Daily'];

  return {
    styleIdentity: recommendations.styleIdentity,
    summary: recommendations.summary,
    scores: recommendations.scores,
    colorPalette,
    outfits,
    hairstyles,
    accessories
  };
};
