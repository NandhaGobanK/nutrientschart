import { MEAL_PLAN_30_DAYS } from '../data/mealPlan30Days';
import { HYDRATION_CHECKPOINTS } from '../data/recipes';
import { DAILY_TARGETS, FOOD_MAP, MEAL_SLOTS, TN_FOODS } from '../data/tnFoods';
import {
  BodySystem,
  DayHydrationState,
  DayPlan,
  DayProgressState,
  DietMode,
  FoodItem,
  HydrationSettings,
  MealSlotEntry,
  MealSlotId,
  Nutrients,
  TrackerStorageState,
  WeightGoalMode,
} from '../types/nutrition';

const STORAGE_KEY = 'tn_wellness_tracker_v1';

const VEG_SUBSTITUTES_BY_ID: Record<string, string> = {
  bf_boiled_nattu_egg: 'bf_soya_paneer_sundal',
  nv_mutton_nenju_soup: 'em_murungai_soup',
  nv_nattu_kozhi_rasam: 'es_kollu_sundal',
  nv_mutton_kuzhambu_varagu: 'ln_varagu_sadam_murungai',
  nv_mutton_sukka_onion: 'ln_kondakadalai_poriyal',
  nv_nattu_kozhi_pepper: 'ln_kudiraivali_kovakkai_inji',
  nv_chicken_kuzhambu_idli: 'dn_inji_thuvaiyal_idli',
  nv_nethili_meen_kuzhambu: 'ln_parboiled_manathakkali_kothavarangai',
  nv_ayala_pan_seared: 'ln_thinai_mookirattai_vazhaithandu',
  ln_mathi_meen_kulambu_varagu: 'ln_kudiraivali_kovakkai_inji',
  ln_nandu_milagu_rasam: 'ln_parboiled_manathakkali_kothavarangai',
  nv_nethili_karuvadu_thokku: 'ln_kariveppilai_sadam_kothavarangai',
  nv_karuvadu_kuzhambu: 'ln_kudiraivali_thoothuvalai',
  wl_steamed_fish_keerai_lunch: 'wl_millet_double_keerai_lunch',
  wl_steamed_nattu_kozhi_broth_lunch: 'wl_millet_double_keerai_lunch',
  wg_ulundhangali_verkadalai_bf: 'bf_ulundhangali',
  wg_mutton_ghee_varagu_lunch: 'wg_veg_ghee_sambar_sundal_lunch',
  wg_fish_ellu_varagu_lunch: 'wg_veg_ghee_sambar_sundal_lunch',
  wg_mutton_chicken_parotta_idli_dn: 'wg_chapati_double_dal_curd_dn',
};

const NON_VEG_LUNCH_ROTATION = [
  'nv_mutton_kuzhambu_varagu',
  'nv_nattu_kozhi_pepper',
  'nv_nethili_meen_kuzhambu',
  'nv_ayala_pan_seared',
  'ln_mathi_meen_kulambu_varagu',
  'nv_karuvadu_kuzhambu',
];

export interface GoalRangeInfo {
  label: string;
  rangeText: string;
  targetKcal: number;
  minKcal: number;
  maxKcal: number;
  prepSummary: string;
}

export function getGoalRangeInfo(goal: WeightGoalMode): GoalRangeInfo {
  if (goal === 'loss') {
    return {
      label: 'Weight Loss',
      rangeText: '1,450–1,750 kcal',
      targetKcal: 1650,
      minKcal: 1400,
      maxKcal: 1800,
      prepSummary:
        'Half-portion millets, double keerai/veggies, steamed lean proteins & ≤1 tsp oil per dish.',
    };
  }
  if (goal === 'gain') {
    return {
      label: 'Weight Gain',
      rangeText: '2,650–3,000 kcal',
      targetKcal: 2800,
      minKcal: 2550,
      maxKcal: 3050,
      prepSummary:
        '1.5× millet/rice portions, verkadalai, ellu podi, pottukadalai, banana, extra curd & eggs/meat/fish.',
    };
  }
  return {
    label: 'Maintenance',
    rangeText: '2,000–2,400 kcal',
    targetKcal: 2200,
    minKcal: 1950,
    maxKcal: 2450,
    prepSummary:
      'Balanced 1× local Tamil Nadu portions sustaining IT study focus and all 11 body systems.',
  };
}

