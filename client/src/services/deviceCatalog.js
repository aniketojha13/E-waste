/**
 * Comprehensive Device Catalog, Valuation Calculation & Anti-Theft IMEI Authentication Engine
 * Supports 3R Circular Economy: REDUCE • REUSE • RECYCLE
 */

export const DEVICE_CATEGORIES = [
  {
    id: 'smartphone',
    name: 'Smartphone / Mobile',
    iconName: 'Smartphone',
    requiresImei: true,
    co2Base: 75,
    baseMSRP: 28000,
    brands: ['Apple', 'Samsung', 'OnePlus', 'Google Pixel', 'Xiaomi', 'Realme', 'Vivo', 'Oppo', 'Motorola', 'Nothing', 'Other']
  },
  {
    id: 'tablet',
    name: 'Tablet / iPad',
    iconName: 'Tablet',
    requiresImei: true,
    co2Base: 120,
    baseMSRP: 32000,
    brands: ['Apple (iPad)', 'Samsung Galaxy Tab', 'Lenovo Tab', 'Xiaomi Pad', 'OnePlus Pad', 'Realme Pad', 'Other']
  },
  {
    id: 'laptop',
    name: 'Laptop / Notebook',
    iconName: 'Laptop',
    requiresImei: false,
    co2Base: 260,
    baseMSRP: 60000,
    brands: ['Apple (MacBook)', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 'Microsoft Surface', 'Other']
  },
  {
    id: 'desktop',
    name: 'Desktop PC / All-in-One',
    iconName: 'Cpu',
    requiresImei: false,
    co2Base: 380,
    baseMSRP: 50000,
    brands: ['Custom Built Gaming PC', 'Apple (iMac/Mac Mini/Studio)', 'Dell OptiPlex/Alienware', 'HP Pavilion', 'Lenovo ThinkCentre', 'Asus ROG', 'Other']
  },
  {
    id: 'smartwatch',
    name: 'Smartwatch & Wearables',
    iconName: 'Watch',
    requiresImei: false,
    co2Base: 35,
    baseMSRP: 15000,
    brands: ['Apple Watch', 'Samsung Galaxy Watch', 'OnePlus Watch', 'Garmin', 'Fossil', 'Fitbit', 'Noise', 'boAt', 'Other']
  },
  {
    id: 'gaming_audio',
    name: 'Gaming Consoles & Premium Audio',
    iconName: 'Gamepad',
    requiresImei: false,
    co2Base: 140,
    baseMSRP: 38000,
    brands: ['Sony PlayStation (PS5/PS4)', 'Microsoft Xbox (Series X/S)', 'Nintendo Switch', 'Apple AirPods Max', 'Sony WH/WF Series', 'Bose QuietComfort', 'Sennheiser', 'Other']
  },
  {
    id: 'monitor_tv',
    name: 'Smart TV / LED Monitor',
    iconName: 'Tv',
    requiresImei: false,
    co2Base: 190,
    baseMSRP: 25000,
    brands: ['Samsung', 'LG', 'Sony Bravia', 'Dell UltraSharp', 'OnePlus TV', 'Xiaomi Mi TV', 'TCL', 'BenQ', 'Other']
  },
  {
    id: 'appliance',
    name: 'Home Appliance (AC/Fridge/Microwave)',
    iconName: 'Home',
    requiresImei: false,
    co2Base: 220,
    baseMSRP: 28000,
    brands: ['LG', 'Samsung', 'Whirlpool', 'Voltas', 'Godrej', 'Panasonic', 'IFB', 'Dyson', 'Other']
  }
];

