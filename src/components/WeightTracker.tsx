import { useMemo, useState } from 'react';
import { Minus, Scale, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { WeightGoalMode, WeightLogEntry } from '../types/nutrition';

interface WeightTrackerProps {
  weightLogs: WeightLogEntry[];
  weightGoal: WeightGoalMode;
  defaultWeightKg: number;
  onAddWeightLog: (entry: WeightLogEntry) => void;
  onDeleteWeightLog: (id: string) => void;
}

export function WeightTracker({
  weightLogs,
  weightGoal,
  defaultWeightKg,
  onAddWeightLog,
  onDeleteWeightLog,
}: WeightTrackerProps) {
  const todayIso = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(todayIso);
  const [weightInput, setWeightInput] = useState(String(defaultWeightKg));
  const [note, setNote] = useState('');

  const sortedLogs = useMemo(
    () =>
      [...weightLogs].sort((a, b) => a.date.localeCompare(b.date)),
    [weightLogs]
  );

  const latest = sortedLogs[sortedLogs.length - 1];
  const first = sortedLogs[0];
  const deltaKg =
    latest && first && sortedLogs.length > 1
      ? Number((latest.weightKg - first.weightKg).toFixed(1))
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = Number(weightInput);
    if (!date || Number.isNaN(w) || w < 25 || w > 250) return;
    onAddWeightLog({
      id: `wt_${Date.now()}`,
      date,
      weightKg: Number(w.toFixed(1)),
      note: note.trim() || undefined,
    });
    setNote('');
  };

  // Build responsive SVG trend chart points
  const chartPoints = useMemo(() => {
    const recent = sortedLogs.slice(-14);
    if (recent.length < 2) return null;

    const weights = recent.map((l) => l.weightKg);
    const minW = Math.min(...weights) - 0.8;
    const maxW = Math.max(...weights) + 0.8;
    const range = Math.max(maxW - minW, 1);

    const width = 420;
    const height = 110;
    const padX = 16;
    const padY = 14;

    const coords = recent.map((item, idx) => {
      const x =
        padX +
        (idx / (recent.length - 1)) * (width - padX * 2);
      const y =
        height -
        padY -
        ((item.weightKg - minW) / range) * (height - padY * 2);
      return { ...item, x, y };
    });

    const linePath = coords
      .map((c, idx) => `${idx === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
      .join(' ');

    return { width, height, coords, linePath, minW, maxW };
  }, [sortedLogs]);

  return (
    <section
      aria-label="Body weight log and trend"
      className="bg-white dark:bg-[#161E1B] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Body Weight Log &amp; Trend
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Active Goal:{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {weightGoal === 'loss'
                ? 'Weight Loss (~1,750 kcal/day)'
                : weightGoal === 'gain'
                ? 'Weight Gain (~2,750 kcal/day)'
                : 'Maintenance (~2,200 kcal/day)'}
            </span>
          </p>
        </div>

        {latest && (
          <div className="text-right font-mono-nums shrink-0">
            <div className="text-lg font-bold text-slate-900 dark:text-slate-50">
              {latest.weightKg.toFixed(1)} kg
            </div>
            {sortedLogs.length > 1 && (
              <div className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                {deltaKg > 0 ? (
                  <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                ) : deltaKg < 0 ? (
                  <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                <span>
                  {deltaKg > 0 ? `+${deltaKg}` : deltaKg} kg net
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Weight Entry Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end"
      >
        <div className="sm:col-span-4">
          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
            Date
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-2.5 py-2 min-h-[40px] text-xs font-mono-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="sm:col-span-3">
          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            step="0.1"
            min="25"
            max="250"
            required
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            className="w-full px-2.5 py-2 min-h-[40px] text-xs font-mono-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="sm:col-span-3">
          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
            Note (optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Morning fasted"
            className="w-full px-2.5 py-2 min-h-[40px] text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full px-3 py-2 min-h-[40px] rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Log
          </button>
        </div>
      </form>

      {/* Trend Chart */}
      {chartPoints ? (
        <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60">
          <svg
            viewBox={`0 0 ${chartPoints.width} ${chartPoints.height}`}
            className="w-full h-28 overflow-visible"
            role="img"
            aria-label="Body weight trend chart"
          >
            <path
              d={chartPoints.linePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-emerald-700 dark:text-emerald-400"
            />
            {chartPoints.coords.map((pt) => (
              <g key={pt.id}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  className="fill-emerald-700 dark:fill-emerald-400 stroke-white dark:stroke-slate-900"
                  strokeWidth="1.5"
                >
                  <title>{`${pt.date}: ${pt.weightKg} kg`}</title>
                </circle>
              </g>
            ))}
          </svg>
          <div className="mt-1 flex items-center justify-between text-[11px] font-mono-nums text-slate-500 dark:text-slate-400">
            <span>{chartPoints.coords[0].date}</span>
            <span>
              Range: {Math.min(...chartPoints.coords.map((c) => c.weightKg)).toFixed(1)}–
              {Math.max(...chartPoints.coords.map((c) => c.weightKg)).toFixed(1)} kg
            </span>
            <span>{chartPoints.coords[chartPoints.coords.length - 1].date}</span>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 rounded-lg px-3 py-2.5">
          {sortedLogs.length === 0
            ? 'Log your first weight entry above to start tracking your Weight Loss, Maintenance, or Weight Gain trend.'
            : 'Add one more weight entry on another date to render your progress trend chart.'}
        </p>
      )}

      {/* Recent Entries List */}
      {sortedLogs.length > 0 && (
        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-44 overflow-y-auto">
          {[...sortedLogs]
            .reverse()
            .slice(0, 6)
            .map((entry) => (
              <div
                key={entry.id}
                className="py-2 flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0">
                  <span className="font-mono-nums font-medium text-slate-700 dark:text-slate-200">
                    {entry.date}
                  </span>
                  {entry.note && (
                    <span className="ml-2 text-slate-500 dark:text-slate-400">
                      · {entry.note}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono-nums font-bold text-slate-900 dark:text-slate-50">
                    {entry.weightKg.toFixed(1)} kg
                  </span>
                  <button
                    type="button"
                    aria-label={`Delete weight entry for ${entry.date}`}
                    onClick={() => onDeleteWeightLog(entry.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}