export function getGoalSlotPrepNote(
  slotId: MealSlotId,
  goal: WeightGoalMode
): string {
  if (goal === 'loss') {
    const notes: Record<MealSlotId, string> = {
      early_morning: 'Loss prep: Warm metabolism water with zero karupatti or peanuts.',
      breakfast: 'Loss prep: Steamed millet/idli + lean egg/soya; skip extra oil & coconut.',
      mid_morning: 'Loss prep: High-volume kidney broth or fiber-rich fruit for hunger control.',
      lunch: 'Loss prep: Cap millet/rice at 1/2 cup; fill 60% of plate with keerai & poriyal.',
      evening_snack: 'Loss prep: Clear soup or sprouted moong-kollu bowl; no fried snacks.',
      dinner: 'Loss prep: Light steamed idli/kambu koozh before 8 PM for fat oxidation.',
      nighttime: 'Loss prep: No-jaggery warm turmeric infusion or toned milk.',
    };
    return notes[slotId];
  }
  if (goal === 'gain') {
    const notes: Record<MealSlotId, string> = {
      early_morning: 'Gain prep: Add soaked verkadalai + warm sukku kaapi for early calories.',
      breakfast: 'Gain prep: Extra gingelly oil/ghee + full protein side (2 eggs or paneer).',
      mid_morning: 'Gain prep: Pair red banana with roasted verkadalai & ellu urundai.',
      lunch: 'Gain prep: 1.5× millet/rice + 1 tbsp ellu podi + full cup homemade curd.',
      evening_snack: 'Gain prep: Double sundal + pottukadalai & banana for healthy calorie surplus.',
      dinner: 'Gain prep: Generous chapati/idli + rich dal, paneer, chicken, or mutton gravy.',
      nighttime: 'Gain prep: Whole milk with murungai poo, ellu powder & karupatti.',
    };
    return notes[slotId];
  }
  const notes: Record<MealSlotId, string> = {
    early_morning: 'Balanced prep: Standard traditional infusion to wake up digestion & focus.',
    breakfast: 'Balanced prep: 1× low-GI millet breakfast + protein anchor for morning study.',
    mid_morning: 'Balanced prep: Seasonal TN fruit, ilaneer, or neer mor between deep-work blocks.',
    lunch: 'Balanced prep: 1× millet/rice + keerai + rasam + curd-ellu podi balance.',
    evening_snack: 'Balanced prep: Moderate sundal or warm pepper broth to prevent evening slump.',
    dinner: 'Balanced prep: Easy-to-digest millet dinner 2 hours before sleep.',
    nighttime: 'Balanced prep: Standard 200 ml warm spiced milk or herbal infusion.',
  };
  return notes[slotId];
}

export function getGoalTargets(goal: WeightGoalMode): Nutrients {
  if (goal === 'loss') {
    return {
      ...DAILY_TARGETS,
      calories: 1700,
      protein: 90,
      carbs: 195,
      fat: 50,
      fiber: 40,
    };
  }
  if (goal === 'gain') {
    return {
      ...DAILY_TARGETS,
      calories: 2750,
      protein: 105,
      carbs: 355,
      fat: 84,
      fiber: 40,
    };
  }
  return { ...DAILY_TARGETS };
}

export function calculateHydrationTargetMl(
  settings: HydrationSettings,
  goal: WeightGoalMode,
  hasHighSodium: boolean
): number {
  const baseWeight = Math.min(Math.max(settings.weightKg || 68, 35), 160);
  let target =
    settings.customTargetMl && settings.customTargetMl >= 1000
      ? settings.customTargetMl
      : baseWeight * 35 +
        (settings.climateLevel === 'active_hot'
          ? 750
          : settings.climateLevel === 'moderate_warm'
          ? 400
          : 0) +
        (goal === 'loss' ? 250 : goal === 'gain' ? 150 : 0);

  if (hasHighSodium && !settings.customTargetMl) {
    target += 350;
  }

  // Round to nearest 250 ml glass, clamped between 2000 and 4500 ml
  const rounded = Math.round(target / 250) * 250;
  return Math.min(Math.max(rounded, 2000), 4500);
}

export function calculateDayHydrationMl(
  dayHydration: DayHydrationState | undefined
): number {
  if (!dayHydration) return 0;
  const checkpointSum = HYDRATION_CHECKPOINTS.reduce((sum, cp) => {
    return dayHydration.checkedCheckpoints?.[cp.id]
      ? sum + cp.recommendedMl
      : sum;
  }, 0);
  return Math.max(0, checkpointSum + (dayHydration.extraMl || 0));
}

