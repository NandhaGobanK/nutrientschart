import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeftRight,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { BODY_SYSTEMS, TN_FOODS } from '../data/tnFoods';
import {
  BodySystem,
  DietMode,
  DietType,
  FoodItem,
  MealSlotEntry,
  MealSlotMeta,
} from '../types/nutrition';

interface MealCustomizerModalProps {
  slot: MealSlotMeta;
  currentEntries: MealSlotEntry[];
  foodLookup: Record<string, FoodItem>;
  customFoods: FoodItem[];
  dietMode: DietMode;
  initialSystemFilter?: BodySystem | 'all';
  onClose: () => void;
  onSaveSlotEntries: (entries: MealSlotEntry[]) => void;
  onRestoreSlotDefault: () => void;
  onAddCustomFood: (food: FoodItem) => void;
}

const DIET_CATEGORY_FILTERS: Array<{ id: DietType | 'all' | 'non_veg_only'; label: string }> = [
  { id: 'all', label: 'All Types' },
  { id: 'veg', label: 'Veg & Millet' },
  { id: 'non_veg_only', label: 'All Non-Veg' },
  { id: 'mutton', label: 'Mutton' },
  { id: 'chicken', label: 'Chicken' },
  { id: 'fish', label: 'Fresh Fish' },
  { id: 'karuvadu', label: 'Karuvadu' },
  { id: 'egg', label: 'Egg' },
];

