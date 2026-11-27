import { useMemo, useState } from 'react';
import { BookOpen, Clock, Search } from 'lucide-react';
import { DayPlanFilterBar } from './DayPlanFilterBar';
import { getRecipeForFood } from '../data/recipes';
import { BODY_SYSTEMS, MEAL_SLOTS, TN_FOODS } from '../data/tnFoods';
import {
  BodySystem,
  DietType,
  FoodItem,
  MealSlotEntry,
  MealSlotId,
} from '../types/nutrition';

interface RecipesPageProps {
  selectedDay: number;
  todayDay: number;
  effectiveMeals: Record<MealSlotId, MealSlotEntry[]>;
  foodLookup: Record<string, FoodItem>;
  customFoods: FoodItem[];
  onSelectDay: (day: number) => void;
  onJumpToToday: () => void;
  onSelectRecipe: (food: FoodItem) => void;
  onBackToTracker: () => void;
}

type RecipeScopeFilter = 'both' | 'today' | 'all';

const DIET_FILTERS: Array<{ id: DietType | 'all'; label: string }> = [
  { id: 'all', label: 'All Dishes' },
  { id: 'veg', label: 'Veg & Millet' },
  { id: 'mutton', label: 'Mutton' },
  { id: 'chicken', label: 'Chicken' },
  { id: 'fish', label: 'Fresh Fish' },
  { id: 'karuvadu', label: 'Karuvadu' },
  { id: 'egg', label: 'Egg' },
];

const SYSTEM_MAP = Object.fromEntries(
  BODY_SYSTEMS.map((s) => [s.id, s.shortLabel])
) as Record<BodySystem, string>;

