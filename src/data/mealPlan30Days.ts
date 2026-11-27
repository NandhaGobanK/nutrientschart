import { DayPlan, MealSlotEntry, MealSlotId } from '../types/nutrition';

const e = (foodId: string, multiplier = 1): MealSlotEntry => ({
  foodId,
  multiplier,
});

const DAY_THEMES: Array<{ title: string; focusAnchor: string }> = [
  {
    title: 'Ragi, Nelli & Murungai Poo Foundation',
    focusAnchor: 'Nelli-vendhaya thanni glycemic start + low-GI finger millet focus',
  },
  {
    title: 'Kambu, Kollu & Vazhaithandu Vitality',
    focusAnchor: 'Pearl millet B-vitamins + banana stem renal cleanse & kollu stamina',
  },
  {
    title: 'Mutton Nenju Soup & Thinai Eye-Brain',
    focusAnchor: 'Foxtail millet steady glucose + rib-bone B12, zinc & collagen',
  },
  {
    title: 'Ulundhangali, Kattralai & Nattu Kozhi',
    focusAnchor: 'Aloe vera hydration + country chicken choline & airway pepper broth',
  },
  {
    title: 'Pazhaya Sadam & Nethili Meen Focus',
    focusAnchor: 'Probiotic fermented rice + anchovy DHA omega-3 & calcium',
  },
  {
    title: 'Pachai Payaru, Inji & Kovakkai Zinc',
    focusAnchor: 'Sprouted green gram choline + ivy gourd metabolic balance',
  },
  {
    title: 'Mathi Meen, Varagu & Karuveppilai Day',
    focusAnchor: 'Coastal sardine omega-3 & thyroid selenium + curry leaf iron',
  },
  {
    title: 'Ragi Puttu, Manathakkali & Kothavarangai',
    focusAnchor: 'Liver-healing manathakkali + cluster bean soluble fiber for steady coding',
  },
  {
    title: 'Kambu Dosai, Ilaneer & Mutton Sukka',
    focusAnchor: 'Tender coconut hydration + mutton heme iron, B12 & sperm vitality',
  },
  {
    title: 'Multi-Dal Adai, Omam & Nattu Kozhi',
    focusAnchor: 'Four-lentil amino profile + pepper chicken cognitive stamina',
  },
  {
    title: 'Kudiraivali, Kovakkai & Inji Immunity',
    focusAnchor: 'Barnyard millet + ginger thuvaiyal & kollu rasam immune boost',
  },
  {
    title: 'Ayala Seared Fish & Kattralai Glow',
    focusAnchor: 'Mackerel DHA/EPA brain focus + aloe vera & nelli skin-hair shield',
  },
  {
    title: 'Thinai Pongal, Barley & Karuvadu Thokku',
    focusAnchor: 'Barley thanni hydration + savory nethili karuvadu calcium & protein',
  },
  {
    title: 'Nandu Rasam, Pesarattu & Metabolic Peak',
    focusAnchor: 'Crab pepper rasam zinc/selenium + whole moong choline focus',
  },
  {
    title: 'Mid-Month Mutton Kuzhambu & Zinc Peak',
    focusAnchor: 'Mutton B12 & zinc + murungai poo + pumpkin seed vitality',
  },
  {
    title: 'Pazhaya Sadam & Samai Deep Work Day',
    focusAnchor: 'Probiotic breakfast + zero-crash samai sambar sadam',
  },
  {
    title: 'Kambu Koozh, Nethili & Ponnanganni',
    focusAnchor: 'Fermented pearl millet + anchovy omega-3 & screen-relief greens',
  },
  {
    title: 'Ulundhangali, Ilaneer & Nattu Kozhi Soup',
    focusAnchor: 'Joint-ligament urad porridge + country chicken evening pepper broth',
  },
  {
    title: 'Ragi Semiya, Kudineer & Thoothuvalai',
    focusAnchor: 'Seasonal kudineer immune start + lung-clearing pepper rasam',
  },
  {
    title: 'Mathi Meen, Mapillai Samba & Ellu',
    focusAnchor: 'Coastal sardine choline & thyroid support + sesame trace minerals',
  },
  {
    title: 'Karuveppilai Idli & Karuvadu Kuzhambu',
    focusAnchor: 'High-iron curry leaf breakfast + drumstick-brinjal karuvadu + neer mor',
  },
  {
    title: 'Thinai, Barley Thanni & Mutton Broth',
    focusAnchor: 'Barley-vazhaithandu renal cleanse + mutton nenju soup recovery',
  },
  {
    title: 'Adai Avial, Vendhaya Thanni & Ayala',
    focusAnchor: 'Soaked fenugreek glycemic anchor + mackerel omega-3 focus',
  },
  {
    title: 'Kudiraivali, Kovakkai & Kollu Immunity',
    focusAnchor: 'Ivy gourd endocrine balance + horsegram rasam immune defense',
  },
  {
    title: 'Pachai Payaru, Nattu Kozhi & Murungai Poo',
    focusAnchor: 'Green gram folate + pepper chicken choline & drumstick flower vitality',
  },
  {
    title: 'Nandu Rasam & Ragi Idli Recovery',
    focusAnchor: 'Fermented ragi calcium + crab black-pepper airway & zinc boost',
  },
  {
    title: 'Kambu, Soya-Paneer & Mookirattai Peak',
    focusAnchor: 'High-choline plant protein + kidney-protective punarnava greens',
  },
  {
    title: 'Pazhaya Sadam & Mutton Sukka Vitality',
    focusAnchor: 'Gut-brain fermented rice + small-onion mutton sukka zinc & iron',
  },
  {
    title: 'Vallarai, Ilaneer & Nethili Omega Day',
    focusAnchor: 'Memory herb tonic + coconut water & anchovy calcium-DHA',
  },
  {
    title: 'Full-Body 11-System Consolidation',
    focusAnchor: 'Nelli, ragi, murungai keerai, kollu, vazhaithandu & murungai poo finale',
  },
];