export function emptyNutrients(): Nutrients {
  return {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    zinc: 0,
    iron: 0,
    calcium: 0,
    bComplex: 0,
    vitC: 0,
    magnesium: 0,
    choline: 0,
    sodium: 0,
  };
}

export function emptyCheckedSlots(): Record<MealSlotId, boolean> {
  return {
    early_morning: false,
    breakfast: false,
    mid_morning: false,
    lunch: false,
    evening_snack: false,
    dinner: false,
    nighttime: false,
  };
}

export function buildFoodLookup(customFoods: FoodItem[]): Record<string, FoodItem> {
  const map: Record<string, FoodItem> = {};
  for (const food of TN_FOODS) {
    map[food.id] = food;
  }
  for (const food of customFoods) {
    map[food.id] = food;
  }
  return map;
}

function isMeatOrFish(foodId: string, lookup: Record<string, FoodItem>): boolean {
  const food = lookup[foodId] || FOOD_MAP[foodId];
  if (!food) return false;
  return (
    food.dietType === 'mutton' ||
    food.dietType === 'chicken' ||
    food.dietType === 'fish' ||
    food.dietType === 'karuvadu'
  );
}

function buildGoalBaseMeals(
  plan: DayPlan,
  weightGoal: WeightGoalMode,
  lookup: Record<string, FoodItem>
): Record<MealSlotId, MealSlotEntry[]> {
  const result = {} as Record<MealSlotId, MealSlotEntry[]>;
  for (const slot of MEAL_SLOTS) {
    result[slot.id] = plan.meals[slot.id].map((entry) => ({ ...entry }));
  }

  if (weightGoal === 'maintenance') {
    return result;
  }

  if (weightGoal === 'loss') {
    // 1. Early Morning: swap out calorie-dense peanuts
    result.early_morning = result.early_morning
      .filter((e) => e.foodId !== 'em_soaked_verkadalai_tulsi')
      .map((e) => ({ ...e, multiplier: Math.min(e.multiplier, 1) }));
    if (result.early_morning.length === 0) {
      result.early_morning = [{ foodId: 'em_vendhaya_seeraga_thanni', multiplier: 1 }];
    }

    // 2. Breakfast: swap dense/oily items for lighter steamed millet/egg plates
    const hasEgg = result.breakfast.some((e) => e.foodId === 'bf_boiled_nattu_egg');
    const primaryBf = result.breakfast[0]?.foodId;
    if (
      primaryBf === 'bf_ulundhangali' ||
      primaryBf === 'bf_ragi_puttu_verkadalai' ||
      primaryBf === 'bf_thinai_pongal_chutney' ||
      primaryBf === 'bf_adai_avial'
    ) {
      result.breakfast = [
        { foodId: 'wl_ragi_keerai_idli_rasam', multiplier: 1 },
        { foodId: hasEgg ? 'bf_boiled_nattu_egg' : 'bf_soya_paneer_sundal', multiplier: 1 },
      ];
    } else {
      result.breakfast = result.breakfast.map((e) =>
        e.foodId === 'bf_boiled_nattu_egg'
          ? { foodId: e.foodId, multiplier: 1 }
          : { foodId: e.foodId, multiplier: 0.85 }
      );
    }

    // 3. Mid-Morning: swap banana/urundai for kidney-cleansing broth or sprouts
    const mmId = result.mid_morning[0]?.foodId;
    if (
      mmId === 'mm_red_banana_verkadalai' ||
      mmId === 'mm_papaya_ellu_urundai' ||
      mmId === 'mm_nattu_banana_pottukadalai'
    ) {
      result.mid_morning = [{ foodId: 'wl_vazhaithandu_kollu_soup', multiplier: 1 }];
    } else {
      result.mid_morning = [{ foodId: mmId || 'mm_pachai_payaru_sprouts', multiplier: 0.85 }];
    }

    // 4. Lunch: swap heavy mutton/rice for half-millet double-keerai, steamed fish, or chicken broth
    const lnPrimary = result.lunch[0]?.foodId || '';
    const primaryFood = lookup[lnPrimary];
    if (primaryFood?.dietType === 'fish') {
      result.lunch = [
        { foodId: 'wl_steamed_fish_keerai_lunch', multiplier: 1 },
        { foodId: 'ln_curd_carrot_ellu_podi', multiplier: 0.5 },
      ];
    } else if (primaryFood?.dietType === 'chicken' || primaryFood?.dietType === 'mutton') {
      result.lunch = [
        { foodId: 'wl_steamed_nattu_kozhi_broth_lunch', multiplier: 1 },
        { foodId: 'ln_curd_carrot_ellu_podi', multiplier: 0.5 },
      ];
    } else if (primaryFood?.dietType === 'karuvadu') {
      result.lunch = [
        { foodId: lnPrimary, multiplier: 0.85 },
        { foodId: 'mm_neer_mor_pottukadalai', multiplier: 0.5 },
      ];
    } else {
      result.lunch = [
        { foodId: 'wl_millet_double_keerai_lunch', multiplier: 1 },
        { foodId: 'ln_curd_carrot_ellu_podi', multiplier: 0.5 },
      ];
    }

    // 5. Evening Snack: keep clear bone/chicken soups or swap heavy sundal for sprouted moong+neer mor
    const esPrimary = result.evening_snack[0]?.foodId;
    if (esPrimary !== 'nv_mutton_nenju_soup' && esPrimary !== 'nv_nattu_kozhi_rasam') {
      result.evening_snack = [{ foodId: 'wl_sundal_neer_mor_bowl', multiplier: 1 }];
    }

    // 6. Dinner: light steamed ragi-keerai idli + kollu rasam or 0.75x light dinner
    const dnPrimary = result.dinner[0]?.foodId || '';
    if (dnPrimary === 'dn_chapati_green_gram' || dnPrimary === 'dn_idli_karuveppilai_podi') {
      result.dinner = [{ foodId: 'wl_ragi_keerai_idli_rasam', multiplier: 1 }];
    } else {
      result.dinner = result.dinner.map((e) => ({
        foodId: e.foodId,
        multiplier: Math.min(e.multiplier, 0.8),
      }));
    }

    // 7. Nighttime: lean turmeric-pepper drink or digestive water
    result.nighttime = [{ foodId: 'wl_skim_manjal_jeera_drink', multiplier: 1 }];
    return result;
  }

  // WEIGHT GAIN ('gain')
  // 1. Early Morning: keep tonic + moderate soaked peanuts if light
  if (
    result.early_morning.length === 1 &&
    !result.early_morning.some((e) => e.foodId === 'em_soaked_verkadalai_tulsi')
  ) {
    result.early_morning = [
      result.early_morning[0] || { foodId: 'em_sukku_malli_kaapi', multiplier: 1 },
      { foodId: 'em_soaked_verkadalai_tulsi', multiplier: 0.5 },
    ];
  }

  // 2. Breakfast: dense Tamil ulundhangali + eggs or 1.15x breakfast + full egg/paneer
  if (plan.day % 3 === 1) {
    result.breakfast = [{ foodId: 'wg_ulundhangali_verkadalai_bf', multiplier: 1 }];
  } else {
    result.breakfast = result.breakfast.map((entry, idx) =>
      idx === 0
        ? { foodId: entry.foodId, multiplier: 1.15 }
        : { foodId: entry.foodId, multiplier: Math.max(entry.multiplier, 1) }
    );
    if (result.breakfast.length === 1) {
      result.breakfast.push({ foodId: 'bf_boiled_nattu_egg', multiplier: 1 });
    }
  }

  // 3. Mid-Morning: calorie-dense red banana + verkadalai + ellu urundai
  if (plan.day % 2 === 1) {
    result.mid_morning = [{ foodId: 'wg_red_banana_ellu_shake', multiplier: 1 }];
  } else {
    result.mid_morning = [
      { foodId: result.mid_morning[0]?.foodId || 'mm_papaya_ellu_urundai', multiplier: 1 },
      { foodId: 'mm_nattu_banana_pottukadalai', multiplier: 0.75 },
    ];
  }

  // 4. Lunch: 1.5x rice/millet + rich protein/curd/ellu podi
  const lnFirst = result.lunch[0]?.foodId || '';
  const lnFood = lookup[lnFirst];
  if (lnFood?.dietType === 'mutton') {
    result.lunch = [{ foodId: 'wg_mutton_ghee_varagu_lunch', multiplier: 1 }];
  } else if (lnFood?.dietType === 'fish') {
    result.lunch = [{ foodId: 'wg_fish_ellu_varagu_lunch', multiplier: 1 }];
  } else if (lnFood?.dietType === 'chicken') {
    result.lunch = [
      { foodId: 'nv_nattu_kozhi_pepper', multiplier: 1.15 },
      { foodId: 'ln_curd_carrot_ellu_podi', multiplier: 1 },
    ];
  } else if (lnFood?.dietType === 'karuvadu') {
    result.lunch = [
      { foodId: lnFirst, multiplier: 1.15 },
      { foodId: 'ln_curd_carrot_ellu_podi', multiplier: 1 },
    ];
  } else {
    result.lunch = [{ foodId: 'wg_veg_ghee_sambar_sundal_lunch', multiplier: 1 }];
  }

  // 5. Evening Snack: double peanut-pottukadalai-banana mass snack or soup + peanuts
  const esFirst = result.evening_snack[0]?.foodId;
  if (esFirst === 'nv_mutton_nenju_soup' || esFirst === 'nv_nattu_kozhi_rasam') {
    result.evening_snack = [
      { foodId: esFirst, multiplier: 1 },
      { foodId: 'es_verkadalai_sundal', multiplier: 0.75 },
    ];
  } else {
    result.evening_snack = [{ foodId: 'wg_verkadalai_pottukadalai_banana', multiplier: 0.9 }];
  }

  // 6. Dinner: richer chapati-dal-curd or idli-chicken/mutton kuzhambu
  const dnFirst = result.dinner[0]?.foodId || '';
  if (dnFirst === 'nv_chicken_kuzhambu_idli' || plan.day % 4 === 0) {
    result.dinner = [{ foodId: 'wg_mutton_chicken_parotta_idli_dn', multiplier: 0.9 }];
  } else {
    result.dinner = [{ foodId: 'wg_chapati_double_dal_curd_dn', multiplier: 0.9 }];
  }

  // 7. Nighttime: nutrient-dense whole milk with murungai poo, ellu & karupatti
  result.nighttime = [{ foodId: 'wg_murungai_ellu_karupatti_milk', multiplier: 1 }];

  return result;
}

