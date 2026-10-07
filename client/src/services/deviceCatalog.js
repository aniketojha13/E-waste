/**
 * Device Catalog & Valuation Calculation Engine
 * Provides structured categories, brands, popular models, and realistic depreciation pricing algorithms.
 */

export const DEVICE_CATEGORIES = [
  {
    id: 'smartphone',
    name: 'Smartphone / Mobile',
    iconName: 'Smartphone',
    co2Base: 75,
    baseMSRP: 25000,
    brands: ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Google Pixel', 'Realme', 'Vivo', 'Oppo', 'Motorola', 'Other']
  },
  {
    id: 'laptop',
    name: 'Laptop / Notebook',
    iconName: 'Laptop',
    co2Base: 260,
    baseMSRP: 55000,
    brands: ['Apple (MacBook)', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 'Microsoft Surface', 'Other']
  },
  {
    id: 'desktop',
    name: 'Desktop PC / All-in-One',
    iconName: 'Cpu',
    co2Base: 380,
    baseMSRP: 45000,
    brands: ['Custom Built', 'Dell', 'HP', 'Lenovo', 'Apple (iMac/Mac Mini)', 'Asus', 'Other']
  },
  {
    id: 'tablet',
    name: 'Tablet / iPad',
    iconName: 'Tablet',
    co2Base: 120,
    baseMSRP: 28000,
    brands: ['Apple (iPad)', 'Samsung Galaxy Tab', 'Lenovo Tab', 'Xiaomi Pad', 'Realme Pad', 'Other']
  },
  {
    id: 'monitor_tv',
    name: 'Smart TV / LED Monitor',
    iconName: 'Tv',
    co2Base: 190,
    baseMSRP: 22000,
    brands: ['Samsung', 'LG', 'Sony', 'Dell', 'LG UltraGear', 'OnePlus TV', 'Xiaomi Mi TV', 'BenQ', 'Other']
  },
  {
    id: 'appliance',
    name: 'Home Appliance (AC/Fridge/Microwave)',
    iconName: 'Home',
    co2Base: 220,
    baseMSRP: 25000,
    brands: ['LG', 'Samsung', 'Whirlpool', 'Voltas', 'Godrej', 'Panasonic', 'IFB', 'Other']
  }
];

export const BRAND_MODELS = {
  'Apple': [
    'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14',
    'iPhone 13 Pro', 'iPhone 13', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 11', 'iPhone SE (3rd Gen)',
    'iPhone XR', 'iPhone X', 'iPhone 8 / Older'
  ],
  'Apple (MacBook)': [
    'MacBook Pro 16" (M3/M2/M1)', 'MacBook Pro 14" (M3/M2/M1)', 'MacBook Air 15" (M2/M3)',
    'MacBook Air 13" (M2/M1)', 'MacBook Pro 13" (M2/M1)', 'MacBook Pro (Intel)', 'MacBook Air (Intel)'
  ],
  'Samsung': [
    'Galaxy S24 Ultra', 'Galaxy S24 / S24+', 'Galaxy S23 Ultra', 'Galaxy S23', 'Galaxy S22 Ultra',
    'Galaxy S22', 'Galaxy S21 FE / S21', 'Galaxy Note 20 Ultra', 'Galaxy A54 / A53', 'Galaxy M34 / M33'
  ],
  'OnePlus': [
    'OnePlus 12 / 12R', 'OnePlus 11', 'OnePlus 10 Pro / 10T', 'OnePlus 9 Pro / 9',
    'OnePlus 8T / 8 Pro', 'OnePlus Nord 3', 'OnePlus Nord CE 3 / 2'
  ],
  'Dell': [
    'XPS 15 / XPS 13', 'Latitude 5420 / 7420', 'Inspiron 15 (3000/5000)',
    'Alienware m15 / x15', 'G15 Gaming Series', 'Vostro 3510 / 3400'
  ],
  'HP': [
    'Spectre x360', 'Envy 13 / 15', 'Pavilion 15 / 14', 'Victus Gaming 15/16',
    'OMEN 16 Gaming', 'ProBook 440 / 450'
  ],
  'Lenovo': [
    'ThinkPad X1 Carbon', 'ThinkPad T14 / T15', 'Legion 5 / Pro', 'IdeaPad 3 / 5',
    'Yoga 7i / 9i', 'ThinkBook 14 / 15'
  ]
};

export const MANUFACTURE_YEARS = [
  { year: 2025, label: '2025 (Brand New / Under 1 Yr)', ageFactor: 0.75 },
  { year: 2024, label: '2024 (1 Year Old)', ageFactor: 0.60 },
  { year: 2023, label: '2023 (2 Years Old)', ageFactor: 0.44 },
  { year: 2022, label: '2022 (3 Years Old)', ageFactor: 0.32 },
  { year: 2021, label: '2021 (4 Years Old)', ageFactor: 0.22 },
  { year: 2020, label: '2020 (5 Years Old)', ageFactor: 0.15 },
  { year: 2019, label: '2019 (6 Years Old)', ageFactor: 0.10 },
  { year: 2018, label: '2018 or Earlier (7+ Years)', ageFactor: 0.05 }
];

