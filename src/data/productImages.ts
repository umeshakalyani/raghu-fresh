// Realistic grocery-store product photography catalog for RAGHU FRESH
// High resolution, natural appearance, clean/white background, centered, commercial grocery styling.

export interface GroceryPhotoPreset {
  id: string;
  name: string;
  category: 'fruits' | 'vegetables' | 'leafy-greens' | 'dairy-eggs' | 'organic-staples';
  url: string;
  tags: string[];
}

// Explicit Product to Photo Mapping
export const PRODUCT_IMAGE_MAP: Record<string, string> = {
  // ==========================================
  // FRUITS (30 Products)
  // ==========================================
  'apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
  'royal-delicious-apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
  'green-apple': 'https://images.unsplash.com/photo-1610397648930-477b8c7f0943?auto=format&fit=crop&w=600&q=80',
  'granny-smith-green-apple': 'https://images.unsplash.com/photo-1610397648930-477b8c7f0943?auto=format&fit=crop&w=600&q=80',
  'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
  'yelakki-banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
  'orange': 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80',
  'nagpur-orange': 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80',
  'sweet-lime': 'https://images.unsplash.com/photo-1534948216015-843149f72be3?auto=format&fit=crop&w=600&q=80',
  'mosambi': 'https://images.unsplash.com/photo-1534948216015-843149f72be3?auto=format&fit=crop&w=600&q=80',
  'lemon': 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=600&q=80',
  'country-lemon': 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=600&q=80',
  'mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
  'alphonso-mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
  'badami-mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
  'pomegranate': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
  'papaya': 'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&w=600&q=80',
  'watermelon': 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=600&q=80',
  'muskmelon': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
  'grapes': 'https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=600&q=80',
  'guava': 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=600&q=80',
  'pineapple': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80',
  'kiwi': 'https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&w=600&q=80',
  'dragon-fruit': 'https://images.unsplash.com/photo-1527325678964-54921661f888?auto=format&fit=crop&w=600&q=80',
  'strawberry': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
  'blueberry': 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80',
  'pear': 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=600&q=80',
  'peach': 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?auto=format&fit=crop&w=600&q=80',
  'plum': 'https://images.unsplash.com/photo-1522184216316-3c25379f9760?auto=format&fit=crop&w=600&q=80',
  'chikoo': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
  'sapota': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
  'custard-apple': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
  'sitaphal': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
  'coconut': 'https://images.unsplash.com/photo-1544378730-8b5104b18790?auto=format&fit=crop&w=600&q=80',
  'tender-coconut': 'https://images.unsplash.com/photo-1544378730-8b5104b18790?auto=format&fit=crop&w=600&q=80',
  'avocado': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
  'jackfruit': 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=600&q=80',
  'fig': 'https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?auto=format&fit=crop&w=600&q=80',
  'anjeer': 'https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?auto=format&fit=crop&w=600&q=80',
  'dates': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
  'lychee': 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=600&q=80',
  'apricot': 'https://images.unsplash.com/photo-1501973801540-537f08ccae7b?auto=format&fit=crop&w=600&q=80',

  // ==========================================
  // VEGETABLES (40 Products)
  // ==========================================
  'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
  'onion': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
  'tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
  'nati-tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
  'carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
  'beetroot': 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=600&q=80',
  'radish': 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=600&q=80',
  'turnip': 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=600&q=80',
  'cucumber': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=600&q=80',
  'capsicum': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
  'green-bell-pepper': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
  'green-chilli': 'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?auto=format&fit=crop&w=600&q=80',
  'red-chilli': 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
  'brinjal': 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80',
  'eggplant': 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80',
  'lady-finger': 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=600&q=80',
  'okra': 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=600&q=80',
  'bhindi': 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=600&q=80',
  'cabbage': 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=600&q=80',
  'cauliflower': 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80',
  'broccoli': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80',
  'beans': 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=600&q=80',
  'french-beans': 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=600&q=80',
  'cluster-beans': 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=600&q=80',
  'green-peas': 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=600&q=80',
  'corn': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
  'bottle-gourd': 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=600&q=80',
  'lauki': 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=600&q=80',
  'ridge-gourd': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=600&q=80',
  'bitter-gourd': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
  'karela': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
  'snake-gourd': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=600&q=80',
  'pumpkin': 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80',
  'ash-gourd': 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=600&q=80',
  'drumstick': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  'raw-banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
  'sweet-potato': 'https://images.unsplash.com/photo-1589217157232-464b505b197f?auto=format&fit=crop&w=600&q=80',
  'ginger': 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
  'garlic': 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80',
  'mushroom': 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=600&q=80',
  'zucchini': 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=600&q=80',
  'ivy-gourd': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=600&q=80',
  'tindora': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=600&q=80',
  'chayote': 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=600&q=80',
  'seemebadnekayi': 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=600&q=80',
  'raw-papaya': 'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&w=600&q=80',
  'raw-mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
  'yam': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
  'colocasia': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
  'arbi': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',

  // ==========================================
  // LEAFY VEGETABLES (12 Products)
  // ==========================================
  'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
  'palak': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
  'coriander': 'https://images.unsplash.com/photo-1588879460618-9249e7d947d1?auto=format&fit=crop&w=600&q=80',
  'coriander-leaves': 'https://images.unsplash.com/photo-1588879460618-9249e7d947d1?auto=format&fit=crop&w=600&q=80',
  'mint': 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=600&q=80',
  'mint-leaves': 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=600&q=80',
  'curry-leaves': 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
  'fenugreek-leaves': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  'methi': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  'amaranth-leaves': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  'dill-leaves': 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
  'spring-onion': 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=600&q=80',
  'lettuce': 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=600&q=80',
  'gongura': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  'drumstick-leaves': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  'basale-soppu': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
  'sprouts': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',

  // ==========================================
  // DAIRY, EGGS & STAPLES
  // ==========================================
  'milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
  'desi-milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
  'butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
  'vedic-butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
  'paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
  'malai-paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
  'eggs': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
  'country-eggs': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
  'oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
  'groundnut-oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
  'honey': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
  'coorg-honey': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
  'millet': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  'foxtail-millet': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  'flour': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  'wheat-flour': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
};

