import { MEAL_SLOTS } from './tnFoods';
import {
  FoodItem,
  IngredientCategory,
  MealSlotEntry,
  MealSlotId,
  RawMaterial,
} from '../types/nutrition';

export const INGREDIENT_CATEGORIES: Array<{
  id: IngredientCategory;
  label: string;
}> = [
  { id: 'grains_millets', label: 'Grains & Millets' },
  { id: 'greens', label: 'Greens & Produce' },
  { id: 'pulses_seeds', label: 'Pulses & Seeds' },
  { id: 'spices_herbs', label: 'Spices & Herbs' },
  { id: 'non_veg', label: 'Non-Veg' },
  { id: 'dairy_drinks', label: 'Dairy & Drinks' },
];

export const TN_INGREDIENTS: RawMaterial[] = [
  // 1. GRAINS & MILLETS
  {
    id: 'ing_ragi',
    name: 'Ragi (Finger Millet)',
    tamilName: 'கேழ்வரகு / ராகி',
    category: 'grains_millets',
    servingSize: '60 g dry flour / 1 cup cooked',
    calories: 208,
    protein: 4.5,
    carbs: 43.2,
    fat: 1.1,
    fiber: 6.8,
    iron: 2.8,
    calcium: 215,
    zinc: 1.4,
    magnesium: 82,
    bComplex: '18% DV (B1, B3, B6)',
    choline: 14,
    vitC: 0,
    sodiumMg: 7,
    systems: ['bones', 'brain', 'endocrine', 'heart'],
    bodyPartsSummary: 'Spine, knees, ligaments, pancreas & brain glucose steadiness',
    healthBenefits:
      'Highest plant calcium among cereals for bone density and ligaments; slow-release starch keeps blood sugar steady during long IT coding/study blocks.',
    linkedFoodId: 'bf_ragi_idli_sambar',
    defaultSlotId: 'breakfast',
  },
  {
    id: 'ing_kambu',
    name: 'Kambu (Pearl Millet)',
    tamilName: 'கம்பு',
    category: 'grains_millets',
    servingSize: '60 g dry grain / 1 cup cooked',
    calories: 218,
    protein: 6.9,
    carbs: 40.5,
    fat: 3.1,
    fiber: 5.2,
    iron: 4.8,
    calcium: 26,
    zinc: 1.9,
    magnesium: 76,
    bComplex: '24% DV (Niacin, B6, Folate)',
    choline: 18,
    vitC: 0,
    sodiumMg: 6,
    systems: ['heart', 'brain', 'digestive', 'endocrine', 'fertility'],
    bodyPartsSummary: 'Red blood cells, gut microbiome, nervous system & thyroid energy',
    healthBenefits:
      'Rich in non-heme iron, zinc, and B-vitamins to prevent mid-day fatigue; fermented as kambu koozh it provides gut-cooling probiotics.',
    linkedFoodId: 'bf_kambu_dosai_ellu',
    defaultSlotId: 'breakfast',
  },
  {
    id: 'ing_thinai',
    name: 'Thinai (Foxtail Millet)',
    tamilName: 'தினை அரிசி',
    category: 'grains_millets',
    servingSize: '60 g dry grain / 1 cup cooked',
    calories: 212,
    protein: 7.4,
    carbs: 39.8,
    fat: 2.6,
    fiber: 4.8,
    iron: 1.8,
    calcium: 19,
    zinc: 1.5,
    magnesium: 68,
    bComplex: '22% DV (B1 Thiamine, B6)',
    choline: 16,
    vitC: 0,
    sodiumMg: 4,
    systems: ['brain', 'eyes', 'heart', 'endocrine'],
    bodyPartsSummary: 'Cerebral cortex, optic nerves, cardiovascular wall & blood glucose',
    healthBenefits:
      'Low-GI millet rich in thiamine (B1) and lecithin-building lipids that sustain mental focus and protect nerve sheaths without sugar spikes.',
    linkedFoodId: 'bf_thinai_pongal_chutney',
    defaultSlotId: 'breakfast',
  },
  {
    id: 'ing_varagu',
    name: 'Varagu (Kodo Millet)',
    tamilName: 'வரகு அரிசி',
    category: 'grains_millets',
    servingSize: '60 g dry grain / 1 cup cooked',
    calories: 204,
    protein: 5.2,
    carbs: 41.2,
    fat: 1.8,
    fiber: 5.6,
    iron: 1.6,
    calcium: 16,
    zinc: 1.2,
    magnesium: 64,
    bComplex: '19% DV (B3, B6, Folate)',
    choline: 15,
    vitC: 0,
    sodiumMg: 5,
    systems: ['endocrine', 'brain', 'digestive', 'heart'],
    bodyPartsSummary: 'Insulin receptors, liver lipid metabolism & nervous system',
    healthBenefits:
      'Ultra-light glycemic response and polyphenol antioxidants prevent post-lunch brain fog and support healthy triglyceride balance.',
    linkedFoodId: 'ln_varagu_sadam_murungai',
    defaultSlotId: 'lunch',
  },
  {
    id: 'ing_samai_kudiraivali',
    name: 'Samai & Kudiraivali (Little & Barnyard Millets)',
    tamilName: 'சாமை & குதிரைவாலி',
    category: 'grains_millets',
    servingSize: '60 g dry grain / 1 cup cooked',
    calories: 202,
    protein: 4.8,
    carbs: 40.0,
    fat: 2.2,
    fiber: 6.4,
    iron: 3.1,
    calcium: 14,
    zinc: 1.4,
    magnesium: 62,
    bComplex: '18% DV (B1, B3)',
    choline: 14,
    vitC: 0,
    sodiumMg: 5,
    systems: ['endocrine', 'digestive', 'brain', 'fertility'],
    bodyPartsSummary: 'Thyroid-metabolic axis, colon motility & sustained focus',
    healthBenefits:
      'High soluble and insoluble fiber clears sluggish digestion, keeps post-meal glucose flat, and supports both weight loss and metabolic health.',
    linkedFoodId: 'ln_kudiraivali_kovakkai_inji',
    defaultSlotId: 'lunch',
  },
  {
    id: 'ing_parboiled_mapillai_rice',
    name: 'Ponni Parboiled / Mapillai Samba Rice',
    tamilName: 'புழுங்கல் அரிசி / மாப்பிள்ளை சம்பா',
    category: 'grains_millets',
    servingSize: '70 g dry rice / 1 cup cooked',
    calories: 245,
    protein: 5.4,
    carbs: 53.0,
    fat: 0.9,
    fiber: 2.8,
    iron: 2.1,
    calcium: 18,
    zinc: 1.3,
    magnesium: 52,
    bComplex: '21% DV (B1, B3, B6)',
    choline: 12,
    vitC: 0,
    sodiumMg: 4,
    systems: ['digestive', 'brain', 'heart', 'fertility'],
    bodyPartsSummary: 'Stomach mucosa, muscles, red blood cells & sperm stamina',
    healthBenefits:
      'Parboiling drives B-vitamins into the grain; Mapillai Samba adds anthocyanins and iron; fermented overnight as pazhaya sadam it yields B12 and gut probiotics.',
    linkedFoodId: 'bf_pazhaya_sadam_neer_mor',
    defaultSlotId: 'breakfast',
  },
  {
    id: 'ing_barley_wheat',
    name: 'Pearl Barley & Samba Godhumai Rava',
    tamilName: 'பார்லி அரிசி & சம்பா கோதுமை ரவை',
    category: 'grains_millets',
    servingSize: '40 g dry / 1 cup broth or kichdi',
    calories: 142,
    protein: 4.6,
    carbs: 29.8,
    fat: 0.7,
    fiber: 5.8,
    iron: 1.3,
    calcium: 16,
    zinc: 1.1,
    magnesium: 42,
    bComplex: '16% DV (B1, B3, B6)',
    choline: 14,
    vitC: 0,
    sodiumMg: 5,
    systems: ['renal', 'digestive', 'heart', 'endocrine'],
    bodyPartsSummary: 'Kidneys, urinary bladder, arterial lining & gut transit',
    healthBenefits:
      'Beta-glucan fiber lowers LDL cholesterol while barley thanni acts as a gentle natural diuretic flushing urinary tract and kidney heat.',
    linkedFoodId: 'mm_barley_vazhaithandu_juice',
    defaultSlotId: 'mid_morning',
  },

  // 2. GREENS & PRODUCE
  {
    id: 'ing_murungai_keerai',
    name: 'Murungai Keerai (Drumstick Leaves)',
    tamilName: 'முருங்கைக் கீரை',
    category: 'greens',
    servingSize: '1 cup fresh leaves (60 g)',
    calories: 44,
    protein: 4.8,
    carbs: 5.6,
    fat: 0.9,
    fiber: 2.2,
    iron: 3.4,
    calcium: 165,
    zinc: 0.6,
    magnesium: 56,
    bComplex: '18% DV (B2, B6, Folate)',
    choline: 22,
    vitC: 52,
    omega3Mg: 95,
    sodiumMg: 14,
    systems: ['heart', 'eyes', 'bones', 'immune', 'integumentary'],
    bodyPartsSummary: 'Retina, hemoglobin, bone matrix, hair follicles & immune cells',
    healthBenefits:
      'Tamil super-green packed with plant iron, calcium, beta-carotene (eyes), and vitamin C for skin collagen and screen-strained vision.',
    linkedFoodId: 'ln_varagu_sadam_murungai',
    defaultSlotId: 'lunch',
  },
  {
    id: 'ing_murungai_poo',
    name: 'Murungai Poo (Drumstick Flowers)',
    tamilName: 'முருங்கைப்பூ',
    category: 'greens',
    servingSize: '30 g fresh flowers (1/2 cup)',
    calories: 24,
    protein: 1.8,
    carbs: 3.4,
    fat: 0.3,
    fiber: 1.6,
    iron: 1.1,
    calcium: 36,
    zinc: 0.9,
    magnesium: 24,
    bComplex: '10% DV (B6, Folate)',
    choline: 14,
    vitC: 22,
    sodiumMg: 6,
    systems: ['fertility', 'bones', 'lungs', 'brain'],
    bodyPartsSummary: 'Male reproductive glands, sperm motility, joints & lungs',
    healthBenefits:
      'Classic Siddha & Tamil fertility food that improves sperm count, motility, seminal vitality, and cools excess body heat.',
    linkedFoodId: 'nt_murungai_poo_paal',
    defaultSlotId: 'nighttime',
  },
  {
    id: 'ing_manathakkali',
    name: 'Manathakkali Keerai (Black Nightshade Greens)',
    tamilName: 'மணத்தக்காளி கீரை',
    category: 'greens',
    servingSize: '1 cup cooked greens (80 g)',
    calories: 38,
    protein: 3.6,
    carbs: 4.8,
    fat: 0.5,
    fiber: 3.2,
    iron: 3.8,
    calcium: 142,
    zinc: 0.6,
    magnesium: 48,
    bComplex: '14% DV (B2, Folate)',
    choline: 18,
    vitC: 28,
    sodiumMg: 18,
    systems: ['digestive', 'immune', 'integumentary', 'heart'],
    bodyPartsSummary: 'Stomach lining, mouth ulcers, liver parenchyma & blood',
    healthBenefits:
      'Premier Tamil Nadu gut-and-liver healer that repairs gastric acidity, mouth ulcers, and fatty-liver inflammation from desk work.',
    linkedFoodId: 'ln_parboiled_manathakkali_kothavarangai',
    defaultSlotId: 'lunch',
  },
  {
    id: 'ing_vallarai_ponnanganni',
    name: 'Vallarai & Ponnanganni Keerai',
    tamilName: 'வல்லாரை & பொன்னாங்கண்ணி கீரை',
    category: 'greens',
    servingSize: '1 cup fresh greens (65 g)',
    calories: 34,
    protein: 2.9,
    carbs: 4.5,
    fat: 0.5,
    fiber: 2.6,
    iron: 2.8,
    calcium: 118,
    zinc: 0.5,
    magnesium: 42,
    bComplex: '12% DV (B2, Folate)',
    choline: 16,
    vitC: 30,
    sodiumMg: 15,
    systems: ['brain', 'eyes', 'integumentary', 'heart'],
    bodyPartsSummary: 'Hippocampus (memory), optic retina, skin radiance & hair roots',
    healthBenefits:
      'Vallarai (Brahmi) boosts neural blood flow and memory retention for IT study; Ponnanganni relieves computer eye strain and nourishes skin.',
    linkedFoodId: 'em_vallarai_buttermilk',
    defaultSlotId: 'early_morning',
  },
  {
    id: 'ing_thoothuvalai_mookirattai',
    name: 'Thoothuvalai & Mookirattai Keerai',
    tamilName: 'தூதுவளை & மூக்கிரட்டை கீரை',
    category: 'greens',
    servingSize: '1/2 cup greens (45 g)',
    calories: 26,
    protein: 2.4,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    iron: 2.4,
    calcium: 105,
    zinc: 0.5,
    magnesium: 38,
    bComplex: '10% DV',
    choline: 12,
    vitC: 24,
    sodiumMg: 12,
    systems: ['lungs', 'renal', 'immune'],
    bodyPartsSummary: 'Bronchial airways, sinuses, nephrons & urinary tract',
    healthBenefits:
      'Thoothuvalai clears phlegm, sinus congestion, and wheezing; Mookirattai (Punarnava) reduces fluid retention and protects kidney filtration.',
    linkedFoodId: 'ln_kudiraivali_thoothuvalai',
    defaultSlotId: 'lunch',
  },
  {
    id: 'ing_vazhaithandu',
    name: 'Vazhaithandu (Banana Stem)',
    tamilName: 'வாழைத்தண்டு',
    category: 'greens',
    servingSize: '1 cup chopped (120 g)',
    calories: 34,
    protein: 0.9,
    carbs: 7.4,
    fat: 0.2,
    fiber: 4.4,
    iron: 0.9,
    calcium: 32,
    zinc: 0.3,
    magnesium: 28,
    bComplex: '8% DV (B6)',
    choline: 8,
    vitC: 10,
    sodiumMg: 14,
    prepNote: 'Remove fibrous strands while slicing; drink juice fresh or cook in kootu.',
    systems: ['renal', 'digestive', 'endocrine'],
    bodyPartsSummary: 'Kidneys, urinary tract, gall bladder & bowel wall',
    healthBenefits:
      'Potassium-rich diuretic that prevents kidney stones, flushes excess sodium (great after karuvadu meals), and aids calorie-deficit satiety.',
    linkedFoodId: 'mm_barley_vazhaithandu_juice',
    defaultSlotId: 'mid_morning',
  },
  {
    id: 'ing_kothavarangai_kovakkai',
    name: 'Kothavarangai (Cluster Beans) & Kovakkai (Ivy Gourd)',
    tamilName: 'கொத்தவரங்காய் & கோவக்காய்',
    category: 'greens',
    servingSize: '1 cup chopped (120 g)',
    calories: 48,
    protein: 3.2,
    carbs: 8.6,
    fat: 0.4,
    fiber: 4.8,
    iron: 1.8,
    calcium: 92,
    zinc: 0.5,
    magnesium: 46,
    bComplex: '14% DV (Folate, B6)',
    choline: 14,
    vitC: 26,
    sodiumMg: 12,
    systems: ['digestive', 'endocrine', 'heart'],
    bodyPartsSummary: 'Pancreatic beta-cells, colon wall & blood vessel lining',
    healthBenefits:
      'Cluster bean guar-gum fiber lowers cholesterol and feeds gut bacteria; ivy gourd naturally blunts post-meal blood sugar surges.',
    linkedFoodId: 'ln_kudiraivali_kovakkai_inji',
    defaultSlotId: 'lunch',
  },
  {
    id: 'ing_nelli_kattralai',
    name: 'Nelli (Amla) & Kattralai (Aloe Vera Gel)',
    tamilName: 'நெல்லிக்காய் & கற்றாழை',
    category: 'greens',
    servingSize: '1 large amla + 2 tbsp washed aloe gel',
    calories: 28,
    protein: 0.6,
    carbs: 6.4,
    fat: 0.2,
    fiber: 2.4,
    iron: 0.9,
    calcium: 26,
    zinc: 0.2,
    magnesium: 14,
    bComplex: '6% DV',
    choline: 6,
    vitC: 115,
    sodiumMg: 8,
    prepNote: 'Wash aloe inner gel 5–7 times in water to remove yellow aloin sap.',
    systems: ['immune', 'integumentary', 'lungs', 'eyes', 'digestive'],
    bodyPartsSummary: 'Skin collagen, hair roots, white blood cells, stomach & eyes',
    healthBenefits:
      'Fresh nelli provides bioavailable Vitamin C for iron absorption, lung defense, and collagen; kattralai cools gut acidity and hydrates skin.',
    linkedFoodId: 'em_kattralai_nelli_juice',
    defaultSlotId: 'early_morning',
  },
  {
    id: 'ing_banana_guava',
    name: 'Sevvazhai (Red Banana) & Koyya (Guava)',
    tamilName: 'செவ்வாழைப் பழம் & கொய்யாப்பழம்',
    category: 'greens',
    servingSize: '1 medium fruit (120 g)',
    calories: 98,
    protein: 1.9,
    carbs: 23.0,
    fat: 0.5,
    fiber: 4.8,
    iron: 0.6,
    calcium: 18,
    zinc: 0.4,
    magnesium: 34,
    bComplex: '18% DV (B6, Folate)',
    choline: 11,
    vitC: 120,
    sodiumMg: 3,
    systems: ['heart', 'eyes', 'lungs', 'immune', 'fertility'],
    bodyPartsSummary: 'Heart rhythm, retina, respiratory mucosa & muscle glycogen',
    healthBenefits:
      'Guava supplies >100% daily Vitamin C on a budget for lungs & immunity; Sevvazhai delivers potassium, B6, and clean carbs for weight gain & stamina.',
    linkedFoodId: 'mm_guava_pumpkin',
    defaultSlotId: 'mid_morning',
  },

  // 3. PULSES & SEEDS
  {
    id: 'ing_verkadalai',
    name: 'Verkadalai (Local Peanuts)',
    tamilName: 'வேர்க்கடலை',
    category: 'pulses_seeds',
    servingSize: '30 g (boiled or dry-roasted)',
    calories: 170,
    protein: 7.7,
    carbs: 4.8,
    fat: 14.5,
    fiber: 2.6,
    iron: 1.3,
    calcium: 28,
    zinc: 1.0,
    magnesium: 52,
    bComplex: '22% DV (Niacin B3, Folate, Biotin)',
    choline: 16,
    vitC: 0,
    sodiumMg: 5,
    prepNote: 'No expensive almonds/walnuts needed—local boiled or roasted peanuts match nutrient density.',
    systems: ['brain', 'fertility', 'heart', 'integumentary'],
    bodyPartsSummary: 'Brain neurotransmitters, vascular endothelium, sperm motility & hair',
    healthBenefits:
      'Budget powerhouse of niacin (B3), arginine, biotin, and monounsaturated fats supporting IT cognitive stamina, blood flow, and weight gain.',
    linkedFoodId: 'es_verkadalai_sundal',
    defaultSlotId: 'evening_snack',
  },
  {
    id: 'ing_pottukadalai',
    name: 'Pottukadalai (Roasted Bengal Gram)',
    tamilName: 'பொட்டுக்கடலை',
    category: 'pulses_seeds',
    servingSize: '30 g roasted gram',
    calories: 112,
    protein: 6.4,
    carbs: 17.5,
    fat: 1.8,
    fiber: 3.8,
    iron: 1.9,
    calcium: 22,
    zinc: 1.1,
    magnesium: 44,
    bComplex: '18% DV (Folate, B1, B6)',
    choline: 24,
    vitC: 0,
    sodiumMg: 6,
    systems: ['brain', 'fertility', 'bones', 'heart'],
    bodyPartsSummary: 'Muscles, sperm vitality, myelin nerve coating & hemoglobin',
    healthBenefits:
      'Oil-free crunchy protein and choline snack ideal for desk work, chutney nutrition, and steady energy across both fat-loss and weight-gain plans.',
    linkedFoodId: 'es_pottukadalai_ellu_mix',
    defaultSlotId: 'evening_snack',
  },
  {
    id: 'ing_ellu',
    name: 'Black & White Ellu (Sesame Seeds)',
    tamilName: 'கருப்பு / வெள்ளை எள்ளு',
    category: 'pulses_seeds',
    servingSize: '15 g (1 tbsp roasted)',
    calories: 86,
    protein: 2.7,
    carbs: 3.5,
    fat: 7.4,
    fiber: 1.8,
    iron: 2.2,
    calcium: 146,
    zinc: 1.2,
    magnesium: 53,
    bComplex: '12% DV (B1, B6)',
    choline: 8,
    vitC: 0,
    omega3Mg: 65,
    sodiumMg: 2,
    systems: ['fertility', 'bones', 'heart', 'integumentary'],
    bodyPartsSummary: 'Bones, teeth, sperm quality, thyroid trace minerals & scalp hair',
    healthBenefits:
      'Concentrated zinc, selenium, copper, iron, and calcium in 1 tbsp; strengthens joints, boosts male fertility/testosterone, and adds clean calories for weight gain.',
    linkedFoodId: 'nt_ellu_paal',
    defaultSlotId: 'nighttime',
  },
  {
    id: 'ing_pumpkin_seeds',
    name: 'Poosani Vidhai (Pumpkin Seeds)',
    tamilName: 'பூசணி விதை',
    category: 'pulses_seeds',
    servingSize: '15 g (1 tbsp dry-roasted)',
    calories: 84,
    protein: 4.5,
    carbs: 2.1,
    fat: 7.1,
    fiber: 1.0,
    iron: 1.3,
    calcium: 8,
    zinc: 1.6,
    magnesium: 82,
    bComplex: '8% DV (B2, Niacin)',
    choline: 10,
    vitC: 0,
    omega3Mg: 45,
    sodiumMg: 3,
    systems: ['fertility', 'brain', 'bones', 'heart'],
    bodyPartsSummary: 'Prostate gland, sperm morphology, nervous system & sleep centers',
    healthBenefits:
      'Top budget local source of zinc and magnesium—essential for male prostate & sperm health, stress resilience, and deep restful sleep.',
    linkedFoodId: 'mm_guava_pumpkin',
    defaultSlotId: 'mid_morning',
  },
  {
    id: 'ing_kollu',
    name: 'Kollu (Horsegram)',
    tamilName: 'கொள்ளு',
    category: 'pulses_seeds',
    servingSize: '40 g dry (1 cup cooked/rasam)',
    calories: 128,
    protein: 8.8,
    carbs: 22.8,
    fat: 0.3,
    fiber: 5.4,
    iron: 2.8,
    calcium: 114,
    zinc: 1.2,
    magnesium: 58,
    bComplex: '18% DV (B1, B3, Folate)',
    choline: 22,
    vitC: 0,
    sodiumMg: 12,
    systems: ['immune', 'lungs', 'endocrine', 'fertility', 'renal'],
    bodyPartsSummary: 'Adipose lipid metabolism, respiratory sinuses, kidneys & stamina',
    healthBenefits:
      'Thermogenic Tamil lentil prized for fat loss, reducing cold/sinus phlegm, supplying iron & calcium, and breaking kidney stone crystals.',
    linkedFoodId: 'es_kollu_sundal',
    defaultSlotId: 'evening_snack',
  },
  {
    id: 'ing_pachai_payaru',
    name: 'Pachai Payaru (Whole Green Gram)',
    tamilName: 'பச்சை பயறு',
    category: 'pulses_seeds',
    servingSize: '45 g dry / 1 cup cooked or sprouted',
    calories: 152,
    protein: 10.8,
    carbs: 26.5,
    fat: 0.6,
    fiber: 7.2,
    iron: 2.4,
    calcium: 56,
    zinc: 1.3,
    magnesium: 84,
    bComplex: '26% DV (Folate B9, B1, B6)',
    choline: 32,
    vitC: 10,
    sodiumMg: 6,
    systems: ['brain', 'digestive', 'heart', 'endocrine'],
    bodyPartsSummary: 'Liver detox enzymes, gut wall, nervous system & muscle tissue',
    healthBenefits:
      'Lightest protein-rich pulse on digestion; sprouting unlocks Vitamin C and choline for sharp mental focus without sluggishness.',
    linkedFoodId: 'bf_pachai_payaru_dosai',
    defaultSlotId: 'breakfast',
  },
  {
    id: 'ing_karuppu_ulundu',
    name: 'Karuppu Ulundu (Whole Black Urad Dal)',
    tamilName: 'கருப்பு உளுந்து',
    category: 'pulses_seeds',
    servingSize: '45 g dry (idli / ulundhangali)',
    calories: 156,
    protein: 10.9,
    carbs: 26.0,
    fat: 0.7,
    fiber: 5.4,
    iron: 2.9,
    calcium: 68,
    zinc: 1.5,
    magnesium: 112,
    bComplex: '24% DV (Folate, B1, B6)',
    choline: 28,
    vitC: 0,
    sodiumMg: 14,
    systems: ['bones', 'fertility', 'brain', 'integumentary'],
    bodyPartsSummary: 'Lumbar spine, knee cartilage, tendons, reproductive vigor & hair',
    healthBenefits:
      'Traditional Tamil bone-and-ligament strengthener rich in magnesium, zinc, and mucilaginous soluble fiber for back/joint resilience and stamina.',
    linkedFoodId: 'bf_ulundhangali',
    defaultSlotId: 'breakfast',
  },
  {
    id: 'ing_kondakadalai_karamani',
    name: 'Karuppu Kondakadalai & Karamani (Black Channa & Cowpeas)',
    tamilName: 'கருப்பு கொண்டைக்கடலை & காராமணி',
    category: 'pulses_seeds',
    servingSize: '45 g dry (1 cup boiled sundal)',
    calories: 162,
    protein: 9.4,
    carbs: 27.2,
    fat: 2.2,
    fiber: 7.6,
    iron: 2.7,
    calcium: 62,
    zinc: 1.5,
    magnesium: 64,
    bComplex: '24% DV (Folate, B6)',
    choline: 34,
    vitC: 2,
    sodiumMg: 10,
    systems: ['brain', 'bones', 'heart', 'digestive', 'endocrine'],
    bodyPartsSummary: 'Skeletal muscle, red blood cells, colon & glucose regulation',
    healthBenefits:
      'Slow-digesting plant protein and zinc anchor that supports muscle recovery, prevents afternoon sugar crashes, and feeds healthy gut bacteria.',
    linkedFoodId: 'ln_kondakadalai_poriyal',
    defaultSlotId: 'lunch',
  },

  // 4. SPICES & HERBS
  {
    id: 'ing_karuveppilai',
    name: 'Karuveppilai (Fresh Curry Leaves)',
    tamilName: 'கறிவேப்பிலை',
    category: 'spices_herbs',
    servingSize: '15 g fresh leaves (~1/2 cup)',
    calories: 16,
    protein: 0.9,
    carbs: 2.8,
    fat: 0.2,
    fiber: 1.0,
    iron: 1.4,
    calcium: 124,
    zinc: 0.2,
    magnesium: 18,
    bComplex: '6% DV (Folate, B2)',
    choline: 8,
    vitC: 4,
    sodiumMg: 4,
    systems: ['integumentary', 'eyes', 'heart', 'digestive'],
    bodyPartsSummary: 'Hair follicles (melanin), retina, liver & digestive enzymes',
    healthBenefits:
      'Rich in carbazole alkaloids, iron, and beta-carotene to prevent premature greying/hair fall, protect eyesight, and stimulate gentle digestion.',
    linkedFoodId: 'bf_karuveppilai_idli',
    defaultSlotId: 'breakfast',
  },
  {
    id: 'ing_inji_sukku',
    name: 'Inji & Sukku (Fresh & Dry Ginger)',
    tamilName: 'இஞ்சி & சுக்கு',
    category: 'spices_herbs',
    servingSize: '10 g fresh ginger / 3 g sukku',
    calories: 8,
    protein: 0.2,
    carbs: 1.8,
    fat: 0.1,
    fiber: 0.2,
    iron: 0.2,
    calcium: 4,
    zinc: 0.1,
    magnesium: 5,
    bComplex: '2% DV (B6)',
    choline: 3,
    vitC: 2,
    sodiumMg: 2,
    systems: ['digestive', 'immune', 'lungs', 'bones'],
    bodyPartsSummary: 'Stomach motility, throat, bronchial lining & joint synovium',
    healthBenefits:
      'Gingerols relieve bloating, nausea, and sluggish post-meal digestion while soothing joint stiffness and warming respiratory airways.',
    linkedFoodId: 'dn_inji_thuvaiyal_idli',
    defaultSlotId: 'dinner',
  },
  {
    id: 'ing_milagu_manjal',
    name: 'Milagu (Black Pepper) & Manjal (Turmeric)',
    tamilName: 'மிளகு & மஞ்சள்',
    category: 'spices_herbs',
    servingSize: '3 g black pepper + 3 g turmeric',
    calories: 18,
    protein: 0.6,
    carbs: 3.8,
    fat: 0.4,
    fiber: 1.4,
    iron: 1.6,
    calcium: 18,
    zinc: 0.2,
    magnesium: 12,
    bComplex: '4% DV (B6, Niacin)',
    choline: 4,
    vitC: 1,
    sodiumMg: 2,
    systems: ['immune', 'lungs', 'brain', 'bones', 'digestive'],
    bodyPartsSummary: 'Lung alveoli, immune cytokines, joints & blood-brain barrier',
    healthBenefits:
      'Piperine in black pepper boosts turmeric curcumin absorption 20×—a potent daily defense against airway inflammation, joint pain, and brain fog.',
    linkedFoodId: 'nt_manjal_milagu_paal',
    defaultSlotId: 'nighttime',
  },
  {
    id: 'ing_seeragam_omam',
    name: 'Seeragam (Cumin) & Omam (Carom Seeds)',
    tamilName: 'சீரகம் & ஓமம்',
    category: 'spices_herbs',
    servingSize: '5 g (1 tsp total for infusions/rasam)',
    calories: 18,
    protein: 0.9,
    carbs: 2.2,
    fat: 1.0,
    fiber: 0.6,
    iron: 2.4,
    calcium: 42,
    zinc: 0.3,
    magnesium: 18,
    bComplex: '4% DV (B1, B6)',
    choline: 3,
    vitC: 1,
    sodiumMg: 8,
    systems: ['digestive', 'renal', 'immune', 'heart'],
    bodyPartsSummary: 'Small intestine, stomach sphincter, kidneys & iron stores',
    healthBenefits:
      'Thymol and cuminaldehyde stimulate digestive enzymes, eliminate desk-sitting gas/bloating, and cool internal body heat via seeraga thanni.',
    linkedFoodId: 'em_omam_kudineer',
    defaultSlotId: 'early_morning',
  },
  {
    id: 'ing_vendhayam',
    name: 'Vendhayam (Fenugreek Seeds)',
    tamilName: 'வெந்தயம்',
    category: 'spices_herbs',
    servingSize: '5 g (1 tsp overnight-soaked)',
    calories: 16,
    protein: 1.2,
    carbs: 2.9,
    fat: 0.3,
    fiber: 1.3,
    iron: 1.7,
    calcium: 9,
    zinc: 0.2,
    magnesium: 10,
    bComplex: '4% DV (B6, Folate)',
    choline: 6,
    vitC: 0,
    sodiumMg: 3,
    systems: ['endocrine', 'digestive', 'fertility', 'integumentary'],
    bodyPartsSummary: 'Insulin sensitivity, thyroid/metabolic balance, scalp & gut',
    healthBenefits:
      'Galactomannan soluble fiber slows carb absorption to prevent sugar spikes; traditionally prized for cooling body heat, testosterone support, and hair thickness.',
    linkedFoodId: 'em_vendhaya_seeraga_thanni',
    defaultSlotId: 'early_morning',
  },
  {
    id: 'ing_poondu_vengayam',
    name: 'Poondu (Garlic) & Chinna Vengayam (Small Onions)',
    tamilName: 'பூண்டு & சின்ன வெங்காயம்',
    category: 'spices_herbs',
    servingSize: '40 g (4 cloves garlic + 5 shallots)',
    calories: 38,
    protein: 1.4,
    carbs: 8.6,
    fat: 0.1,
    fiber: 1.0,
    iron: 0.5,
    calcium: 32,
    zinc: 0.3,
    magnesium: 12,
    bComplex: '8% DV (B6)',
    choline: 8,
    vitC: 8,
    sodiumMg: 6,
    systems: ['heart', 'immune', 'lungs', 'fertility', 'digestive'],
    bodyPartsSummary: 'Coronary arteries, nitric oxide blood flow, airways & gut flora',
    healthBenefits:
      'Allicin and quercetin lower arterial stiffness, support nitric-oxide circulation (heart & fertility), and provide prebiotic fiber.',
    linkedFoodId: 'dn_kambu_koozh_onion',
    defaultSlotId: 'dinner',
  },

  // 5. NON-VEG (BUDGET TAMIL NADU PROTEIN & MICRONUTRIENTS)
  {
    id: 'ing_nattu_egg',
    name: 'Nattu Kozhi Egg (Country Chicken Egg)',
    tamilName: 'நாட்டுக்கோழி முட்டை',
    category: 'non_veg',
    servingSize: '2 boiled eggs (100 g)',
    calories: 155,
    protein: 13.0,
    carbs: 1.1,
    fat: 10.8,
    fiber: 0,
    iron: 1.9,
    calcium: 56,
    zinc: 1.4,
    magnesium: 12,
    bComplex: '44% DV (1.1 mcg B12, B2, Biotin)',
    choline: 294,
    vitC: 0,
    omega3Mg: 90,
    sodiumMg: 140,
    systems: ['brain', 'eyes', 'fertility', 'bones'],
    bodyPartsSummary: 'Brain acetylcholine, macula/retina, sperm membrane & muscle',
    healthBenefits:
      'Richest everyday source of brain choline (~294 mg/2 eggs) for memory & IT coding focus, plus lutein for screen-stressed eyes and bioavailable protein.',
    linkedFoodId: 'bf_boiled_nattu_egg',
    defaultSlotId: 'breakfast',
  },
  {
    id: 'ing_mutton',
    name: 'Goat Meat / Mutton (Rib Bones & Lean Cuts)',
    tamilName: 'ஆட்டு இறைச்சி / நெஞ்சு எலும்பு',
    category: 'non_veg',
    servingSize: '120 g cooked / bone broth serving',
    calories: 238,
    protein: 27.5,
    carbs: 0,
    fat: 13.5,
    fiber: 0,
    iron: 4.1,
    calcium: 38,
    zinc: 5.2,
    magnesium: 28,
    bComplex: '112% DV (2.8 mcg B12, B3, B6)',
    choline: 106,
    vitC: 0,
    sodiumMg: 95,
    prepNote: 'Simmer nenju elumbu (rib bones) with pepper and garlic for soothing collagen broth.',
    systems: ['fertility', 'heart', 'bones', 'brain', 'immune'],
    bodyPartsSummary: 'Sperm motility, hemoglobin, joint collagen, spinal nerves & muscles',
    healthBenefits:
      'Exceptional bioavailable zinc, heme iron, and Vitamin B12 for male fertility, stamina, hemoglobin levels, and bone-ligament repair.',
    linkedFoodId: 'nv_mutton_nenju_soup',
    defaultSlotId: 'evening_snack',
  },
  {
    id: 'ing_nattu_kozhi',
    name: 'Nattu Kozhi (Country Chicken)',
    tamilName: 'நாட்டுக்கோழி',
    category: 'non_veg',
    servingSize: '130 g skinless cooked meat / rasam',
    calories: 215,
    protein: 29.5,
    carbs: 0.5,
    fat: 9.8,
    fiber: 0,
    iron: 1.9,
    calcium: 22,
    zinc: 2.6,
    magnesium: 34,
    bComplex: '78% DV (Niacin B3, B6, B12)',
    choline: 96,
    vitC: 0,
    sodiumMg: 92,
    systems: ['brain', 'lungs', 'immune', 'bones', 'endocrine'],
    bodyPartsSummary: 'Skeletal muscle, respiratory airways, neurotransmitters & thyroid',
    healthBenefits:
      'Lean complete protein with high B3/B6 and carnosine for sustained mental alertness, post-illness recovery, and clean muscle maintenance.',
    linkedFoodId: 'nv_nattu_kozhi_pepper',
    defaultSlotId: 'lunch',
  },
  {
    id: 'ing_fresh_fish',
    name: 'Fresh Marine Fish (Nethili, Mathi Sardine, Ayala Mackerel)',
    tamilName: 'நெத்திலி / மத்தி / அயிலை மீன்',
    category: 'non_veg',
    servingSize: '130 g fresh fish',
    calories: 196,
    protein: 25.8,
    carbs: 0,
    fat: 9.6,
    fiber: 0,
    iron: 2.3,
    calcium: 265,
    zinc: 1.9,
    magnesium: 42,
    bComplex: '140% DV (5.2 mcg B12, B3, B6)',
    choline: 98,
    vitC: 0,
    omega3Mg: 1650,
    sodiumMg: 105,
    prepNote: 'Soft-boned nethili & mathi deliver huge edible calcium alongside DHA/EPA.',
    systems: ['brain', 'heart', 'fertility', 'endocrine', 'eyes', 'bones'],
    bodyPartsSummary: 'Brain grey matter, coronary vessels, sperm membrane, thyroid & retina',
    healthBenefits:
      'Budget coastal Tamil fish packed with DHA/EPA omega-3, iodine/selenium (thyroid), B12, and soft-bone calcium for peak cognitive and heart health.',
    linkedFoodId: 'nv_nethili_meen_kuzhambu',
    defaultSlotId: 'lunch',
  },
  {
    id: 'ing_nandu',
    name: 'Nandu (Tamil Coastal Crab)',
    tamilName: 'நண்டு',
    category: 'non_veg',
    servingSize: '140 g shell-on simmered in rasam',
    calories: 118,
    protein: 21.5,
    carbs: 0.4,
    fat: 2.4,
    fiber: 0,
    iron: 1.2,
    calcium: 112,
    zinc: 4.8,
    magnesium: 48,
    bComplex: '95% DV (4.5 mcg B12, Copper)',
    choline: 88,
    vitC: 0,
    omega3Mg: 420,
    sodiumMg: 290,
    systems: ['lungs', 'immune', 'fertility', 'endocrine', 'brain'],
    bodyPartsSummary: 'Sinuses, bronchial airways, immune cells, thyroid & sperm zinc',
    healthBenefits:
      'Classic Tamil remedy for chest congestion and colds when simmered as milagu rasam; delivers high zinc, selenium, and B12 with minimal fat.',
    linkedFoodId: 'ln_nandu_milagu_rasam',
    defaultSlotId: 'lunch',
  },
  {
    id: 'ing_karuvadu',
    name: 'Nethili Karuvadu (Sun-Dried Anchovies)',
    tamilName: 'நெத்திலி கருவாடு',
    category: 'non_veg',
    servingSize: '30 g cleaned & soaked',
    calories: 92,
    protein: 18.6,
    carbs: 0,
    fat: 1.8,
    fiber: 0,
    iron: 1.6,
    calcium: 310,
    zinc: 1.4,
    magnesium: 36,
    bComplex: '65% DV (2.4 mcg B12, Niacin)',
    choline: 52,
    vitC: 0,
    omega3Mg: 380,
    sodiumMg: 780,
    prepNote: 'Soak in warm water 15 min and rinse twice to lower salt; pair with neer mor & extra water.',
    systems: ['bones', 'brain', 'fertility', 'heart'],
    bodyPartsSummary: 'Bone mineral matrix, teeth, muscles & neural myelin',
    healthBenefits:
      'Ultra-concentrated budget protein, calcium, phosphorus, and B12; practice sodium moderation and increase hydration when eating karuvadu.',
    linkedFoodId: 'nv_nethili_karuvadu_thokku',
    defaultSlotId: 'lunch',
  },

  // 6. DAIRY & DRINKS
  {
    id: 'ing_curd_neer_mor',
    name: 'Homemade Curd & Spiced Neer Mor (Buttermilk)',
    tamilName: 'தயிர் & நீர்மோர்',
    category: 'dairy_drinks',
    servingSize: '150 g curd / 250 ml neer mor',
    calories: 96,
    protein: 5.4,
    carbs: 7.2,
    fat: 4.8,
    fiber: 0,
    iron: 0.1,
    calcium: 188,
    zinc: 0.8,
    magnesium: 18,
    bComplex: '22% DV (B12, Riboflavin B2)',
    choline: 24,
    vitC: 1,
    sodiumMg: 72,
    systems: ['digestive', 'renal', 'bones', 'immune'],
    bodyPartsSummary: 'Intestinal flora, gut-brain vagus nerve, bones & kidney hydration',
    healthBenefits:
      'Live lactobacillus probiotics improve nutrient absorption, soothe spicy meals, cool body heat, and supply bioavailable calcium and B12.',
    linkedFoodId: 'ln_curd_carrot_ellu_podi',
    defaultSlotId: 'lunch',
  },
  {
    id: 'ing_milk_karupatti',
    name: 'Fresh Milk & Karupatti (Palm Jaggery)',
    tamilName: 'பால் & கருப்பட்டி',
    category: 'dairy_drinks',
    servingSize: '200 ml milk + 1 tsp (5 g) karupatti',
    calories: 146,
    protein: 6.6,
    carbs: 14.5,
    fat: 6.8,
    fiber: 0,
    iron: 0.7,
    calcium: 240,
    zinc: 0.9,
    magnesium: 24,
    bComplex: '24% DV (B12, B2)',
    choline: 34,
    vitC: 0,
    sodiumMg: 88,
    prepNote: 'Use toned milk without karupatti for Weight Loss; whole milk with karupatti for Weight Gain.',
    systems: ['bones', 'brain', 'lungs', 'fertility'],
    bodyPartsSummary: 'Bone trabeculae, sleep neurotransmitters & overnight recovery',
    healthBenefits:
      'Tryptophan, calcium, and B12 aid deep restorative sleep; unrefined karupatti adds trace iron and minerals unlike white sugar.',
    linkedFoodId: 'nt_manjal_milagu_paal',
    defaultSlotId: 'nighttime',
  },
  {
    id: 'ing_ilaneer',
    name: 'Ilaneer (Tender Coconut Water & Soft Pulp)',
    tamilName: 'இளநீர் & வழுக்கை',
    category: 'dairy_drinks',
    servingSize: '1 fresh coconut (300 ml water + 30 g pulp)',
    calories: 92,
    protein: 1.4,
    carbs: 14.8,
    fat: 3.2,
    fiber: 1.4,
    iron: 0.4,
    calcium: 44,
    zinc: 0.2,
    magnesium: 46,
    bComplex: '6% DV',
    choline: 6,
    vitC: 8,
    sodiumMg: 110,
    systems: ['renal', 'integumentary', 'heart', 'digestive'],
    bodyPartsSummary: 'Kidneys, skin hydration, heart electrolytes & bladder',
    healthBenefits:
      'Natural potassium-magnesium electrolyte drink that prevents dehydration headaches during IT work, flushes kidneys, and brightens skin.',
    linkedFoodId: 'mm_ilaneer_pumpkin',
    defaultSlotId: 'mid_morning',
  },
];