export const CONDITION_GRADES = [
  {
    id: 'flawless',
    grade: 'Grade A - Flawless',
    badge: 'Flawless',
    desc: 'Zero scratches, screen & body immaculate, battery health >85%, never repaired.',
    factor: 1.05
  },
  {
    id: 'good',
    grade: 'Grade B - Good',
    badge: 'Good Condition',
    desc: 'Minor hairline scratches, battery health 75-85%, all cameras, ports & sensors 100% working.',
    factor: 0.85
  },
  {
    id: 'fair',
    grade: 'Grade C - Fair',
    badge: 'Fair / Heavily Used',
    desc: 'Visible scuffs, back glass hairline cracks or degraded battery (<75%), fully bootable.',
    factor: 0.60
  },
  {
    id: 'damaged',
    grade: 'Grade D - Damaged / Cracked',
    badge: 'Damaged Screen/Parts',
    desc: 'Screen cracked/bleeding, damaged charging port, speaker dead, but powers on.',
    factor: 0.35
  },
  {
    id: 'dead',
    grade: 'Grade E - Dead / Non-Functional',
    badge: 'Dead / For Scrap',
    desc: 'Does not turn on, severe liquid damage, or motherboard failure. Component salvage only.',
    factor: 0.12
  }
];

export const ACCESSORY_OPTIONS = [
  { id: 'charger', label: 'Original Charger / Adapter', bonus: 0.08 },
  { id: 'box', label: 'Original Packaging Box', bonus: 0.04 },
  { id: 'bill', label: 'Original Tax Invoice / Bill', bonus: 0.04 }
];

/**
 * Calculates precision estimated resale / recycling payout and strategic advice
 */
export function calculateDeviceValuation({
  category,
  brand,
  model,
  yearOfManufacture,
  conditionId,
  storage,
  ram,
  selectedAccessories = []
}) {
  const catObj = DEVICE_CATEGORIES.find(c => c.id === category) || DEVICE_CATEGORIES[0];
  const yearObj = MANUFACTURE_YEARS.find(y => y.year === Number(yearOfManufacture)) || MANUFACTURE_YEARS[2];
  const condObj = CONDITION_GRADES.find(g => g.id === conditionId) || CONDITION_GRADES[1];

  let basePrice = catObj.baseMSRP;

  // Premium brand weighting
  if (brand && (brand.toLowerCase().includes('apple') || brand.toLowerCase().includes('macbook'))) {
    basePrice *= 1.45;
  } else if (brand && (brand.toLowerCase().includes('samsung') || brand.toLowerCase().includes('dell') || brand.toLowerCase().includes('oneplus'))) {
    basePrice *= 1.15;
  }

  // Storage / RAM bonuses
  if (storage && (storage.includes('256') || storage.includes('512') || storage.includes('1 TB'))) {
    basePrice *= 1.12;
  }
  if (ram && (ram.includes('16') || ram.includes('32'))) {
    basePrice *= 1.15;
  }

  // Accessories bonus
  let accBonus = 0;
  for (const accId of selectedAccessories) {
    const acc = ACCESSORY_OPTIONS.find(a => a.id === accId);
    if (acc) accBonus += acc.bonus;
  }

  const rawValuation = basePrice * yearObj.ageFactor * condObj.factor * (1 + accBonus);
  const roundedPrice = Math.max(300, Math.round(rawValuation / 100) * 100);
  const minRange = Math.max(250, Math.round((roundedPrice * 0.9) / 50) * 50);
  const maxRange = Math.round((roundedPrice * 1.12) / 50) * 50;

  // Carbon Emission Savings calculation
  const co2Saved = Math.round(catObj.co2Base * (condObj.id === 'dead' ? 0.65 : 0.92));
  const treesEquivalent = (co2Saved / 21).toFixed(1);
  const kmAvoided = Math.round(co2Saved * 4.3);

  // Strategic Decision recommendation
  let strategy = '';
  let strategyType = ''; // 'sell', 'use', 'recycle'
  let rationale = '';

  const age = 2025 - Number(yearOfManufacture || 2023);

  if (condObj.id === 'dead' || age >= 6) {
    strategyType = 'recycle';
    strategy = 'Certified E-Waste Scrap & Recycling';
    rationale = `This device has completed its functional life cycle. Professional recycling salvages valuable scarce metals (copper, gold, rare-earth magnets) while preventing heavy toxic mercury from leaching into groundwater.`;
  } else if ((condObj.id === 'good' || condObj.id === 'flawless') && age <= 3) {
    if (age <= 1) {
      strategyType = 'sell';
      strategy = 'Sell Now for High Cash Value';
      rationale = `Prime resale window. Your device retains approximately 50-65% of its original purchase value. In the next 6-9 months, market depreciation will drop its price by ₹3,500 - ₹6,000. Cashing out now yields maximum return.`;
    } else {
      strategyType = 'use';
      strategy = 'Keep & Use for 1.5 - 2 More Years (Best Value)';
      rationale = `Economically optimal: With ${ram || '8GB'} configuration and good hardware health, this device easily handles all modern software workloads. Spending ₹1,200 on an authorized battery tune-up will easily extend its life until 2027, avoiding ₹40,000+ in new replacement expenses!`;
    }
  } else if (condObj.id === 'damaged' && age <= 2) {
    strategyType = 'sell';
    strategy = 'Sell As-Is to Certified Collection Agent';
    rationale = `Screen replacement for this tier typically costs ₹6,000 - ₹9,000. Selling it through our certified collection network recovers your net residual value without risking repair failure.`;
  } else {
    strategyType = 'sell';
    strategy = 'Schedule Doorstep Collection & Payout';
    rationale = `Our verified collection agents will collect the device at your doorstep, verify condition, and process payment directly.`;
  }

  return {
    estimatedPrice: roundedPrice,
    minRange,
    maxRange,
    co2Saved,
    treesEquivalent,
    kmAvoided,
    strategy,
    strategyType,
    rationale
  };
}