// Curated library presets for Admin Image Picker
export const PRESET_GROCERY_PHOTOS: GroceryPhotoPreset[] = [
  // Fruits
  { id: 'p-apple', name: 'Royal Red Apple', category: 'fruits', url: PRODUCT_IMAGE_MAP['apple'], tags: ['apple', 'red apple', 'fruit'] },
  { id: 'p-green-apple', name: 'Granny Smith Green Apple', category: 'fruits', url: PRODUCT_IMAGE_MAP['green-apple'], tags: ['green apple', 'apple'] },
  { id: 'p-banana', name: 'Fresh Yellow Bananas', category: 'fruits', url: PRODUCT_IMAGE_MAP['banana'], tags: ['banana', 'yelakki', 'robusta'] },
  { id: 'p-orange', name: 'Fresh Nagpur Orange', category: 'fruits', url: PRODUCT_IMAGE_MAP['orange'], tags: ['orange', 'santra', 'citrus'] },
  { id: 'p-sweet-lime', name: 'Sweet Lime (Mosambi)', category: 'fruits', url: PRODUCT_IMAGE_MAP['sweet-lime'], tags: ['sweet lime', 'mosambi', 'citrus'] },
  { id: 'p-lemon', name: 'Country Lemon', category: 'fruits', url: PRODUCT_IMAGE_MAP['lemon'], tags: ['lemon', 'nimbe hannu', 'citrus'] },
  { id: 'p-mango', name: 'Alphonso / Badami Mango', category: 'fruits', url: PRODUCT_IMAGE_MAP['mango'], tags: ['mango', 'alphonso', 'badami'] },
  { id: 'p-pomegranate', name: 'Ruby Pomegranate', category: 'fruits', url: PRODUCT_IMAGE_MAP['pomegranate'], tags: ['pomegranate', 'dalimbe', 'anar'] },
  { id: 'p-papaya', name: 'Ripe Red Lady Papaya', category: 'fruits', url: PRODUCT_IMAGE_MAP['papaya'], tags: ['papaya', 'pawpaw'] },
  { id: 'p-watermelon', name: 'Crisp Watermelon', category: 'fruits', url: PRODUCT_IMAGE_MAP['watermelon'], tags: ['watermelon', 'kallangadi', 'tarbooj'] },
  { id: 'p-muskmelon', name: 'Sweet Muskmelon', category: 'fruits', url: PRODUCT_IMAGE_MAP['muskmelon'], tags: ['muskmelon', 'kharbuj', 'cantaloupe'] },
  { id: 'p-grapes', name: 'Seedless Green Grapes', category: 'fruits', url: PRODUCT_IMAGE_MAP['grapes'], tags: ['grapes', 'sonaka', 'drakshi'] },
  { id: 'p-guava', name: 'Fresh White Guava', category: 'fruits', url: PRODUCT_IMAGE_MAP['guava'], tags: ['guava', 'amrood', 'seebe'] },
  { id: 'p-pineapple', name: 'Fresh Ripe Pineapple', category: 'fruits', url: PRODUCT_IMAGE_MAP['pineapple'], tags: ['pineapple', 'ananas'] },
  { id: 'p-kiwi', name: 'Green Kiwi Fruit', category: 'fruits', url: PRODUCT_IMAGE_MAP['kiwi'], tags: ['kiwi', 'zespri'] },
  { id: 'p-dragon-fruit', name: 'Red Dragon Fruit', category: 'fruits', url: PRODUCT_IMAGE_MAP['dragon-fruit'], tags: ['dragon fruit', 'pitaya'] },
  { id: 'p-strawberry', name: 'Fresh Red Strawberries', category: 'fruits', url: PRODUCT_IMAGE_MAP['strawberry'], tags: ['strawberry', 'berries'] },
  { id: 'p-blueberry', name: 'Fresh Blueberries', category: 'fruits', url: PRODUCT_IMAGE_MAP['blueberry'], tags: ['blueberry', 'berries'] },
  { id: 'p-pear', name: 'Crisp Sweet Green Pear', category: 'fruits', url: PRODUCT_IMAGE_MAP['pear'], tags: ['pear', 'nashpati'] },
  { id: 'p-peach', name: 'Juicy Himalayan Peaches', category: 'fruits', url: PRODUCT_IMAGE_MAP['peach'], tags: ['peach', 'aadoo'] },
  { id: 'p-plum', name: 'Fresh Indian Plums', category: 'fruits', url: PRODUCT_IMAGE_MAP['plum'], tags: ['plum', 'aloo bukhara'] },
  { id: 'p-coconut', name: 'Fresh Tender Coconut', category: 'fruits', url: PRODUCT_IMAGE_MAP['coconut'], tags: ['coconut', 'eleniru', 'nariyal'] },
  { id: 'p-avocado', name: 'Ripe Butter Fruit (Avocado)', category: 'fruits', url: PRODUCT_IMAGE_MAP['avocado'], tags: ['avocado', 'butter fruit'] },
  { id: 'p-jackfruit', name: 'Ripe Sweet Jackfruit', category: 'fruits', url: PRODUCT_IMAGE_MAP['jackfruit'], tags: ['jackfruit', 'halasina'] },
  { id: 'p-fig', name: 'Fresh Purple Figs (Anjeer)', category: 'fruits', url: PRODUCT_IMAGE_MAP['fig'], tags: ['fig', 'anjeer'] },
  { id: 'p-dates', name: 'Fresh Soft Dates (Khajoor)', category: 'fruits', url: PRODUCT_IMAGE_MAP['dates'], tags: ['dates', 'khajoor'] },
  { id: 'p-lychee', name: 'Fresh Shahi Lychee', category: 'fruits', url: PRODUCT_IMAGE_MAP['lychee'], tags: ['lychee', 'litchi'] },
  { id: 'p-apricot', name: 'Golden Hill Apricots', category: 'fruits', url: PRODUCT_IMAGE_MAP['apricot'], tags: ['apricot', 'jardalu'] },

  // Vegetables
  { id: 'p-potato', name: 'Golden Farm Potatoes', category: 'vegetables', url: PRODUCT_IMAGE_MAP['potato'], tags: ['potato', 'alugadde', 'aloo'] },
  { id: 'p-onion', name: 'Red Country Onion', category: 'vegetables', url: PRODUCT_IMAGE_MAP['onion'], tags: ['onion', 'eerulli', 'pyaz'] },
  { id: 'p-tomato', name: 'Vine-Ripened Country Tomatoes', category: 'vegetables', url: PRODUCT_IMAGE_MAP['tomato'], tags: ['tomato', 'nati tomato', 'tamatar'] },
  { id: 'p-carrot', name: 'Sweet Hill Carrots', category: 'vegetables', url: PRODUCT_IMAGE_MAP['carrot'], tags: ['carrot', 'gajar'] },
  { id: 'p-beetroot', name: 'Ruby Red Beetroot', category: 'vegetables', url: PRODUCT_IMAGE_MAP['beetroot'], tags: ['beetroot', 'beet'] },
  { id: 'p-radish', name: 'White Daikon Radish', category: 'vegetables', url: PRODUCT_IMAGE_MAP['radish'], tags: ['radish', 'moolangi', 'mooli'] },
  { id: 'p-turnip', name: 'Purple Top Turnip', category: 'vegetables', url: PRODUCT_IMAGE_MAP['turnip'], tags: ['turnip', 'shalgam'] },
  { id: 'p-cucumber', name: 'Crisp Green Cucumbers', category: 'vegetables', url: PRODUCT_IMAGE_MAP['cucumber'], tags: ['cucumber', 'southekayi', 'kheera'] },
  { id: 'p-capsicum', name: 'Green Bell Pepper (Capsicum)', category: 'vegetables', url: PRODUCT_IMAGE_MAP['capsicum'], tags: ['capsicum', 'bell pepper', 'shimla mirch'] },
  { id: 'p-green-chilli', name: 'Fresh Country Green Chilli', category: 'vegetables', url: PRODUCT_IMAGE_MAP['green-chilli'], tags: ['chilli', 'green chilli', 'mirchi', 'menasina'] },
  { id: 'p-red-chilli', name: 'Fresh Ripe Red Chilli', category: 'vegetables', url: PRODUCT_IMAGE_MAP['red-chilli'], tags: ['red chilli', 'lal mirch'] },
  { id: 'p-brinjal', name: 'Purple Farm Brinjal / Eggplant', category: 'vegetables', url: PRODUCT_IMAGE_MAP['brinjal'], tags: ['brinjal', 'eggplant', 'baingan', 'badanekayi'] },
  { id: 'p-lady-finger', name: 'Tender Green Lady Finger (Okra)', category: 'vegetables', url: PRODUCT_IMAGE_MAP['lady-finger'], tags: ['lady finger', 'okra', 'bhindi', 'bhendi'] },
  { id: 'p-cabbage', name: 'Crisp Green Cabbage', category: 'vegetables', url: PRODUCT_IMAGE_MAP['cabbage'], tags: ['cabbage', 'ele kose', 'patta gobhi'] },
  { id: 'p-cauliflower', name: 'Snow White Cauliflower', category: 'vegetables', url: PRODUCT_IMAGE_MAP['cauliflower'], tags: ['cauliflower', 'hoo kose', 'phool gobhi'] },
  { id: 'p-broccoli', name: 'Fresh Green Broccoli', category: 'vegetables', url: PRODUCT_IMAGE_MAP['broccoli'], tags: ['broccoli', 'green cauliflower'] },
  { id: 'p-green-peas', name: 'Tender Sweet Green Peas', category: 'vegetables', url: PRODUCT_IMAGE_MAP['green-peas'], tags: ['peas', 'green peas', 'matar', 'batani'] },
  { id: 'p-corn', name: 'Golden Sweet Corn', category: 'vegetables', url: PRODUCT_IMAGE_MAP['corn'], tags: ['corn', 'sweet corn', 'makka', 'musukina jola'] },
  { id: 'p-pumpkin', name: 'Golden Country Pumpkin', category: 'vegetables', url: PRODUCT_IMAGE_MAP['pumpkin'], tags: ['pumpkin', 'kaddu', 'kumbalakayi'] },
  { id: 'p-garlic', name: 'Fresh Country Garlic Bulbs', category: 'vegetables', url: PRODUCT_IMAGE_MAP['garlic'], tags: ['garlic', 'bellulli', 'lehsun'] },
  { id: 'p-ginger', name: 'Fresh Organic Ginger Rhizomes', category: 'vegetables', url: PRODUCT_IMAGE_MAP['ginger'], tags: ['ginger', 'shunti', 'adrak'] },
  { id: 'p-mushroom', name: 'Fresh Button Mushrooms', category: 'vegetables', url: PRODUCT_IMAGE_MAP['mushroom'], tags: ['mushroom', 'khumb'] },
  { id: 'p-zucchini', name: 'Fresh Green Zucchini', category: 'vegetables', url: PRODUCT_IMAGE_MAP['zucchini'], tags: ['zucchini', 'courgette'] },
  { id: 'p-french-beans', name: 'Tender Green French Beans', category: 'vegetables', url: PRODUCT_IMAGE_MAP['french-beans'], tags: ['beans', 'french beans', 'haricot'] },
  { id: 'p-sweet-potato', name: 'Organic Sweet Potatoes', category: 'vegetables', url: PRODUCT_IMAGE_MAP['sweet-potato'], tags: ['sweet potato', 'shakarkand', 'genasu'] },
  { id: 'p-bottle-gourd', name: 'Tender Bottle Gourd (Lauki)', category: 'vegetables', url: PRODUCT_IMAGE_MAP['bottle-gourd'], tags: ['bottle gourd', 'lauki', 'sorekayi'] },

  // Leafy Vegetables
  { id: 'p-spinach', name: 'Crisp Farm Spinach (Palak)', category: 'leafy-greens', url: PRODUCT_IMAGE_MAP['spinach'], tags: ['spinach', 'palak', 'soppu'] },
  { id: 'p-coriander', name: 'Aromatic Coriander Leaves', category: 'leafy-greens', url: PRODUCT_IMAGE_MAP['coriander'], tags: ['coriander', 'kothmir', 'kothambari'] },
  { id: 'p-mint', name: 'Crisp Fragrant Mint Leaves', category: 'leafy-greens', url: PRODUCT_IMAGE_MAP['mint'], tags: ['mint', 'pudina'] },
  { id: 'p-curry-leaves', name: 'Dark Green Curry Leaves', category: 'leafy-greens', url: PRODUCT_IMAGE_MAP['curry-leaves'], tags: ['curry leaves', 'kadi patta', 'karibevu'] },
  { id: 'p-methi', name: 'Tender Organic Fenugreek (Methi)', category: 'leafy-greens', url: PRODUCT_IMAGE_MAP['methi'], tags: ['methi', 'fenugreek', 'menthya soppu'] },
  { id: 'p-lettuce', name: 'Crisp Butterhead Lettuce', category: 'leafy-greens', url: PRODUCT_IMAGE_MAP['lettuce'], tags: ['lettuce', 'salad leaves'] },
  { id: 'p-spring-onion', name: 'Crisp Spring Onions', category: 'leafy-greens', url: PRODUCT_IMAGE_MAP['spring-onion'], tags: ['spring onion', 'scallions', 'eerulli huvu'] },

  // Dairy & Staples
  { id: 'p-milk', name: 'Desi Cow A2 Fresh Milk', category: 'dairy-eggs', url: PRODUCT_IMAGE_MAP['milk'], tags: ['milk', 'a2 milk', 'dairy', 'haalu'] },
  { id: 'p-butter', name: 'Hand-Churned Vedic Butter', category: 'dairy-eggs', url: PRODUCT_IMAGE_MAP['butter'], tags: ['butter', 'makhan', 'benne'] },
  { id: 'p-paneer', name: 'Fresh Soft Malai Paneer', category: 'dairy-eggs', url: PRODUCT_IMAGE_MAP['paneer'], tags: ['paneer', 'cottage cheese'] },
  { id: 'p-eggs', name: 'Free-Range Country Eggs', category: 'dairy-eggs', url: PRODUCT_IMAGE_MAP['eggs'], tags: ['eggs', 'country eggs', 'motte'] },
  { id: 'p-oil', name: 'Cold-Pressed Groundnut Oil', category: 'organic-staples', url: PRODUCT_IMAGE_MAP['oil'], tags: ['oil', 'cold pressed', 'groundnut oil', 'enne'] },
  { id: 'p-honey', name: 'Raw Forest Hill Honey', category: 'organic-staples', url: PRODUCT_IMAGE_MAP['honey'], tags: ['honey', 'raw honey', 'thenu'] },
  { id: 'p-millet', name: 'Unpolished Foxtail Millet', category: 'organic-staples', url: PRODUCT_IMAGE_MAP['millet'], tags: ['millet', 'navane', 'grain'] },
  { id: 'p-flour', name: 'Stone-Ground Wheat Flour', category: 'organic-staples', url: PRODUCT_IMAGE_MAP['flour'], tags: ['flour', 'atta', 'wheat flour', 'godhi hittu'] }
];