export const INGREDIENT_MAP: Record<string, RawMaterial> = Object.fromEntries(
  TN_INGREDIENTS.map((ing) => [ing.id, ing])
);

const FOOD_TO_INGREDIENTS: Record<string, string[]> = {
  em_nellikai_curry_water: ['ing_nelli_kattralai', 'ing_karuveppilai', 'ing_vendhayam'],
  em_vendhaya_seeraga_thanni: ['ing_vendhayam', 'ing_seeragam_omam'],
  em_kattralai_nelli_juice: ['ing_nelli_kattralai', 'ing_seeragam_omam'],
  em_omam_kudineer: ['ing_seeragam_omam', 'ing_inji_sukku', 'ing_milagu_manjal'],
  em_sukku_malli_kaapi: ['ing_inji_sukku', 'ing_milk_karupatti'],
  em_soaked_verkadalai_tulsi: ['ing_verkadalai', 'ing_milagu_manjal'],
  em_murungai_soup: ['ing_murungai_keerai', 'ing_milagu_manjal', 'ing_poondu_vengayam'],
  em_lemon_jeera_pumpkin: ['ing_seeragam_omam', 'ing_pumpkin_seeds'],
  em_vallarai_buttermilk: ['ing_vallarai_ponnanganni', 'ing_curd_neer_mor', 'ing_ellu'],
  bf_pazhaya_sadam_neer_mor: [
    'ing_parboiled_mapillai_rice',
    'ing_curd_neer_mor',
    'ing_poondu_vengayam',
    'ing_karuveppilai',
  ],
  bf_ragi_idli_sambar: ['ing_ragi', 'ing_karuppu_ulundu', 'ing_murungai_keerai'],
  bf_kambu_dosai_ellu: ['ing_kambu', 'ing_karuppu_ulundu', 'ing_ellu'],
  bf_thinai_pongal_chutney: ['ing_thinai', 'ing_pachai_payaru', 'ing_pottukadalai', 'ing_milagu_manjal'],
  bf_adai_avial: ['ing_parboiled_mapillai_rice', 'ing_kondakadalai_karamani', 'ing_curd_neer_mor'],
  bf_pachai_payaru_dosai: ['ing_pachai_payaru', 'ing_inji_sukku'],
  bf_ragi_puttu_verkadalai: ['ing_ragi', 'ing_verkadalai', 'ing_milk_karupatti'],
  bf_ulundhangali: ['ing_karuppu_ulundu', 'ing_ellu', 'ing_milk_karupatti'],
  bf_karuveppilai_idli: ['ing_parboiled_mapillai_rice', 'ing_karuveppilai', 'ing_verkadalai'],
  bf_samai_veg_upma: ['ing_samai_kudiraivali', 'ing_pottukadalai', 'ing_karuveppilai'],
  bf_boiled_nattu_egg: ['ing_nattu_egg', 'ing_milagu_manjal'],
  bf_soya_paneer_sundal: ['ing_curd_neer_mor', 'ing_milagu_manjal', 'ing_poondu_vengayam'],
  mm_ilaneer_pumpkin: ['ing_ilaneer', 'ing_pumpkin_seeds'],
  mm_barley_vazhaithandu_juice: ['ing_barley_wheat', 'ing_vazhaithandu', 'ing_seeragam_omam'],
  mm_guava_pumpkin: ['ing_banana_guava', 'ing_pumpkin_seeds'],
  mm_red_banana_verkadalai: ['ing_banana_guava', 'ing_verkadalai'],
  mm_papaya_ellu_urundai: ['ing_ellu', 'ing_milk_karupatti'],
  mm_neer_mor_pottukadalai: ['ing_curd_neer_mor', 'ing_pottukadalai', 'ing_seeragam_omam'],
  mm_pachai_payaru_sprouts: ['ing_pachai_payaru', 'ing_poondu_vengayam', 'ing_milagu_manjal'],
  mm_nattu_banana_pottukadalai: ['ing_banana_guava', 'ing_pottukadalai', 'ing_milk_karupatti'],
  nv_mutton_nenju_soup: ['ing_mutton', 'ing_milagu_manjal', 'ing_poondu_vengayam'],
  nv_mutton_kuzhambu_varagu: ['ing_mutton', 'ing_varagu', 'ing_murungai_keerai', 'ing_poondu_vengayam'],
  nv_mutton_sukka_onion: ['ing_mutton', 'ing_poondu_vengayam', 'ing_karuveppilai', 'ing_milagu_manjal'],
  nv_nattu_kozhi_rasam: ['ing_nattu_kozhi', 'ing_milagu_manjal', 'ing_poondu_vengayam'],
  nv_nattu_kozhi_pepper: ['ing_nattu_kozhi', 'ing_parboiled_mapillai_rice', 'ing_milagu_manjal'],
  nv_chicken_kuzhambu_idli: ['ing_nattu_kozhi', 'ing_ragi', 'ing_karuppu_ulundu'],
  nv_nethili_meen_kuzhambu: ['ing_fresh_fish', 'ing_parboiled_mapillai_rice', 'ing_poondu_vengayam'],
  nv_ayala_pan_seared: ['ing_fresh_fish', 'ing_varagu', 'ing_murungai_keerai', 'ing_milagu_manjal'],
  ln_mathi_meen_kulambu_varagu: ['ing_fresh_fish', 'ing_varagu', 'ing_murungai_keerai'],
  ln_nandu_milagu_rasam: ['ing_nandu', 'ing_parboiled_mapillai_rice', 'ing_kothavarangai_kovakkai', 'ing_milagu_manjal'],
  nv_nethili_karuvadu_thokku: ['ing_karuvadu', 'ing_parboiled_mapillai_rice', 'ing_poondu_vengayam'],
  nv_karuvadu_kuzhambu: ['ing_karuvadu', 'ing_varagu', 'ing_poondu_vengayam'],
  ln_varagu_sadam_murungai: ['ing_varagu', 'ing_murungai_keerai', 'ing_kollu'],
  ln_parboiled_manathakkali_kothavarangai: [
    'ing_parboiled_mapillai_rice',
    'ing_manathakkali',
    'ing_kothavarangai_kovakkai',
    'ing_seeragam_omam',
  ],
  ln_thinai_mookirattai_vazhaithandu: ['ing_thinai', 'ing_thoothuvalai_mookirattai', 'ing_vazhaithandu'],
  ln_kudiraivali_kovakkai_inji: ['ing_samai_kudiraivali', 'ing_kothavarangai_kovakkai', 'ing_inji_sukku', 'ing_kollu'],
  ln_kariveppilai_sadam_kothavarangai: ['ing_parboiled_mapillai_rice', 'ing_karuveppilai', 'ing_kothavarangai_kovakkai', 'ing_curd_neer_mor'],
  ln_mapillai_samba_ponnanganni: ['ing_parboiled_mapillai_rice', 'ing_vallarai_ponnanganni', 'ing_milagu_manjal'],
  ln_parboiled_manathakkali_sambar: ['ing_parboiled_mapillai_rice', 'ing_manathakkali', 'ing_kothavarangai_kovakkai'],
  ln_kudiraivali_thoothuvalai: ['ing_samai_kudiraivali', 'ing_thoothuvalai_mookirattai', 'ing_murungai_poo'],
  ln_thinai_arisi_sirukeerai: ['ing_thinai', 'ing_manathakkali', 'ing_poondu_vengayam'],
  ln_kambu_sadam_vazhaithandu: ['ing_kambu', 'ing_vazhaithandu', 'ing_poondu_vengayam', 'ing_milagu_manjal'],
  ln_samai_bisibelebath: ['ing_samai_kudiraivali', 'ing_kothavarangai_kovakkai', 'ing_curd_neer_mor'],
  ln_curd_carrot_ellu_podi: ['ing_curd_neer_mor', 'ing_ellu', 'ing_karuveppilai'],
  ln_kondakadalai_poriyal: ['ing_kondakadalai_karamani', 'ing_karuveppilai'],
  es_kattralai_buttermilk_sundal: ['ing_nelli_kattralai', 'ing_curd_neer_mor', 'ing_verkadalai', 'ing_kollu'],
  es_verkadalai_sundal: ['ing_verkadalai', 'ing_karuveppilai'],
  es_kollu_sundal: ['ing_kollu', 'ing_inji_sukku', 'ing_milagu_manjal'],
  es_murungai_poo_sundal: ['ing_murungai_poo', 'ing_pottukadalai'],
  es_pottukadalai_ellu_mix: ['ing_pottukadalai', 'ing_pumpkin_seeds', 'ing_ellu'],
  es_karamani_sundal: ['ing_kondakadalai_karamani', 'ing_karuveppilai'],
  es_sweet_potato_pepper: ['ing_milagu_manjal', 'ing_seeragam_omam'],
  es_ragi_murungai_adai: ['ing_ragi', 'ing_murungai_keerai', 'ing_poondu_vengayam'],
  dn_inji_thuvaiyal_idli: ['ing_parboiled_mapillai_rice', 'ing_karuppu_ulundu', 'ing_inji_sukku', 'ing_kollu'],
  dn_kambu_kovakkai_kootu: ['ing_kambu', 'ing_kothavarangai_kovakkai', 'ing_seeragam_omam'],
  dn_kambu_koozh_onion: ['ing_kambu', 'ing_poondu_vengayam', 'ing_curd_neer_mor'],
  dn_idli_karuveppilai_podi: ['ing_parboiled_mapillai_rice', 'ing_karuppu_ulundu', 'ing_ellu', 'ing_karuveppilai'],
  dn_godhumai_rava_kichdi: ['ing_barley_wheat', 'ing_poondu_vengayam'],
  dn_ragi_semiya_veg: ['ing_ragi', 'ing_verkadalai'],
  dn_chapati_green_gram: ['ing_barley_wheat', 'ing_pachai_payaru', 'ing_manathakkali'],
  dn_thinai_curd_pomegranate: ['ing_thinai', 'ing_curd_neer_mor', 'ing_inji_sukku', 'ing_karuveppilai'],
  dn_varagu_dosai_tomato: ['ing_varagu', 'ing_poondu_vengayam', 'ing_milagu_manjal'],
  nt_murungai_poo_paal: ['ing_milk_karupatti', 'ing_murungai_poo', 'ing_milagu_manjal'],
  nt_manjal_milagu_paal: ['ing_milk_karupatti', 'ing_milagu_manjal', 'ing_inji_sukku'],
  nt_ellu_paal: ['ing_milk_karupatti', 'ing_ellu'],
  nt_karupatti_chukku_milk: ['ing_seeragam_omam', 'ing_pumpkin_seeds'],
  nt_ashwagandha_pepper_milk: ['ing_milk_karupatti', 'ing_milagu_manjal'],
  // Weight loss & Weight gain tailored food mappings
  wl_ragi_keerai_idli_rasam: ['ing_ragi', 'ing_murungai_keerai', 'ing_kollu', 'ing_milagu_manjal'],
  wl_vazhaithandu_kollu_soup: ['ing_vazhaithandu', 'ing_kollu', 'ing_milagu_manjal', 'ing_poondu_vengayam'],
  wl_millet_double_keerai_lunch: ['ing_varagu', 'ing_manathakkali', 'ing_kothavarangai_kovakkai', 'ing_seeragam_omam'],
  wl_steamed_fish_keerai_lunch: ['ing_fresh_fish', 'ing_varagu', 'ing_murungai_keerai', 'ing_milagu_manjal'],
  wl_steamed_nattu_kozhi_broth_lunch: ['ing_nattu_kozhi', 'ing_thinai', 'ing_kothavarangai_kovakkai', 'ing_milagu_manjal'],
  wl_sundal_neer_mor_bowl: ['ing_pachai_payaru', 'ing_kollu', 'ing_curd_neer_mor'],
  wl_skim_manjal_jeera_drink: ['ing_milk_karupatti', 'ing_milagu_manjal', 'ing_pumpkin_seeds'],
  wg_ulundhangali_verkadalai_bf: ['ing_karuppu_ulundu', 'ing_ellu', 'ing_verkadalai', 'ing_nattu_egg', 'ing_milk_karupatti'],
  wg_red_banana_ellu_shake: ['ing_banana_guava', 'ing_verkadalai', 'ing_ellu', 'ing_milk_karupatti'],
  wg_mutton_ghee_varagu_lunch: ['ing_mutton', 'ing_varagu', 'ing_ellu', 'ing_curd_neer_mor'],
  wg_fish_ellu_varagu_lunch: ['ing_fresh_fish', 'ing_parboiled_mapillai_rice', 'ing_curd_neer_mor', 'ing_ellu'],
  wg_veg_ghee_sambar_sundal_lunch: ['ing_samai_kudiraivali', 'ing_kondakadalai_karamani', 'ing_kothavarangai_kovakkai', 'ing_curd_neer_mor'],
  wg_verkadalai_pottukadalai_banana: ['ing_verkadalai', 'ing_pottukadalai', 'ing_ellu', 'ing_banana_guava'],
  wg_chapati_double_dal_curd_dn: ['ing_barley_wheat', 'ing_pachai_payaru', 'ing_manathakkali', 'ing_verkadalai', 'ing_curd_neer_mor'],
  wg_mutton_chicken_parotta_idli_dn: ['ing_nattu_kozhi', 'ing_ragi', 'ing_karuppu_ulundu', 'ing_milagu_manjal'],
  wg_murungai_ellu_karupatti_milk: ['ing_milk_karupatti', 'ing_murungai_poo', 'ing_ellu', 'ing_pumpkin_seeds'],
};