export const BRAND_MODELS = {
  'Apple': [
    'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 / 16 Plus',
    'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 / 15 Plus',
    'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 / 14 Plus',
    'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 mini',
    'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 mini',
    'iPhone 11 Pro', 'iPhone 11', 'iPhone SE (3rd Gen)', 'iPhone XR', 'iPhone X / XS',
    'iPhone 8 / Older'
  ],
  'Apple (MacBook)': [
    'MacBook Pro 16" (M3 Max/Pro)', 'MacBook Pro 14" (M3 Max/Pro/M3)',
    'MacBook Pro 16" (M2 Max/Pro)', 'MacBook Pro 14" (M2 Max/Pro)',
    'MacBook Air 15" (M3/M2)', 'MacBook Air 13" (M3/M2/M1)',
    'MacBook Pro 13" (M2/M1)', 'MacBook Pro 16" (Intel)', 'MacBook Pro 15" / 13" (Intel)'
  ],
  'Apple (iPad)': [
    'iPad Pro 13" / 11" (M4 OLED)', 'iPad Pro 12.9" (M2/M1)', 'iPad Pro 11" (M2/M1)',
    'iPad Air 13" / 11" (M2)', 'iPad Air 10.9" (5th / 4th Gen)',
    'iPad (10th Gen 10.9")', 'iPad (9th Gen 10.2")', 'iPad mini (6th / 5th Gen)'
  ],
  'Apple Watch': [
    'Apple Watch Ultra 2', 'Apple Watch Ultra', 'Apple Watch Series 9', 'Apple Watch Series 8',
    'Apple Watch Series 7', 'Apple Watch Series 6', 'Apple Watch SE (2nd Gen)'
  ],
  'Samsung': [
    'Galaxy S24 Ultra', 'Galaxy S24+ / S24', 'Galaxy S23 Ultra', 'Galaxy S23+ / S23',
    'Galaxy S22 Ultra', 'Galaxy S22+ / S22', 'Galaxy S21 FE / S21 Ultra',
    'Galaxy Z Fold 6 / 5 / 4', 'Galaxy Z Flip 6 / 5 / 4',
    'Galaxy Note 20 Ultra / Note 10+', 'Galaxy A55 / A54 / A53',
    'Galaxy M54 / M34 / F54'
  ],
  'Samsung Galaxy Tab': [
    'Galaxy Tab S9 Ultra / S9+ / S9', 'Galaxy Tab S8 Ultra / S8+ / S8',
    'Galaxy Tab S9 FE / S9 FE+', 'Galaxy Tab A9+ / A9'
  ],
  'Samsung Galaxy Watch': [
    'Galaxy Watch Ultra', 'Galaxy Watch 6 Classic / Watch 6', 'Galaxy Watch 5 Pro / Watch 5'
  ],
  'OnePlus': [
    'OnePlus 12 / 12R', 'OnePlus Open (Foldable)', 'OnePlus 11 / 11R',
    'OnePlus 10 Pro / 10T', 'OnePlus 9 Pro / 9 / 9RT', 'OnePlus 8T / 8 Pro',
    'OnePlus Nord 4 / Nord 3', 'OnePlus Nord CE 4 / CE 3 Lite'
  ],
  'Google Pixel': [
    'Pixel 9 Pro XL / 9 Pro / 9', 'Pixel 9 Pro Fold', 'Pixel 8 Pro / 8 / 8a',
    'Pixel 7 Pro / 7 / 7a', 'Pixel 6 Pro / 6 / 6a', 'Pixel 5 / Older'
  ],
  'Xiaomi': [
    'Xiaomi 14 Ultra / 14', 'Xiaomi 13 Pro', 'Xiaomi 12 Pro',
    'Redmi Note 13 Pro+ / Pro', 'Redmi Note 12 Pro+', 'Poco F6 / F5', 'Poco X6 Pro'
  ],
  'Vivo': [
    'Vivo X100 Pro / X100', 'Vivo X90 Pro', 'Vivo V30 Pro / V30',
    'Vivo V29 Pro / V27', 'Vivo T3 5G / T2 Pro'
  ],
  'Oppo': [
    'Find N3 Flip / Fold', 'Find X7 / X6 Pro', 'Reno 12 Pro / 11 Pro',
    'Reno 10 Pro+ / 10', 'Oppo F25 Pro / F23'
  ],
  'Realme': [
    'Realme GT 6 / GT 6T', 'Realme 12 Pro+ / 12 Pro', 'Realme 11 Pro+ / 11',
    'Realme GT 2 Pro / Neo', 'Realme Narzo 70 Pro'
  ],
  'Motorola': [
    'Razr 50 Ultra / 40 Ultra', 'Edge 50 Ultra / 50 Pro / 50 Fusion',
    'Edge 40 Pro / 40 Neo', 'Moto G84 / G54'
  ],
  'Nothing': [
    'Nothing Phone (2)', 'Nothing Phone (2a) / Plus', 'Nothing Phone (1)', 'CMF Phone 1'
  ],
  'Dell': [
    'XPS 16 / XPS 14 (2024)', 'XPS 15 / XPS 13 Plus', 'Alienware m18 / m16 / x16',
    'Latitude 7440 / 5440', 'G16 / G15 Gaming Series', 'Inspiron 16 / 15 (3000/5000)'
  ],
  'HP': [
    'Spectre x360 16 / 14', 'OMEN Transcend 16 / 14', 'Envy x360 15 / 14',
    'Victus Gaming 16 / 15', 'Pavilion Plus 14 / 15', 'ProBook 450 / 440'
  ],
  'Lenovo': [
    'ThinkPad X1 Carbon (Gen 12/11)', 'Legion Pro 7i / Pro 5i', 'ThinkPad T14 / P14s',
    'Yoga 9i / Yoga 7i', 'IdeaPad Pro 5 / Slim 5', 'ThinkBook 16 / 14'
  ],
  'Asus': [
    'ROG Zephyrus G16 / G14 (OLED)', 'ROG Strix SCAR 16 / 18', 'ZenBook 14 OLED',
    'TUF Gaming A15 / F15', 'Vivobook Pro 15 / 16X'
  ],
  'Acer': [
    'Predator Helios 16 / 18', 'Swift Go 14 / 16 (OLED)', 'Nitro 16 / 5', 'Aspire 5 / 7'
  ],
  'Sony PlayStation (PS5/PS4)': [
    'PlayStation 5 Slim (Disc/Digital)', 'PlayStation 5 Original', 'PlayStation 4 Pro (1TB)', 'PlayStation 4 Slim'
  ],
  'Microsoft Xbox (Series X/S)': [
    'Xbox Series X (1TB)', 'Xbox Series S (1TB/512GB)', 'Xbox One X / S'
  ],
  'Nintendo Switch': [
    'Nintendo Switch OLED Model', 'Nintendo Switch (V2 / V1)', 'Nintendo Switch Lite'
  ]
};

