export type BodySystem =
  | 'brain'
  | 'fertility'
  | 'bones'
  | 'heart'
  | 'lungs'
  | 'eyes'
  | 'digestive'
  | 'renal'
  | 'endocrine'
  | 'immune'
  | 'integumentary';

export type MealSlotId =
  | 'early_morning'
  | 'breakfast'
  | 'mid_morning'
  | 'lunch'
  | 'evening_snack'
  | 'dinner'
  | 'nighttime';

export type DietType =
  | 'veg'
  | 'egg'
  | 'mutton'
  | 'chicken'
  | 'fish'
  | 'karuvadu';

export type DietMode = 'all' | 'veg_millet' | 'non_veg' | 'high_protein';

export type WeightGoalMode = 'loss' | 'maintenance' | 'gain';

export type HydrationClimateLevel =
  | 'sedentary_cool'
  | 'moderate_warm'
  | 'active_hot';

export interface Nutrients {
  calories: number; // kcal
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fiber: number; // g
  zinc: number; // mg
  iron: number; // mg
  calcium: number; // mg
  bComplex: number; // % Daily Value composite
  vitC: number; // mg
  magnesium: number; // mg
  choline: number; // mg
  sodium: number; // mg
}

export interface FoodItem {
  id: string;
  name: string;
  tamilName: string;
  portion: string;
  slots: MealSlotId[];
  dietType: DietType;
  nutrients: Nutrients;
  systems: BodySystem[];
  note: string;
  sodiumNote?: string;
  isCustom?: boolean;
}

export interface RecipeDetail {
  foodId: string;
  prepTime: string;
  cookTime: string;
  ingredients: string[];
  steps: string[];
  lossTip: string;
  gainTip: string;
}

export interface MealSlotEntry {
  foodId: string;
  multiplier: number; // e.g., 0.5, 1, 1.5, 2
}

export interface DayPlan {
  day: number;
  title: string;
  focusAnchor: string;
  meals: Record<MealSlotId, MealSlotEntry[]>;
}

export interface DayProgressState {
  checkedSlots: Record<MealSlotId, boolean>;
  customMeals?: Partial<Record<MealSlotId, MealSlotEntry[]>>;
  customMealsByGoal?: Partial<
    Record<WeightGoalMode, Partial<Record<MealSlotId, MealSlotEntry[]>>>
  >;
}

export interface DayHydrationState {
  extraMl: number;
  checkedCheckpoints: Record<string, boolean>;
}

export interface HydrationSettings {
  weightKg: number;
  climateLevel: HydrationClimateLevel;
  customTargetMl: number | null;
}

export interface WeightLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  note?: string;
}

export interface TrackerStorageState {
  selectedDay: number;
  todayDay: number;
  days: Record<number, DayProgressState>;
  customFoods: FoodItem[];
  dietMode: DietMode;
  weightGoal: WeightGoalMode;
  hydrationSettings: HydrationSettings;
  hydrationByDay: Record<number, DayHydrationState>;
  weightLogs: WeightLogEntry[];
}

export interface MealSlotMeta {
  id: MealSlotId;
  label: string;
  timeWindow: string;
  purpose: string;
}

export interface BodySystemMeta {
  id: BodySystem;
  label: string;
  shortLabel: string;
  description: string;
  keyNutrients: string;
}

export interface HydrationCheckpointMeta {
  id: string;
  label: string;
  time: string;
  recommendedMl: number;
  beverageNote: string;
}

export type IngredientCategory =
  | 'grains_millets'
  | 'greens'
  | 'pulses_seeds'
  | 'spices_herbs'
  | 'non_veg'
  | 'dairy_drinks';

export interface RawMaterial {
  id: string;
  name: string;
  tamilName: string;
  category: IngredientCategory;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  iron: number; // mg
  calcium: number; // mg
  zinc: number; // mg
  magnesium: number; // mg
  bComplex: string; // e.g., "24% DV (B1, B3, B6)" or "2.8 mcg B12 (116% DV)"
  choline: number; // mg
  vitC: number; // mg
  omega3Mg?: number; // mg DHA/EPA or ALA
  sodiumMg?: number; // mg
  prepNote?: string;
  systems: BodySystem[];
  bodyPartsSummary: string;
  healthBenefits: string;
  linkedFoodId: string;
  defaultSlotId: MealSlotId;
}