export function getEffectiveMealsForDay(
  plan: DayPlan,
  dayState: DayProgressState | undefined,
  dietMode: DietMode,
  weightGoal: WeightGoalMode = 'maintenance',
  foodLookup: Record<string, FoodItem> = FOOD_MAP
): Record<MealSlotId, MealSlotEntry[]> {
  const goalBase = buildGoalBaseMeals(plan, weightGoal, foodLookup);
  const goalCustomMeals =
    dayState?.customMealsByGoal?.[weightGoal] ??
    (weightGoal === 'maintenance' ? dayState?.customMeals : undefined);

  const result = {} as Record<MealSlotId, MealSlotEntry[]>;

  for (const slot of MEAL_SLOTS) {
    const custom = goalCustomMeals?.[slot.id];
    if (custom !== undefined) {
      result[slot.id] = custom;
      continue;
    }

    const baseEntries = goalBase[slot.id];
    if (dietMode === 'veg_millet') {
      result[slot.id] = baseEntries.map((entry) => {
        const subId = VEG_SUBSTITUTES_BY_ID[entry.foodId];
        return subId ? { foodId: subId, multiplier: entry.multiplier } : entry;
      });
    } else {
      result[slot.id] = [...baseEntries];
    }
  }

  // Non-Veg Included mode: ensure every uncustomized day includes a non-veg Tamil Nadu anchor
  if (dietMode === 'non_veg') {
    const hasAnyMeatOrFish = MEAL_SLOTS.some((slot) =>
      result[slot.id].some((entry) => isMeatOrFish(entry.foodId, foodLookup))
    );
    if (!hasAnyMeatOrFish && goalCustomMeals?.lunch === undefined) {
      if (weightGoal === 'loss') {
        result.lunch = [
          {
            foodId:
              plan.day % 2 === 0
                ? 'wl_steamed_fish_keerai_lunch'
                : 'wl_steamed_nattu_kozhi_broth_lunch',
            multiplier: 1,
          },
          { foodId: 'ln_curd_carrot_ellu_podi', multiplier: 0.5 },
        ];
      } else if (weightGoal === 'gain') {
        result.lunch = [
          {
            foodId:
              plan.day % 2 === 0
                ? 'wg_fish_ellu_varagu_lunch'
                : 'wg_mutton_ghee_varagu_lunch',
            multiplier: 1,
          },
        ];
      } else {
        const nvId =
          NON_VEG_LUNCH_ROTATION[(plan.day - 1) % NON_VEG_LUNCH_ROTATION.length];
        result.lunch = [
          { foodId: nvId, multiplier: 1 },
          { foodId: 'ln_curd_carrot_ellu_podi', multiplier: 1 },
        ];
      }
    }
  }

  // High-Protein Focus mode: upgrade lighter uncustomized slots
  if (dietMode === 'high_protein') {
    if (goalCustomMeals?.breakfast === undefined) {
      const hasEggOrPaneer = result.breakfast.some(
        (e) =>
          e.foodId === 'bf_boiled_nattu_egg' ||
          e.foodId === 'bf_soya_paneer_sundal' ||
          e.foodId === 'wg_ulundhangali_verkadalai_bf'
      );
      if (!hasEggOrPaneer) {
        result.breakfast = [
          ...result.breakfast,
          { foodId: 'bf_boiled_nattu_egg', multiplier: 1 },
        ];
      }
    }

    if (goalCustomMeals?.evening_snack === undefined) {
      const isLightSnack = result.evening_snack.some(
        (e) => e.foodId === 'es_sweet_potato_pepper'
      );
      if (isLightSnack) {
        result.evening_snack = [{ foodId: 'nv_nattu_kozhi_rasam', multiplier: 1 }];
      }
    }

    if (goalCustomMeals?.lunch === undefined) {
      const hasHighProteinLunch = result.lunch.some(
        (e) =>
          isMeatOrFish(e.foodId, foodLookup) ||
          e.foodId === 'wg_veg_ghee_sambar_sundal_lunch'
      );
      if (!hasHighProteinLunch) {
        const hasChanna = result.lunch.some(
          (e) => e.foodId === 'ln_kondakadalai_poriyal'
        );
        if (!hasChanna) {
          result.lunch = [
            ...result.lunch,
            {
              foodId: 'ln_kondakadalai_poriyal',
              multiplier: weightGoal === 'loss' ? 0.75 : 1,
            },
          ];
        }
      }
    }
  }

  return result;
}