const EARLY_MORNING_ROTATION: MealSlotEntry[][] = [
  [e('em_nellikai_curry_water')],
  [e('em_vendhaya_seeraga_thanni'), e('em_lemon_jeera_pumpkin', 0.5)],
  [e('em_kattralai_nelli_juice')],
  [e('em_omam_kudineer'), e('em_soaked_verkadalai_tulsi', 0.75)],
  [e('em_vallarai_buttermilk')],
  [e('em_murungai_soup')],
  [e('em_lemon_jeera_pumpkin')],
  [e('em_sukku_malli_kaapi'), e('em_vendhaya_seeraga_thanni', 0.5)],
];

const BREAKFAST_ROTATION: MealSlotEntry[][] = [
  [e('bf_ragi_idli_sambar'), e('bf_boiled_nattu_egg')],
  [e('bf_kambu_dosai_ellu'), e('bf_soya_paneer_sundal', 0.75)],
  [e('bf_thinai_pongal_chutney'), e('bf_boiled_nattu_egg')],
  [e('bf_ulundhangali'), e('bf_soya_paneer_sundal', 0.75)],
  [e('bf_pazhaya_sadam_neer_mor'), e('bf_boiled_nattu_egg')],
  [e('bf_pachai_payaru_dosai'), e('bf_boiled_nattu_egg')],
  [e('bf_ragi_puttu_verkadalai'), e('bf_soya_paneer_sundal', 0.75)],
  [e('bf_karuveppilai_idli'), e('bf_boiled_nattu_egg')],
  [e('bf_adai_avial'), e('bf_boiled_nattu_egg', 0.5)],
  [e('bf_samai_veg_upma'), e('bf_soya_paneer_sundal')],
];

const MID_MORNING_ROTATION: MealSlotEntry[][] = [
  [e('mm_guava_pumpkin')],
  [e('mm_ilaneer_pumpkin')],
  [e('mm_barley_vazhaithandu_juice'), e('mm_nattu_banana_pottukadalai', 0.5)],
  [e('mm_red_banana_verkadalai')],
  [e('mm_papaya_ellu_urundai')],
  [e('mm_neer_mor_pottukadalai')],
  [e('mm_pachai_payaru_sprouts')],
];

