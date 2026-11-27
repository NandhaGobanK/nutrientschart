import { AlertTriangle, Clock, Utensils, X } from 'lucide-react';
import { getRecipeForFood } from '../data/recipes';
import { BODY_SYSTEMS } from '../data/tnFoods';
import { BodySystem, FoodItem, WeightGoalMode } from '../types/nutrition';

interface RecipeDetailModalProps {
  food: FoodItem;
  weightGoal: WeightGoalMode;
  onClose: () => void;
}

const SYSTEM_MAP = Object.fromEntries(
  BODY_SYSTEMS.map((s) => [s.id, s.shortLabel])
) as Record<BodySystem, string>;

export function RecipeDetailModal({
  food,
  weightGoal,
  onClose,
}: RecipeDetailModalProps) {
  const recipe = getRecipeForFood(food);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-xs p-0 sm:p-4"
    >
      <div className="w-full sm:max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-[#161E1B] border border-slate-200 dark:border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 font-mono-nums">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Prep {recipe.prepTime}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-nums">Cook {recipe.cookTime}</span>
              <span aria-hidden="true">·</span>
              <span>{food.portion}</span>
            </div>
            <h2
              id="recipe-modal-title"
              className="mt-1 font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50"
            >
              {food.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {food.tamilName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close recipe"
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Quick Nutrition Strip */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 font-mono-nums">
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Calories
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-50">
                {food.nutrients.calories} kcal
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Protein
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-50">
                {food.nutrients.protein}g
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Carbs
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-50">
                {food.nutrients.carbs}g
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Fat
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-50">
                {food.nutrients.fat}g
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Zinc / Iron
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-50">
                {food.nutrients.zinc} / {food.nutrients.iron} mg
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Sodium
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-50">
                {food.nutrients.sodium} mg
              </div>
            </div>
          </div>

          {food.sodiumNote && (
            <div className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 rounded-lg px-3 py-2.5">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              <span>{food.sodiumNote}</span>
            </div>
          )}

          {/* Body Systems & Why */}
          <div>
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Supports: {food.systems.map((s) => SYSTEM_MAP[s]).join(' · ')}
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {food.note}
            </p>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
              <Utensils className="w-4 h-4 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
              <span>Budget Local Ingredients</span>
            </h3>
            <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-200 list-disc pl-5">
              {recipe.ingredients.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* How to Make It */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2.5">
              How to Make It (Step-by-Step)
            </h3>
            <ol className="space-y-2.5">
              {recipe.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  <span className="font-mono-nums text-xs font-bold w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Weight Loss vs Weight Gain Guidance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div
              className={`p-3 rounded-xl border text-xs leading-relaxed ${
                weightGoal === 'loss'
                  ? 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/35 dark:border-emerald-800'
                  : 'bg-slate-50/80 border-slate-200/80 dark:bg-slate-800/40 dark:border-slate-700/70'
              }`}
            >
              <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                Weight Loss Preparation Tip
                {weightGoal === 'loss' ? ' · Active Goal' : ''}
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                {recipe.lossTip}
              </p>
            </div>
            <div
              className={`p-3 rounded-xl border text-xs leading-relaxed ${
                weightGoal === 'gain'
                  ? 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/35 dark:border-emerald-800'
                  : 'bg-slate-50/80 border-slate-200/80 dark:bg-slate-800/40 dark:border-slate-700/70'
              }`}
            >
              <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                Weight Gain Preparation Tip
                {weightGoal === 'gain' ? ' · Active Goal' : ''}
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                {recipe.gainTip}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121916] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 min-h-[40px] rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  );
}