export function addNutrients(
  acc: Nutrients,
  n: Nutrients,
  multiplier = 1
): Nutrients {
  return {
    calories: acc.calories + n.calories * multiplier,
    protein: acc.protein + n.protein * multiplier,
    carbs: acc.carbs + n.carbs * multiplier,
    fat: acc.fat + n.fat * multiplier,
    fiber: acc.fiber + n.fiber * multiplier,
    zinc: acc.zinc + n.zinc * multiplier,
    iron: acc.iron + n.iron * multiplier,
    calcium: acc.calcium + n.calcium * multiplier,
    bComplex: acc.bComplex + n.bComplex * multiplier,
    vitC: acc.vitC + n.vitC * multiplier,
    magnesium: acc.magnesium + n.magnesium * multiplier,
    choline: acc.choline + n.choline * multiplier,
    sodium: acc.sodium + (n.sodium || 0) * multiplier,
  };
}

export function sumSlotNutrients(
  entries: MealSlotEntry[],
  foodLookup: Record<string, FoodItem>
): Nutrients {
  let totals = emptyNutrients();
  for (const entry of entries) {
    const food = foodLookup[entry.foodId];
    if (food) {
      totals = addNutrients(totals, food.nutrients, entry.multiplier);
    }
  }
  return totals;
}

