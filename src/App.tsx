import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  CheckCheck,
  Droplets,
  Leaf,
  Minus,
  TrendingDown,
  TrendingUp,
  Utensils,
} from 'lucide-react';
import { DaySelector } from './components/DaySelector';
import { Header } from './components/Header';
import { HydrationTracker } from './components/HydrationTracker';
import { IngredientsPage } from './components/IngredientsPage';
import { MealCustomizerModal } from './components/MealCustomizerModal';
import { MealSlotCard } from './components/MealSlotCard';
import { NutrientBreakdown } from './components/NutrientBreakdown';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { RecipesPage } from './components/RecipesPage';
import { SystemCoveragePanel } from './components/SystemCoveragePanel';
import { ThirtyDayOverview } from './components/ThirtyDayOverview';
import { WeightTracker } from './components/WeightTracker';
import { BODY_SYSTEMS, MEAL_SLOTS } from './data/tnFoods';
import {
  BodySystem,
  DietMode,
  FoodItem,
  HydrationSettings,
  MealSlotEntry,
  MealSlotId,
  TrackerStorageState,
  WeightGoalMode,
  WeightLogEntry,
} from './types/nutrition';
import {
  buildFoodLookup,
  calculateHydrationTargetMl,
  emptyCheckedSlots,
  getDayPlan,
  getDaySystemCoverage,
  getEffectiveMealsForDay,
  getGoalRangeInfo,
  loadTrackerState,
  saveTrackerState,
  sumDayNutrients,
} from './utils/nutritionCalc';

