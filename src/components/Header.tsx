import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  activePage: 'tracker' | 'recipes' | 'ingredients';
  onSelectPage: (page: 'tracker' | 'recipes' | 'ingredients') => void;
  onToggleTheme: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export function Header({
  isDark,
  activePage,
  onSelectPage,
  onToggleTheme,
  onNavigateSection,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-[#121916]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#daily-plan"
          onClick={(e) => {
            e.preventDefault();
            onSelectPage('tracker');
            onNavigateSection('daily-plan');
          }}
          className="font-display text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 whitespace-nowrap shrink-0"
        >
          TN Wellness Tracker
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          <button
            type="button"
            onClick={() => {
              onSelectPage('tracker');
              setTimeout(() => onNavigateSection('daily-plan'), 20);
            }}
            className={`hover:text-emerald-700 dark:hover:text-emerald-400 underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activePage === 'tracker'
                ? 'text-emerald-700 dark:text-emerald-400 underline font-semibold'
                : 'hover:underline'
            }`}
          >
            Daily Plan
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectPage('recipes');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`hover:text-emerald-700 dark:hover:text-emerald-400 underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activePage === 'recipes'
                ? 'text-emerald-700 dark:text-emerald-400 underline font-semibold'
                : 'hover:underline'
            }`}
          >
            Recipes
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectPage('ingredients');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`hover:text-emerald-700 dark:hover:text-emerald-400 underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activePage === 'ingredients'
                ? 'text-emerald-700 dark:text-emerald-400 underline font-semibold'
                : 'hover:underline'
            }`}
          >
            Ingredients
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectPage('tracker');
              setTimeout(() => onNavigateSection('hydration-weight'), 20);
            }}
            className="hover:text-emerald-700 dark:hover:text-emerald-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Hydrate &amp; Wt
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectPage('tracker');
              setTimeout(() => onNavigateSection('thirty-day-grid'), 20);
            }}
            className="hover:text-emerald-700 dark:hover:text-emerald-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            30-Day Plan
          </button>
        </nav>

        {/* Zone 3: Single primary header action (Theme Toggle) */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" aria-hidden="true" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