// Helper: Normalize product name or ID to lookup key
export function normalizeProductKey(input: string): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .replace(/^fruit-|^veg-|^leafy-|^dairy-|^staple-/, '')
    .replace(/\(.*?\)/g, '') // remove parentheticals like (Royal Delicious)
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Function to resolve realistic photo for any product name, id, or description
export function getRealisticProductImage(productNameOrId: string, category?: string): string {
  if (!productNameOrId) {
    return PRODUCT_IMAGE_MAP['apple'];
  }

  const raw = productNameOrId.toLowerCase();
  const normalized = normalizeProductKey(productNameOrId);

  // 1. Direct key match
  if (PRODUCT_IMAGE_MAP[normalized]) {
    return PRODUCT_IMAGE_MAP[normalized];
  }

  // 2. Specific item detection rules
  // Fruits
  if (raw.includes('green apple') || raw.includes('granny smith')) return PRODUCT_IMAGE_MAP['green-apple'];
  if (raw.includes('apple')) return PRODUCT_IMAGE_MAP['apple'];
  if (raw.includes('banana') || raw.includes('yelakki') || raw.includes('robusta') || raw.includes('bale')) return PRODUCT_IMAGE_MAP['banana'];
  if (raw.includes('mosambi') || raw.includes('sweet lime')) return PRODUCT_IMAGE_MAP['sweet-lime'];
  if (raw.includes('orange') || raw.includes('santra') || raw.includes('kithale')) return PRODUCT_IMAGE_MAP['orange'];
  if (raw.includes('lemon') || raw.includes('nimbe')) return PRODUCT_IMAGE_MAP['lemon'];
  if (raw.includes('mango') || raw.includes('alphonso') || raw.includes('badami') || raw.includes('mavina')) return PRODUCT_IMAGE_MAP['mango'];
  if (raw.includes('pomegranate') || raw.includes('dalimbe') || raw.includes('anar')) return PRODUCT_IMAGE_MAP['pomegranate'];
  if (raw.includes('papaya') || raw.includes('parangi')) return PRODUCT_IMAGE_MAP['papaya'];
  if (raw.includes('watermelon') || raw.includes('kallangadi') || raw.includes('tarbooj')) return PRODUCT_IMAGE_MAP['watermelon'];
  if (raw.includes('muskmelon') || raw.includes('kharbuj') || raw.includes('cantaloupe')) return PRODUCT_IMAGE_MAP['muskmelon'];
  if (raw.includes('grape') || raw.includes('drakshi')) return PRODUCT_IMAGE_MAP['grapes'];
  if (raw.includes('guava') || raw.includes('seebe') || raw.includes('amrood')) return PRODUCT_IMAGE_MAP['guava'];
  if (raw.includes('pineapple') || raw.includes('ananas')) return PRODUCT_IMAGE_MAP['pineapple'];
  if (raw.includes('kiwi')) return PRODUCT_IMAGE_MAP['kiwi'];
  if (raw.includes('dragon fruit') || raw.includes('pitaya')) return PRODUCT_IMAGE_MAP['dragon-fruit'];
  if (raw.includes('strawberry')) return PRODUCT_IMAGE_MAP['strawberry'];
  if (raw.includes('blueberry')) return PRODUCT_IMAGE_MAP['blueberry'];
  if (raw.includes('pear') || raw.includes('nashpati')) return PRODUCT_IMAGE_MAP['pear'];
  if (raw.includes('peach') || raw.includes('aadoo')) return PRODUCT_IMAGE_MAP['peach'];
  if (raw.includes('plum') || raw.includes('aloo bukhara')) return PRODUCT_IMAGE_MAP['plum'];
  if (raw.includes('chikoo') || raw.includes('sapota')) return PRODUCT_IMAGE_MAP['chikoo'];
  if (raw.includes('custard apple') || raw.includes('sitaphal')) return PRODUCT_IMAGE_MAP['custard-apple'];
  if (raw.includes('coconut') || raw.includes('eleniru') || raw.includes('thengu')) return PRODUCT_IMAGE_MAP['coconut'];
  if (raw.includes('avocado') || raw.includes('butter fruit')) return PRODUCT_IMAGE_MAP['avocado'];
  if (raw.includes('jackfruit') || raw.includes('halasina')) return PRODUCT_IMAGE_MAP['jackfruit'];
  if (raw.includes('fig') || raw.includes('anjeer')) return PRODUCT_IMAGE_MAP['fig'];
  if (raw.includes('date') || raw.includes('khajoor')) return PRODUCT_IMAGE_MAP['dates'];
  if (raw.includes('lychee') || raw.includes('litchi')) return PRODUCT_IMAGE_MAP['lychee'];
  if (raw.includes('apricot') || raw.includes('jardalu')) return PRODUCT_IMAGE_MAP['apricot'];

  // Vegetables
  if (raw.includes('potato') || raw.includes('alugadde') || raw.includes('aloo')) return PRODUCT_IMAGE_MAP['potato'];
  if (raw.includes('onion') || raw.includes('eerulli') || raw.includes('pyaz')) return PRODUCT_IMAGE_MAP['onion'];
  if (raw.includes('tomato') || raw.includes('tamatar')) return PRODUCT_IMAGE_MAP['tomato'];
  if (raw.includes('carrot') || raw.includes('gajar')) return PRODUCT_IMAGE_MAP['carrot'];
  if (raw.includes('beetroot') || raw.includes('beet')) return PRODUCT_IMAGE_MAP['beetroot'];
  if (raw.includes('radish') || raw.includes('moolangi') || raw.includes('mooli')) return PRODUCT_IMAGE_MAP['radish'];
  if (raw.includes('turnip') || raw.includes('shalgam')) return PRODUCT_IMAGE_MAP['turnip'];
  if (raw.includes('cucumber') || raw.includes('southekayi') || raw.includes('kheera')) return PRODUCT_IMAGE_MAP['cucumber'];
  if (raw.includes('capsicum') || raw.includes('bell pepper') || raw.includes('shimla')) return PRODUCT_IMAGE_MAP['capsicum'];
  if (raw.includes('red chilli') || raw.includes('kempu menasina')) return PRODUCT_IMAGE_MAP['red-chilli'];
  if (raw.includes('chilli') || raw.includes('menasina') || raw.includes('mirchi')) return PRODUCT_IMAGE_MAP['green-chilli'];
  if (raw.includes('brinjal') || raw.includes('eggplant') || raw.includes('badanekayi') || raw.includes('baingan')) return PRODUCT_IMAGE_MAP['brinjal'];
  if (raw.includes('okra') || raw.includes('lady finger') || raw.includes('bhendi') || raw.includes('bhindi')) return PRODUCT_IMAGE_MAP['lady-finger'];
  if (raw.includes('cauliflower') || raw.includes('hoo kose') || raw.includes('gobhi')) return PRODUCT_IMAGE_MAP['cauliflower'];
  if (raw.includes('cabbage') || raw.includes('ele kose')) return PRODUCT_IMAGE_MAP['cabbage'];
  if (raw.includes('broccoli')) return PRODUCT_IMAGE_MAP['broccoli'];
  if (raw.includes('green peas') || raw.includes('peas') || raw.includes('batani') || raw.includes('matar')) return PRODUCT_IMAGE_MAP['green-peas'];
  if (raw.includes('corn') || raw.includes('jola') || raw.includes('makka')) return PRODUCT_IMAGE_MAP['corn'];
  if (raw.includes('bottle gourd') || raw.includes('lauki') || raw.includes('sorekayi')) return PRODUCT_IMAGE_MAP['bottle-gourd'];
  if (raw.includes('ridge gourd') || raw.includes('hirekayi')) return PRODUCT_IMAGE_MAP['ridge-gourd'];
  if (raw.includes('bitter gourd') || raw.includes('karela') || raw.includes('hagalakayi')) return PRODUCT_IMAGE_MAP['bitter-gourd'];
  if (raw.includes('snake gourd') || raw.includes('padavalakayi')) return PRODUCT_IMAGE_MAP['snake-gourd'];
  if (raw.includes('pumpkin') || raw.includes('kaddu') || raw.includes('kumbalakayi')) return PRODUCT_IMAGE_MAP['pumpkin'];
  if (raw.includes('ash gourd') || raw.includes('boodukumbala') || raw.includes('petha')) return PRODUCT_IMAGE_MAP['ash-gourd'];
  if (raw.includes('drumstick') || raw.includes('moringa') || raw.includes('nuggekayi')) return PRODUCT_IMAGE_MAP['drumstick'];
  if (raw.includes('sweet potato') || raw.includes('genasu') || raw.includes('shakarkand')) return PRODUCT_IMAGE_MAP['sweet-potato'];
  if (raw.includes('ginger') || raw.includes('shunti') || raw.includes('adrak')) return PRODUCT_IMAGE_MAP['ginger'];
  if (raw.includes('garlic') || raw.includes('bellulli') || raw.includes('lehsun')) return PRODUCT_IMAGE_MAP['garlic'];
  if (raw.includes('mushroom') || raw.includes('khumb') || raw.includes('anabe')) return PRODUCT_IMAGE_MAP['mushroom'];
  if (raw.includes('zucchini')) return PRODUCT_IMAGE_MAP['zucchini'];
  if (raw.includes('french beans') || raw.includes('beans') || raw.includes('hurali')) return PRODUCT_IMAGE_MAP['french-beans'];
  if (raw.includes('cluster beans') || raw.includes('gorikayi') || raw.includes('gavar')) return PRODUCT_IMAGE_MAP['cluster-beans'];
  if (raw.includes('ivy gourd') || raw.includes('tindora') || raw.includes('thondekayi')) return PRODUCT_IMAGE_MAP['ivy-gourd'];
  if (raw.includes('chayote') || raw.includes('seemebadnekayi') || raw.includes('chow chow')) return PRODUCT_IMAGE_MAP['chayote'];
  if (raw.includes('raw papaya')) return PRODUCT_IMAGE_MAP['raw-papaya'];
  if (raw.includes('raw mango') || raw.includes('mavinkayi')) return PRODUCT_IMAGE_MAP['raw-mango'];
  if (raw.includes('yam') || raw.includes('suvarnagedde') || raw.includes('jimikand')) return PRODUCT_IMAGE_MAP['yam'];
  if (raw.includes('colocasia') || raw.includes('arbi') || raw.includes('kesavina')) return PRODUCT_IMAGE_MAP['colocasia'];

  // Leafy Greens
  if (raw.includes('spinach') || raw.includes('palak')) return PRODUCT_IMAGE_MAP['spinach'];
  if (raw.includes('coriander') || raw.includes('kothambari') || raw.includes('cilantro')) return PRODUCT_IMAGE_MAP['coriander'];
  if (raw.includes('mint') || raw.includes('pudina')) return PRODUCT_IMAGE_MAP['mint'];
  if (raw.includes('curry leaves') || raw.includes('karibevu')) return PRODUCT_IMAGE_MAP['curry-leaves'];
  if (raw.includes('methi') || raw.includes('fenugreek') || raw.includes('menthya')) return PRODUCT_IMAGE_MAP['methi'];
  if (raw.includes('amaranth') || raw.includes('dantu')) return PRODUCT_IMAGE_MAP['amaranth-leaves'];
  if (raw.includes('dill') || raw.includes('sabbakki')) return PRODUCT_IMAGE_MAP['dill-leaves'];
  if (raw.includes('spring onion') || raw.includes('scallion')) return PRODUCT_IMAGE_MAP['spring-onion'];
  if (raw.includes('lettuce')) return PRODUCT_IMAGE_MAP['lettuce'];
  if (raw.includes('gongura') || raw.includes('sorrel') || raw.includes('punti')) return PRODUCT_IMAGE_MAP['gongura'];
  if (raw.includes('drumstick leaves') || raw.includes('nugge soppu')) return PRODUCT_IMAGE_MAP['drumstick-leaves'];
  if (raw.includes('basale') || raw.includes('malabar spinach')) return PRODUCT_IMAGE_MAP['basale-soppu'];
  if (raw.includes('sprout')) return PRODUCT_IMAGE_MAP['sprouts'];

  // Dairy & Staples
  if (raw.includes('milk') || raw.includes('haalu')) return PRODUCT_IMAGE_MAP['milk'];
  if (raw.includes('butter') || raw.includes('benne') || raw.includes('makhan')) return PRODUCT_IMAGE_MAP['butter'];
  if (raw.includes('paneer')) return PRODUCT_IMAGE_MAP['paneer'];
  if (raw.includes('egg') || raw.includes('motte')) return PRODUCT_IMAGE_MAP['eggs'];
  if (raw.includes('oil') || raw.includes('enne') || raw.includes('tel')) return PRODUCT_IMAGE_MAP['oil'];
  if (raw.includes('honey') || raw.includes('thenu') || raw.includes('shahad')) return PRODUCT_IMAGE_MAP['honey'];
  if (raw.includes('millet') || raw.includes('navane')) return PRODUCT_IMAGE_MAP['millet'];
  if (raw.includes('flour') || raw.includes('atta') || raw.includes('wheat') || raw.includes('godhi')) return PRODUCT_IMAGE_MAP['flour'];

  // Category based fallback
  if (category === 'fruits') return PRODUCT_IMAGE_MAP['apple'];
  if (category === 'vegetables') return PRODUCT_IMAGE_MAP['tomato'];
  if (category === 'leafy-greens') return PRODUCT_IMAGE_MAP['spinach'];
  if (category === 'dairy-eggs') return PRODUCT_IMAGE_MAP['milk'];
  if (category === 'organic-staples') return PRODUCT_IMAGE_MAP['oil'];

  return PRODUCT_IMAGE_MAP['apple'];
}