export default function App() {
  const [tracker, setTracker] = useState<TrackerStorageState>(() =>
    loadTrackerState()
  );
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });
  const [nutrientMode, setNutrientMode] = useState<'consumed' | 'planned'>(
    'consumed'
  );
  const [activePage, setActivePage] = useState<
    'tracker' | 'recipes' | 'ingredients'
  >('tracker');
  const [selectedRecipeFood, setSelectedRecipeFood] = useState<FoodItem | null>(
    null
  );
  const [activeSystemFilter, setActiveSystemFilter] = useState<
    BodySystem | 'all'
  >('all');
  const [editingSlotId, setEditingSlotId] = useState<MealSlotId | null>(null);

  // Persist tracker state automatically to localStorage
  useEffect(() => {
    saveTrackerState(tracker);
  }, [tracker]);

  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('tn-wellness-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('tn-wellness-theme', 'light');
      }
      return next;
    });
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const foodLookup = useMemo(
    () => buildFoodLookup(tracker.customFoods),
    [tracker.customFoods]
  );

  const selectedPlan = useMemo(
    () => getDayPlan(tracker.selectedDay),
    [tracker.selectedDay]
  );

  const dayState = tracker.days[tracker.selectedDay];
  const checkedSlots = dayState?.checkedSlots || emptyCheckedSlots();

  const goalCustomMeals =
    dayState?.customMealsByGoal?.[tracker.weightGoal] ??
    (tracker.weightGoal === 'maintenance' ? dayState?.customMeals : undefined);

  const effectiveMeals = useMemo(
    () =>
      getEffectiveMealsForDay(
        selectedPlan,
        dayState,
        tracker.dietMode,
        tracker.weightGoal,
        foodLookup
      ),
    [selectedPlan, dayState, tracker.dietMode, tracker.weightGoal, foodLookup]
  );

  const consumedNutrients = useMemo(
    () => sumDayNutrients(effectiveMeals, checkedSlots, foodLookup, 'consumed'),
    [effectiveMeals, checkedSlots, foodLookup]
  );

  const plannedNutrients = useMemo(
    () => sumDayNutrients(effectiveMeals, checkedSlots, foodLookup, 'planned'),
    [effectiveMeals, checkedSlots, foodLookup]
  );

  const systemCoverage = useMemo(
    () => getDaySystemCoverage(effectiveMeals, checkedSlots, foodLookup),
    [effectiveMeals, checkedSlots, foodLookup]
  );

  const visibleSlots = useMemo(() => {
    if (activeSystemFilter === 'all') return MEAL_SLOTS;
    return MEAL_SLOTS.filter((slot) => {
      const entries = effectiveMeals[slot.id] || [];
      return entries.some((entry) =>
        foodLookup[entry.foodId]?.systems.includes(activeSystemFilter)
      );
    });
  }, [activeSystemFilter, effectiveMeals, foodLookup]);

  const checkedCount = MEAL_SLOTS.filter((s) =>
    Boolean(checkedSlots[s.id])
  ).length;
  const completionPct = Math.round((checkedCount / MEAL_SLOTS.length) * 100);
  const isDayCustomized = Boolean(
    goalCustomMeals && Object.keys(goalCustomMeals).length > 0
  );
  const goalInfo = getGoalRangeInfo(tracker.weightGoal);
  const plannedKcal = Math.round(plannedNutrients.calories);
  const fitsGoalRange =
    plannedKcal >= goalInfo.minKcal && plannedKcal <= goalInfo.maxKcal;

  const dayHasKaruvadu = useMemo(() => {
    return MEAL_SLOTS.some((slot) =>
      (effectiveMeals[slot.id] || []).some(
        (entry) => foodLookup[entry.foodId]?.dietType === 'karuvadu'
      )
    );
  }, [effectiveMeals, foodLookup]);

  const hasHighSodium = plannedNutrients.sodium > 2000 || dayHasKaruvadu;

  const hydrationTargetMl = useMemo(
    () =>
      calculateHydrationTargetMl(
        tracker.hydrationSettings,
        tracker.weightGoal,
        hasHighSodium
      ),
    [tracker.hydrationSettings, tracker.weightGoal, hasHighSodium]
  );

  const handleSelectDay = (day: number) => {
    setTracker((prev) => ({ ...prev, selectedDay: day }));
  };

  const handleJumpToToday = () => {
    setTracker((prev) => ({ ...prev, selectedDay: prev.todayDay }));
  };

  const handleSetAsToday = (day: number) => {
    setTracker((prev) => ({ ...prev, todayDay: day, selectedDay: day }));
  };

  const handleChangeDietMode = (dietMode: DietMode) => {
    setTracker((prev) => ({ ...prev, dietMode }));
  };

  const handleChangeWeightGoal = (weightGoal: WeightGoalMode) => {
    setTracker((prev) => ({ ...prev, weightGoal }));
  };

  const handleAddWaterMl = (deltaMl: number) => {
    setTracker((prev) => {
      const current = prev.hydrationByDay[prev.selectedDay] || {
        extraMl: 0,
        checkedCheckpoints: {},
      };
      return {
        ...prev,
        hydrationByDay: {
          ...prev.hydrationByDay,
          [prev.selectedDay]: {
            ...current,
            extraMl: Math.max(-2000, (current.extraMl || 0) + deltaMl),
          },
        },
      };
    });
  };

  const handleToggleHydrationCheckpoint = (checkpointId: string) => {
    setTracker((prev) => {
      const current = prev.hydrationByDay[prev.selectedDay] || {
        extraMl: 0,
        checkedCheckpoints: {},
      };
      return {
        ...prev,
        hydrationByDay: {
          ...prev.hydrationByDay,
          [prev.selectedDay]: {
            ...current,
            checkedCheckpoints: {
              ...current.checkedCheckpoints,
              [checkpointId]: !current.checkedCheckpoints?.[checkpointId],
            },
          },
        },
      };
    });
  };

  const handleUpdateHydrationSettings = (hydrationSettings: HydrationSettings) => {
    setTracker((prev) => ({ ...prev, hydrationSettings }));
  };

  const handleAddWeightLog = (entry: WeightLogEntry) => {
    setTracker((prev) => ({
      ...prev,
      weightLogs: [...prev.weightLogs, entry],
      hydrationSettings: {
        ...prev.hydrationSettings,
        weightKg: entry.weightKg,
      },
    }));
  };

  const handleDeleteWeightLog = (id: string) => {
    setTracker((prev) => ({
      ...prev,
      weightLogs: prev.weightLogs.filter((item) => item.id !== id),
    }));
  };

  const handleToggleSlotChecked = (slotId: MealSlotId) => {
    setTracker((prev) => {
      const currentDay = prev.days[prev.selectedDay] || {
        checkedSlots: emptyCheckedSlots(),
      };
      return {
        ...prev,
        days: {
          ...prev.days,
          [prev.selectedDay]: {
            ...currentDay,
            checkedSlots: {
              ...emptyCheckedSlots(),
              ...currentDay.checkedSlots,
              [slotId]: !currentDay.checkedSlots?.[slotId],
            },
          },
        },
      };
    });
  };

  const handleCheckAllSlots = (checked: boolean) => {
    setTracker((prev) => {
      const currentDay = prev.days[prev.selectedDay] || {
        checkedSlots: emptyCheckedSlots(),
      };
      const nextChecked = emptyCheckedSlots();
      for (const s of MEAL_SLOTS) {
        nextChecked[s.id] = checked;
      }
      return {
        ...prev,
        days: {
          ...prev.days,
          [prev.selectedDay]: {
            ...currentDay,
            checkedSlots: nextChecked,
          },
        },
      };
    });
  };

  const handleSaveSlotEntries = (
    slotId: MealSlotId,
    entries: MealSlotEntry[]
  ) => {
    setTracker((prev) => {
      const currentDay = prev.days[prev.selectedDay] || {
        checkedSlots: emptyCheckedSlots(),
      };
      const prevGoalCustom =
        currentDay.customMealsByGoal?.[prev.weightGoal] ??
        (prev.weightGoal === 'maintenance' ? currentDay.customMeals : undefined) ??
        {};
      return {
        ...prev,
        days: {
          ...prev.days,
          [prev.selectedDay]: {
            ...currentDay,
            customMealsByGoal: {
              ...currentDay.customMealsByGoal,
              [prev.weightGoal]: {
                ...prevGoalCustom,
                [slotId]: entries,
              },
            },
          },
        },
      };
    });
  };

  const handleRestoreSlotDefault = (slotId: MealSlotId) => {
    setTracker((prev) => {
      const currentDay = prev.days[prev.selectedDay];
      if (!currentDay) return prev;
      const prevGoalCustom =
        currentDay.customMealsByGoal?.[prev.weightGoal] ??
        (prev.weightGoal === 'maintenance' ? currentDay.customMeals : undefined);
      if (!prevGoalCustom) return prev;
      const nextGoalCustom = { ...prevGoalCustom };
      delete nextGoalCustom[slotId];
      return {
        ...prev,
        days: {
          ...prev.days,
          [prev.selectedDay]: {
            ...currentDay,
            customMeals:
              prev.weightGoal === 'maintenance'
                ? nextGoalCustom
                : currentDay.customMeals,
            customMealsByGoal: {
              ...currentDay.customMealsByGoal,
              [prev.weightGoal]: nextGoalCustom,
            },
          },
        },
      };
    });
  };

  const handleResetDayCustomizations = () => {
    setTracker((prev) => {
      const currentDay = prev.days[prev.selectedDay];
      if (!currentDay) return prev;
      const nextByGoal = { ...currentDay.customMealsByGoal };
      delete nextByGoal[prev.weightGoal];
      return {
        ...prev,
        days: {
          ...prev.days,
          [prev.selectedDay]: {
            ...currentDay,
            customMeals:
              prev.weightGoal === 'maintenance'
                ? undefined
                : currentDay.customMeals,
            customMealsByGoal: nextByGoal,
          },
        },
      };
    });
  };

  const handleAddCustomFood = (food: FoodItem) => {
    setTracker((prev) => ({
      ...prev,
      customFoods: [food, ...prev.customFoods],
    }));
  };

  const handleQuickAddFoodToDay = (foodId: string, slotId: MealSlotId) => {
    if (!foodLookup[foodId]) return;
    setTracker((prev) => {
      const plan = getDayPlan(prev.selectedDay);
      const currentDay = prev.days[prev.selectedDay] || {
        checkedSlots: emptyCheckedSlots(),
      };
      const prevGoalCustom =
        currentDay.customMealsByGoal?.[prev.weightGoal] ??
        (prev.weightGoal === 'maintenance' ? currentDay.customMeals : undefined) ??
        {};
      const currentEffective = getEffectiveMealsForDay(
        plan,
        currentDay,
        prev.dietMode,
        prev.weightGoal,
        foodLookup
      );
      const baseEntries = prevGoalCustom[slotId] ?? currentEffective[slotId] ?? [];
      const existingIndex = baseEntries.findIndex((e) => e.foodId === foodId);
      const nextEntries =
        existingIndex >= 0
          ? baseEntries.map((entry, idx) =>
              idx === existingIndex
                ? {
                    ...entry,
                    multiplier: Math.round((entry.multiplier + 1) * 10) / 10,
                  }
                : entry
            )
          : [...baseEntries, { foodId, multiplier: 1 }];

      return {
        ...prev,
        days: {
          ...prev.days,
          [prev.selectedDay]: {
            ...currentDay,
            customMealsByGoal: {
              ...currentDay.customMealsByGoal,
              [prev.weightGoal]: {
                ...prevGoalCustom,
                [slotId]: nextEntries,
              },
            },
          },
        },
      };
    });
  };

  const editingSlotMeta = editingSlotId
    ? MEAL_SLOTS.find((s) => s.id === editingSlotId) || null
    : null;

  const activeFilterMeta =
    activeSystemFilter !== 'all'
      ? BODY_SYSTEMS.find((s) => s.id === activeSystemFilter)
      : null;

  return (
    <div className="min-h-screen flex flex-col pb-20 lg:pb-12">
      <Header
        isDark={isDark}
        activePage={activePage}
        onSelectPage={setActivePage}
        onToggleTheme={handleToggleTheme}
        onNavigateSection={handleNavigateSection}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {activePage === 'recipes' ? (
          <RecipesPage
            selectedDay={tracker.selectedDay}
            effectiveMeals={effectiveMeals}
            foodLookup={foodLookup}
            customFoods={tracker.customFoods}
            onSelectRecipe={setSelectedRecipeFood}
            onBackToTracker={() => setActivePage('tracker')}
          />
        ) : activePage === 'ingredients' ? (
          <IngredientsPage
            selectedDay={tracker.selectedDay}
            weightGoal={tracker.weightGoal}
            dietMode={tracker.dietMode}
            daysState={tracker.days}
            effectiveMeals={effectiveMeals}
            foodLookup={foodLookup}
            onQuickAddFoodToDay={handleQuickAddFoodToDay}
            onBackToTracker={() => setActivePage('tracker')}
          />
        ) : (
          <>
            {/* Page Title & Day Controls */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 text-balance">
                    Tamil Nadu Daily Wellness &amp; Nutrition Tracker
                  </h1>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
                    30-day budget-friendly local meal plan nourishing all 11 body systems—from IT cognitive focus and fertility to gut, kidney, thyroid, immune, and skin-hair health.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 font-mono-nums whitespace-nowrap">
                  <span>Saved locally in browser · No imported nuts</span>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePage('ingredients');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-sans font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <Leaf className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                    <span>Ingredients</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePage('recipes');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-sans font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Open Recipes</span>
                  </button>
                </div>
              </div>

              <DaySelector
                selectedDay={tracker.selectedDay}
                todayDay={tracker.todayDay}
                daysState={tracker.days}
                dietMode={tracker.dietMode}
                weightGoal={tracker.weightGoal}
                isDayCustomized={isDayCustomized}
                onSelectDay={handleSelectDay}
                onJumpToToday={handleJumpToToday}
                onSetAsToday={handleSetAsToday}
                onChangeDietMode={handleChangeDietMode}
                onChangeWeightGoal={handleChangeWeightGoal}
                onResetDayCustomizations={handleResetDayCustomizations}
              />

              {/* Compact Active Goal Summary Banner */}
              <section
                aria-label="Active weight goal summary"
                className="bg-white dark:bg-[#161E1B] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span className="font-bold text-slate-900 dark:text-slate-50">
                    {goalInfo.label} Menu
                  </span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                    ·
                  </span>
                  <span className="font-mono-nums text-slate-600 dark:text-slate-300">
                    Target: {goalInfo.rangeText}
                  </span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                    ·
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {goalInfo.prepSummary}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono-nums shrink-0">
                  <span className="font-semibold text-slate-900 dark:text-slate-50">
                    Day {selectedPlan.day}: {plannedKcal} kcal ·{' '}
                    {plannedNutrients.protein.toFixed(0)}g P ·{' '}
                    {plannedNutrients.carbs.toFixed(0)}g C ·{' '}
                    {plannedNutrients.fat.toFixed(0)}g F
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-sans font-semibold ${
                      tracker.weightGoal === 'loss'
                        ? fitsGoalRange
                          ? 'text-sky-700 dark:text-sky-400'
                          : 'text-amber-700 dark:text-amber-400'
                        : tracker.weightGoal === 'gain'
                        ? fitsGoalRange
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-amber-700 dark:text-amber-400'
                        : fitsGoalRange
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {tracker.weightGoal === 'loss' ? (
                      <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : tracker.weightGoal === 'gain' ? (
                      <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    <span>
                      {fitsGoalRange
                        ? tracker.weightGoal === 'loss'
                          ? 'Fits Deficit Target'
                          : tracker.weightGoal === 'gain'
                          ? 'Fits Surplus Target'
                          : 'Fits Maintenance Target'
                        : plannedKcal < goalInfo.minKcal
                        ? 'Below Target Range'
                        : 'Above Target Range'}
                    </span>
                  </span>
                </div>
              </section>
            </div>

            {/* Main 2-Column Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Day Overview + System Filter + Meal Checklist */}
              <div id="daily-plan" className="lg:col-span-7 space-y-4">
                {/* Day Summary Banner */}
                <section
                  aria-label="Selected day summary"
                  className="bg-white dark:bg-[#161E1B] border border-slate-200 dark:border-slate-800 rounded-xl p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-mono-nums font-semibold text-emerald-700 dark:text-emerald-400">
                          Day {selectedPlan.day} of 30
                        </span>
                        {selectedPlan.day === tracker.todayDay && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-medium text-slate-700 dark:text-slate-200">
                              Today
                            </span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-nums">
                          {Math.round(plannedNutrients.calories)} kcal planned
                        </span>
                      </div>
                      <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        {selectedPlan.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {selectedPlan.focusAnchor}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          handleCheckAllSlots(checkedCount < MEAL_SLOTS.length)
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>
                          {checkedCount === MEAL_SLOTS.length
                            ? 'Clear Checks'
                            : 'Check All Meals'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Completion Bar */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        Daily Meal Completion
                      </span>
                      <span className="font-mono-nums font-semibold text-emerald-700 dark:text-emerald-400">
                        {checkedCount} / {MEAL_SLOTS.length} meals ({completionPct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-700 dark:bg-emerald-500 transition-all duration-200"
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Interactive System Coverage Filter & Daily Organ Coverage */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        Filter Meals by Body System
                      </span>
                      {activeSystemFilter !== 'all' && (
                        <button
                          type="button"
                          onClick={() => setActiveSystemFilter('all')}
                          className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          Reset filter
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveSystemFilter('all')}
                        className={`px-2.5 py-1.5 min-h-[34px] rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          activeSystemFilter === 'all'
                            ? 'bg-slate-900 border-slate-900 text-white dark:bg-emerald-600 dark:border-emerald-500'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/70 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                      >
                        All Systems (11)
                      </button>

                      {BODY_SYSTEMS.map((sys) => {
                        const info = systemCoverage[sys.id];
                        const hasConsumed = info.consumedFoods.length > 0;
                        const hasPlanned = info.plannedFoods.length > 0;
                        const isActive = activeSystemFilter === sys.id;

                        return (
                          <button
                            key={sys.id}
                            type="button"
                            onClick={() =>
                              setActiveSystemFilter(isActive ? 'all' : sys.id)
                            }
                            aria-pressed={isActive}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[34px] rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              isActive
                                ? 'bg-slate-900 border-slate-900 text-white dark:bg-emerald-600 dark:border-emerald-500'
                                : hasConsumed
                                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-800/80 dark:text-emerald-200'
                                : hasPlanned
                                ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300'
                                : 'bg-slate-50/40 border-dashed border-slate-300 text-slate-500 dark:bg-slate-900/40 dark:border-slate-700 dark:text-slate-400'
                            }`}
                          >
                            {hasConsumed && (
                              <Check
                                className={`w-3 h-3 shrink-0 ${
                                  isActive
                                    ? 'text-white'
                                    : 'text-emerald-700 dark:text-emerald-400'
                                }`}
                                aria-hidden="true"
                              />
                            )}
                            <span>{sys.shortLabel}</span>
                            <span
                              className={`font-mono-nums text-[11px] ${
                                isActive
                                  ? 'text-slate-200'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {info.plannedFoods.length}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {/* Meal Slot Checklist Cards */}
                {visibleSlots.length === 0 ? (
                  <div className="bg-white dark:bg-[#161E1B] border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center space-y-3">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      No foods in Day {selectedPlan.day} currently target{' '}
                      {activeFilterMeta?.label}.
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Add a local Tamil Nadu anchor dish for this system to Lunch or Mid-Morning.
                    </p>
                    <div className="flex items-center justify-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setEditingSlotId('lunch')}
                        className="px-4 py-2 min-h-[40px] rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer"
                      >
                        Add to Lunch
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSystemFilter('all')}
                        className="px-4 py-2 min-h-[40px] rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
                      >
                        Show All Meals
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {visibleSlots.map((slot) => (
                      <MealSlotCard
                        key={slot.id}
                        slot={slot}
                        entries={effectiveMeals[slot.id] || []}
                        foodLookup={foodLookup}
                        isChecked={Boolean(checkedSlots[slot.id])}
                        isCustomized={Boolean(
                          goalCustomMeals && goalCustomMeals[slot.id] !== undefined
                        )}
                        activeSystemFilter={activeSystemFilter}
                        weightGoal={tracker.weightGoal}
                        onToggleChecked={() => handleToggleSlotChecked(slot.id)}
                        onOpenCustomizer={() => setEditingSlotId(slot.id)}
                        onOpenRecipe={setSelectedRecipeFood}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Live Nutrient Breakdown + Body System Coverage */}
              <aside className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
                <NutrientBreakdown
                  mode={nutrientMode}
                  onChangeMode={setNutrientMode}
                  consumedNutrients={consumedNutrients}
                  plannedNutrients={plannedNutrients}
                  checkedCount={checkedCount}
                  totalSlots={MEAL_SLOTS.length}
                  weightGoal={tracker.weightGoal}
                />

                <SystemCoveragePanel
                  coverage={systemCoverage}
                  mode={nutrientMode}
                  activeSystemFilter={activeSystemFilter}
                  onSelectSystemFilter={setActiveSystemFilter}
                />
              </aside>
            </div>

            {/* Hydration Timing & Body Weight Tracking Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <HydrationTracker
                selectedDay={tracker.selectedDay}
                targetMl={hydrationTargetMl}
                hasHighSodium={hasHighSodium}
                dayHydration={tracker.hydrationByDay[tracker.selectedDay]}
                settings={tracker.hydrationSettings}
                weightGoal={tracker.weightGoal}
                onAddWaterMl={handleAddWaterMl}
                onToggleCheckpoint={handleToggleHydrationCheckpoint}
                onUpdateSettings={handleUpdateHydrationSettings}
              />

              <WeightTracker
                weightLogs={tracker.weightLogs}
                weightGoal={tracker.weightGoal}
                defaultWeightKg={tracker.hydrationSettings.weightKg}
                onAddWeightLog={handleAddWeightLog}
                onDeleteWeightLog={handleDeleteWeightLog}
              />
            </div>

            {/* Full 30-Day Overview & Pantry Reference */}
            <ThirtyDayOverview
              selectedDay={tracker.selectedDay}
              todayDay={tracker.todayDay}
              daysState={tracker.days}
              onSelectDay={handleSelectDay}
            />
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (compact <=15% height cap) */}
      <nav
        aria-label="Mobile quick jump"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-white/95 dark:bg-[#121916]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-6 items-center"
      >
        <button
          type="button"
          onClick={() => {
            setActivePage('tracker');
            setTimeout(() => handleNavigateSection('daily-plan'), 20);
          }}
          className={`flex flex-col items-center justify-center h-full cursor-pointer ${
            activePage === 'tracker'
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-slate-700 dark:text-slate-200'
          }`}
        >
          <Utensils className="w-4 h-4" aria-hidden="true" />
          <span className="text-[10px] font-medium mt-0.5">Meals</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActivePage('recipes');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center h-full cursor-pointer ${
            activePage === 'recipes'
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-slate-700 dark:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          <span className="text-[10px] font-medium mt-0.5">Recipes</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActivePage('ingredients');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center h-full cursor-pointer ${
            activePage === 'ingredients'
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-slate-700 dark:text-slate-200'
          }`}
        >
          <Leaf className="w-4 h-4" aria-hidden="true" />
          <span className="text-[10px] font-medium mt-0.5">Items</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActivePage('tracker');
            setTimeout(() => handleNavigateSection('nutrients'), 20);
          }}
          className="flex flex-col items-center justify-center h-full text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer"
        >
          <BarChart3 className="w-4 h-4" aria-hidden="true" />
          <span className="text-[10px] font-medium mt-0.5">Nutrients</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActivePage('tracker');
            setTimeout(() => handleNavigateSection('hydration-weight'), 20);
          }}
          className="flex flex-col items-center justify-center h-full text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer"
        >
          <Droplets className="w-4 h-4" aria-hidden="true" />
          <span className="text-[10px] font-medium mt-0.5">Hydrate</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActivePage('tracker');
            setTimeout(() => handleNavigateSection('thirty-day-grid'), 20);
          }}
          className="flex flex-col items-center justify-center h-full text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer"
        >
          <CalendarDays className="w-4 h-4" aria-hidden="true" />
          <span className="text-[10px] font-medium mt-0.5">30 Days</span>
        </button>
      </nav>

      {/* Meal Slot Customizer Modal / Sheet */}
      {editingSlotMeta && (
        <MealCustomizerModal
          slot={editingSlotMeta}
          currentEntries={effectiveMeals[editingSlotMeta.id] || []}
          foodLookup={foodLookup}
          customFoods={tracker.customFoods}
          dietMode={tracker.dietMode}
          initialSystemFilter={activeSystemFilter}
          onClose={() => setEditingSlotId(null)}
          onSaveSlotEntries={(entries) =>
            handleSaveSlotEntries(editingSlotMeta.id, entries)
          }
          onRestoreSlotDefault={() =>
            handleRestoreSlotDefault(editingSlotMeta.id)
          }
          onAddCustomFood={handleAddCustomFood}
        />
      )}

      {/* Recipe Step-by-Step Detail Modal */}
      {selectedRecipeFood && (
        <RecipeDetailModal
          food={selectedRecipeFood}
          weightGoal={tracker.weightGoal}
          onClose={() => setSelectedRecipeFood(null)}
        />
      )}
    </div>
  );
}