export function MealCustomizerModal({
  slot,
  currentEntries,
  foodLookup,
  customFoods,
  dietMode,
  initialSystemFilter = 'all',
  onClose,
  onSaveSlotEntries,
  onRestoreSlotDefault,
  onAddCustomFood,
}: MealCustomizerModalProps) {
  const [entries, setEntries] = useState<MealSlotEntry[]>(currentEntries);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllSlots, setShowAllSlots] = useState(false);
  const [systemFilter, setSystemFilter] = useState<BodySystem | 'all'>(
    initialSystemFilter
  );
  const [dietFilter, setDietFilter] = useState<
    DietType | 'all' | 'non_veg_only'
  >(dietMode === 'veg_millet' ? 'veg' : 'all');
  const [swapTargetIndex, setSwapTargetIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'create'>('browse');

  // Custom food creation form state
  const [customName, setCustomName] = useState('');
  const [customPortion, setCustomPortion] = useState('1 serving');
  const [customDietType, setCustomDietType] = useState<DietType>('veg');
  const [customCalories, setCustomCalories] = useState('220');
  const [customProtein, setCustomProtein] = useState('12');
  const [customCarbs, setCustomCarbs] = useState('22');
  const [customFat, setCustomFat] = useState('8');
  const [customFiber, setCustomFiber] = useState('3');
  const [customZinc, setCustomZinc] = useState('1.8');
  const [customIron, setCustomIron] = useState('2.5');
  const [customCalcium, setCustomCalcium] = useState('70');
  const [customSodium, setCustomSodium] = useState('350');
  const [customSystems, setCustomSystems] = useState<BodySystem[]>([
    'brain',
    'fertility',
  ]);

  const allFoods = useMemo(
    () => [...customFoods, ...TN_FOODS],
    [customFoods]
  );

  const filteredFoods = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allFoods.filter((food) => {
      if (dietFilter === 'veg' && food.dietType !== 'veg') return false;
      if (dietFilter === 'non_veg_only' && food.dietType === 'veg') return false;
      if (
        dietFilter !== 'all' &&
        dietFilter !== 'non_veg_only' &&
        food.dietType !== dietFilter
      ) {
        return false;
      }
      if (systemFilter !== 'all' && !food.systems.includes(systemFilter)) {
        return false;
      }
      if (!showAllSlots && !food.slots.includes(slot.id) && !food.isCustom) {
        return false;
      }
      if (!q) return true;
      return (
        food.name.toLowerCase().includes(q) ||
        food.tamilName.toLowerCase().includes(q) ||
        food.note.toLowerCase().includes(q)
      );
    });
  }, [allFoods, dietFilter, systemFilter, showAllSlots, slot.id, searchQuery]);

  const handleMultiplierChange = (idx: number, multiplier: number) => {
    setEntries((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, multiplier } : item))
    );
  };

  const handleRemoveEntry = (idx: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== idx));
    if (swapTargetIndex === idx) setSwapTargetIndex(null);
  };

  const handlePickFood = (foodId: string) => {
    if (swapTargetIndex !== null) {
      setEntries((prev) =>
        prev.map((item, i) =>
          i === swapTargetIndex ? { foodId, multiplier: 1 } : item
        )
      );
      setSwapTargetIndex(null);
    } else {
      setEntries((prev) => [...prev, { foodId, multiplier: 1 }]);
    }
  };

  const handleToggleSystem = (sys: BodySystem) => {
    setCustomSystems((prev) =>
      prev.includes(sys) ? prev.filter((s) => s !== sys) : [...prev, sys]
    );
  };

  const handleCreateCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const sodiumVal = Math.max(0, Number(customSodium) || 0);
    const newFood: FoodItem = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      tamilName: 'Custom TN Dish',
      portion: customPortion.trim() || '1 serving',
      slots: [slot.id],
      dietType: customDietType,
      nutrients: {
        calories: Math.max(0, Number(customCalories) || 0),
        protein: Math.max(0, Number(customProtein) || 0),
        carbs: Math.max(0, Number(customCarbs) || 0),
        fat: Math.max(0, Number(customFat) || 0),
        fiber: Math.max(0, Number(customFiber) || 0),
        zinc: Math.max(0, Number(customZinc) || 0),
        iron: Math.max(0, Number(customIron) || 0),
        calcium: Math.max(0, Number(customCalcium) || 0),
        bComplex: 15,
        vitC: 8,
        magnesium: 35,
        choline: 45,
        sodium: sodiumVal,
      },
      systems: customSystems.length > 0 ? customSystems : ['brain'],
      note: 'Custom home-prepared entry',
      sodiumNote:
        sodiumVal >= 900
          ? `High sodium (~${sodiumVal} mg): moderate portion and hydrate well.`
          : undefined,
      isCustom: true,
    };

    onAddCustomFood(newFood);
    handlePickFood(newFood.id);
    setCustomName('');
    setActiveTab('browse');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="customizer-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-xs p-0 sm:p-4"
    >
      <div className="w-full sm:max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-[#161E1B] border border-slate-200 dark:border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div>
            <h2
              id="customizer-title"
              className="font-display text-lg font-bold text-slate-900 dark:text-slate-50"
            >
              Customize {slot.label}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {slot.timeWindow} · Veg, millet, mutton, nattu kozhi, fresh fish &amp; karuvadu
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close customizer"
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Current Slot Items */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Current Items in {slot.label}
              </h3>
              <button
                type="button"
                onClick={() => {
                  onRestoreSlotDefault();
                  onClose();
                }}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore slot default</span>
              </button>
            </div>

            {entries.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 p-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                Slot is empty. Choose an item below to add it.
              </p>
            ) : (
              <div className="space-y-2">
                {entries.map((entry, idx) => {
                  const food = foodLookup[entry.foodId];
                  if (!food) return null;
                  const isSwapping = swapTargetIndex === idx;

                  return (
                    <div
                      key={`${entry.foodId}-${idx}`}
                      className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSwapping
                          ? 'border-emerald-600 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/30'
                          : 'border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {food.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono-nums">
                          {food.portion} ·{' '}
                          {Math.round(food.nutrients.calories * entry.multiplier)}{' '}
                          kcal · {(food.nutrients.protein * entry.multiplier).toFixed(1)}
                          g protein
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-0.5">
                          {[0.5, 1, 1.5, 2].map((mult) => (
                            <button
                              key={mult}
                              type="button"
                              onClick={() => handleMultiplierChange(idx, mult)}
                              className={`px-2 py-1 rounded-md font-mono-nums text-xs font-medium cursor-pointer transition-colors ${
                                entry.multiplier === mult
                                  ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white'
                                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              {mult}×
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setSwapTargetIndex(isSwapping ? null : idx)
                          }
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[34px] rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                            isSwapping
                              ? 'bg-emerald-700 border-emerald-700 text-white'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                          <span>{isSwapping ? 'Picking...' : 'Swap'}</span>
                        </button>

                        <button
                          type="button"
                          aria-label={`Remove ${food.name}`}
                          onClick={() => handleRemoveEntry(idx)}
                          className="inline-flex items-center justify-center min-w-[34px] min-h-[34px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Browse vs Create Custom Tab */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="inline-flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveTab('browse')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    activeTab === 'browse'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {swapTargetIndex !== null
                    ? 'Pick Replacement Food'
                    : 'Add TN Local Food'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('create')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    activeTab === 'create'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Create Custom Dish
                </button>
              </div>

              {activeTab === 'browse' && (
                <button
                  type="button"
                  onClick={() => setShowAllSlots((v) => !v)}
                  className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  {showAllSlots
                    ? `Show ${slot.label} matches only`
                    : 'Show all TN foods'}
                </button>
              )}
            </div>

            {activeTab === 'browse' ? (
              <div className="space-y-3">
                {/* Category Filter Buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {DIET_CATEGORY_FILTERS.map((cat) => {
                    const active = dietFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setDietFilter(cat.id)}
                        className={`px-2.5 py-1 rounded-md border text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="relative">
                    <Search
                      className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search mutton, nattu kozhi, nethili, karuvadu..."
                      className="w-full pl-9 pr-3 py-2 min-h-[42px] text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-2 focus:outline-emerald-600"
                    />
                  </div>
                  <select
                    aria-label="Filter foods by body system"
                    value={systemFilter}
                    onChange={(e) =>
                      setSystemFilter(e.target.value as BodySystem | 'all')
                    }
                    className="w-full px-3 py-2 min-h-[42px] text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-2 focus:outline-emerald-600"
                  >
                    <option value="all">All 11 Body Systems</option>
                    {BODY_SYSTEMS.map((sys) => (
                      <option key={sys.id} value={sys.id}>
                        {sys.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl">
                  {filteredFoods.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                      No matching foods found. Try toggling &ldquo;Show all TN foods&rdquo; or switching category filter.
                    </div>
                  ) : (
                    filteredFoods.map((food) => (
                      <div
                        key={food.id}
                        className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {food.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono-nums">
                            {food.portion} · {food.nutrients.calories} kcal ·{' '}
                            {food.nutrients.protein}g P · {food.nutrients.zinc}mg Zn
                          </div>
                          {food.sodiumNote && (
                            <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400">
                              <AlertTriangle className="w-3 h-3 shrink-0" aria-hidden="true" />
                              <span>{food.sodiumNote}</span>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePickFood(food.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 min-h-[36px] rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium shrink-0 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>
                            {swapTargetIndex !== null ? 'Swap' : 'Add'}
                          </span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateCustomFood} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Food / Dish Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g., Sankara Fish Fry / Mutton Chukka"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Portion Size
                    </label>
                    <input
                      type="text"
                      value={customPortion}
                      onChange={(e) => setCustomPortion(e.target.value)}
                      placeholder="e.g., 120 g serving"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      value={customDietType}
                      onChange={(e) =>
                        setCustomDietType(e.target.value as DietType)
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    >
                      <option value="veg">Veg / Millet</option>
                      <option value="egg">Egg</option>
                      <option value="mutton">Goat / Mutton</option>
                      <option value="chicken">Chicken</option>
                      <option value="fish">Fresh Fish / Crab</option>
                      <option value="karuvadu">Karuvadu (Dried Fish)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {[
                    { label: 'Calories (kcal)', val: customCalories, set: setCustomCalories },
                    { label: 'Protein (g)', val: customProtein, set: setCustomProtein },
                    { label: 'Carbs (g)', val: customCarbs, set: setCustomCarbs },
                    { label: 'Fat (g)', val: customFat, set: setCustomFat },
                    { label: 'Fiber (g)', val: customFiber, set: setCustomFiber },
                    { label: 'Zinc (mg)', val: customZinc, set: setCustomZinc },
                    { label: 'Iron (mg)', val: customIron, set: setCustomIron },
                    { label: 'Calcium (mg)', val: customCalcium, set: setCustomCalcium },
                    { label: 'Sodium (mg)', val: customSodium, set: setCustomSodium },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        {field.label}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={field.val}
                        onChange={(e) => field.set(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-sm font-mono-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <span className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Body Systems Supported
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {BODY_SYSTEMS.map((sys) => {
                      const active = customSystems.includes(sys.id);
                      return (
                        <button
                          key={sys.id}
                          type="button"
                          onClick={() => handleToggleSystem(sys.id)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium border cursor-pointer transition-colors ${
                            active
                              ? 'bg-emerald-700 border-emerald-700 text-white'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {sys.shortLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 min-h-[40px] rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Save &amp; Add to {slot.label}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121916] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 min-h-[42px] rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSaveSlotEntries(entries);
              onClose();
            }}
            className="px-5 py-2 min-h-[42px] rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
          >
            Save {slot.label} Changes
          </button>
        </div>
      </div>
    </div>
  );
}
