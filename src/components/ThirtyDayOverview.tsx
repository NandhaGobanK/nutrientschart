import { Check } from 'lucide-react';
import { MEAL_PLAN_30_DAYS } from '../data/mealPlan30Days';
import { DayProgressState } from '../types/nutrition';
import { getDayCompletionCount } from '../utils/nutritionCalc';

interface ThirtyDayOverviewProps {
  selectedDay: number;
  todayDay: number;
  daysState: Record<number, DayProgressState>;
  onSelectDay: (day: number) => void;
}

const BUDGET_ANCHORS = [
  {
    item: 'Murungai Poo, Ellu & Pumpkin Seeds',
    tamil: 'முருங்கைப்பூ, எள், பூசணி விதை',
    systems: 'Male Fertility, Bones, Brain Focus',
    usage: 'Nighttime murungai poo milk, ellu chutney/urundai, roasted pumpkin seeds',
  },
  {
    item: 'Verkadalai, Pottukadalai & Millets',
    tamil: 'வேர்க்கடலை, பொட்டுக்கடலை, சிறுதானியங்கள்',
    systems: 'Brain IT Focus, Heart, Endocrine',
    usage: 'Ragi/Kambu/Thinai/Varagu/Samai/Kudiraivali staples + boiled peanut sundal',
  },
  {
    item: 'Goat Meat (Mutton Nenju Soup, Kuzhambu & Sukka)',
    tamil: 'ஆட்டு நெஞ்சு எலும்பு சூப், மட்டன் சுக்கா',
    systems: 'Fertility, Heart & Blood, Bones, Immunity',
    usage: 'Vitamin B12, heme iron, zinc & rib-bone collagen for stamina and sperm health',
  },
  {
    item: 'Nattu Kozhi (Country Chicken Soup & Milagu Varuval)',
    tamil: 'நாட்டுக்கோழி ரசம், மிளகு வறுவல்',
    systems: 'Brain Focus, Immunity, Lungs, Bones',
    usage: 'Complete protein, B-complex & choline for sustained coding/study drive',
  },
  {
    item: 'Fresh Coastal Fish (Nethili, Mathi, Ayala, Sankara)',
    tamil: 'நெத்திலி, மத்தி, அயிலை, சங்கரா மீன்',
    systems: 'Brain, Heart, Thyroid, Fertility, Eyes',
    usage: 'DHA/EPA omega-3, thyroid selenium, calcium & sperm motility support',
  },
  {
    item: 'Karuvadu (Nethili Karuvadu Thokku & Kuzhambu)',
    tamil: 'நெத்திலி கருவாடு தொக்கு, குழம்பு',
    systems: 'Bones & Joints, Brain, Protein Density',
    usage: 'Concentrated protein & calcium; pair with neer mor & extra water for sodium balance',
  },
  {
    item: 'Manathakkali, Kothavarangai, Vazhaithandu & Mookirattai',
    tamil: 'மணத்தக்காளி, கொத்தவரங்காய், வாழைத்தண்டு, மூக்கிரட்டை',
    systems: 'Digestive, Liver, Urinary & Renal',
    usage: 'Gut repair, kidney cleansing, barley thanni, seeraga & omam infusions',
  },
  {
    item: 'Kattralai, Kariveppilai, Nelli & Ilaneer',
    tamil: 'கற்றாழை, கறிவேப்பிலை, நெல்லி, இளநீர்',
    systems: 'Skin, Hair, Nails, Eyes & Immunity',
    usage: 'Aloe-amla morning shot, curry leaf rice/thuvaiyal, kollu rasam, inji thuvaiyal',
  },
];

export function ThirtyDayOverview({
  selectedDay,
  todayDay,
  daysState,
  onSelectDay,
}: ThirtyDayOverviewProps) {
  return (
    <section id="thirty-day-grid" className="space-y-8">
      {/* 30-Day Grid */}
      <div className="bg-white dark:bg-[#161E1B] border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-5">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              30-Day Full-Body Wellness Rotation
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Select any day to inspect or log its Tamil Nadu veg, millet, or non-veg menu across all 11 body systems.
            </p>
          </div>
          <span className="font-mono-nums text-xs text-slate-500 dark:text-slate-400">
            Zero imported nuts · 100% local ingredients
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {MEAL_PLAN_30_DAYS.map((plan) => {
            const doneCount = getDayCompletionCount(plan.day, daysState);
            const isSelected = plan.day === selectedDay;
            const isToday = plan.day === todayDay;
            const isComplete = doneCount === 7;

            return (
              <button
                key={plan.day}
                type="button"
                onClick={() => {
                  onSelectDay(plan.day);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-left p-3.5 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-emerald-700 dark:border-emerald-600'
                    : isComplete
                    ? 'bg-emerald-50/60 border-emerald-200 hover:bg-emerald-100/70 dark:bg-emerald-950/30 dark:border-emerald-800/80 dark:hover:bg-emerald-950/50'
                    : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 dark:bg-slate-800/40 dark:border-slate-700/80 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-mono-nums text-xs font-bold ${
                      isSelected
                        ? 'text-emerald-300 dark:text-emerald-100'
                        : 'text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    Day {plan.day}
                    {isToday ? ' · Today' : ''}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-mono-nums text-[11px] ${
                      isSelected
                        ? 'text-slate-200'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isComplete && <Check className="w-3 h-3" aria-hidden="true" />}
                    <span>{doneCount}/7</span>
                  </span>
                </div>
                <div
                  className={`text-xs font-semibold leading-snug line-clamp-2 ${
                    isSelected
                      ? 'text-white'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {plan.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget Local Pantry Anchor Table */}
      <div className="bg-white dark:bg-[#161E1B] border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="mb-4">
          <h2 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Tamil Nadu Budget Veg &amp; Non-Veg Pantry Anchors
          </h2>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Local millets, greens, seeds, mutton, country chicken, coastal fish, and dried fish supporting full-body vitality.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <th className="py-2.5 pr-4 font-semibold">Ingredient Group</th>
                <th className="py-2.5 pr-4 font-semibold">Target Body Systems</th>
                <th className="py-2.5 font-semibold">Daily Meal Integration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {BUDGET_ANCHORS.map((row) => (
                <tr key={row.item}>
                  <td className="py-3 pr-4 align-top">
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {row.item}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {row.tamil}
                    </div>
                  </td>
                  <td className="py-3 pr-4 align-top text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    {row.systems}
                  </td>
                  <td className="py-3 align-top text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {row.usage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