export function sumDayNutrients(
  meals: Record<MealSlotId, MealSlotEntry[]>,
  checkedSlots: Record<MealSlotId, boolean>,
  foodLookup: Record<string, FoodItem>,
  mode: 'consumed' | 'planned'
): Nutrients {
  let totals = emptyNutrients();
  for (const slot of MEAL_SLOTS) {
    if (mode === 'consumed' && !checkedSlots[slot.id]) {
      continue;
    }
    const slotTotals = sumSlotNutrients(meals[slot.id] || [], foodLookup);
    totals = addNutrients(totals, slotTotals, 1);
  }
  return totals;
}

export interface SystemCoverageInfo {
  system: BodySystem;
  plannedFoods: string[];
  consumedFoods: string[];
}

export function getDaySystemCoverage(
  meals: Record<MealSlotId, MealSlotEntry[]>,
  checkedSlots: Record<MealSlotId, boolean>,
  foodLookup: Record<string, FoodItem>
): Record<BodySystem, SystemCoverageInfo> {
  const systems: BodySystem[] = [
    'brain',
    'fertility',
    'heart',
    'bones',
    'lungs',
    'eyes',
    'digestive',
    'renal',
    'endocrine',
    'immune',
    'integumentary',
  ];

  const coverage = {} as Record<BodySystem, SystemCoverageInfo>;
  for (const sys of systems) {
    coverage[sys] = { system: sys, plannedFoods: [], consumedFoods: [] };
  }

  for (const slot of MEAL_SLOTS) {
    const isChecked = Boolean(checkedSlots[slot.id]);
    const entries = meals[slot.id] || [];
    for (const entry of entries) {
      const food = foodLookup[entry.foodId];
      if (!food) continue;
      for (const sys of food.systems) {
        if (!coverage[sys].plannedFoods.includes(food.name)) {
          coverage[sys].plannedFoods.push(food.name);
        }
        if (isChecked && !coverage[sys].consumedFoods.includes(food.name)) {
          coverage[sys].consumedFoods.push(food.name);
        }
      }
    }
  }

  return coverage;
}

