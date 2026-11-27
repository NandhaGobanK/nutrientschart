import { useState } from 'react';
import { Check, Droplets, Minus, Plus, SlidersHorizontal } from 'lucide-react';
import { HYDRATION_CHECKPOINTS } from '../data/recipes';
import {
  DayHydrationState,
  HydrationClimateLevel,
  HydrationSettings,
  WeightGoalMode,
} from '../types/nutrition';
import { calculateDayHydrationMl } from '../utils/nutritionCalc';

interface HydrationTrackerProps {
  selectedDay: number;
  targetMl: number;
  hasHighSodium: boolean;
  dayHydration: DayHydrationState | undefined;
  settings: HydrationSettings;
  weightGoal: WeightGoalMode;
  onAddWaterMl: (deltaMl: number) => void;
  onToggleCheckpoint: (checkpointId: string) => void;
  onUpdateSettings: (next: HydrationSettings) => void;
}

export function HydrationTracker({
  selectedDay,
  targetMl,
  hasHighSodium,
  dayHydration,
  settings,
  weightGoal,
  onAddWaterMl,
  onToggleCheckpoint,
  onUpdateSettings,
}: HydrationTrackerProps) {
  const [showCalculator, setShowCalculator] = useState(false);
  const [customMlInput, setCustomMlInput] = useState('300');

  const loggedMl = calculateDayHydrationMl(dayHydration);
  const pct = Math.min(100, Math.round((loggedMl / targetMl) * 100));
  const glassesLogged = (loggedMl / 250).toFixed(1).replace(/\.0$/, '');
  const glassesTarget = Math.round(targetMl / 250);

  const handleAddCustomMl = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Math.round(Number(customMlInput));
    if (val > 0) {
      onAddWaterMl(val);
    }
  };

  return (
    <section
      id="hydration-weight"
      aria-label="Daily hydration schedule and tracker"
      className="bg-white dark:bg-[#161E1B] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Hydration Timing &amp; Logger (Day {selectedDay})
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 font-mono-nums">
            Daily Target: {(targetMl / 1000).toFixed(2)} L ({glassesTarget} glasses × 250 ml)
            {hasHighSodium ? ' · Includes +350 ml for karuvadu sodium balance' : ''}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCalculator((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{showCalculator ? 'Hide Target Calc' : 'Target Calculator'}</span>
        </button>
      </div>

      {/* Target Calculator Settings Panel */}
      {showCalculator && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
            Daily Hydration Target Calculator (Auto-synced with {weightGoal === 'loss' ? 'Weight Loss' : weightGoal === 'gain' ? 'Weight Gain' : 'Maintenance'} goal)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                Body Weight (kg)
              </label>
              <input
                type="number"
                min="35"
                max="160"
                value={settings.weightKg}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    weightKg: Math.max(35, Number(e.target.value) || 68),
                  })
                }
                className="w-full px-3 py-2 text-sm font-mono-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                Activity &amp; TN Climate
              </label>
              <select
                value={settings.climateLevel}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    climateLevel: e.target.value as HydrationClimateLevel,
                  })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value="sedentary_cool">Desk / Cool AC</option>
                <option value="moderate_warm">Moderate / Warm Climate</option>
                <option value="active_hot">Active / Hot Summer</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                Custom Override (ml, optional)
              </label>
              <input
                type="number"
                step="250"
                min="0"
                max="5000"
                placeholder="Auto"
                value={settings.customTargetMl ?? ''}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    customTargetMl: e.target.value
                      ? Math.max(1000, Number(e.target.value))
                      : null,
                  })
                }
                className="w-full px-3 py-2 text-sm font-mono-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>
      )}

      {/* Progress & One-Tap Logger */}
      <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <div className="font-mono-nums">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {loggedMl} ml
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5">
              / {targetMl} ml ({glassesLogged} of {glassesTarget} glasses)
            </span>
          </div>
          <span className="font-mono-nums text-xs font-semibold text-sky-700 dark:text-sky-400">
            {pct}%
          </span>
        </div>

        <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-sky-600 dark:bg-sky-500 transition-all duration-200"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => onAddWaterMl(250)}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>+250 ml (1 Glass)</span>
          </button>
          <button
            type="button"
            onClick={() => onAddWaterMl(500)}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 text-xs font-semibold hover:bg-sky-100 dark:hover:bg-sky-900/60 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>+500 ml</span>
          </button>
          <button
            type="button"
            onClick={() => onAddWaterMl(-250)}
            disabled={loggedMl <= 0}
            aria-label="Subtract 250 ml"
            className="inline-flex items-center gap-1 px-2.5 py-2 min-h-[38px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>250 ml</span>
          </button>

          <form onSubmit={handleAddCustomMl} className="inline-flex items-center gap-1.5 ml-auto">
            <input
              type="number"
              min="50"
              max="2000"
              step="50"
              aria-label="Custom ml amount"
              value={customMlInput}
              onChange={(e) => setCustomMlInput(e.target.value)}
              className="w-20 px-2.5 py-1.5 min-h-[38px] text-xs font-mono-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
            <button
              type="submit"
              className="px-3 py-1.5 min-h-[38px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            >
              Add ml
            </button>
          </form>
        </div>
      </div>

      {/* 7 Time-Slotted Hydration Checkpoints */}
      <div>
        <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Daily Hydration Timing Checkpoints
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden">
          {HYDRATION_CHECKPOINTS.map((cp) => {
            const isChecked = Boolean(dayHydration?.checkedCheckpoints?.[cp.id]);
            return (
              <button
                key={cp.id}
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => onToggleCheckpoint(cp.id)}
                className={`w-full text-left px-3.5 py-2.5 flex items-start gap-3 transition-colors cursor-pointer ${
                  isChecked
                    ? 'bg-sky-50/60 dark:bg-sky-950/25'
                    : 'bg-white dark:bg-[#161E1B] hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <span
                  className={`mt-0.5 flex items-center justify-center w-6 h-6 rounded-md border shrink-0 transition-colors ${
                    isChecked
                      ? 'bg-sky-600 border-sky-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {cp.label}{' '}
                      <span className="font-mono-nums font-normal text-slate-500 dark:text-slate-400">
                        · {cp.time}
                      </span>
                    </span>
                    <span className="font-mono-nums text-xs font-semibold text-sky-700 dark:text-sky-400 shrink-0">
                      {cp.recommendedMl} ml
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {cp.beverageNote}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
