import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Copy,
  Download,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
} from 'lucide-react';
import {
  computeShoppingBuyList,
  extractTodayIngredients,
  INGREDIENT_CATEGORIES,
  TN_INGREDIENTS,
} from '../data/ingredients';
import { BODY_SYSTEMS, MEAL_SLOTS } from '../data/tnFoods';
import {
  BodySystem,
  DayProgressState,
  DietMode,
  FoodItem,
  IngredientCategory,
  MealSlotEntry,
  MealSlotId,
  RawMaterial,
  WeightGoalMode,
} from '../types/nutrition';
import { getDayPlan, getEffectiveMealsForDay } from '../utils/nutritionCalc';

interface IngredientsPageProps {
  selectedDay: number;
  weightGoal: WeightGoalMode;
  dietMode: DietMode;
  daysState: Record<number, DayProgressState>;
  effectiveMeals: Record<MealSlotId, MealSlotEntry[]>;
  foodLookup: Record<string, FoodItem>;
  onQuickAddFoodToDay: (foodId: string, slotId: MealSlotId) => void;
  onBackToTracker: () => void;
}

type IngredientViewScope = 'today' | 'all';
type BuyRangeMode = 'both' | 'today' | 'seven_days' | 'thirty_days';

const BOUGHT_STORAGE_KEY = 'tn_wellness_bought_items_v1';

const CATEGORY_LABEL_MAP = Object.fromEntries(
  INGREDIENT_CATEGORIES.map((c) => [c.id, c.label])
) as Record<IngredientCategory, string>;

const SYSTEM_LABEL_MAP = Object.fromEntries(
  BODY_SYSTEMS.map((s) => [s.id, s.shortLabel])
) as Record<BodySystem, string>;

const SLOT_LABEL_MAP = Object.fromEntries(
  MEAL_SLOTS.map((s) => [s.id, s.label])
) as Record<MealSlotId, string>;