function fallbackIngredientMatch(food: FoodItem): string[] {
  const hay = `${food.name} ${food.note}`.toLowerCase();
  const matched: string[] = [];
  const rules: Array<[string, string[]]> = [
    ['ing_ragi', ['ragi']],
    ['ing_kambu', ['kambu', 'pearl millet']],
    ['ing_thinai', ['thinai', 'foxtail']],
    ['ing_varagu', ['varagu', 'kodo']],
    ['ing_samai_kudiraivali', ['samai', 'kudiraivali', 'barnyard', 'little millet']],
    ['ing_parboiled_mapillai_rice', ['rice', 'idli', 'dosai', 'sadam']],
    ['ing_murungai_keerai', ['murungai keerai', 'drumstick']],
    ['ing_murungai_poo', ['murungai poo']],
    ['ing_manathakkali', ['manathakkali']],
    ['ing_vazhaithandu', ['vazhaithandu', 'banana stem']],
    ['ing_kothavarangai_kovakkai', ['kothavarangai', 'kovakkai']],
    ['ing_verkadalai', ['verkadalai', 'peanut']],
    ['ing_pottukadalai', ['pottukadalai', 'roasted gram']],
    ['ing_ellu', ['ellu', 'sesame']],
    ['ing_pumpkin_seeds', ['pumpkin seed']],
    ['ing_kollu', ['kollu', 'horsegram']],
    ['ing_pachai_payaru', ['pachai payaru', 'green gram', 'moong']],
    ['ing_nattu_egg', ['egg']],
    ['ing_mutton', ['mutton', 'goat']],
    ['ing_nattu_kozhi', ['kozhi', 'chicken']],
    ['ing_fresh_fish', ['fish', 'meen', 'nethili', 'mathi', 'ayala']],
    ['ing_nandu', ['nandu', 'crab']],
    ['ing_karuvadu', ['karuvadu', 'dried fish']],
    ['ing_curd_neer_mor', ['curd', 'neer mor', 'buttermilk']],
  ];
  for (const [ingId, keys] of rules) {
    if (keys.some((k) => hay.includes(k))) {
      matched.push(ingId);
    }
  }
  return matched;
}

