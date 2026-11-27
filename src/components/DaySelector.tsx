import { useEffect, useRef } from 'react';
import { Calendar, Check, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { DayProgressState, DietMode, WeightGoalMode } from '../types/nutrition';
import { getDayCompletionCount } from '../utils/nutritionCalc';

interface DaySelectorProps {
  selectedDay: number;
  todayDay: number;
  daysState: Record<number, DayProgressState>;
  dietMode: DietMode;
  weightGoal: WeightGoalMode;
  isDayCustomized: boolean;
  onSelectDay: (day: number) => void;
  onJumpToToday: () => void;
  onSetAsToday: (day: number) => void;
  onChangeDietMode: (mode: DietMode) => void;
  onChangeWeightGoal: (goal: WeightGoalMode) => void;
  onResetDayCustomizations: () => void;
}

const DIET_MODES: Array<{ id: DietMode; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'veg_millet', label: 'Veg + Millet' },
  { id: 'non_veg', label: 'Non-Veg Included' },
  { id: 'high_protein', label: 'High-Protein Focus' },
];

const WEIGHT_GOALS: Array<{ id: WeightGoalMode; label: string }> = [
  { id: 'loss', label: 'Weight Loss' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'gain', label: 'Weight Gain' },
];

export function DaySelector({
  selectedDay,
  todayDay,
  daysState,
  dietMode,
  weightGoal,
  isDayCustomized,
  onSelectDay,
  onJumpToToday,
  onSetAsToday,
  onChangeDietMode,
  onChangeWeightGoal,
  onResetDayCustomizations,
}: DaySelectorProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollerRef.current;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLButtonElement>(
      `[data-day="${selectedDay}"]`
    );
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedDay]);

  return (
    <section
      aria-label="Day selector and dietary filter"
      className="bg-white dark:bg-[#161E1B] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5"
    >
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onSelectDay(Math.max(1, selectedDay - 1))}
              disabled={selectedDay <= 1}
              aria-label="Previous day"
              className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onSelectDay(Math.min(30, selectedDay + 1))}
              disabled={selectedDay >= 30}
              aria-label="Next day"
              className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onJumpToToday}
            className={`inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedDay === todayDay
                ? 'bg-emerald-700 text-white dark:bg-emerald-600 dark:text-white'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-900/60'
            }`}
          >
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>
              {selectedDay === todayDay
                ? `Today · Day ${todayDay}`
                : `Jump to Today (Day ${todayDay})`}
            </span>
          </button>

          {selectedDay !== todayDay && (
            <button
              type="button"
              onClick={() => onSetAsToday(selectedDay)}
              className="px-3 py-2 min-h-[44px] rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Set Day {selectedDay} as Today
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dietary Filter Toggle */}
          <div
            role="group"
            aria-label="Dietary preference filter"
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80"
          >
            {DIET_MODES.map((mode) => {
              const active = dietMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onChangeDietMode(mode.id)}
                  aria-pressed={active}
                  className={`px-3 py-1.5 min-h-[36px] rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>

          {/* Weight Goal Mode Selector */}
          <div
            role="group"
            aria-label="Weight goal mode"
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80"
          >
            {WEIGHT_GOALS.map((goal) => {
              const active = weightGoal === goal.id;
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => onChangeWeightGoal(goal.id)}
                  aria-pressed={active}
                  className={`px-3 py-1.5 min-h-[36px] rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-emerald-700 text-white dark:bg-emerald-600 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {goal.label}
                </button>
              );
            })}
          </div>

          {isDayCustomized && (
            <button
              type="button"
              onClick={onResetDayCustomizations}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                Reset Day to{' '}
                {weightGoal === 'loss'
                  ? 'Weight Loss'
                  : weightGoal === 'gain'
                  ? 'Weight Gain'
                  : 'Maintenance'}{' '}
                Default
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal 1-30 Day Ribbon */}
      <div
        ref={scrollerRef}
        className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1"
      >
        {Array.from({ length: 30 }, (_, idx) => {
          const dayNum = idx + 1;
          const isSelected = dayNum === selectedDay;
          const isToday = dayNum === todayDay;
          const completed = getDayCompletionCount(dayNum, daysState);
          const allDone = completed === 7;

          return (
            <button
              key={dayNum}
              type="button"
              data-day={dayNum}
              onClick={() => onSelectDay(dayNum)}
              aria-label={`Day ${dayNum}${isToday ? ' (Today)' : ''}, ${completed} of 7 meals checked`}
              aria-current={isSelected ? 'date' : undefined}
              className={`relative flex flex-col items-center justify-center min-w-[46px] min-h-[48px] px-2 py-1.5 rounded-lg border text-xs transition-colors shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-emerald-600 dark:text-white dark:border-emerald-500'
                  : allDone
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-50/80 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/80 dark:hover:bg-slate-800'
              }`}
            >
              <span className="font-mono-nums font-semibold leading-none">
                {dayNum}
              </span>
              <span
                className={`mt-1 text-[10px] font-mono-nums leading-none flex items-center gap-0.5 ${
                  isSelected
                    ? 'text-slate-200 dark:text-emerald-50'
                    : completed > 0
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {allDone ? (
                  <Check className="w-3 h-3" aria-hidden="true" />
                ) : (
                  <span>{completed}/7</span>
                )}
              </span>
              {isToday && !isSelected && (
                <span className="sr-only">Today</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