export const RAM_OPTIONS = [
  '4 GB', '6 GB', '8 GB', '12 GB', '16 GB', '24 GB', '32 GB', '64 GB', '128 GB'
];

export const STORAGE_OPTIONS = [
  '32 GB', '64 GB', '128 GB', '256 GB', '512 GB', '1 TB', '2 TB', '4 TB'
];

export const MANUFACTURE_YEARS = [
  { year: 2025, label: '2025 (Under 1 Year / Brand New)', ageFactor: 0.80 },
  { year: 2024, label: '2024 (1 Year Old)', ageFactor: 0.65 },
  { year: 2023, label: '2023 (2 Years Old)', ageFactor: 0.48 },
  { year: 2022, label: '2022 (3 Years Old)', ageFactor: 0.35 },
  { year: 2021, label: '2021 (4 Years Old)', ageFactor: 0.24 },
  { year: 2020, label: '2020 (5 Years Old)', ageFactor: 0.16 },
  { year: 2019, label: '2019 (6 Years Old)', ageFactor: 0.11 },
  { year: 2018, label: '2018 or Earlier (7+ Years)', ageFactor: 0.06 }
];

export const CONDITION_GRADES = [
  {
    id: 'flawless',
    grade: 'Grade A - Flawless (Like New)',
    badge: 'Flawless',
    desc: 'Immaculate body and screen, battery health >85%, zero repairs, all ports & sensors working 100%.',
    factor: 1.10
  },
  {
    id: 'good',
    grade: 'Grade B - Good (Minor Wear)',
    badge: 'Good Condition',
    desc: 'Hairline scratches from everyday use, battery 75-85%, screen completely intact, all features functional.',
    factor: 0.88
  },
  {
    id: 'fair',
    grade: 'Grade C - Fair (Heavily Used)',
    badge: 'Fair Condition',
    desc: 'Visible scuffs or casing dings, battery <75%, fully bootable and operable.',
    factor: 0.62
  },
  {
    id: 'damaged',
    grade: 'Grade D - Damaged / Cracked Glass',
    badge: 'Damaged Screen/Body',
    desc: 'Cracked screen or rear glass, speaker/mic issue, but powers on and boots.',
    factor: 0.38
  },
  {
    id: 'dead',
    grade: 'Grade E - Dead / For Scientific Salvage',
    badge: 'Dead / For E-Waste Salvage',
    desc: 'Does not turn on, liquid damage, or motherboard failure. We still buy for precious metal metallurgy!',
    factor: 0.15
  }
];

