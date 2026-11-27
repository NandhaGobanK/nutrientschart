import {
  Activity,
  Bone,
  Brain,
  CheckCircle2,
  CircleAlert,
  Clock,
  Droplets,
  Eye,
  Flower2,
  Gauge,
  Heart,
  Leaf,
  ShieldCheck,
  Wind,
} from 'lucide-react';
import { BODY_SYSTEMS } from '../data/tnFoods';
import { BodySystem } from '../types/nutrition';
import { SystemCoverageInfo } from '../utils/nutritionCalc';

interface SystemCoveragePanelProps {
  coverage: Record<BodySystem, SystemCoverageInfo>;
  mode: 'consumed' | 'planned';
  activeSystemFilter: BodySystem | 'all';
  onSelectSystemFilter: (system: BodySystem | 'all') => void;
}

const SYSTEM_ICONS: Record<BodySystem, typeof Brain> = {
  brain: Brain,
  fertility: Activity,
  heart: Heart,
  bones: Bone,
  lungs: Wind,
  eyes: Eye,
  digestive: Leaf,
  renal: Droplets,
  endocrine: Gauge,
  immune: ShieldCheck,
  integumentary: Flower2,
};

export function SystemCoveragePanel({
  coverage,
  mode,
  activeSystemFilter,
  onSelectSystemFilter,
}: SystemCoveragePanelProps) {
  const coveredCount = BODY_SYSTEMS.filter((sys) => {
    const info = coverage[sys.id];
    return mode === 'consumed'
      ? info.consumedFoods.length > 0
      : info.plannedFoods.length > 0;
  }).length;

  return (
    <section
      id="body-systems"
      aria-label="Organ and wellness goal coverage"
      className="bg-white dark:bg-[#161E1B] border border-slate-200 dark:border-slate-800 rounded-xl p-5"
    >
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Organ &amp; Goal Coverage
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {mode === 'consumed'
              ? 'All 11 body systems nourished by meals checked off today'
              : 'All 11 body systems covered across the full day menu'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {activeSystemFilter !== 'all' && (
            <button
              type="button"
              onClick={() => onSelectSystemFilter('all')}
              className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 underline underline-offset-2 cursor-pointer"
            >
              Show all
            </button>
          )}
          <span className="font-mono-nums text-xs font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
            {coveredCount} / {BODY_SYSTEMS.length} active
          </span>
        </div>
      </div>

      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
        {BODY_SYSTEMS.map((sys) => {
          const Icon = SYSTEM_ICONS[sys.id];
          const info = coverage[sys.id];
          const activeFoods =
            mode === 'consumed' ? info.consumedFoods : info.plannedFoods;
          const plannedCount = info.plannedFoods.length;
          const isCovered = activeFoods.length > 0;
          const isPending = !isCovered && plannedCount > 0;
          const isFiltered = activeSystemFilter === sys.id;

          return (
            <button
              key={sys.id}
              type="button"
              onClick={() =>
                onSelectSystemFilter(isFiltered ? 'all' : sys.id)
              }
              aria-pressed={isFiltered}
              className={`w-full text-left py-3 first:pt-1.5 last:pb-1 px-2 -mx-2 rounded-lg transition-colors cursor-pointer ${
                isFiltered
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div
                    className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                      isCovered
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {sys.label}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {sys.keyNutrients}
                    </div>
                  </div>
                </div>

                {/* Explicit status text + icon (never hue-only) */}
                <div className="shrink-0">
                  {isCovered ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 font-mono-nums">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Covered ({activeFoods.length})</span>
                    </span>
                  ) : isPending ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 font-mono-nums">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Planned ({plannedCount})</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <CircleAlert className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Not in menu</span>
                    </span>
                  )}
                </div>
              </div>

              {activeFoods.length > 0 ? (
                <p className="mt-1.5 pl-9 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeFoods.join(' · ')}
                </p>
              ) : isPending ? (
                <p className="mt-1.5 pl-9 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Scheduled in today&apos;s plan: {info.plannedFoods.slice(0, 2).join(' · ')}
                  {info.plannedFoods.length > 2
                    ? ` +${info.plannedFoods.length - 2} more`
                    : ''}
                </p>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
