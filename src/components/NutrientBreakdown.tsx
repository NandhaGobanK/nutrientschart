import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  Minus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { DAILY_TARGETS } from '../data/tnFoods';
import { Nutrients, WeightGoalMode } from '../types/nutrition';
import { getGoalTargets } from '../utils/nutritionCalc';

interface NutrientBreakdownProps {
  mode: 'consumed' | 'planned';
  onChangeMode: (mode: 'consumed' | 'planned') => void;
  consumedNutrients: Nutrients;
  plannedNutrients: Nutrients;
  checkedCount: number;
  totalSlots: number;
  weightGoal: WeightGoalMode;
}

interface MicroRowConfig {
  key: keyof Nutrients;
  label: string;
  unit: string;
  target: number;
  role: string;
  isUpperLimit?: boolean;
}

const MICRO_ROWS: MicroRowConfig[] = [
  {
    key: 'zinc',
    label: 'Zinc',
    unit: 'mg',
    target: DAILY_TARGETS.zinc,
    role: 'Fertility, testosterone & focus',
  },
  {
    key: 'iron',
    label: 'Iron',
    unit: 'mg',
    target: DAILY_TARGETS.iron,
    role: 'Hemoglobin & stamina',
  },
  {
    key: 'calcium',
    label: 'Calcium',
    unit: 'mg',
    target: DAILY_TARGETS.calcium,
    role: 'Bones, spine & ligaments',
  },
  {
    key: 'bComplex',
    label: 'B-Complex',
    unit: '% DV',
    target: DAILY_TARGETS.bComplex,
    role: 'B12 & steady cognitive energy',
  },
  {
    key: 'vitC',
    label: 'Vitamin C',
    unit: 'mg',
    target: DAILY_TARGETS.vitC,
    role: 'Lungs, immunity & iron uptake',
  },
  {
    key: 'magnesium',
    label: 'Magnesium',
    unit: 'mg',
    target: DAILY_TARGETS.magnesium,
    role: 'Nerves, stress & focus',
  },
  {
    key: 'choline',
    label: 'Choline',
    unit: 'mg',
    target: DAILY_TARGETS.choline,
    role: 'Memory & acetylcholine',
  },
  {
    key: 'sodium',
    label: 'Sodium',
    unit: 'mg',
    target: DAILY_TARGETS.sodium,
    role: 'Moderation limit (karuvadu & salt)',
    isUpperLimit: true,
  },
];

const GOAL_GUIDANCE: Record<
  WeightGoalMode,
  { title: string; targetNote: string; tnTweaks: string }
> = {
  loss: {
    title: 'Weight Loss Mode',
    targetNote: '1,500–1,800 kcal/day · High-satiety fiber & lean protein',
    tnTweaks:
      'Use 0.5–0.75× rice/millet sadam, cap oil/coconut to 1 tsp per dish, double manathakkali/kothavarangai/vazhaithandu volume, and keep boiled nattu egg, kollu rasam, or steamed fish/chicken.',
  },
  maintenance: {
    title: 'Maintenance Mode',
    targetNote: '2,050–2,350 kcal/day · Steady IT cognitive & metabolic balance',
    tnTweaks:
      'Follow standard 1× portions across millets, keerai, kollu/sundal, and optional non-veg slots to maintain steady study energy and full 11-system micronutrient coverage.',
  },
  gain: {
    title: 'Weight Gain Mode',
    targetNote: '2,600–2,950 kcal/day · Calorie-dense local TN energy',
    tnTweaks:
      'Use 1.5× millet/parboiled rice portions, add 1 tbsp ellu podi or sesame oil on meals, eat full sundal/verkadalai/pottukadalai snacks, and prioritize extra egg, mutton, or mathi/ayala fish.',
  },
};