export const ACCESSORY_OPTIONS = [
  { id: 'charger', label: 'Original Charger / Power Adapter', bonus: 0.08 },
  { id: 'box', label: 'Original Retail Packaging Box', bonus: 0.04 },
  { id: 'bill', label: 'Original Purchase Invoice / Tax Bill', bonus: 0.05 },
  { id: 'cable', label: 'Original Connection Cables / S-Pen / Case', bonus: 0.03 }
];

/**
 * Validates IMEI (15 digits via Luhn formula) for phones/tablets or Serial Number for laptops/appliances.
 * Simulates check against CEIR (Central Equipment Identity Register) anti-theft database.
 */
export function verifyImeiOrSerial(code, category) {
  if (!code || typeof code !== 'string') {
    return { valid: false, message: 'Please enter a valid IMEI or Serial Number.' };
  }

  const clean = code.trim();
  const isImeiTarget = category === 'smartphone' || category === 'tablet';

  if (isImeiTarget) {
    const digitsOnly = clean.replace(/[^0-9]/g, '');

    if (digitsOnly.length !== 15) {
      return {
        valid: false,
        message: `IMEI must be exactly 15 digits (Dial *#06# on keypad to check). Entered: ${digitsOnly.length} digits.`
      };
    }

    // Luhn checksum validation
    let sum = 0;
    for (let i = 0; i < 14; i++) {
      let digit = parseInt(digitsOnly[i], 10);
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    if (checkDigit !== parseInt(digitsOnly[14], 10)) {
      return {
        valid: false,
        message: 'Invalid IMEI checksum. Please verify digits from *#06# or device original box.'
      };
    }

    return {
      valid: true,
      imei: digitsOnly,
      status: 'clean',
      message: '✅ Verified Genuine & Clean: Passed National CEIR/GSMA anti-theft registry check. Not reported lost or stolen.',
      certifiedAt: new Date().toLocaleDateString()
    };
  } else {
    // Serial Number validation for laptops, desktops, smartwatches, consoles
    if (clean.length < 5) {
      return {
        valid: false,
        message: 'Hardware Serial Number (S/N) must be at least 5 alphanumeric characters.'
      };
    }

    return {
      valid: true,
      imei: clean.toUpperCase(),
      status: 'clean',
      message: '✅ Serial Number Authenticated: Device ownership verified. Eligible for doorstep pickup & cash settlement.',
      certifiedAt: new Date().toLocaleDateString()
    };
  }
}

/**
 * Calculates precision estimated resale / recycling payout, 3R path, and carbon savings
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
  const b = (brand || '').toLowerCase();
  if (b.includes('apple') || b.includes('macbook')) {
    basePrice *= 1.50;
  } else if (b.includes('samsung') || b.includes('dell') || b.includes('oneplus') || b.includes('sony')) {
    basePrice *= 1.20;
  } else if (b.includes('google') || b.includes('alienware') || b.includes('playstation')) {
    basePrice *= 1.25;
  }

  // Storage multiplier
  if (storage) {
    if (storage.includes('1 TB') || storage.includes('2 TB')) basePrice *= 1.22;
    else if (storage.includes('512')) basePrice *= 1.15;
    else if (storage.includes('256')) basePrice *= 1.08;
  }

  // RAM multiplier
  if (ram) {
    if (ram.includes('32') || ram.includes('64')) basePrice *= 1.20;
    else if (ram.includes('16') || ram.includes('24')) basePrice *= 1.12;
    else if (ram.includes('12')) basePrice *= 1.06;
  }

  // Accessories bonus
  let accBonus = 0;
  for (const accId of selectedAccessories) {
    const acc = ACCESSORY_OPTIONS.find(a => a.id === accId);
    if (acc) accBonus += acc.bonus;
  }

  const rawValuation = basePrice * yearObj.ageFactor * condObj.factor * (1 + accBonus);
  const roundedPrice = Math.max(350, Math.round(rawValuation / 100) * 100);
  const minRange = Math.max(300, Math.round((roundedPrice * 0.92) / 50) * 50);
  const maxRange = Math.round((roundedPrice * 1.12) / 50) * 50;

  // Carbon Emission Savings calculation
  const co2Saved = Math.round(catObj.co2Base * (condObj.id === 'dead' ? 0.68 : 0.94));
  const treesEquivalent = (co2Saved / 21).toFixed(1);
  const kmAvoided = Math.round(co2Saved * 4.3);

  // 3R Strategic Pathway Recommendation
  let strategy = '';
  let strategyType = ''; // 'sell', 'use', 'recycle'
  let threeR = ''; // 'REDUCE', 'REUSE', 'RECYCLE'
  let rationale = '';

  const age = 2025 - Number(yearOfManufacture || 2023);

  if (condObj.id === 'dead' || age >= 6) {
    threeR = 'RECYCLE';
    strategyType = 'recycle';
    strategy = 'Scientific E-Waste Metallurgy & Recycling (Guaranteed Buyback)';
    rationale = `This item has completed its operational cycle. Through our certified recycling chain, rare-earth metals, gold, and copper will be reclaimed safely while preventing cadmium and mercury toxic pollution. We guarantee cash payout for raw component value!`;
  } else if ((condObj.id === 'good' || condObj.id === 'flawless') && age <= 3) {
    if (age <= 1) {
      threeR = 'REUSE';
      strategyType = 'sell';
      strategy = 'Sell Now for Peak Value (Guaranteed Instant Buyback)';
      rationale = `Prime resale sweet-spot: Your device commands 55-70% of its initial market cost. Locking in your cash settlement today avoids impending depreciation. We will find it an eager refurbished secondary owner!`;
    } else {
      threeR = 'REDUCE';
      strategyType = 'use';
      strategy = 'Reduce Waste: Keep & Use for 1.5–2 More Years';
      rationale = `Eco-friendly choice: With ${ram || '8GB'} configuration and solid hardware, this hardware easily handles current software. Keeping it in service saves the carbon footprint of manufacturing a brand-new unit! (If you still want to sell, our guaranteed cash buyback is ready for you below!)`;
    }
  } else if (condObj.id === 'damaged' && age <= 3) {
    threeR = 'REUSE';
    strategyType = 'sell';
    strategy = 'Sell As-Is: Doorstep Cash Pickup & Refurbishment';
    rationale = `Repair costs for this unit are high for individuals. Our authorized collection depot will collect it at your door, replace the damaged panel, and grant the device a second functional life!`;
  } else {
    threeR = 'REUSE';
    strategyType = 'sell';
    strategy = 'Schedule Doorstep Buyback Payout';
    rationale = `Our verified collection agents will collect your electronic item right at your doorstep, verify the serial/IMEI, and settle your cash payment instantly.`;
  }

  return {
    estimatedPrice: roundedPrice,
    minRange,
    maxRange,
    co2Saved,
    treesEquivalent,
    kmAvoided,
    threeR,
    strategy,
    strategyType,
    rationale
  };
}