export interface TodayIngredientUsage {
  material: RawMaterial;
  usedInSlots: string[];
  usedInDishes: string[];
}

export function extractTodayIngredients(
  effectiveMeals: Record<MealSlotId, MealSlotEntry[]>,
  foodLookup: Record<string, FoodItem>
): TodayIngredientUsage[] {
  const usageMap = new Map<
    string,
    { material: RawMaterial; slots: Set<string>; dishes: Set<string> }
  >();

  for (const slot of MEAL_SLOTS) {
    const entries = effectiveMeals[slot.id] || [];
    for (const entry of entries) {
      const food = foodLookup[entry.foodId];
      if (!food) continue;
      const ingIds =
        FOOD_TO_INGREDIENTS[food.id] || fallbackIngredientMatch(food);
      for (const ingId of ingIds) {
        const mat = INGREDIENT_MAP[ingId];
        if (!mat) continue;
        let rec = usageMap.get(ingId);
        if (!rec) {
          rec = { material: mat, slots: new Set(), dishes: new Set() };
          usageMap.set(ingId, rec);
        }
        rec.slots.add(slot.label);
        rec.dishes.add(food.name);
      }
    }
  }

  return Array.from(usageMap.values()).map((item) => ({
    material: item.material,
    usedInSlots: Array.from(item.slots),
    usedInDishes: Array.from(item.dishes),
  }));
}