export function NutrientBreakdown({
  mode,
  onChangeMode,
  consumedNutrients,
  plannedNutrients,
  checkedCount,
  totalSlots,
  weightGoal,
}: NutrientBreakdownProps) {
  const active = mode === 'consumed' ? consumedNutrients : plannedNutrients;
  const targets = getGoalTargets(weightGoal);
  const goalGuide = GOAL_GUIDANCE[weightGoal];

  const calPct = Math.min(
    100,
    Math.round((active.calories / targets.calories) * 100)
  );

  // Compare full day planned calories against goal target to clearly show Deficit / Balanced / Surplus
  const plannedDiff = Math.round(plannedNutrients.calories - targets.calories);
  const balanceStatus =
    plannedDiff < -100
      ? 'deficit'
      : plannedDiff > 100
      ? 'surplus'
      : 'balanced';

  const macroCards = [
    {
      label: 'Protein',
      value: active.protein,
      target: targets.protein,
      unit: 'g',
    },
    {
      label: 'Carbohydrates',
      value: active.carbs,
      target: targets.carbs,
      unit: 'g',
    },
    {
      label: 'Fat',
      value: active.fat,
      target: targets.fat,
      unit: 'g',
    },
    {
      label: 'Fiber',
      value: active.fiber,
      target: targets.fiber,
      unit: 'g',
    },
  ];

  const isSodiumHigh = active.sodium > DAILY_TARGETS.sodium;

  return (
    <section
      id="nutrients"
      aria-label="Daily nutrient and macro breakdown"
      className="bg-white dark:bg-[#161E1B] border border-slate-200 dark:border-slate-800 rounded-xl p-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Nutrient Breakdown
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 font-mono-nums">
            {Math.round(consumedNutrients.calories)} kcal eaten of{' '}
            {Math.round(plannedNutrients.calories)} kcal planned ({checkedCount}/
            {totalSlots} meals)
          </p>
        </div>

        {/* Segmented Control: Eaten vs Planned */}
        <div
          role="group"
          aria-label="Nutrition calculation scope"
          className="inline-flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 self-start sm:self-auto"
        >
          <button
            type="button"
            onClick={() => onChangeMode('consumed')}
            className={`px-3 py-1.5 min-h-[34px] rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'consumed'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Eaten Today
          </button>
          <button
            type="button"
            onClick={() => onChangeMode('planned')}
            className={`px-3 py-1.5 min-h-[34px] rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'planned'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Full Day Plan
          </button>
        </div>
      </div>

      {/* Weight Goal Balance & Tamil Nadu Meal Tweaks */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/45 border border-slate-200/80 dark:border-slate-700/70 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {goalGuide.title}
            </span>
            <span className="ml-2 text-[11px] text-slate-500 dark:text-slate-400">
              {goalGuide.targetNote}
            </span>
          </div>

          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold font-mono-nums ${
              balanceStatus === 'deficit'
                ? 'text-sky-700 dark:text-sky-400'
                : balanceStatus === 'surplus'
                ? 'text-amber-700 dark:text-amber-400'
                : 'text-emerald-700 dark:text-emerald-400'
            }`}
          >
            {balanceStatus === 'deficit' ? (
              <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
            ) : balanceStatus === 'surplus' ? (
              <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Minus className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>
              {balanceStatus === 'deficit'
                ? `In Deficit (${plannedDiff} kcal vs goal)`
                : balanceStatus === 'surplus'
                ? `In Surplus (+${plannedDiff} kcal vs goal)`
                : `Balanced (${plannedDiff >= 0 ? `+${plannedDiff}` : plannedDiff} kcal vs goal)`}
            </span>
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {goalGuide.tnTweaks}
        </p>
      </div>

      {/* Total Calories Bar */}
      <div className="mt-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Total Energy
          </span>
          <div className="font-mono-nums text-right">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {Math.round(active.calories)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
              / {targets.calories} kcal ({calPct}%)
            </span>
          </div>
        </div>
        <div className="mt-2 h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-700 dark:bg-emerald-500 transition-all duration-200"
            style={{ width: `${calPct}%` }}
          />
        </div>
      </div>

      {/* 4-Card Macronutrients */}
      <div className="mt-4 grid grid-cols-2 gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
        {macroCards.map((macro) => {
          const pct = Math.min(
            100,
            Math.round((macro.value / macro.target) * 100)
          );
          return (
            <div
              key={macro.label}
              className="p-3 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60"
            >
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {macro.label}
                </span>
                <span className="font-mono-nums text-[11px] text-slate-500 dark:text-slate-400">
                  {pct}%
                </span>
              </div>
              <div className="mt-1 font-mono-nums">
                <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  {macro.value.toFixed(1)}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                  / {macro.target}
                  {macro.unit}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-700 dark:bg-emerald-500 transition-all duration-200"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Vitamins, Minerals & Sodium Moderation */}
      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Key Vitamins, Minerals &amp; Sodium
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            % of daily target
          </span>
        </div>

        {mode === 'consumed' && checkedCount === 0 && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 rounded-lg px-3 py-2">
            Check off any meal on the left to watch your consumed vitamins and minerals climb, or switch to Full Day Plan to preview the day&apos;s totals.
          </p>
        )}

        {isSodiumHigh && (
          <div className="mt-2.5 flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 rounded-lg px-3 py-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              Daily sodium is elevated ({Math.round(active.sodium)} mg). Drink 2–3 extra glasses of water, seeraga thanni, or neer mor for kidney balance.
            </span>
          </div>
        )}

        <div className="mt-3 space-y-3.5">
          {MICRO_ROWS.map((row) => {
            const val = active[row.key];
            const rawPct = Math.round((val / row.target) * 100);
            const barPct = Math.min(100, rawPct);
            const isOverLimit = Boolean(row.isUpperLimit && rawPct > 100);
            const met = row.isUpperLimit ? !isOverLimit : rawPct >= 90;

            return (
              <div key={row.key}>
                <div className="flex items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {row.label}
                    </span>
                    <span className="ml-2 text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                      {row.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono-nums text-xs shrink-0">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {row.key === 'calcium' ||
                      row.key === 'magnesium' ||
                      row.key === 'choline' ||
                      row.key === 'bComplex' ||
                      row.key === 'vitC' ||
                      row.key === 'sodium'
                        ? Math.round(val)
                        : val.toFixed(1)}
                      <span className="text-slate-500 dark:text-slate-400 font-normal">
                        {' '}
                        / {row.target} {row.unit}
                      </span>
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                        isOverLimit
                          ? 'text-amber-700 dark:text-amber-400'
                          : met
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {isOverLimit ? (
                        <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : met ? (
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <CircleDashed className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                      <span>
                        {row.isUpperLimit
                          ? isOverLimit
                            ? 'High'
                            : `${rawPct}%`
                          : `${rawPct}%`}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-200 ${
                      isOverLimit
                        ? 'bg-amber-600 dark:bg-amber-500'
                        : met
                        ? 'bg-emerald-700 dark:bg-emerald-500'
                        : 'bg-slate-500 dark:bg-slate-400'
                    }`}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