// Explicit 30-day lunch schedule mixing Veg+Millet, Mutton, Nattu Kozhi, Fresh Fish, and Karuvadu
const LUNCH_SCHEDULE: MealSlotEntry[][] = [
  [e('ln_varagu_sadam_murungai'), e('ln_curd_carrot_ellu_podi')], // 1
  [e('ln_kambu_sadam_vazhaithandu'), e('ln_curd_carrot_ellu_podi')], // 2
  [e('ln_thinai_mookirattai_vazhaithandu'), e('ln_kondakadalai_poriyal')], // 3 (mutton soup in evening)
  [e('ln_parboiled_manathakkali_kothavarangai'), e('ln_curd_carrot_ellu_podi')], // 4 (chicken soup in evening)
  [e('nv_nethili_meen_kuzhambu'), e('ln_curd_carrot_ellu_podi')], // 5: Fresh Nethili Fish
  [e('ln_kudiraivali_kovakkai_inji'), e('ln_curd_carrot_ellu_podi')], // 6
  [e('ln_mathi_meen_kulambu_varagu'), e('ln_curd_carrot_ellu_podi')], // 7: Mathi Sardine
  [e('ln_parboiled_manathakkali_sambar'), e('ln_curd_carrot_ellu_podi')], // 8
  [e('ln_kariveppilai_sadam_kothavarangai'), e('nv_mutton_sukka_onion')], // 9: Mutton Sukka
  [e('nv_nattu_kozhi_pepper'), e('ln_curd_carrot_ellu_podi')], // 10: Nattu Kozhi Pepper
  [e('ln_kudiraivali_thoothuvalai'), e('ln_curd_carrot_ellu_podi')], // 11
  [e('nv_ayala_pan_seared'), e('ln_curd_carrot_ellu_podi')], // 12: Ayala Mackerel
  [e('nv_nethili_karuvadu_thokku'), e('mm_neer_mor_pottukadalai', 0.75)], // 13: Nethili Karuvadu + Neer Mor
  [e('ln_nandu_milagu_rasam'), e('ln_curd_carrot_ellu_podi')], // 14: Nandu Crab Rasam
  [e('nv_mutton_kuzhambu_varagu'), e('ln_curd_carrot_ellu_podi')], // 15: Mutton Kuzhambu
  [e('ln_samai_bisibelebath'), e('ln_kondakadalai_poriyal')], // 16
  [e('nv_nethili_meen_kuzhambu'), e('ln_curd_carrot_ellu_podi')], // 17: Fresh Nethili
  [e('ln_mapillai_samba_ponnanganni'), e('ln_kondakadalai_poriyal')], // 18 (chicken soup in evening)
  [e('ln_thinai_arisi_sirukeerai'), e('ln_kondakadalai_poriyal')], // 19
  [e('ln_mathi_meen_kulambu_varagu'), e('ln_curd_carrot_ellu_podi')], // 20: Mathi Sardine
  [e('nv_karuvadu_kuzhambu'), e('mm_neer_mor_pottukadalai', 0.75)], // 21: Karuvadu Kuzhambu + Neer Mor
  [e('ln_thinai_mookirattai_vazhaithandu'), e('ln_curd_carrot_ellu_podi')], // 22 (mutton soup in evening)
  [e('nv_ayala_pan_seared'), e('ln_curd_carrot_ellu_podi')], // 23: Ayala Seared Fish
  [e('ln_kudiraivali_kovakkai_inji'), e('ln_kondakadalai_poriyal')], // 24
  [e('nv_nattu_kozhi_pepper'), e('ln_curd_carrot_ellu_podi')], // 25: Nattu Kozhi Pepper
  [e('ln_nandu_milagu_rasam'), e('ln_curd_carrot_ellu_podi')], // 26: Nandu Rasam
  [e('ln_thinai_mookirattai_vazhaithandu'), e('ln_kondakadalai_poriyal')], // 27
  [e('ln_kariveppilai_sadam_kothavarangai'), e('nv_mutton_sukka_onion')], // 28: Mutton Sukka
  [e('nv_nethili_meen_kuzhambu'), e('ln_curd_carrot_ellu_podi')], // 29: Fresh Nethili
  [e('ln_varagu_sadam_murungai'), e('ln_curd_carrot_ellu_podi')], // 30
];