export type BuyUnit = 'g' | 'ml' | 'eggs' | 'fruits' | 'coconuts';

interface BuySpec {
  qtyPerServing: number;
  unit: BuyUnit;
  hint?: string;
}

const INGREDIENT_BUY_SPECS: Record<string, BuySpec> = {
  // Grains & Millets (dry weight to buy)
  ing_ragi: { qtyPerServing: 60, unit: 'g', hint: 'ragi flour / grain' },
  ing_kambu: { qtyPerServing: 60, unit: 'g', hint: 'pearl millet' },
  ing_thinai: { qtyPerServing: 60, unit: 'g', hint: 'foxtail millet' },
  ing_varagu: { qtyPerServing: 60, unit: 'g', hint: 'kodo millet' },
  ing_samai_kudiraivali: { qtyPerServing: 60, unit: 'g', hint: 'samai / kudiraivali' },
  ing_parboiled_mapillai_rice: { qtyPerServing: 70, unit: 'g', hint: 'parboiled / mapillai samba' },
  ing_barley_wheat: { qtyPerServing: 40, unit: 'g', hint: 'barley / samba rava' },

  // Greens & Produce
  ing_murungai_keerai: { qtyPerServing: 60, unit: 'g', hint: '~1/2 bunch per serving' },
  ing_murungai_poo: { qtyPerServing: 30, unit: 'g', hint: 'fresh drumstick flowers' },
  ing_manathakkali: { qtyPerServing: 80, unit: 'g', hint: '~2/3 bunch per serving' },
  ing_vallarai_ponnanganni: { qtyPerServing: 65, unit: 'g', hint: '~1/2 bunch per serving' },
  ing_thoothuvalai_mookirattai: { qtyPerServing: 45, unit: 'g', hint: 'herbal greens bunch' },
  ing_vazhaithandu: { qtyPerServing: 120, unit: 'g', hint: 'fresh banana stem' },
  ing_kothavarangai_kovakkai: { qtyPerServing: 120, unit: 'g', hint: 'fresh veg' },
  ing_nelli_kattralai: { qtyPerServing: 40, unit: 'g', hint: 'amla + aloe stem' },
  ing_banana_guava: { qtyPerServing: 1, unit: 'fruits', hint: '~120 g per fruit' },

  // Pulses & Seeds
  ing_verkadalai: { qtyPerServing: 30, unit: 'g', hint: 'raw / roasted peanuts' },
  ing_pottukadalai: { qtyPerServing: 30, unit: 'g', hint: 'roasted bengal gram' },
  ing_ellu: { qtyPerServing: 15, unit: 'g', hint: 'black/white sesame' },
  ing_pumpkin_seeds: { qtyPerServing: 15, unit: 'g', hint: 'poosani vidhai' },
  ing_kollu: { qtyPerServing: 40, unit: 'g', hint: 'whole horsegram' },
  ing_pachai_payaru: { qtyPerServing: 45, unit: 'g', hint: 'whole green gram' },
  ing_karuppu_ulundu: { qtyPerServing: 45, unit: 'g', hint: 'whole black urad dal' },
  ing_kondakadalai_karamani: { qtyPerServing: 45, unit: 'g', hint: 'black channa / cowpeas' },

  // Spices & Herbs
  ing_karuveppilai: { qtyPerServing: 15, unit: 'g', hint: 'fresh curry leaf sprigs' },
  ing_inji_sukku: { qtyPerServing: 10, unit: 'g', hint: 'fresh ginger / dry sukku' },
  ing_milagu_manjal: { qtyPerServing: 6, unit: 'g', hint: 'black pepper & turmeric' },
  ing_seeragam_omam: { qtyPerServing: 5, unit: 'g', hint: 'cumin & carom seeds' },
  ing_vendhayam: { qtyPerServing: 5, unit: 'g', hint: 'fenugreek seeds' },
  ing_poondu_vengayam: { qtyPerServing: 40, unit: 'g', hint: 'garlic + small onions' },

  // Non-Veg
  ing_nattu_egg: { qtyPerServing: 2, unit: 'eggs', hint: 'country chicken eggs' },
  ing_mutton: { qtyPerServing: 120, unit: 'g', hint: 'goat meat / rib bones' },
  ing_nattu_kozhi: { qtyPerServing: 130, unit: 'g', hint: 'country chicken cut' },
  ing_fresh_fish: { qtyPerServing: 130, unit: 'g', hint: 'nethili / mathi / ayala' },
  ing_nandu: { qtyPerServing: 140, unit: 'g', hint: 'whole crab' },
  ing_karuvadu: { qtyPerServing: 30, unit: 'g', hint: 'dried nethili karuvadu' },

  // Dairy & Drinks
  ing_curd_neer_mor: { qtyPerServing: 150, unit: 'ml', hint: 'curd / buttermilk base' },
  ing_milk_karupatti: { qtyPerServing: 200, unit: 'ml', hint: 'fresh milk (+ karupatti)' },
  ing_ilaneer: { qtyPerServing: 1, unit: 'coconuts', hint: 'tender coconut' },
};