export function getDefaultTodayDay(): number {
  const dateNum = new Date().getDate();
  return Math.min(Math.max(dateNum, 1), 30);
}

export function loadTrackerState(): TrackerStorageState {
  const defaultDay = getDefaultTodayDay();
  const fallback: TrackerStorageState = {
    selectedDay: defaultDay,
    todayDay: defaultDay,
    days: {},
    customFoods: [],
    dietMode: 'all',
    weightGoal: 'maintenance',
    hydrationSettings: {
      weightKg: 68,
      climateLevel: 'moderate_warm',
      customTargetMl: null,
    },
    hydrationByDay: {},
    weightLogs: [],
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<TrackerStorageState> & {
      vegOnly?: boolean;
    };

    const validModes: DietMode[] = [
      'all',
      'veg_millet',
      'non_veg',
      'high_protein',
    ];
    let resolvedDietMode: DietMode = 'all';
    if (parsed.dietMode && validModes.includes(parsed.dietMode)) {
      resolvedDietMode = parsed.dietMode;
    } else if (parsed.vegOnly) {
      resolvedDietMode = 'veg_millet';
    }

    const validGoals: WeightGoalMode[] = ['loss', 'maintenance', 'gain'];
    const resolvedGoal: WeightGoalMode =
      parsed.weightGoal && validGoals.includes(parsed.weightGoal)
        ? parsed.weightGoal
        : 'maintenance';

    return {
      selectedDay:
        typeof parsed.selectedDay === 'number' &&
        parsed.selectedDay >= 1 &&
        parsed.selectedDay <= 30
          ? parsed.selectedDay
          : defaultDay,
      todayDay:
        typeof parsed.todayDay === 'number' &&
        parsed.todayDay >= 1 &&
        parsed.todayDay <= 30
          ? parsed.todayDay
          : defaultDay,
      days: parsed.days && typeof parsed.days === 'object' ? parsed.days : {},
      customFoods: Array.isArray(parsed.customFoods) ? parsed.customFoods : [],
      dietMode: resolvedDietMode,
      weightGoal: resolvedGoal,
      hydrationSettings:
        parsed.hydrationSettings && typeof parsed.hydrationSettings === 'object'
          ? {
              weightKg: Number(parsed.hydrationSettings.weightKg) || 68,
              climateLevel:
                parsed.hydrationSettings.climateLevel || 'moderate_warm',
              customTargetMl:
                parsed.hydrationSettings.customTargetMl ?? null,
            }
          : fallback.hydrationSettings,
      hydrationByDay:
        parsed.hydrationByDay && typeof parsed.hydrationByDay === 'object'
          ? parsed.hydrationByDay
          : {},
      weightLogs: Array.isArray(parsed.weightLogs) ? parsed.weightLogs : [],
    };
  } catch {
    return fallback;
  }
}

export function saveTrackerState(state: TrackerStorageState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota or storage restriction errors silently
  }
}

export function getDayCompletionCount(
  dayNumber: number,
  daysState: Record<number, DayProgressState>
): number {
  const dayState = daysState[dayNumber];
  if (!dayState) return 0;
  return MEAL_SLOTS.filter((slot) => Boolean(dayState.checkedSlots?.[slot.id]))
    .length;
}

export function getDayPlan(dayNumber: number): DayPlan {
  return (
    MEAL_PLAN_30_DAYS.find((d) => d.day === dayNumber) || MEAL_PLAN_30_DAYS[0]
  );
}