export function RecipesPage({
  selectedDay,
  todayDay,
  effectiveMeals,
  foodLookup,
  customFoods,
  onSelectDay,
  onJumpToToday,
  onSelectRecipe,
  onBackToTracker,
}: RecipesPageProps) {
  const [scope, setScope] = useState<RecipeScopeFilter>('both');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState<DietType | 'all'>('all');
  const [systemFilter, setSystemFilter] = useState<BodySystem | 'all'>('all');

  const todayRecipeEntries = useMemo(() => {
    const items: Array<{ slotLabel: string; food: FoodItem }> = [];
    const seen = new Set<string>();

    for (const slot of MEAL_SLOTS) {
      for (const entry of effectiveMeals[slot.id] || []) {
        const food = foodLookup[entry.foodId];
        if (!food) continue;
        const key = `${slot.id}:${food.id}`;
        if (!seen.has(key)) {
          seen.add(key);
          items.push({ slotLabel: slot.label, food });
        }
      }
    }
    return items;
  }, [effectiveMeals, foodLookup]);

  const allCatalogFoods = useMemo(
    () => [...customFoods, ...TN_FOODS],
    [customFoods]
  );

  const activeSystemMeta = useMemo(
    () =>
      systemFilter === 'all'
        ? null
        : BODY_SYSTEMS.find((s) => s.id === systemFilter) || null,
    [systemFilter]
  );

  const systemCounts = useMemo(() => {
    const sourceFoods =
      scope === 'today'
        ? todayRecipeEntries.map((item) => item.food)
        : allCatalogFoods;
    const counts = {} as Record<BodySystem, number>;
    for (const sys of BODY_SYSTEMS) {
      counts[sys.id] = 0;
    }
    for (const food of sourceFoods) {
      for (const sys of food.systems) {
        counts[sys] = (counts[sys] || 0) + 1;
      }
    }
    return counts;
  }, [scope, todayRecipeEntries, allCatalogFoods]);

  const matchesFilters = (food: FoodItem) => {
    if (dietFilter !== 'all' && food.dietType !== dietFilter) return false;
    if (systemFilter !== 'all' && !food.systems.includes(systemFilter)) {
      return false;
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      food.name.toLowerCase().includes(q) ||
      food.tamilName.toLowerCase().includes(q) ||
      food.note.toLowerCase().includes(q)
    );
  };

  const filteredToday = useMemo(
    () => todayRecipeEntries.filter((item) => matchesFilters(item.food)),
    [todayRecipeEntries, searchQuery, dietFilter, systemFilter]
  );

  const filteredAll = useMemo(
    () => allCatalogFoods.filter(matchesFilters),
    [allCatalogFoods, searchQuery, dietFilter, systemFilter]
  );

  const renderRecipeCard = (food: FoodItem, slotContext?: string) => {
    const recipe = getRecipeForFood(food);
    return (
      <button
        key={`${slotContext || 'all'}-${food.id}`}
        type="button"
        onClick={() => onSelectRecipe(food)}
        className="text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161E1B] hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer flex flex-col justify-between gap-3"
      >
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-emerald-700 dark:text-emerald-400">
              {slotContext ? slotContext : food.dietType === 'veg' ? 'Veg / Millet' : food.dietType.toUpperCase()}
            </span>
            <span className="inline-flex items-center gap-1 font-mono-nums">
              <Clock className="w-3 h-3" aria-hidden="true" />
              <span>
                {recipe.prepTime} + {recipe.cookTime}
              </span>
            </span>
          </div>

          <h3 className="mt-1.5 font-display text-base font-semibold text-slate-900 dark:text-slate-50 leading-snug">
            {food.name}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {food.portion}
          </p>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {food.note}
          </p>
          <p className="mt-2 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
            {food.systems.map((s) => SYSTEM_MAP[s]).join(' · ')}
          </p>
        </div>

        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
          <span className="font-mono-nums text-slate-600 dark:text-slate-300">
            {food.nutrients.calories} kcal · {food.nutrients.protein}g P
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>How to make</span>
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <section className="bg-white dark:bg-[#161E1B] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Tamil Nadu Wellness Recipes
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Click any dish to view ingredients, step-by-step cooking instructions, and weight goal adjustments.
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToTracker}
            className="px-4 py-2 min-h-[40px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
          >
            Back to Day {selectedDay} Tracker
          </button>
        </div>

        {/* Day Plan Filter (Days 1-30) */}
        <DayPlanFilterBar
          selectedDay={selectedDay}
          todayDay={todayDay}
          label="Filter Recipes by Day Plan"
          onSelectDay={onSelectDay}
          onJumpToToday={onJumpToToday}
        />

        {/* Section Scope Filter: Selected Day Plan Recipes vs All Recipes */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div
            role="group"
            aria-label="Filter recipe sections"
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start"
          >
            <button
              type="button"
              onClick={() => setScope('both')}
              className={`px-3 py-1.5 min-h-[36px] rounded-md text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
                scope === 'both'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Both Sections
            </button>
            <button
              type="button"
              onClick={() => setScope('today')}
              className={`px-3 py-1.5 min-h-[36px] rounded-md text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
                scope === 'today'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {selectedDay === todayDay
                ? `Today's Recipes Only (${filteredToday.length})`
                : `Day ${selectedDay} Plan Only (${filteredToday.length})`}
            </button>
            <button
              type="button"
              onClick={() => setScope('all')}
              className={`px-3 py-1.5 min-h-[36px] rounded-md text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
                scope === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              All Recipes ({filteredAll.length})
            </button>
          </div>

          <div className="relative w-full lg:w-72">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, millets, mutton, fish..."
              className="w-full pl-9 pr-3 py-2 min-h-[40px] text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-2 focus:outline-emerald-600"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1.5">
          {DIET_FILTERS.map((cat) => {
            const active = dietFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setDietFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  active
                    ? 'bg-slate-900 border-slate-900 text-white dark:bg-emerald-600 dark:border-emerald-500'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Filter Recipes by Body System */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Filter Recipes by Body System
            </span>
            {systemFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setSystemFilter('all')}
                className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Reset system filter
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSystemFilter('all')}
              aria-pressed={systemFilter === 'all'}
              className={`px-2.5 py-1.5 min-h-[34px] rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                systemFilter === 'all'
                  ? 'bg-slate-900 border-slate-900 text-white dark:bg-emerald-600 dark:border-emerald-500'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              All Systems (11)
            </button>
            {BODY_SYSTEMS.map((sys) => {
              const active = systemFilter === sys.id;
              const count = systemCounts[sys.id] || 0;
              return (
                <button
                  key={sys.id}
                  type="button"
                  onClick={() => setSystemFilter(active ? 'all' : sys.id)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[34px] rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-slate-900 border-slate-900 text-white dark:bg-emerald-600 dark:border-emerald-500'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{sys.shortLabel}</span>
                  <span
                    className={`font-mono-nums text-[11px] ${
                      active ? 'text-slate-200' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          {activeSystemMeta && (
            <p className="mt-2 text-xs text-emerald-800 dark:text-emerald-300">
              Focused on <strong>{activeSystemMeta.label}</strong>: {activeSystemMeta.description}
            </p>
          )}
        </div>
      </section>

      {/* Section 1: Selected Day Plan Recipes */}
      {(scope === 'both' || scope === 'today') && (
        <section aria-label="Selected day plan recipes" className="space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50">
                {selectedDay === todayDay
                  ? `Today's Recipes (Day ${selectedDay})`
                  : `Day ${selectedDay} Plan Recipes`}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dishes scheduled in Day {selectedDay} menu ({filteredToday.length} items)
                {activeSystemMeta ? ` · ${activeSystemMeta.label}` : ''}
              </p>
            </div>
          </div>

          {filteredToday.length === 0 ? (
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161E1B] text-center space-y-2">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No recipes in Today&apos;s menu match your current search, category, or body-system filter.
              </p>
              {(dietFilter !== 'all' || systemFilter !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setDietFilter('all');
                    setSystemFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredToday.map((item) =>
                renderRecipeCard(item.food, item.slotLabel)
              )}
            </div>
          )}
        </section>
      )}

      {/* Section 2: All Recipes */}
      {(scope === 'both' || scope === 'all') && (
        <section aria-label="All Tamil Nadu recipes" className="space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50">
                All Recipes ({filteredAll.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Complete budget-friendly Tamil Nadu veg, millet, and non-veg recipe library ({Object.keys(SYSTEM_MAP).length} body systems covered)
                {activeSystemMeta ? ` · Focused on ${activeSystemMeta.label}` : ''}
              </p>
            </div>
          </div>

          {filteredAll.length === 0 ? (
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161E1B] text-center space-y-2">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No recipes match your current search, category, or body-system filter.
              </p>
              {(dietFilter !== 'all' || systemFilter !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setDietFilter('all');
                    setSystemFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAll.map((food) => renderRecipeCard(food))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