// Optional dish-specific scaling adjustments for ingredients (e.g., weight-loss half-grain + double-veg)
const DISH_INGREDIENT_SCALES: Record<string, Record<string, number>> = {
  wl_millet_double_keerai_lunch: {
    ing_varagu: 0.6,
    ing_manathakkali: 1.5,
    ing_kothavarangai_kovakkai: 1.25,
  },
  wl_steamed_fish_keerai_lunch: {
    ing_varagu: 0.6,
    ing_murungai_keerai: 1.5,
  },
  wl_steamed_nattu_kozhi_broth_lunch: {
    ing_thinai: 0.6,
    ing_kothavarangai_kovakkai: 1.35,
  },
  wl_ragi_keerai_idli_rasam: {
    ing_ragi: 0.7,
    ing_murungai_keerai: 1.25,
  },
  wg_ulundhangali_verkadalai_bf: {
    ing_nattu_egg: 0.5, // 1 egg alongside ulundhangali
    ing_verkadalai: 1.3,
  },
  wg_mutton_ghee_varagu_lunch: {
    ing_varagu: 1.4,
    ing_mutton: 1.15,
  },
  wg_fish_ellu_varagu_lunch: {
    ing_parboiled_mapillai_rice: 1.4,
    ing_fresh_fish: 1.15,
  },
  wg_veg_ghee_sambar_sundal_lunch: {
    ing_samai_kudiraivali: 1.4,
    ing_kondakadalai_karamani: 1.35,
  },
  wg_chapati_double_dal_curd_dn: {
    ing_barley_wheat: 1.5,
    ing_pachai_payaru: 1.35,
  },
};

