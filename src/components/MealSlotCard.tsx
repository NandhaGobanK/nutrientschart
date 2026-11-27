import { AlertTriangle, BookOpen, Check, SlidersHorizontal } from 'lucide-react';
import { BODY_SYSTEMS } from '../data/tnFoods';
import {
  BodySystem,
  DietType,
  FoodItem,
  MealSlotEntry,
  MealSlotMeta,
  WeightGoalMode,
} from '../types/nutrition';
import { getGoalSlotPrepNote, sumSlotNutrients } from '../utils/nutritionCalc';

interface MealSlotCardProps {
  slot: MealSlotMeta;
  entries: MealSlotEntry[];
  foodLookup: Record<string, FoodItem>;
  isChecked: boolean;
  isCustomized: boolean;
  activeSystemFilter: BodySystem | 'all';
  weightGoal: WeightGoalMode;
  onToggleChecked: () => void;
  onOpenCustomizer: () => void;
  onOpenRecipe: (food: FoodItem) => void;
}

const SYSTEM_SHORT_MAP = Object.fromEntries(
  BODY_SYSTEMS.map((s) => [s.id, s.shortLabel])
) as Record<BodySystem, string>;

const DIET_LABELS: Record<DietType, string> = {
  veg: '',
  egg: 'Egg',
  mutton: 'Goat / Mutton',
  chicken: 'Country Chicken',
  fish: 'Fresh Fish / Crab',
  karuvadu: 'Dried Fish (Karuvadu)',
};

export function MealSlotCard({
  slot,
  entries,
  foodLookup,
  isChecked,
  isCustomized,
  activeSystemFilter,
  weightGoal,
  onToggleChecked,
  onOpenCustomizer,
  onOpenRecipe,
}: MealSlotCardProps) {
  const slotTotals = sumSlotNutrients(entries, foodLookup);
  const goalPrepNote = getGoalSlotPrepNote(slot.id, weightGoal);
  const coveredSystems = Array.from(
    new Set(
      entries.flatMap((entry) => {
        const item = foodLookup[entry.foodId];
        return item ? item.systems : [];
      })
    )
  );

  return (
    <article
      className={`rounded-xl border transition-colors p-4 sm:p-5 ${
        isChecked
          ? 'bg-emerald-50/45 border-emerald-200/90 dark:bg-emerald-950/20 dark:border-emerald-800/70'
          : 'bg-white border-slate-200 dark:bg-[#161E1B] dark:border-slate-800'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <button
            type="button"
            role="checkbox"
            aria-checked={isChecked}
            aria-label={`Mark ${slot.label} as eaten`}
            onClick={onToggleChecked}
            className={`mt-0.5 flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl border transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
              isChecked
                ? 'bg-emerald-700 border-emerald-700 text-white dark:bg-emerald-600 dark:border-emerald-600'
                : 'bg-slate-50 border-slate-300 text-transparent hover:border-emerald-600 dark:bg-slate-800/80 dark:border-slate-600 dark:hover:border-emerald-500'
            }`}
          >
            <Check className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
              <h3
                className={`font-display text-base sm:text-lg font-semibold tracking-tight ${
                  isChecked
                    ? 'text-emerald-950 dark:text-emerald-100'
                    : 'text-slate-900 dark:text-slate-50'
                }`}
              >
                {slot.label}
              </h3>
              <span className="font-mono-nums text-xs text-slate-500 dark:text-slate-400">
                {slot.timeWindow}
              </span>
              {isCustomized && (
                <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                  · Customized
                </span>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono-nums font-medium text-slate-700 dark:text-slate-200">
                {Math.round(slotTotals.calories)} kcal
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-nums">
                {slotTotals.protein.toFixed(1)}g protein
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-nums">
                {slotTotals.zinc.toFixed(1)} mg zinc
              </span>
              {coveredSystems.length > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                    {coveredSystems
                      .map((sys) => SYSTEM_SHORT_MAP[sys])
                      .join(' · ')}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCustomizer}
          className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Swap / Edit</span>
        </button>
      </div>

      {/* Goal-Specific Slot Preparation Note */}
      <p className="mt-2.5 pl-0 sm:pl-[56px] text-xs text-slate-600 dark:text-slate-300">
        {goalPrepNote}
      </p>

      {/* Meal Items List */}
      {entries.length === 0 ? (
        <div className="mt-3 pl-[56px] text-sm text-slate-500 dark:text-slate-400">
          No items scheduled for this slot. Click Swap / Edit to add local Tamil Nadu foods.
        </div>
      ) : (
        <ul className="mt-3.5 pl-0 sm:pl-[56px] divide-y divide-slate-100 dark:divide-slate-800/80">
          {entries.map((entry, idx) => {
            const food = foodLookup[entry.foodId];
            if (!food) return null;
            const kcal = Math.round(food.nutrients.calories * entry.multiplier);
            const prot = (food.nutrients.protein * entry.multiplier).toFixed(1);
            const dietLabel = DIET_LABELS[food.dietType];
            const matchesFilter =
              activeSystemFilter !== 'all' &&
              food.systems.includes(activeSystemFilter);

            return (
              <li
                key={`${entry.foodId}-${idx}`}
                className={`py-2.5 first:pt-0 last:pb-0 flex flex-col gap-1.5 ${
                  matchesFilter
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/35 -mx-2 px-2 rounded-lg'
                    : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-snug">
                      <span>{food.name}</span>
                      {entry.multiplier !== 1 && (
                        <span className="ml-1.5 font-mono-nums text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          ({entry.multiplier}×)
                        </span>
                      )}
                      {dietLabel && (
                        <span className="ml-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                          · {dietLabel}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span>{food.portion}</span>
                      <span aria-hidden="true">·</span>
                      <span>{food.note}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono-nums text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {kcal} kcal · {prot}g P
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenRecipe(food)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 min-h-[30px] rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <BookOpen className="w-3 h-3" aria-hidden="true" />
                      <span>How to make</span>
                    </button>
                  </div>
                </div>

                {food.sodiumNote && (
                  <div className="flex items-start gap-1.5 text-xs text-amber-800 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-lg px-2.5 py-1.5">
                    <AlertTriangle
                      className="w-3.5 h-3.5 mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{food.sodiumNote}</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}