const EVENING_SNACK_SCHEDULE: MealSlotEntry[][] = [
  [e('es_verkadalai_sundal')], // 1
  [e('es_kollu_sundal')], // 2
  [e('nv_mutton_nenju_soup')], // 3: Mutton Nenju Elumbu Soup
  [e('nv_nattu_kozhi_rasam')], // 4: Nattu Kozhi Soup
  [e('es_pottukadalai_ellu_mix')], // 5
  [e('es_murungai_poo_sundal')], // 6
  [e('es_kattralai_buttermilk_sundal')], // 7
  [e('es_karamani_sundal')], // 8
  [e('es_sweet_potato_pepper'), e('em_sukku_malli_kaapi')], // 9
  [e('es_ragi_murungai_adai')], // 10
  [e('es_kollu_sundal')], // 11
  [e('es_pottukadalai_ellu_mix')], // 12
  [e('es_kattralai_buttermilk_sundal')], // 13
  [e('es_verkadalai_sundal')], // 14
  [e('es_murungai_poo_sundal')], // 15
  [e('es_karamani_sundal')], // 16
  [e('es_kollu_sundal')], // 17
  [e('nv_nattu_kozhi_rasam')], // 18: Nattu Kozhi Soup
  [e('es_ragi_murungai_adai')], // 19
  [e('es_pottukadalai_ellu_mix')], // 20
  [e('es_kattralai_buttermilk_sundal')], // 21
  [e('nv_mutton_nenju_soup')], // 22: Mutton Nenju Elumbu Soup
  [e('es_verkadalai_sundal')], // 23
  [e('es_kollu_sundal')], // 24
  [e('es_murungai_poo_sundal')], // 25
  [e('es_karamani_sundal')], // 26
  [e('es_pottukadalai_ellu_mix')], // 27
  [e('es_sweet_potato_pepper'), e('em_sukku_malli_kaapi')], // 28
  [e('es_kattralai_buttermilk_sundal')], // 29
  [e('es_murungai_poo_sundal')], // 30
];

const DINNER_ROTATION: MealSlotEntry[][] = [
  [e('dn_kambu_koozh_onion')],
  [e('dn_inji_thuvaiyal_idli')],
  [e('dn_kambu_kovakkai_kootu')],
  [e('nv_chicken_kuzhambu_idli')],
  [e('dn_idli_karuveppilai_podi')],
  [e('dn_godhumai_rava_kichdi')],
  [e('dn_ragi_semiya_veg')],
  [e('dn_chapati_green_gram')],
  [e('dn_thinai_curd_pomegranate')],
  [e('dn_varagu_dosai_tomato')],
];

const NIGHTTIME_ROTATION: MealSlotEntry[][] = [
  [e('nt_murungai_poo_paal')],
  [e('nt_manjal_milagu_paal')],
  [e('nt_ellu_paal')],
  [e('nt_ashwagandha_pepper_milk')],
  [e('nt_murungai_poo_paal')],
  [e('nt_karupatti_chukku_milk')],
];

export const MEAL_PLAN_30_DAYS: DayPlan[] = Array.from({ length: 30 }, (_, idx) => {
  const day = idx + 1;
  const theme = DAY_THEMES[idx];

  const meals: Record<MealSlotId, MealSlotEntry[]> = {
    early_morning: EARLY_MORNING_ROTATION[idx % EARLY_MORNING_ROTATION.length],
    breakfast: BREAKFAST_ROTATION[idx % BREAKFAST_ROTATION.length],
    mid_morning: MID_MORNING_ROTATION[idx % MID_MORNING_ROTATION.length],
    lunch: LUNCH_SCHEDULE[idx],
    evening_snack: EVENING_SNACK_SCHEDULE[idx],
    dinner: DINNER_ROTATION[idx % DINNER_ROTATION.length],
    nighttime: NIGHTTIME_ROTATION[idx % NIGHTTIME_ROTATION.length],
  };

  return {
    day,
    title: theme.title,
    focusAnchor: theme.focusAnchor,
    meals,
  };
});
