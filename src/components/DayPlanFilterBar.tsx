import { useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { MEAL_PLAN_30_DAYS } from '../data/mealPlan30Days';
import { getDayPlan } from '../utils/nutritionCalc';

interface DayPlanFilterBarProps {
  selectedDay: number;
  todayDay: number;
  label?: string;
  onSelectDay: (day: number) => void;
  onJumpToToday: () => void;
}

export function DayPlanFilterBar({
  selectedDay,
  todayDay,
  label = 'Filter by Day Plan (Days 1–30)',
  onSelectDay,
  onJumpToToday,
}: DayPlanFilterBarProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activePlan = getDayPlan(selectedDay);

  useEffect(() => {
    const container = scrollerRef.current;
    if (!container) return;
    const btn = container.querySelector<HTMLButtonElement>(
      `[data-plan-day="${selectedDay}"]`
    );
    if (btn) {
      btn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedDay]);

  return (
    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {label}
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
            ·
          </span>
          <span className="font-mono-nums font-medium text-emerald-700 dark:text-emerald-400">
            Day {selectedDay}: {activePlan.title}
          </span>
          {selectedDay === todayDay && (
            <>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                ·
              </span>
              <span className="font-medium text-slate-600 dark:text-slate-300">
                Today
              </span>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onSelectDay(Math.max(1, selectedDay - 1))}
            disabled={selectedDay <= 1}
            aria-label="Previous day plan"
            className="inline-flex items-center justify-center min-w-[34px] min-h-[34px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <select
            value={selectedDay}
            onChange={(e) => onSelectDay(Number(e.target.value))}
            aria-label="Select day plan from Day 1 to Day 30"
            className="px-2.5 py-1.5 min-h-[34px] max-w-[230px] sm:max-w-xs text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
          >
            {MEAL_PLAN_30_DAYS.map((plan) => (
              <option key={plan.day} value={plan.day}>
                Day {plan.day}
                {plan.day === todayDay ? ' (Today)' : ''} — {plan.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => onSelectDay(Math.min(30, selectedDay + 1))}
            disabled={selectedDay >= 30}
            aria-label="Next day plan"
            className="inline-flex items-center justify-center min-w-[34px] min-h-[34px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {selectedDay !== todayDay && (
            <button
              type="button"
              onClick={onJumpToToday}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[34px] rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Today (Day {todayDay})</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal 1–30 Day Quick Strip */}
      <div
        ref={scrollerRef}
        className="flex items-center gap-1 overflow-x-auto pb-1"
        role="group"
        aria-label="Quick select day 1 to 30"
      >
        {MEAL_PLAN_30_DAYS.map((plan) => {
          const isSelected = plan.day === selectedDay;
          const isToday = plan.day === todayDay;
          return (
            <button
              key={plan.day}
              type="button"
              data-plan-day={plan.day}
              onClick={() => onSelectDay(plan.day)}
              aria-pressed={isSelected}
              title={`Day ${plan.day}: ${plan.title}`}
              className={`min-w-[34px] h-[32px] px-2 rounded-md border text-xs font-mono-nums font-medium transition-colors shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-slate-900 text-white dark:bg-emerald-600 dark:border-emerald-500'
                  : isToday
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              {plan.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