export function formatBuyQuantity(qty: number, unit: BuyUnit): string {
  if (qty <= 0) return '—';
  if (unit === 'g') {
    const rounded = qty < 25 ? Math.ceil(qty) : Math.round(qty / 5) * 5;
    if (rounded >= 1000) {
      return `${(rounded / 1000).toFixed(2).replace(/\.?0+$/, '')} kg`;
    }
    return `${rounded} g`;
  }
  if (unit === 'ml') {
    const rounded = Math.round(qty / 25) * 25 || 25;
    if (rounded >= 1000) {
      return `${(rounded / 1000).toFixed(2).replace(/\.?0+$/, '')} L`;
    }
    return `${rounded} ml`;
  }
  if (unit === 'eggs') {
    const count = Math.max(1, Math.round(qty));
    return `${count} ${count === 1 ? 'egg' : 'eggs'}`;
  }
  if (unit === 'fruits') {
    const count = Math.max(1, Math.round(qty * 2) / 2);
    return `${count} ${count === 1 ? 'fruit' : 'fruits'}`;
  }
  const count = Math.max(1, Math.round(qty));
  return `${count} ${count === 1 ? 'coconut' : 'coconuts'}`;
}

export interface ShoppingBuyItem {
  material: RawMaterial;
  unit: BuyUnit;
  hint?: string;
  todayQty: number;
  sevenDayQty: number;
  thirtyDayQty: number;
  todayFormatted: string;
  sevenDayFormatted: string;
  thirtyDayFormatted: string;
  todayServings: number;
  sevenDayServings: number;
  thirtyDayServings: number;
}