export function IngredientsPage({
  selectedDay,
  weightGoal,
  dietMode,
  daysState,
  effectiveMeals,
  foodLookup,
  onQuickAddFoodToDay,
  onBackToTracker,
}: IngredientsPageProps) {
  const [scope, setScope] = useState<IngredientViewScope>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<
    IngredientCategory | 'all'
  >('all');
  const [systemFilter, setSystemFilter] = useState<BodySystem | 'all'>('all');
  const [recentlyAddedIds, setRecentlyAddedIds] = useState<
    Record<string, boolean>
  >({});

  // Grocery Buy List state
  const [buyRange, setBuyRange] = useState<BuyRangeMode>('both');
  const [buyCategoryFilter, setBuyCategoryFilter] = useState<
    IngredientCategory | 'all'
  >('all');
  const [copiedBuyList, setCopiedBuyList] = useState(false);
  const [downloadedBuyList, setDownloadedBuyList] = useState(false);
  const [boughtMap, setBoughtMap] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(BOUGHT_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(BOUGHT_STORAGE_KEY, JSON.stringify(boughtMap));
    } catch {
      // Ignore storage quota errors
    }
  }, [boughtMap]);

  const shoppingPlan = useMemo(() => {
    return computeShoppingBuyList(
      selectedDay,
      (dayNum) =>
        dayNum === selectedDay
          ? effectiveMeals
          : getEffectiveMealsForDay(
              getDayPlan(dayNum),
              daysState[dayNum],
              dietMode,
              weightGoal,
              foodLookup
            ),
      foodLookup
    );
  }, [selectedDay, effectiveMeals, daysState, dietMode, weightGoal, foodLookup]);

  const activeSystemMeta = useMemo(
    () =>
      systemFilter === 'all'
        ? null
        : BODY_SYSTEMS.find((s) => s.id === systemFilter) || null,
    [systemFilter]
  );

  const buyRangeBaseItems = useMemo(() => {
    return shoppingPlan.items.filter((item) => {
      if (buyRange === 'today') return item.todayQty > 0;
      if (buyRange === 'seven_days' || buyRange === 'both') {
        return item.sevenDayQty > 0;
      }
      return item.thirtyDayQty > 0;
    });
  }, [shoppingPlan.items, buyRange]);

  const buySystemCounts = useMemo(() => {
    const counts = {} as Record<BodySystem, number>;
    for (const sys of BODY_SYSTEMS) {
      counts[sys.id] = 0;
    }
    for (const item of buyRangeBaseItems) {
      for (const sys of item.material.systems) {
        counts[sys] = (counts[sys] || 0) + 1;
      }
    }
    return counts;
  }, [buyRangeBaseItems]);

  const visibleBuyItems = useMemo(() => {
    return buyRangeBaseItems.filter((item) => {
      if (
        buyCategoryFilter !== 'all' &&
        item.material.category !== buyCategoryFilter
      ) {
        return false;
      }
      if (
        systemFilter !== 'all' &&
        !item.material.systems.includes(systemFilter)
      ) {
        return false;
      }
      return true;
    });
  }, [buyRangeBaseItems, buyCategoryFilter, systemFilter]);

  const todayBuyCount = useMemo(
    () => shoppingPlan.items.filter((i) => i.todayQty > 0).length,
    [shoppingPlan.items]
  );

  const sevenDayBuyCount = useMemo(
    () => shoppingPlan.items.filter((i) => i.sevenDayQty > 0).length,
    [shoppingPlan.items]
  );

  const thirtyDayBuyCount = useMemo(
    () => shoppingPlan.items.filter((i) => i.thirtyDayQty > 0).length,
    [shoppingPlan.items]
  );

  const checkedBuyCount = useMemo(
    () => visibleBuyItems.filter((i) => Boolean(boughtMap[i.material.id])).length,
    [visibleBuyItems, boughtMap]
  );

  const firstDay = shoppingPlan.dayNumbers[0];
  const lastDay = shoppingPlan.dayNumbers[shoppingPlan.dayNumbers.length - 1];
  const sevenDayRangeLabel = `Days ${firstDay}–${lastDay}`;

  const handleToggleBought = (id: string) => {
    setBoughtMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const buildBuyListText = () => {
    const itemsToExport = visibleBuyItems.filter(
      (i) => !boughtMap[i.material.id]
    );
    const source = itemsToExport.length > 0 ? itemsToExport : visibleBuyItems;
    const focusSuffix = activeSystemMeta
      ? ` — ${activeSystemMeta.label} Focus`
      : '';
    const categorySuffix =
      buyCategoryFilter !== 'all'
        ? ` · ${CATEGORY_LABEL_MAP[buyCategoryFilter]}`
        : '';
    const header =
      buyRange === 'today'
        ? `Tamil Nadu Grocery List — Day ${selectedDay} (${goalLabel}, ${dietLabel})${focusSuffix}${categorySuffix}`
        : buyRange === 'seven_days'
        ? `Tamil Nadu Grocery List — 7 Days (${sevenDayRangeLabel}, ${goalLabel}, ${dietLabel})${focusSuffix}${categorySuffix}`
        : buyRange === 'thirty_days'
        ? `Tamil Nadu Grocery List — 30 Days (Days 1–30, ${goalLabel}, ${dietLabel})${focusSuffix}${categorySuffix}`
        : `Tamil Nadu Grocery List — Day ${selectedDay} & 7 Days (${sevenDayRangeLabel}, ${goalLabel}, ${dietLabel})${focusSuffix}${categorySuffix}`;

    const lines = source.map((item) => {
      const status = boughtMap[item.material.id] ? '[x]' : '[ ]';
      if (buyRange === 'today') {
        return `${status} ${item.material.name} (${item.material.tamilName}): ${item.todayFormatted}`;
      }
      if (buyRange === 'seven_days') {
        return `${status} ${item.material.name} (${item.material.tamilName}): ${item.sevenDayFormatted}`;
      }
      if (buyRange === 'thirty_days') {
        return `${status} ${item.material.name} (${item.material.tamilName}): ${item.thirtyDayFormatted}`;
      }
      return `${status} ${item.material.name} (${item.material.tamilName}): Today ${item.todayFormatted} | 7-Day ${item.sevenDayFormatted}`;
    });

    return [header, '', ...lines].join('\n');
  };

  const handleCopyBuyList = async () => {
    try {
      await navigator.clipboard.writeText(buildBuyListText());
      setCopiedBuyList(true);
      setTimeout(() => setCopiedBuyList(false), 2000);
    } catch {
      // Ignore clipboard failures in restricted iframes
    }
  };

  const handleDownloadBuyList = () => {
    const content = buildBuyListText();
    const rangeSlug =
      buyRange === 'both'
        ? `day-${selectedDay}-and-7-days`
        : buyRange === 'today'
        ? `day-${selectedDay}`
        : buyRange === 'seven_days'
        ? '7-days'
        : '30-days';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tn-grocery-list-${rangeSlug}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadedBuyList(true);
    setTimeout(() => setDownloadedBuyList(false), 2000);
  };

  const todayUsageList = useMemo(
    () => extractTodayIngredients(effectiveMeals, foodLookup),
    [effectiveMeals, foodLookup]
  );

  const todayUsageById = useMemo(() => {
    const map: Record<
      string,
      { usedInSlots: string[]; usedInDishes: string[] }
    > = {};
    for (const item of todayUsageList) {
      map[item.material.id] = {
        usedInSlots: item.usedInSlots,
        usedInDishes: item.usedInDishes,
      };
    }
    return map;
  }, [todayUsageList]);

  const baseList: RawMaterial[] = useMemo(() => {
    if (scope === 'today') {
      return todayUsageList.map((u) => u.material);
    }
    return TN_INGREDIENTS;
  }, [scope, todayUsageList]);

  const guideSystemCounts = useMemo(() => {
    const counts = {} as Record<BodySystem, number>;
    for (const sys of BODY_SYSTEMS) {
      counts[sys.id] = 0;
    }
    for (const item of baseList) {
      for (const sys of item.systems) {
        counts[sys] = (counts[sys] || 0) + 1;
      }
    }
    return counts;
  }, [baseList]);

  const filteredIngredients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return baseList.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }
      if (systemFilter !== 'all' && !item.systems.includes(systemFilter)) {
        return false;
      }
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.tamilName.toLowerCase().includes(q) ||
        item.bodyPartsSummary.toLowerCase().includes(q) ||
        item.healthBenefits.toLowerCase().includes(q)
      );
    });
  }, [baseList, categoryFilter, systemFilter, searchQuery]);

  const handleQuickAdd = (material: RawMaterial) => {
    onQuickAddFoodToDay(material.linkedFoodId, material.defaultSlotId);
    setRecentlyAddedIds((prev) => ({ ...prev, [material.id]: true }));
  };

  const goalLabel =
    weightGoal === 'loss'
      ? 'Weight Loss'
      : weightGoal === 'gain'
      ? 'Weight Gain'
      : 'Maintenance';

  const dietLabel =
    dietMode === 'veg_millet'
      ? 'Veg & Millet'
      : dietMode === 'non_veg'
      ? 'Non-Veg Included'
      : dietMode === 'high_protein'
      ? 'High-Protein Focus'
      : 'All TN Meals';

  return (
    <div className="space-y-6">
      {/* Section 1: Grocery Buy List (Today & 7-Day Quantities) */}
      <section
        aria-label="Grocery buy list for today and 7 days"
        className="bg-white dark:bg-[#161E1B] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Market &amp; Grocery Buy List</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-nums">
                Today: Day {selectedDay} ({todayBuyCount} items)
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-nums">
                7 Days: {sevenDayRangeLabel} ({sevenDayBuyCount} items)
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-nums">
                30 Days: Days 1–30 ({thirtyDayBuyCount} items)
              </span>
            </div>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 text-balance">
              Ingredients to Buy — Today, 7-Day &amp; 30-Day Quantities
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Scaled for {goalLabel} ({dietLabel}) including your custom meal swaps. Check off items you already have in your kitchen.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyBuyList}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors whitespace-nowrap cursor-pointer"
            >
              {copiedBuyList ? (
                <>
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copied List</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copy Buy List</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadBuyList}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              {downloadedBuyList ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                  <span>Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Download List</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onBackToTracker}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 whitespace-nowrap cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Back to Day {selectedDay}</span>
            </button>
          </div>
        </div>

        {/* Buy List Controls: Period Switcher + Category Filter + Uncheck */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div
            role="group"
            aria-label="Buy list timeframe"
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 self-start"
          >
            <button
              type="button"
              onClick={() => setBuyRange('both')}
              aria-pressed={buyRange === 'both'}
              className={`px-3 py-1.5 min-h-[34px] rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                buyRange === 'both'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Today + 7 Days
            </button>
            <button
              type="button"
              onClick={() => setBuyRange('today')}
              aria-pressed={buyRange === 'today'}
              className={`px-3 py-1.5 min-h-[34px] rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                buyRange === 'today'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Today Only ({todayBuyCount})
            </button>
            <button
              type="button"
              onClick={() => setBuyRange('seven_days')}
              aria-pressed={buyRange === 'seven_days'}
              className={`px-3 py-1.5 min-h-[34px] rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                buyRange === 'seven_days'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              7-Day Plan ({sevenDayBuyCount})
            </button>
            <button
              type="button"
              onClick={() => setBuyRange('thirty_days')}
              aria-pressed={buyRange === 'thirty_days'}
              className={`px-3 py-1.5 min-h-[34px] rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                buyRange === 'thirty_days'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              30-Day Plan ({thirtyDayBuyCount})
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono-nums text-slate-500 dark:text-slate-400">
              {checkedBuyCount} / {visibleBuyItems.length} in kitchen
            </span>
            {Object.values(boughtMap).some(Boolean) && (
              <button
                type="button"
                onClick={() => setBoughtMap({})}
                className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                <span>Uncheck all</span>
              </button>
            )}
          </div>
        </div>

        {/* Buy List Category Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setBuyCategoryFilter('all')}
            aria-pressed={buyCategoryFilter === 'all'}
            className={`px-2.5 py-1 min-h-[32px] rounded-lg border text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              buyCategoryFilter === 'all'
                ? 'bg-slate-900 border-slate-900 text-white dark:bg-emerald-600 dark:border-emerald-500'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300'
            }`}
          >
            All Items
          </button>
          {INGREDIENT_CATEGORIES.map((cat) => {
            const active = buyCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setBuyCategoryFilter(cat.id)}
                aria-pressed={active}
                className={`px-2.5 py-1 min-h-[32px] rounded-lg border text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
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

        {/* Buy List Body System Focus Filter */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Filter Items by Body System Focused
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
              className={`px-2.5 py-1 min-h-[32px] rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                systemFilter === 'all'
                  ? 'bg-slate-900 border-slate-900 text-white dark:bg-emerald-600 dark:border-emerald-500'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              All Systems (11)
            </button>
            {BODY_SYSTEMS.map((sys) => {
              const active = systemFilter === sys.id;
              const count = buySystemCounts[sys.id] || 0;
              return (
                <button
                  key={sys.id}
                  type="button"
                  onClick={() => setSystemFilter(active ? 'all' : sys.id)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 min-h-[32px] rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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

        {/* Buy List Table (Desktop) */}
        {visibleBuyItems.length === 0 ? (
          <div className="py-5 text-center space-y-2">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              No buy-list items match this category and body-system focus.
            </p>
            <button
              type="button"
              onClick={() => {
                setBuyCategoryFilter('all');
                setSystemFilter('all');
              }}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Clear buy-list filters
            </button>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <th className="py-2.5 px-3 w-10">Got</th>
                    <th className="py-2.5 px-3">Ingredient / Raw Material</th>
                    <th className="py-2.5 px-3">Category</th>
                    {(buyRange === 'both' || buyRange === 'today') && (
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">
                        Today (Day {selectedDay})
                      </th>
                    )}
                    {(buyRange === 'both' || buyRange === 'seven_days') && (
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">
                        7 Days ({sevenDayRangeLabel})
                      </th>
                    )}
                    {buyRange === 'thirty_days' && (
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">
                        30 Days (Days 1–30)
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {visibleBuyItems.map((item) => {
                    const isBought = Boolean(boughtMap[item.material.id]);
                    return (
                      <tr
                        key={item.material.id}
                        className={`transition-colors ${
                          isBought
                            ? 'bg-slate-50/70 dark:bg-slate-900/40 opacity-65'
                            : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
                        }`}
                      >
                        <td className="py-2.5 px-3 align-middle">
                          <button
                            type="button"
                            onClick={() => handleToggleBought(item.material.id)}
                            aria-label={`Mark ${item.material.name} as bought`}
                            aria-pressed={isBought}
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                              isBought
                                ? 'bg-emerald-700 border-emerald-700 text-white dark:bg-emerald-600 dark:border-emerald-500'
                                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                            }`}
                          >
                            {isBought && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                          </button>
                        </td>
                        <td className="py-2.5 px-3">
                          <div
                            className={`font-medium text-slate-900 dark:text-slate-50 ${
                              isBought ? 'line-through' : ''
                            }`}
                          >
                            {item.material.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {item.material.tamilName}
                            {item.hint ? ` · ${item.hint}` : ''}
                            {activeSystemMeta ? ` · ${item.material.bodyPartsSummary}` : ''}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {CATEGORY_LABEL_MAP[item.material.category]}
                        </td>
                        {(buyRange === 'both' || buyRange === 'today') && (
                          <td className="py-2.5 px-3 text-right font-mono-nums whitespace-nowrap">
                            {item.todayQty > 0 ? (
                              <div>
                                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                                  {item.todayFormatted}
                                </span>
                                <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                                  {item.todayServings} srv
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500">—</span>
                            )}
                          </td>
                        )}
                        {(buyRange === 'both' || buyRange === 'seven_days') && (
                          <td className="py-2.5 px-3 text-right font-mono-nums whitespace-nowrap">
                            <div>
                              <span className="font-bold text-slate-900 dark:text-slate-50">
                                {item.sevenDayFormatted}
                              </span>
                              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                                {item.sevenDayServings} srv
                              </span>
                            </div>
                          </td>
                        )}
                        {buyRange === 'thirty_days' && (
                          <td className="py-2.5 px-3 text-right font-mono-nums whitespace-nowrap">
                            <div>
                              <span className="font-bold text-slate-900 dark:text-slate-50">
                                {item.thirtyDayFormatted}
                              </span>
                              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                                {item.thirtyDayServings} srv
                              </span>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Buy List Cards (Mobile) */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
              {visibleBuyItems.map((item) => {
                const isBought = Boolean(boughtMap[item.material.id]);
                return (
                  <div
                    key={item.material.id}
                    className={`p-3.5 flex items-start gap-3 ${
                      isBought ? 'opacity-65 bg-slate-50/70 dark:bg-slate-900/40' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleBought(item.material.id)}
                      aria-label={`Mark ${item.material.name} as bought`}
                      aria-pressed={isBought}
                      className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 cursor-pointer ${
                        isBought
                          ? 'bg-emerald-700 border-emerald-700 text-white dark:bg-emerald-600 dark:border-emerald-500'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                      }`}
                    >
                      {isBought && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                    </button>

                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div>
                        <div
                          className={`text-sm font-semibold text-slate-900 dark:text-slate-50 ${
                            isBought ? 'line-through' : ''
                          }`}
                        >
                          {item.material.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {item.material.tamilName} ·{' '}
                          {CATEGORY_LABEL_MAP[item.material.category]}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono-nums">
                        {(buyRange === 'both' || buyRange === 'today') && (
                          <span>
                            <span className="font-sans text-slate-500 dark:text-slate-400">
                              Today:{' '}
                            </span>
                            <strong className="text-emerald-700 dark:text-emerald-400">
                              {item.todayFormatted}
                            </strong>
                          </span>
                        )}
                        {(buyRange === 'both' || buyRange === 'seven_days') && (
                          <span>
                            <span className="font-sans text-slate-500 dark:text-slate-400">
                              7 Days:{' '}
                            </span>
                            <strong className="text-slate-900 dark:text-slate-50">
                              {item.sevenDayFormatted}
                            </strong>
                          </span>
                        )}
                        {buyRange === 'thirty_days' && (
                          <span>
                            <span className="font-sans text-slate-500 dark:text-slate-400">
                              30 Days:{' '}
                            </span>
                            <strong className="text-slate-900 dark:text-slate-50">
                              {item.thirtyDayFormatted}
                            </strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* Section 2: Ingredient Nutrient & Body-System Library */}
      <section className="bg-white dark:bg-[#161E1B] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 text-balance">
            Raw Material Nutrient &amp; Body-System Guide
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Day {selectedDay} · {goalLabel} Mode · Budget-friendly Tamil Nadu raw materials, nutrient values, and organ-level benefits (no costly imported nuts).
          </p>
        </div>

        {/* View Switcher (Today's Items vs All Ingredients) + Search */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div
            role="group"
            aria-label="Ingredient view scope"
            className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 self-start"
          >
            <button
              type="button"
              onClick={() => setScope('today')}
              aria-pressed={scope === 'today'}
              className={`px-3.5 py-1.5 min-h-[36px] rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                scope === 'today'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Today&apos;s Items ({todayUsageList.length})
            </button>
            <button
              type="button"
              onClick={() => setScope('all')}
              aria-pressed={scope === 'all'}
              className={`px-3.5 py-1.5 min-h-[36px] rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                scope === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Ingredients ({TN_INGREDIENTS.length})
            </button>
          </div>

          <div className="w-full sm:w-80">
            <div className="relative w-full">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search English or Tamil name..."
                aria-label="Search ingredients by English or Tamil name"
                className="w-full pl-9 pr-3 py-2 min-h-[40px] text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-2 focus:outline-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            aria-pressed={categoryFilter === 'all'}
            className={`px-3 py-1.5 min-h-[34px] rounded-lg border text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              categoryFilter === 'all'
                ? 'bg-slate-900 border-slate-900 text-white dark:bg-emerald-600 dark:border-emerald-500'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300'
            }`}
          >
            All Categories
          </button>
          {INGREDIENT_CATEGORIES.map((cat) => {
            const active = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                aria-pressed={active}
                className={`px-3 py-1.5 min-h-[34px] rounded-lg border text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
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

        {/* Filter Items by Body System Focused */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Filter Items by Body System Focused
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
              const count = guideSystemCounts[sys.id] || 0;
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
        </div>
      </section>

      {/* Result Count Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing{' '}
          <strong className="font-mono-nums text-slate-800 dark:text-slate-200">
            {filteredIngredients.length}
          </strong>{' '}
          {scope === 'today'
            ? `raw materials used in Day ${selectedDay} (${goalLabel})`
            : 'Tamil Nadu raw materials & foods'}
          {activeSystemMeta ? ` · Focused on ${activeSystemMeta.label}` : ''}
        </span>
        {(categoryFilter !== 'all' || systemFilter !== 'all' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setCategoryFilter('all');
              setSystemFilter('all');
              setSearchQuery('');
            }}
            className="text-emerald-700 dark:text-emerald-400 font-medium hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Ingredients Grid */}
      {filteredIngredients.length === 0 ? (
        <div className="bg-white dark:bg-[#161E1B] border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center space-y-3">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
            No ingredients match your active filters.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Try switching to &ldquo;All Ingredients&rdquo; or clearing the category/organ filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredIngredients.map((item) => {
            const todayUsage = todayUsageById[item.id];
            const isAddedNow = Boolean(recentlyAddedIds[item.id]);
            const linkedDish = foodLookup[item.linkedFoodId];
            const defaultSlotName =
              SLOT_LABEL_MAP[item.defaultSlotId] || 'Today';

            return (
              <article
                key={item.id}
                className="bg-white dark:bg-[#161E1B] border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3.5">
                  {/* Top Unboxed Metadata + Name */}
                  <div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-emerald-700 dark:text-emerald-400">
                        {CATEGORY_LABEL_MAP[item.category]}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Serving: {item.servingSize}</span>
                      {todayUsage && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-slate-700 dark:text-slate-200">
                            In Today&apos;s {todayUsage.usedInSlots.join(', ')}
                          </span>
                        </>
                      )}
                    </div>

                    <h2 className="mt-1 font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
                      {item.name}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.tamilName}
                    </p>
                  </div>

                  {/* Macros Summary Row */}
                  <div className="grid grid-cols-5 gap-2 p-3 rounded-lg bg-slate-50/90 dark:bg-slate-800/45 border border-slate-200/70 dark:border-slate-700/60 font-mono-nums">
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Calories
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-50">
                        {item.calories}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Protein
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-50">
                        {item.protein}g
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Carbs
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-50">
                        {item.carbs}g
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Fat
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-50">
                        {item.fat}g
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Fiber
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-50">
                        {item.fiber}g
                      </div>
                    </div>
                  </div>

                  {/* Key Vitamins & Minerals */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs font-mono-nums">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 font-sans">
                        Iron:{' '}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.iron} mg
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 font-sans">
                        Calcium:{' '}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.calcium} mg
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 font-sans">
                        Zinc:{' '}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.zinc} mg
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 font-sans">
                        Magnesium:{' '}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.magnesium} mg
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 font-sans">
                        Choline:{' '}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.choline} mg
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 font-sans">
                        Vit C:{' '}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.vitC} mg
                      </span>
                    </div>
                    {item.omega3Mg !== undefined && (
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 font-sans">
                          Omega-3:{' '}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.omega3Mg} mg
                        </span>
                      </div>
                    )}
                    {item.sodiumMg !== undefined && (
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 font-sans">
                          Sodium:{' '}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.sodiumMg} mg
                        </span>
                      </div>
                    )}
                    <div className="col-span-2 sm:col-span-4 font-sans">
                      <span className="text-slate-500 dark:text-slate-400">
                        B-Complex / B12:{' '}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.bComplex}
                      </span>
                    </div>
                  </div>

                  {/* Body Parts & Organ Benefits */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs leading-relaxed">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        Body Parts Targeted:{' '}
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">
                        {item.bodyPartsSummary}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        Systems:{' '}
                      </span>
                      <span className="text-emerald-800 dark:text-emerald-300 font-medium">
                        {item.systems.map((s) => SYSTEM_LABEL_MAP[s]).join(' · ')}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      {item.healthBenefits}
                    </p>
                  </div>

                  {item.prepNote && (
                    <div
                      className={`flex items-start gap-1.5 text-xs rounded-lg px-3 py-2 border ${
                        item.id === 'ing_karuvadu'
                          ? 'text-amber-800 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/60'
                          : 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-700/60'
                      }`}
                    >
                      {item.id === 'ing_karuvadu' && (
                        <AlertTriangle
                          className="w-3.5 h-3.5 mt-0.5 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      <span>{item.prepNote}</span>
                    </div>
                  )}
                </div>

                {/* Card Footer: Quick Add to Today's Meal */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[58%]">
                    {linkedDish ? `Dish: ${linkedDish.name}` : defaultSlotName}
                  </span>

                  <div className="flex items-center gap-2 shrink-0">
                    {isAddedNow && (
                      <button
                        type="button"
                        onClick={onBackToTracker}
                        className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        View Day {selectedDay}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(item)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                        isAddedNow
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {isAddedNow ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Added to {defaultSlotName}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Add to {defaultSlotName}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