export function computeShoppingBuyList(
  selectedDay: number,
  getMealsForDay: (dayNumber: number) => Record<MealSlotId, MealSlotEntry[]>,
  foodLookup: Record<string, FoodItem>
): {
  items: ShoppingBuyItem[];
  dayNumbers: number[];
} {
  const dayNumbers: number[] = [];
  for (let offset = 0; offset < 7; offset++) {
    const wrapped = ((selectedDay - 1 + offset) % 30) + 1;
    dayNumbers.push(wrapped);
  }

  const acc = new Map<
    string,
    {
      material: RawMaterial;
      spec: BuySpec;
      todayQty: number;
      sevenDayQty: number;
      thirtyDayQty: number;
      todayServings: number;
      sevenDayServings: number;
      thirtyDayServings: number;
    }
  >();

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const dayNum = ((selectedDay - 1 + dayOffset) % 30) + 1;
    const dayMeals = getMealsForDay(dayNum);
    for (const slot of MEAL_SLOTS) {
      const entries = dayMeals[slot.id] || [];
      for (const entry of entries) {
        const food = foodLookup[entry.foodId];
        if (!food) continue;
        const ingIds =
          FOOD_TO_INGREDIENTS[food.id] || fallbackIngredientMatch(food);
        const mult = entry.multiplier > 0 ? entry.multiplier : 1;

        for (const ingId of ingIds) {
          const mat = INGREDIENT_MAP[ingId];
          const spec = INGREDIENT_BUY_SPECS[ingId];
          if (!mat || !spec) continue;

          const dishScale = DISH_INGREDIENT_SCALES[food.id]?.[ingId] ?? 1;
          const qtyAdd = spec.qtyPerServing * mult * dishScale;
          const servingAdd = mult * dishScale;

          let record = acc.get(ingId);
          if (!record) {
            record = {
              material: mat,
              spec,
              todayQty: 0,
              sevenDayQty: 0,
              thirtyDayQty: 0,
              todayServings: 0,
              sevenDayServings: 0,
              thirtyDayServings: 0,
            };
            acc.set(ingId, record);
          }

          record.thirtyDayQty += qtyAdd;
          record.thirtyDayServings += servingAdd;
          if (dayOffset < 7) {
            record.sevenDayQty += qtyAdd;
            record.sevenDayServings += servingAdd;
          }
          if (dayOffset === 0) {
            record.todayQty += qtyAdd;
            record.todayServings += servingAdd;
          }
        }
      }
    }
  }

  // Preserve TN_INGREDIENTS order so categories stay cleanly grouped
  const items: ShoppingBuyItem[] = TN_INGREDIENTS.filter((mat) =>
    acc.has(mat.id)
  ).map((mat) => {
    const rec = acc.get(mat.id)!;
    return {
      material: mat,
      unit: rec.spec.unit,
      hint: rec.spec.hint,
      todayQty: rec.todayQty,
      sevenDayQty: rec.sevenDayQty,
      thirtyDayQty: rec.thirtyDayQty,
      todayFormatted: formatBuyQuantity(rec.todayQty, rec.spec.unit),
      sevenDayFormatted: formatBuyQuantity(rec.sevenDayQty, rec.spec.unit),
      thirtyDayFormatted: formatBuyQuantity(rec.thirtyDayQty, rec.spec.unit),
      todayServings: Math.round(rec.todayServings * 10) / 10,
      sevenDayServings: Math.round(rec.sevenDayServings * 10) / 10,
      thirtyDayServings: Math.round(rec.thirtyDayServings * 10) / 10,
    };
  });

  return { items, dayNumbers };
}
