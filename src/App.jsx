import { useState, useCallback } from "react";

// DATA - Expanded with assessment-specific outcomes
const FW = {
  katz: { l: "Katz ADL", c: "#6366f1", u: "https://hign.org/sites/default/files/2020-06/Try_This_General_Assessment_2.pdf" },
  barthel: { l: "Barthel Index", c: "#0891b2", u: "https://www.sralab.org/sites/default/files/2017-07/barthel.pdf" },
  fim: { l: "FIM", c: "#059669", u: "https://www.sralab.org/rehabilitation-measures/functional-independence-measure" },
  oasis: { l: "OASIS", c: "#d97706", u: "https://www.cms.gov/medicare/quality/home-health/oasis-data-sets" },
  nanda: { l: "NANDA-I/NOC", c: "#dc2626", u: "https://nurseslabs.com/self-care-deficit/" },
  pom: { l: "CQL Outcomes", c: "#7c3aed", u: "https://www.c-q-l.org" },
  wadl: { l: "Waisman ADL", c: "#be185d", u: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8068038/" },
  lawton: { l: "Lawton IADL", c: "#0d9488", u: "https://geriatrictoolkit.missouri.edu/funct/Lawton_IADL.pdf" },
  bsp: { l: "BSP", c: "#ea580c" }, slp: { l: "SLP/Dysphagia", c: "#4f46e5" },
  nursing: { l: "Nursing", c: "#b91c1c", u: "https://nurseslabs.com/risk-for-injury/" },
  hcbs: { l: "HCBS/Waiver", c: "#1d4ed8" },
  cder: { l: "CDER (DDS)", c: "#4338ca", u: "https://www.dds.ca.gov/wp-content/uploads/2019/02/CDERManual_Overview.pdf" },
  gmfcs: { l: "GMFCS (CP)", c: "#0e7490", u: "https://cpup.se/wp-content/uploads/2013/07/GMFCS-ER.pdf" },
  macs: { l: "MACS (CP)", c: "#155e75", u: "https://www.macs.nu" },
  cfcs: { l: "CFCS (CP)", c: "#164e63", u: "https://cfcs.us" },
  edacs: { l: "EDACS (CP)", c: "#1e3a5f", u: "https://www.edacs.org" },
  abas: { l: "ABAS-3", c: "#9333ea", u: "https://www.wpspublish.com/abas-3-adaptive-behavior-assessment-system-third-edition" },
  vineland: { l: "Vineland-3", c: "#a21caf" },
  sis: { l: "SIS (AAIDD)", c: "#0369a1", u: "https://www.aaidd.org/sis/sis-a" },
  icap: { l: "ICAP", c: "#075985" },
  qolie: { l: "QOLIE (Epilepsy)", c: "#b45309", u: "https://www.rand.org/health-care/surveys_tools/qolie.html" },
  dabs: { l: "DABS", c: "#6d28d9", u: "https://www.aaidd.org/dabs" },
};

const REFS = [
  { cat: "California DDS", links: [
    ["CDER Overview", "https://www.dds.ca.gov/transparency/cder/"],
    ["CDER Field Manual (PDF)", "https://www.dds.ca.gov/wp-content/uploads/2019/02/CDERManual_Overview.pdf"],
    ["CDER Evaluation Element (PDF)", "https://www.dds.ca.gov/wp-content/uploads/2019/02/CDERManual_EvaluationElement.pdf"],
    ["CDER Online Form", "https://www.tfaforms.com/4615601"],
  ]},
  { cat: "Cerebral Palsy", links: [
    ["GMFCS-E&R (PDF)", "https://cpup.se/wp-content/uploads/2013/07/GMFCS-ER.pdf"],
    ["MACS Official", "https://www.macs.nu"],["CFCS Official", "https://cfcs.us"],["EDACS Official", "https://www.edacs.org"],
    ["4 CP Systems (PMC)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC5406689/"],
  ]},
  { cat: "Autism & Adaptive", links: [
    ["ABAS-3 (WPS)", "https://www.wpspublish.com/abas-3-adaptive-behavior-assessment-system-third-edition"],
    ["Vineland-3 (Pearson)", "https://www.pearsonassessments.com/store/usassessments/en/Store/Professional-Assessments/Behavior/Adaptive/Vineland-Adaptive-Behavior-Scales-%7C-Third-Edition/p/100001622.html"],
    ["Assessment Tools — Autism (PDF)", "https://paautism.org/wp-content/uploads/2019/10/CommonAssessmentTools-1.pdf"],
    ["DABS (AAIDD)", "https://www.aaidd.org/dabs"],
  ]},
  { cat: "Epilepsy", links: [
    ["QOLIE-31 (PDF)", "https://www.neurocenternj.com/wp-content/uploads/2021/01/Quality-of-Life-in-Epilepsy.pdf"],
    ["QOLIE-10 (PDF)", "https://www.aan.com/siteassets/home-page/policy-and-guidelines/quality/quality-measures/epilepsy-and-seizures/qolie-10p.pdf"],
    ["QOLIE — RAND (free)", "https://www.rand.org/health-care/surveys_tools/qolie.html"],
  ]},
  { cat: "Supported Living & IDD", links: [
    ["SIS-A (AAIDD)", "https://www.aaidd.org/sis/sis-a"],
    ["SIS Overview (PDF)", "https://aaidd.org/docs/default-source/sis-docs/sisoverview.pdf"],
    ["ICAP Policy (PDF)", "https://www.hhs.nd.gov/sites/www/files/documents/DHS%20Legacy/sis-icap-assessment-policy.pdf"],
    ["CQL Personal Outcomes", "https://www.c-q-l.org"],
  ]},
  { cat: "ADL & Functional", links: [
    ["Katz ADL (PDF)", "https://hign.org/sites/default/files/2020-06/Try_This_General_Assessment_2.pdf"],
    ["Barthel Index (PDF)", "https://www.sralab.org/sites/default/files/2017-07/barthel.pdf"],
    ["Lawton IADL (PDF)", "https://geriatrictoolkit.missouri.edu/funct/Lawton_IADL.pdf"],
    ["FIM (RehabMeasures)", "https://www.sralab.org/rehabilitation-measures/functional-independence-measure"],
  ]},
  { cat: "Nursing & Home Health", links: [
    ["OASIS-E (CMS)", "https://www.cms.gov/medicare/quality/home-health/oasis-data-sets"],
    ["Self-Care Deficit Plans", "https://nurseslabs.com/self-care-deficit/"],
    ["Fall Risk Plans", "https://nurseslabs.com/risk-for-falls/"],
    ["Safety Diagnoses", "https://www.nursetogether.com/safety-nursing-diagnosis-care-plan/"],
  ]},
  { cat: "Person-Centered Planning", links: [
    ["ACL Federal PCP Guidance", "https://acl.gov/programs/consumer-control/person-centered-planning"],
    ["HCBS Plan Template — NY (PDF)", "https://www.health.ny.gov/health_care/medicaid/redesign/hcbs/docs/pcp_template.pdf"],
    ["IEP Living Goals Bank", "https://www.spedadulting.com/goals-independent-living/"],
  ]},
];

const N = "[Client's name]";
const GB = {
  bathing: { label: "Bathing / Showering", icon: "🚿", cats: [
    { n: "Independence & Maintenance", g: [
      { t: `${N} needs to maintain current independence in bathing/showering with minimal cueing to complete all steps.`, k: ["katz","fim","abas","vineland"] },
      { t: `${N} needs to complete bathing/showering independently using adaptive equipment (shower chair, grab bars, hand-held showerhead).`, k: ["barthel","oasis","gmfcs"] },
      { t: `${N} needs to bathe independently with environmental setup at least [frequency].`, k: ["fim","wadl","sis"] },
    ]},
    { n: "Prompting & Assistance Levels — Bathing", g: [
      { t: `${N} needs indirect verbal cues ("What do you need to do next?") to complete bathing routine.`, k: ["fim","cder","abas"] },
      { t: `${N} needs gentle reminders to initiate bathing at the scheduled time.`, k: ["hcbs","pom","icap"] },
      { t: `${N} needs direct verbal prompting for each step of the bathing routine (undressing, entering tub/shower, washing each body part, rinsing, drying).`, k: ["fim","oasis","cder","sis"] },
      { t: `${N} needs step-by-step verbal instructions with wait time between each step during bathing.`, k: ["fim","wadl","vineland","bsp"] },
      { t: `${N} needs choice-based prompting during bathing ("Do you want to wash your arms or legs first?") to support autonomy.`, k: ["pom","bsp","abas"] },
      { t: `${N} needs gestural cues (pointing to body parts, motioning washing movements) during bathing.`, k: ["fim","cder","bsp"] },
      { t: `${N} needs a visual schedule or picture checklist in the bathroom to follow the bathing routine.`, k: ["bsp","wadl","abas"] },
      { t: `${N} needs full task modeling — watching the bathing sequence demonstrated before performing it.`, k: ["fim","wadl","bsp"] },
      { t: `${N} needs simultaneous modeling — bathing performed alongside as a model to follow.`, k: ["fim","bsp"] },
      { t: `${N} needs light touch cues (tap on arm, gentle guide) to prompt the next bathing step.`, k: ["fim","cder","bsp"] },
      { t: `${N} needs light physical guidance with brief touch cues to guide washing movements.`, k: ["fim","cder"] },
      { t: `${N} needs partial physical assistance to wash hard-to-reach areas while completing remaining steps independently.`, k: ["katz","barthel","fim","cder"] },
      { t: `${N} needs moderate physical assistance with bathing including transfers in/out of tub or shower and help with washing and drying.`, k: ["barthel","fim","oasis","gmfcs"] },
      { t: `${N} needs hand-over-hand assistance to complete bathing tasks, guiding through washing, rinsing, and drying each body part.`, k: ["fim","wadl","cder","sis"] },
      { t: `${N} needs full physical assistance for all bathing/showering at least [frequency] to maintain skin integrity, hygiene, and dignity.`, k: ["katz","barthel","oasis","cder","sis"] },
    ]},
    { n: "OASIS Bathing Outcomes", g: [
      { t: `${N} needs to safely bathe self in tub/shower independently.`, k: ["oasis"] },
      { t: `${N} needs to bathe in tub/shower with intermittent assistance or supervision from another person.`, k: ["oasis"] },
      { t: `${N} needs to bathe in tub/shower with assistance or supervision throughout, requiring another person present for entire task.`, k: ["oasis"] },
      { t: `${N} needs participation in bathing in tub/shower with assistance, contributing helpful movements, but requiring another person to do most of the bathing.`, k: ["oasis"] },
      { t: `${N} is unable to bathe in tub/shower but needs to bathe independently at the sink or with a sponge bath.`, k: ["oasis"] },
      { t: `${N} is unable to use tub/shower or bathe at sink and needs to receive total bath by another person.`, k: ["oasis"] },
    ]},
    { n: "CDER Personal Care Outcomes", g: [
      { t: `${N} does not perform or assist with personal care activities and needs complete assistance with bathing, teeth brushing, washing, and hair care.`, k: ["cder","sis"] },
      { t: `${N} assists with personal care activities by performing helpful movements during bathing and hygiene tasks.`, k: ["cder"] },
      { t: `${N} performs personal care activities but needs assistance to complete them fully.`, k: ["cder"] },
      { t: `${N} performs personal care activities independently when reminded but may forget some steps without prompts.`, k: ["cder"] },
      { t: `${N} performs all personal care activities independently without reminders.`, k: ["cder"] },
    ]},
    { n: "Barthel Bathing Outcomes", g: [
      { t: `${N} needs to be bathed entirely by another person or is unable to bathe.`, k: ["barthel"] },
      { t: `${N} needs to bathe independently or with help for only one body part (back or disabled extremity).`, k: ["barthel"] },
    ]},
    { n: "FIM Bathing Outcomes", g: [
      { t: `${N} needs total assistance — another person performs entire bathing task.`, k: ["fim"] },
      { t: `${N} needs maximal assistance — performs less than 25% of bathing effort.`, k: ["fim"] },
      { t: `${N} needs moderate assistance — performs 25-49% of bathing effort.`, k: ["fim"] },
      { t: `${N} needs minimal contact assistance — performs 50-74% of bathing effort.`, k: ["fim"] },
      { t: `${N} needs supervision or setup only for bathing — no physical contact help needed.`, k: ["fim"] },
      { t: `${N} needs modified independence for bathing — uses adaptive equipment or takes extra time.`, k: ["fim"] },
      { t: `${N} is completely independent in bathing — no equipment, no extra time, safe.`, k: ["fim"] },
    ]},
    { n: "Behavioral & Aversion", g: [
      { t: `${N} needs a calm, patient, consistent approach during bathing, with additional time allowed.`, k: ["bsp","hcbs","cder"] },
      { t: `${N} needs the BSP followed during bathing, including de-escalation techniques and breaks.`, k: ["bsp","nanda"] },
      { t: `${N} needs a gradual desensitization approach to reduce aversion to bathing.`, k: ["bsp","abas"] },
      { t: `${N} needs sensory accommodations during bathing (water temp, lighting, products, textures).`, k: ["bsp","pom","vineland"] },
      { t: `${N} needs preferred or gender-specific assistance with bathing.`, k: ["pom","hcbs"] },
    ]},
    { n: "Safety & Medical", g: [
      { t: `${N} needs fall prevention measures during bathing (non-slip surfaces, grab bars, close supervision).`, k: ["nanda","nursing","oasis","gmfcs"] },
      { t: `${N} needs to never be left unattended in water due to seizure risk.`, k: ["nursing","nanda","qolie"] },
      { t: `${N} needs skin integrity check during each bathing session with changes reported.`, k: ["nanda","nursing","oasis"] },
      { t: `${N} needs transfer equipment used during bathing transfers per protocol.`, k: ["fim","nursing","gmfcs"] },
    ]},
  ]},
  eating: { label: "Eating / Drinking", icon: "🍽️", cats: [
    { n: "Prompting & Assistance Levels — Eating", g: [
      { t: `${N} needs to eat and drink independently at all meals, managing all utensils and containers.`, k: ["katz","barthel","fim","abas","vineland"] },
      { t: `${N} needs environmental setup only — food cut, containers opened, items arranged within reach.`, k: ["fim","oasis"] },
      { t: `${N} needs gentle reminders to eat/drink at scheduled meal and snack times.`, k: ["hcbs","pom","icap"] },
      { t: `${N} needs indirect verbal cues during meals ("What's next on your plate?").`, k: ["fim","abas"] },
      { t: `${N} needs direct verbal prompting and pacing cues throughout meals to ensure adequate intake and safe swallowing.`, k: ["fim","oasis","cder","edacs"] },
      { t: `${N} needs choice-based prompting during meals ("Would you like the chicken or the rice next?").`, k: ["pom","bsp","abas"] },
      { t: `${N} needs gestural cues (pointing to food, motioning to mouth) during meals.`, k: ["fim","cder","bsp"] },
      { t: `${N} needs full task modeling — watching eating demonstrated before imitating.`, k: ["fim","bsp"] },
      { t: `${N} needs light touch cues to prompt bringing utensils or cup to mouth.`, k: ["fim","cder"] },
      { t: `${N} needs partial physical assistance with eating (cutting food, opening containers, stabilizing plate, guiding utensils).`, k: ["barthel","fim","cder","macs"] },
      { t: `${N} needs hand-over-hand feeding assistance to complete meals.`, k: ["fim","wadl","sis","edacs"] },
      { t: `${N} needs full feeding assistance at each meal and snack for adequate nutrition and hydration.`, k: ["katz","oasis","cder","sis"] },
    ]},
    { n: "CDER Eating Outcomes", g: [
      { t: `${N} does not feed self and needs to be fed completely.`, k: ["cder","sis"] },
      { t: `${N} eats with fingers with assistance.`, k: ["cder"] },
      { t: `${N} eats with fingers without assistance.`, k: ["cder"] },
      { t: `${N} eats with at least one utensil, with spillage.`, k: ["cder"] },
      { t: `${N} eats with at least one utensil, without spillage.`, k: ["cder"] },
    ]},
    { n: "OASIS Feeding Outcomes", g: [
      { t: `${N} needs to eat and drink independently and safely.`, k: ["oasis"] },
      { t: `${N} needs to eat and drink with setup assistance (cutting food, opening containers).`, k: ["oasis"] },
      { t: `${N} needs verbal cueing or continual supervision during meals.`, k: ["oasis"] },
      { t: `${N} needs limited assistance with meals (physical help with drinking, lifting utensils to mouth).`, k: ["oasis"] },
      { t: `${N} needs total dependence for eating, unable to participate in feeding self.`, k: ["oasis"] },
    ]},
    { n: "Barthel Feeding Outcomes", g: [
      { t: `${N} is unable to feed self and needs to be fed.`, k: ["barthel"] },
      { t: `${N} needs help cutting food, spreading butter, or similar tasks but feeds self otherwise.`, k: ["barthel"] },
      { t: `${N} feeds self independently with food within reach.`, k: ["barthel"] },
    ]},
    { n: "FIM Eating Outcomes", g: [
      { t: `${N} needs total assistance — another person feeds entirely.`, k: ["fim"] },
      { t: `${N} needs moderate assistance — performs 25-49% of eating effort.`, k: ["fim"] },
      { t: `${N} needs supervision or setup only for eating.`, k: ["fim"] },
      { t: `${N} is independent in eating — uses adaptive utensils or modified independence.`, k: ["fim"] },
    ]},
    { n: "Diet & Dysphagia", g: [
      { t: `${N} eats and drinks safely — no limitations.`, k: ["edacs","slp"] },
      { t: `${N} eats and drinks safely but with some limitations — may need specific food textures.`, k: ["edacs","slp"] },
      { t: `${N} eats and drinks with some limitations to safety — may cough/choke and needs supervision.`, k: ["edacs","slp"] },
      { t: `${N} eats and drinks with significant limitations to safety — needs close supervision and modified diet.`, k: ["edacs","slp"] },
      { t: `${N} is unable to eat or drink safely — nutrition may be provided via tube feeding.`, k: ["edacs","slp","nursing"] },
      { t: `${N} needs food prepared to mechanical soft/pureed consistency as prescribed.`, k: ["slp","nursing","edacs"] },
      { t: `${N} needs liquids thickened to nectar/honey/pudding consistency as prescribed.`, k: ["slp","nursing","edacs"] },
      { t: `${N} needs meals paced with alternating solids/liquids and small bolus sizes.`, k: ["slp","nursing","edacs"] },
      { t: `${N} needs chin tuck/head positioning during swallowing as directed by SLP.`, k: ["slp","edacs","gmfcs"] },
      { t: `${N} needs monitoring for aspiration signs during all meals.`, k: ["slp","nanda","nursing","edacs"] },
      { t: `${N} needs oral motor exercises before meals per SLP protocol.`, k: ["slp","edacs"] },
      { t: `${N} is NPO and needs nutrition via G-tube only per prescribed schedule.`, k: ["nursing","slp"] },
    ]},
    { n: "Adaptive Equipment & Assistive", g: [
      { t: `${N} needs adaptive feeding equipment (built-up utensils, plate guard, nosey cup, weighted utensils).`, k: ["fim","oasis","macs","edacs"] },
      { t: `${N} needs food temperature checked before serving to prevent burns.`, k: ["nursing"] },
      { t: `${N} needs 1:1 supervision during all meals and snacks.`, k: ["nursing","nanda","edacs"] },
    ]},
    { n: "Seizure & Behavioral Safety", g: [
      { t: `${N} needs seizure precautions during meals, with airway cleared and protocol followed immediately.`, k: ["nursing","nanda","qolie"] },
      { t: `${N} needs PICA precautions during meals.`, k: ["bsp","nursing","cder"] },
      { t: `${N} needs a calm, patient approach during meals, with additional time and no power struggles.`, k: ["bsp"] },
    ]},
  ]},
  toileting: { label: "Toileting / Continence", icon: "🚻", cats: [
    { n: "Prompting & Assistance Levels — Toileting", g: [
      { t: `${N} needs to manage toileting independently, including transfers, clothing management, and hygiene.`, k: ["katz","barthel","fim","abas","vineland"] },
      { t: `${N} needs gentle reminders to use the restroom on a regular schedule.`, k: ["hcbs","pom","icap"] },
      { t: `${N} needs indirect verbal cues to initiate toileting ("Do you need to use the restroom?").`, k: ["fim","abas"] },
      { t: `${N} needs direct verbal prompting on a scheduled toileting routine to promote regularity and reduce accidents.`, k: ["fim","oasis","cder","sis"] },
      { t: `${N} needs step-by-step verbal instructions throughout the toileting routine (clothing, transfer, hygiene, flush, handwash).`, k: ["fim","wadl","bsp"] },
      { t: `${N} needs gestural cues (pointing to restroom, motioning to clothing) to complete toileting steps.`, k: ["fim","cder","bsp"] },
      { t: `${N} needs a visual schedule or picture sequence for toileting steps.`, k: ["bsp","wadl","abas"] },
      { t: `${N} needs light physical guidance with brief touch cues to initiate and complete toileting steps.`, k: ["fim","cder"] },
      { t: `${N} needs partial physical assistance with toileting, including clothing management and transfers on/off the toilet.`, k: ["barthel","fim","cder","gmfcs"] },
      { t: `${N} needs moderate physical assistance with toileting, including positioning, cleaning, and clothing management.`, k: ["barthel","fim","oasis"] },
      { t: `${N} needs full physical assistance with all toileting tasks, including transfers, positioning, cleaning, and clothing.`, k: ["katz","oasis","cder","sis"] },
    ]},
    { n: "CDER Toileting Outcomes", g: [
      { t: `${N} is not toilet or habit trained.`, k: ["cder"] },
      { t: `${N} is habit trained only — toilets at preset intervals.`, k: ["cder"] },
      { t: `${N} toilets when prompted.`, k: ["cder"] },
      { t: `${N} toilets without prompting but needs physical assistance.`, k: ["cder"] },
      { t: `${N} toilets independently without assistance.`, k: ["cder"] },
    ]},
    { n: "CDER Bladder/Bowel Control Outcomes", g: [
      { t: `${N} has no control of either bladder or bowel.`, k: ["cder","nursing"] },
      { t: `${N} has wetting and/or soiling at least once a week during waking hours.`, k: ["cder"] },
      { t: `${N} has wetting and/or soiling at least once a week at night only.`, k: ["cder"] },
      { t: `${N} has wetting and/or soiling no more than once a month.`, k: ["cder"] },
      { t: `${N} has complete control of bladder and bowel.`, k: ["cder"] },
    ]},
    { n: "OASIS Toilet Transfer Outcomes", g: [
      { t: `${N} needs to transfer to/from and on/off toilet independently.`, k: ["oasis"] },
      { t: `${N} needs human assistance to transfer to/from and on/off toilet when grasping/holding is insufficient.`, k: ["oasis"] },
      { t: `${N} is unable to transfer self to/from toilet but can use bedside commode with assistance.`, k: ["oasis"] },
      { t: `${N} is unable to transfer to toilet or commode and needs total dependence for toileting.`, k: ["oasis"] },
    ]},
    { n: "Barthel Toileting Outcomes", g: [
      { t: `${N} is dependent on another person for toileting.`, k: ["barthel"] },
      { t: `${N} needs some help with toileting but can manage some tasks alone.`, k: ["barthel"] },
      { t: `${N} is independent with toileting including clothing and cleaning.`, k: ["barthel"] },
    ]},
    { n: "Incontinence & Dignity", g: [
      { t: `${N} needs timely incontinence care including changing, cleaning, and repositioning to prevent skin breakdown.`, k: ["nanda","nursing","oasis"] },
      { t: `${N} needs adaptive equipment (raised toilet seat, grab bars, commode).`, k: ["barthel","oasis","gmfcs"] },
      { t: `${N} needs preferred or gender-specific toileting assistance for dignity and comfort.`, k: ["pom","hcbs"] },
      { t: `${N} needs the BSP followed during toileting, with de-escalation techniques.`, k: ["bsp"] },
      { t: `${N} needs seizure safety precautions during toileting.`, k: ["nursing","nanda","qolie"] },
    ]},
  ]},
  dressing: { label: "Dressing", icon: "👔", cats: [
    { n: "Prompting & Assistance Levels — Dressing", g: [
      { t: `${N} needs to select and put on weather-appropriate clothing independently, managing all fasteners.`, k: ["katz","barthel","fim","abas","vineland"] },
      { t: `${N} needs environmental setup only — clothing laid out and organized for independent dressing.`, k: ["fim","wadl","sis"] },
      { t: `${N} needs gentle reminders to get dressed at appropriate times.`, k: ["hcbs","pom","icap"] },
      { t: `${N} needs indirect verbal cues to initiate dressing ("What do you need to put on first?").`, k: ["fim","abas"] },
      { t: `${N} needs direct verbal prompting for each step of dressing (undergarments, pants, shirt, socks, shoes, fasteners).`, k: ["fim","oasis","cder","sis"] },
      { t: `${N} needs choice-based prompting ("Would you like to wear the blue shirt or the red shirt?") to support autonomy.`, k: ["pom","bsp","abas"] },
      { t: `${N} needs gestural cues (pointing to clothing items, motioning how to put them on) during dressing.`, k: ["fim","cder","bsp"] },
      { t: `${N} needs a visual schedule or laid-out clothing sequence to complete dressing.`, k: ["bsp","wadl","abas"] },
      { t: `${N} needs full task modeling — watching the dressing sequence demonstrated before performing it.`, k: ["fim","wadl","bsp"] },
      { t: `${N} needs light touch cues to prompt the next dressing step.`, k: ["fim","cder"] },
      { t: `${N} needs partial physical assistance with dressing, including help with lower body garments, fasteners, or shoes.`, k: ["barthel","fim","cder","gmfcs"] },
      { t: `${N} needs hand-over-hand assistance to guide dressing movements (pulling shirts over head, pushing arms through sleeves).`, k: ["fim","wadl","cder","sis"] },
      { t: `${N} needs full physical assistance to be dressed in clean, weather-appropriate clothing each day.`, k: ["katz","oasis","cder","sis"] },
    ]},
    { n: "CDER Dressing Outcomes", g: [
      { t: `${N} does not dress self.`, k: ["cder","sis"] },
      { t: `${N} assists with dressing by performing helpful movements.`, k: ["cder"] },
      { t: `${N} dresses self but needs assistance with zippers, buttons, or fasteners.`, k: ["cder"] },
      { t: `${N} dresses self independently but needs reminders to complete.`, k: ["cder"] },
      { t: `${N} dresses self independently without reminders.`, k: ["cder"] },
    ]},
    { n: "OASIS Upper Body Dressing Outcomes", g: [
      { t: `${N} needs to dress/undress upper body independently.`, k: ["oasis"] },
      { t: `${N} needs to dress/undress upper body with standby assistance from another person.`, k: ["oasis"] },
      { t: `${N} needs someone to help with upper body dressing, doing more than half the effort.`, k: ["oasis"] },
      { t: `${N} is dependent on another person to dress/undress upper body entirely.`, k: ["oasis"] },
    ]},
    { n: "OASIS Lower Body Dressing Outcomes", g: [
      { t: `${N} needs to dress/undress lower body independently.`, k: ["oasis"] },
      { t: `${N} needs to dress/undress lower body with standby assistance.`, k: ["oasis"] },
      { t: `${N} needs someone to help with lower body dressing, doing more than half the effort.`, k: ["oasis"] },
      { t: `${N} is dependent on another person to dress/undress lower body entirely.`, k: ["oasis"] },
    ]},
    { n: "Adaptive & Behavioral", g: [
      { t: `${N} needs adaptive clothing/equipment (velcro, button hooks, dressing stick).`, k: ["fim","oasis","macs","gmfcs"] },
      { t: `${N} needs sensory accommodations (preferred fabrics, tag removal, seamless socks).`, k: ["bsp","pom","vineland"] },
      { t: `${N} needs clothing choices offered to promote autonomy.`, k: ["pom","hcbs"] },
      { t: `${N} needs additional time and a step-by-step approach to reduce distress during dressing.`, k: ["bsp","abas"] },
    ]},
  ]},
  grooming: { label: "Grooming", icon: "✂️", cats: [
    { n: "Prompting & Assistance Levels — Grooming", g: [
      { t: `${N} needs to complete all grooming tasks (hair, shaving, nails, deodorant, oral care) independently.`, k: ["barthel","fim","abas","vineland"] },
      { t: `${N} needs gentle reminders to initiate daily grooming tasks.`, k: ["hcbs","pom","icap"] },
      { t: `${N} needs indirect verbal cues to complete grooming ("Did you brush your teeth yet?").`, k: ["fim","abas"] },
      { t: `${N} needs direct verbal prompting for each grooming step (hair, teeth, face wash, deodorant, shaving).`, k: ["fim","oasis","cder","sis"] },
      { t: `${N} needs gestural cues (pointing to grooming items, motioning brushing movement) during grooming.`, k: ["fim","cder","bsp"] },
      { t: `${N} needs a visual checklist for grooming routine (brush teeth, wash face, comb hair, deodorant).`, k: ["bsp","wadl","abas"] },
      { t: `${N} needs modeling — watching grooming tasks demonstrated before performing them.`, k: ["fim","bsp"] },
      { t: `${N} needs light physical guidance with brief touch cues to guide grooming movements.`, k: ["fim","cder"] },
      { t: `${N} needs partial physical assistance with grooming (hair brushing/styling, shaving, nail care).`, k: ["fim","barthel","cder","macs"] },
      { t: `${N} needs hand-over-hand assistance to complete grooming tasks.`, k: ["fim","wadl","cder","sis"] },
      { t: `${N} needs full physical assistance with all grooming tasks to maintain personal appearance and hygiene.`, k: ["oasis","wadl","cder","sis"] },
    ]},
    { n: "OASIS Grooming Outcomes", g: [
      { t: `${N} needs to groom self independently (oral care, hair care, shaving, applying makeup).`, k: ["oasis"] },
      { t: `${N} needs grooming utensils placed within reach for self-grooming.`, k: ["oasis"] },
      { t: `${N} needs assistance/supervision with grooming tasks.`, k: ["oasis"] },
      { t: `${N} is dependent on another person to perform all grooming tasks.`, k: ["oasis"] },
    ]},
    { n: "Barthel Grooming Outcomes", g: [
      { t: `${N} needs help with grooming tasks.`, k: ["barthel"] },
      { t: `${N} grooms face, hair, teeth, and shaves independently.`, k: ["barthel"] },
    ]},
    { n: "Assessment-Aligned Goals", g: [
      { t: `${N} needs verbal prompting to initiate and complete daily grooming tasks.`, k: ["fim","wadl","cder","sis"] },
      { t: `${N} needs partial physical assistance with grooming (hair brushing, shaving).`, k: ["fim","barthel","cder","macs"] },
      { t: `${N} needs full physical assistance with all grooming tasks.`, k: ["oasis","wadl","cder","sis"] },
      { t: `${N} needs sharp objects (razors, clippers) used only under direct supervision.`, k: ["nursing","nanda"] },
      { t: `${N} needs a desensitization approach to reduce grooming aversion.`, k: ["bsp","abas"] },
    ]},
  ]},
  mobility: { label: "Mobility / Transfers", icon: "🚶", cats: [
    { n: "Prompting & Assistance Levels — Mobility & Transfers", g: [
      { t: `${N} needs to ambulate and transfer independently throughout all daily routines.`, k: ["katz","barthel","fim","abas"] },
      { t: `${N} needs verbal reminders to use mobility device (walker, cane, wheelchair) when ambulating.`, k: ["fim","oasis","hcbs"] },
      { t: `${N} needs verbal prompting and cueing for safe transfer technique (lock brakes, scoot forward, stand, pivot).`, k: ["fim","oasis","cder"] },
      { t: `${N} needs gestural cues (pointing to grab bars, motioning to stand) during transfers.`, k: ["fim","cder","bsp"] },
      { t: `${N} needs supervision only — a support person within arm's reach during ambulation and transfers.`, k: ["fim","oasis","gmfcs","cder"] },
      { t: `${N} needs standby assistance during ambulation — someone ready to steady or catch if needed.`, k: ["fim","oasis","gmfcs"] },
      { t: `${N} needs light physical guidance (hand on elbow, guiding direction) during ambulation.`, k: ["fim","cder"] },
      { t: `${N} needs contact guard assistance during ambulation — hands-on support for balance and safety.`, k: ["fim","oasis","gmfcs"] },
      { t: `${N} needs minimal physical assistance with transfers — support for one aspect (steadying, lifting one leg).`, k: ["barthel","fim","gmfcs"] },
      { t: `${N} needs moderate physical assistance with transfers — support for multiple aspects.`, k: ["barthel","fim","oasis","gmfcs"] },
      { t: `${N} needs a gait belt used during all transfers and ambulation for safety.`, k: ["nursing","fim","gmfcs"] },
      { t: `${N} needs a Hoyer lift for all transfers per protocol.`, k: ["nursing","gmfcs"] },
      { t: `${N} needs two-person assist for transfers as needed for safety.`, k: ["nursing","gmfcs"] },
      { t: `${N} needs full physical assistance with all transfers using proper body mechanics and equipment.`, k: ["fim","oasis","gmfcs","cder","sis"] },
    ]},
    { n: "CDER Walking Outcomes", g: [
      { t: `${N} cannot walk.`, k: ["cder","gmfcs"] },
      { t: `${N} walks with support (walker, cane, staff assistance).`, k: ["cder","gmfcs"] },
      { t: `${N} walks alone at least 10 feet but is unsteady.`, k: ["cder","gmfcs"] },
      { t: `${N} walks alone at least 20 feet but is unsteady.`, k: ["cder"] },
      { t: `${N} walks alone at least 20 feet with good balance.`, k: ["cder"] },
    ]},
    { n: "CDER Wheelchair Outcomes", g: [
      { t: `${N} sits in wheelchair but cannot move it.`, k: ["cder","gmfcs"] },
      { t: `${N} uses wheelchair but needs assistance.`, k: ["cder","gmfcs"] },
      { t: `${N} uses wheelchair independently but has difficulty steering.`, k: ["cder","gmfcs"] },
      { t: `${N} uses wheelchair independently and smoothly in some situations.`, k: ["cder","gmfcs"] },
      { t: `${N} uses wheelchair independently and smoothly in nearly all situations.`, k: ["cder","gmfcs"] },
    ]},
    { n: "OASIS Ambulation Outcomes", g: [
      { t: `${N} needs to ambulate and turn around independently on all surfaces.`, k: ["oasis"] },
      { t: `${N} needs a device (cane, walker) for safe ambulation but can walk alone on level surfaces.`, k: ["oasis","gmfcs"] },
      { t: `${N} needs supervision or intermittent assistance during ambulation.`, k: ["oasis"] },
      { t: `${N} needs continuous assistance from another person at all times to ambulate safely.`, k: ["oasis","gmfcs"] },
      { t: `${N} uses wheelchair for mobility and needs assistance navigating surfaces.`, k: ["oasis","gmfcs"] },
      { t: `${N} is bedbound and needs to be repositioned by another person.`, k: ["oasis","gmfcs","nursing"] },
    ]},
    { n: "OASIS Transferring Outcomes", g: [
      { t: `${N} needs to transfer independently from bed to chair.`, k: ["oasis"] },
      { t: `${N} needs to transfer with minimal assistance or with assistive device.`, k: ["oasis","gmfcs"] },
      { t: `${N} is unable to transfer without maximal assistance or is lifted mechanically.`, k: ["oasis","gmfcs"] },
    ]},
    { n: "GMFCS Level Outcomes", g: [
      { t: `${N} is classified at GMFCS Level I — walks without limitations, may have limitations in advanced motor skills.`, k: ["gmfcs"] },
      { t: `${N} is classified at GMFCS Level II — walks with limitations, difficulty on uneven surfaces and inclines.`, k: ["gmfcs"] },
      { t: `${N} is classified at GMFCS Level III — walks using hand-held mobility device, may use wheeled mobility for longer distances.`, k: ["gmfcs"] },
      { t: `${N} is classified at GMFCS Level IV — self-mobility limited, may use powered wheelchair, transported in manual wheelchair.`, k: ["gmfcs"] },
      { t: `${N} is classified at GMFCS Level V — severe limitations in head/trunk control, requires extensive assisted technology and physical assistance.`, k: ["gmfcs"] },
    ]},
    { n: "Seizure & Fall Safety", g: [
      { t: `${N} needs to be guided safely to ground during a seizure, head protected, seizure timed, protocol followed.`, k: ["nursing","nanda","qolie"] },
      { t: `${N} needs sharp edges padded/removed to minimize seizure/fall injury risk.`, k: ["nursing","nanda","qolie"] },
      { t: `${N} needs fall prevention interventions throughout all mobility activities.`, k: ["nanda","nursing","oasis","gmfcs"] },
      { t: `${N} needs ROM exercises and positioning per therapy protocol to prevent contractures.`, k: ["gmfcs","nursing"] },
    ]},
  ]},
  medication: { label: "Medication Support", icon: "💊", cats: [
    { n: "CDER Medication Outcomes", g: [
      { t: `${N} requires assistance to take medication.`, k: ["cder","nursing"] },
      { t: `${N} takes medication with supervision.`, k: ["cder"] },
      { t: `${N} takes medication when reminded.`, k: ["cder"] },
      { t: `${N} usually takes medication without reminders.`, k: ["cder"] },
      { t: `${N} always takes medication without reminders.`, k: ["cder"] },
    ]},
    { n: "OASIS Medication Outcomes", g: [
      { t: `${N} needs to manage oral medications independently.`, k: ["oasis","lawton"] },
      { t: `${N} needs to take oral medications reliably if pre-set by another person.`, k: ["oasis"] },
      { t: `${N} is unable to take oral medications unless administered by another person.`, k: ["oasis","nursing"] },
    ]},
    { n: "Seizure & Rescue Medication", g: [
      { t: `${N} needs anti-seizure medications on a strict schedule. Missed doses must be reported immediately.`, k: ["nursing","nanda","qolie","cder"] },
      { t: `${N} needs rescue medications (Diastat, EpiPen, rescue inhaler) accessible at all times with trained individuals.`, k: ["nursing","nanda","qolie"] },
      { t: `${N} needs a seizure activity log documenting onset, duration, type, and post-ictal presentation.`, k: ["nursing","qolie","cder"] },
      { t: `${N} needs a medication refusal protocol followed with approved strategies and all refusals documented.`, k: ["nursing","bsp"] },
    ]},
    { n: "ABAS-3 Health & Safety Skill Area", g: [
      { t: `${N} needs support to identify medications and understand their purpose.`, k: ["abas"] },
      { t: `${N} needs support to follow prescribed medication schedules without prompting.`, k: ["abas","lawton"] },
      { t: `${N} needs support to recognize and communicate symptoms of illness.`, k: ["abas","vineland"] },
      { t: `${N} needs support to follow safety rules and respond appropriately to emergencies.`, k: ["abas"] },
    ]},
  ]},
  safety: { label: "Safety Awareness", icon: "🛡️", cats: [
    { n: "CDER Safety Awareness Outcomes", g: [
      { t: `${N} requires constant supervision during waking hours to prevent injury/harm in all settings.`, k: ["cder","sis","hcbs"] },
      { t: `${N} requires someone nearby during waking hours to prevent injury/harm in all settings.`, k: ["cder","sis"] },
      { t: `${N} requires constant supervision to prevent injury/harm in unfamiliar settings only.`, k: ["cder"] },
      { t: `${N} requires someone nearby to avoid injury/harm in unfamiliar settings only.`, k: ["cder"] },
      { t: `${N} does not require supervision to prevent injury/harm.`, k: ["cder"] },
    ]},
    { n: "QOLIE Seizure Safety Outcomes", g: [
      { t: `${N} needs seizure worry addressed — support reducing anxiety and fear related to seizure occurrence.`, k: ["qolie"] },
      { t: `${N} needs medication effects monitored — tracking physical and mental side effects of anti-seizure medication.`, k: ["qolie","nursing"] },
      { t: `${N} needs energy/fatigue levels monitored and addressed, as fatigue may increase seizure risk.`, k: ["qolie"] },
      { t: `${N} needs cognitive function supported — addressing memory, concentration, and attention difficulties related to epilepsy.`, k: ["qolie"] },
      { t: `${N} needs social function supported — addressing limitations in work, driving, and social activities caused by epilepsy.`, k: ["qolie","hcbs"] },
      { t: `${N} needs overall quality of life in epilepsy assessed regularly using a standardized tool.`, k: ["qolie"] },
    ]},
    { n: "Nursing Safety Diagnosis Outcomes", g: [
      { t: `${N} needs to remain free from falls during the reporting period.`, k: ["nanda","nursing"] },
      { t: `${N} needs to remain free from any form of self-harm.`, k: ["nanda","nursing"] },
      { t: `${N} needs to remain free from skin breakdown or impairment in skin integrity.`, k: ["nanda","nursing","oasis"] },
      { t: `${N} needs to demonstrate measures and behaviors to prevent falls.`, k: ["nanda","nursing"] },
      { t: `${N} needs elopement precautions followed including door/exit monitoring and close proximity.`, k: ["bsp","nursing","cder"] },
    ]},
  ]},
  communication: { label: "Communication", icon: "💬", cats: [
    { n: "CDER Verbal Communication Outcomes", g: [
      { t: `${N} does not use words to communicate.`, k: ["cder","cfcs"] },
      { t: `${N} uses words to communicate but speech is not easily understood by strangers.`, k: ["cder","cfcs"] },
      { t: `${N} uses simple statements of one or two words.`, k: ["cder","cfcs"] },
      { t: `${N} uses sentences of three words or more with limited vocabulary of 30 words or less.`, k: ["cder","cfcs"] },
      { t: `${N} uses sentences of three words or more with vocabulary of more than 30 words.`, k: ["cder","cfcs"] },
    ]},
    { n: "CDER Nonverbal Communication Outcomes", g: [
      { t: `${N} does not use signals, gestures, or signs to communicate.`, k: ["cder","cfcs"] },
      { t: `${N} communicates through movement, smiling, or making eye contact.`, k: ["cder","cfcs"] },
      { t: `${N} communicates through simple gestures such as pointing, shaking head, or leading by the hand.`, k: ["cder","cfcs"] },
      { t: `${N} uses signs/gestures and facial expressions to communicate but does not understand those of others.`, k: ["cder","cfcs"] },
      { t: `${N} uses and understands signs/gestures and facial expressions in communication.`, k: ["cder","cfcs"] },
    ]},
    { n: "CFCS Level Outcomes", g: [
      { t: `${N} is classified at CFCS Level I — effective sender and receiver with unfamiliar and familiar partners.`, k: ["cfcs"] },
      { t: `${N} is classified at CFCS Level II — effective but slower-paced sender and/or receiver with unfamiliar and familiar partners.`, k: ["cfcs"] },
      { t: `${N} is classified at CFCS Level III — effective sender and receiver with familiar partners only.`, k: ["cfcs"] },
      { t: `${N} is classified at CFCS Level IV — inconsistent sender and/or receiver with familiar partners.`, k: ["cfcs"] },
      { t: `${N} is classified at CFCS Level V — seldom effective sender and receiver even with familiar partners.`, k: ["cfcs"] },
    ]},
    { n: "Vineland-3 Communication Outcomes", g: [
      { t: `${N} needs support to follow instructions containing two or more sequential steps.`, k: ["vineland"] },
      { t: `${N} needs support to express wants and needs using words, phrases, or sentences.`, k: ["vineland","cfcs"] },
      { t: `${N} needs support to read and comprehend common signs and written information.`, k: ["vineland","abas"] },
    ]},
    { n: "AAC & Device Goals", g: [
      { t: `${N} needs AAC device accessible and used during all care tasks.`, k: ["pom","hcbs","cfcs","vineland"] },
      { t: `${N} needs PECS used for communication during care tasks.`, k: ["bsp","hcbs","cfcs"] },
      { t: `${N} needs sign language used for communication during all tasks.`, k: ["pom","hcbs","cfcs"] },
      { t: `${N} needs simple, concrete language and additional processing time during all tasks.`, k: ["bsp","hcbs","cfcs","vineland"] },
      { t: `${N} needs all care actions verbally narrated before and during each task.`, k: ["bsp","pom"] },
    ]},
  ]},
  social: { label: "Social Interaction & Community", icon: "🤝", cats: [
    { n: "CDER Social Interaction Outcomes", g: [
      { t: `${N} does not interact with others.`, k: ["cder"] },
      { t: `${N} responds to interaction initiated by others but does not initiate interaction.`, k: ["cder","vineland"] },
      { t: `${N} initiates and sustains interaction with familiar people.`, k: ["cder","vineland"] },
      { t: `${N} initiates and sustains interaction with familiar and unfamiliar people.`, k: ["cder","vineland"] },
      { t: `${N} interacts appropriately in a variety of social situations.`, k: ["cder","vineland","abas"] },
    ]},
    { n: "Vineland-3 Socialization Outcomes", g: [
      { t: `${N} needs support to demonstrate interest in others and respond to social cues.`, k: ["vineland"] },
      { t: `${N} needs support to follow rules in games and group activities.`, k: ["vineland","abas"] },
      { t: `${N} needs support to demonstrate responsibility, sensitivity to others, and self-control.`, k: ["vineland"] },
    ]},
    { n: "SIS Community Living Outcomes", g: [
      { t: `${N} needs support to move about in the community and use public transportation.`, k: ["sis","hcbs"] },
      { t: `${N} needs support to participate in recreation/leisure activities in the community.`, k: ["sis","hcbs","pom"] },
      { t: `${N} needs support to use public services in the community.`, k: ["sis","hcbs"] },
      { t: `${N} needs support to go shopping and purchase goods.`, k: ["sis","hcbs","lawton"] },
      { t: `${N} needs support to interact with community members.`, k: ["sis","hcbs","pom"] },
      { t: `${N} needs support to access public buildings and settings.`, k: ["sis","hcbs","gmfcs"] },
    ]},
    { n: "ABAS-3 Social & Community Use Outcomes", g: [
      { t: `${N} needs support to show consideration for others and cooperate with peers.`, k: ["abas","vineland"] },
      { t: `${N} needs support to follow social rules and respond to social cues appropriately.`, k: ["abas"] },
      { t: `${N} needs support to travel to familiar locations within the community.`, k: ["abas","lawton"] },
      { t: `${N} needs support to demonstrate knowledge of community resources and how to access them.`, k: ["abas","lawton"] },
    ]},
    { n: "Community Safety & Behavioral", g: [
      { t: `${N} needs 1:1 staffing during all community outings.`, k: ["hcbs","sis","cder"] },
      { t: `${N} needs a seizure emergency kit and rescue medications carried during all outings.`, k: ["nursing","qolie"] },
      { t: `${N} needs sensory-friendly outing planning, avoiding crowds and overstimulating environments.`, k: ["bsp","pom","vineland"] },
      { t: `${N} needs an emergency return plan if becoming overwhelmed.`, k: ["bsp","hcbs"] },
    ]},
  ]},
  hand_function: { label: "Hand Function & Fine Motor", icon: "🤲", cats: [
    { n: "CDER Using Hands Outcomes", g: [
      { t: `${N} does not use either hand.`, k: ["cder","macs","gmfcs"] },
      { t: `${N} grasps objects with one hand.`, k: ["cder","macs"] },
      { t: `${N} grasps objects with both hands.`, k: ["cder","macs"] },
      { t: `${N} uses fingers of one hand to manipulate objects.`, k: ["cder","macs"] },
      { t: `${N} uses fingers of both hands to manipulate objects.`, k: ["cder","macs"] },
    ]},
    { n: "MACS Level Outcomes", g: [
      { t: `${N} is classified at MACS Level I — handles objects easily, at most limitations in ease of performance.`, k: ["macs"] },
      { t: `${N} is classified at MACS Level II — handles most objects but with reduced quality or speed.`, k: ["macs"] },
      { t: `${N} is classified at MACS Level III — handles objects with difficulty, needs help to prepare or modify activities.`, k: ["macs"] },
      { t: `${N} is classified at MACS Level IV — handles limited selection of easily managed objects in adapted situations.`, k: ["macs"] },
      { t: `${N} is classified at MACS Level V — does not handle objects, has severely limited ability to perform even simple actions.`, k: ["macs"] },
    ]},
    { n: "Vineland-3 Fine Motor Outcomes", g: [
      { t: `${N} needs support to manipulate small objects with fingers.`, k: ["vineland","macs"] },
      { t: `${N} needs support to use writing/drawing instruments functionally.`, k: ["vineland"] },
      { t: `${N} needs support to use scissors and tools requiring bilateral coordination.`, k: ["vineland","macs"] },
    ]},
  ]},
  focus_behavior: { label: "Attention, Behavior & Self-Direction", icon: "🧠", cats: [
    { n: "CDER Focusing Outcomes", g: [
      { t: `${N} focuses on a preferred task or activity for less than 1 minute.`, k: ["cder"] },
      { t: `${N} focuses on a preferred task or activity for 1-5 minutes.`, k: ["cder"] },
      { t: `${N} focuses on a preferred task or activity for 5-15 minutes.`, k: ["cder"] },
      { t: `${N} focuses on a preferred task or activity for 15-30 minutes.`, k: ["cder"] },
      { t: `${N} focuses on a preferred task or activity for more than 30 minutes.`, k: ["cder"] },
    ]},
    { n: "ABAS-3 Self-Direction Outcomes", g: [
      { t: `${N} needs support to make choices and decisions independently.`, k: ["abas","pom"] },
      { t: `${N} needs support to follow a schedule and complete tasks within expected time frames.`, k: ["abas"] },
      { t: `${N} needs support to demonstrate self-control and follow directions without constant prompting.`, k: ["abas","bsp"] },
      { t: `${N} needs support to maintain attention and on-task behavior during structured activities.`, k: ["abas","bsp"] },
    ]},
    { n: "ABAS-3 Leisure Outcomes", g: [
      { t: `${N} needs support to engage in recreational activities independently or with peers.`, k: ["abas","pom"] },
      { t: `${N} needs support to follow rules during games and group leisure activities.`, k: ["abas","vineland"] },
      { t: `${N} needs support to plan and participate in preferred leisure activities.`, k: ["abas","pom","hcbs"] },
    ]},
  ]},
  household: { label: "Household & Home Living", icon: "🏠", cats: [
    { n: "SIS Home Living Outcomes", g: [
      { t: `${N} needs support to use the toilet.`, k: ["sis"] },
      { t: `${N} needs support to take care of clothes, including laundering.`, k: ["sis","lawton"] },
      { t: `${N} needs support to prepare food.`, k: ["sis","lawton"] },
      { t: `${N} needs support to eat food.`, k: ["sis"] },
      { t: `${N} needs support to take care of and clean the living area.`, k: ["sis","lawton"] },
      { t: `${N} needs support to dress self.`, k: ["sis"] },
      { t: `${N} needs support to bathe and take care of personal hygiene.`, k: ["sis"] },
      { t: `${N} needs support to operate home appliances.`, k: ["sis","lawton"] },
    ]},
    { n: "Vineland-3 Domestic Outcomes", g: [
      { t: `${N} needs support to perform household chores (cleaning, tidying).`, k: ["vineland","lawton"] },
      { t: `${N} needs support to prepare simple meals and snacks.`, k: ["vineland","lawton"] },
      { t: `${N} needs support to care for personal belongings and keep living space organized.`, k: ["vineland"] },
    ]},
    { n: "Lawton IADL Outcomes", g: [
      { t: `${N} needs support to use the telephone/communication device.`, k: ["lawton","abas"] },
      { t: `${N} needs support with shopping for groceries and personal items.`, k: ["lawton","abas"] },
      { t: `${N} needs support with food preparation.`, k: ["lawton","abas"] },
      { t: `${N} needs support with housekeeping tasks.`, k: ["lawton"] },
      { t: `${N} needs support with laundry.`, k: ["lawton"] },
      { t: `${N} needs support with transportation and navigating the community.`, k: ["lawton","abas","sis"] },
      { t: `${N} needs support with managing medications independently.`, k: ["lawton","oasis"] },
      { t: `${N} needs support with managing finances and money.`, k: ["lawton","abas"] },
    ]},
    { n: "Safety", g: [
      { t: `${N} needs safety with sharp/hot items during household tasks.`, k: ["nursing","hcbs"] },
      { t: `${N} needs chemical/cleaning product safety — products stored securely.`, k: ["nursing","hcbs"] },
      { t: `${N} needs seizure precautions during household tasks (hot surfaces, sharp items, water).`, k: ["nursing","nanda","qolie"] },
      { t: `${N} needs PICA precautions during household tasks.`, k: ["bsp","nursing","cder"] },
    ]},
  ]},
  sleep: { label: "Sleep / Bedtime", icon: "🌙", cats: [
    { n: "Routine & Assistance", g: [
      { t: `${N} needs a consistent bedtime routine each night for restful, safe sleep.`, k: ["nanda","hcbs","abas"] },
      { t: `${N} needs assistance changing into sleepwear at night and clothing in the morning.`, k: ["oasis","hcbs","cder"] },
      { t: `${N} needs nighttime incontinence care with minimal sleep disruption.`, k: ["nursing","nanda"] },
    ]},
    { n: "Safety & Monitoring", g: [
      { t: `${N} needs nighttime safety checks at least every [frequency].`, k: ["nursing","hcbs"] },
      { t: `${N} needs nocturnal seizure precautions (monitor, low bed, padding). Protocol followed if nighttime activity occurs.`, k: ["nursing","nanda","qolie"] },
      { t: `${N} needs bed rails and/or fall mats per safety protocol.`, k: ["nursing","gmfcs"] },
      { t: `${N} needs nighttime repositioning per schedule to prevent pressure injuries.`, k: ["nanda","nursing","gmfcs"] },
      { t: `${N} needs nighttime elopement precautions (door alarms, regular checks).`, k: ["bsp","nursing"] },
      { t: `${N} needs sensory accommodations (sound machine, weighted blanket, lighting) for sleep.`, k: ["bsp","pom","vineland"] },
    ]},
  ]},
  skin_care: { label: "Skin Care", icon: "🧴", cats: [
    { n: "Monitoring & Prevention", g: [
      { t: `${N} needs regular skin checks during personal care with changes documented and reported.`, k: ["nanda","nursing","oasis","cder"] },
      { t: `${N} needs pressure injury prevention including repositioning and specialty cushions.`, k: ["nanda","nursing","gmfcs"] },
      { t: `${N} needs moisture barrier cream applied as needed.`, k: ["nursing"] },
      { t: `${N} needs bruise monitoring, particularly following seizure activity or falls.`, k: ["nursing","nanda","qolie"] },
      { t: `${N} needs prescribed creams, lotions, and skin treatments applied as directed.`, k: ["nursing"] },
      { t: `${N} needs wound care provided per nursing protocol.`, k: ["nursing"] },
    ]},
  ]},
};

const TA = Object.entries(GB).map(([id, t]) => ({ id, ...t }));
const totalGoals = Object.values(GB).reduce((s, t) => s + t.cats.reduce((s2, c) => s2 + c.g.length, 0), 0);

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={async () => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {} }}
      className={`shrink-0 px-2.5 py-1 rounded text-xs font-semibold transition-all ${copied ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500 hover:bg-indigo-100 hover:text-indigo-700"}`}>
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function Tag({ id }) {
  const fw = FW[id];
  if (!fw) return null;
  return <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold text-white mr-1 mb-1" style={{ backgroundColor: fw.c }}>{fw.l}</span>;
}

function Card({ goal, sel, onTog }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${sel ? "border-emerald-400 bg-emerald-50" : "border-gray-100 bg-white hover:border-gray-200"}`}>
      <input type="checkbox" checked={sel} onChange={onTog} className="mt-1 h-4 w-4 rounded border-gray-300 accent-emerald-600 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 leading-relaxed mb-1.5">{goal.t}</p>
        <div className="flex flex-wrap">{goal.k.map(t => <Tag key={t} id={t} />)}</div>
      </div>
      <CopyBtn text={goal.t} />
    </div>
  );
}

function RefLib({ show }) {
  if (!show) return null;
  return (
    <div className="mb-4 bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
      <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto">
        {REFS.map(r => (
          <div key={r.cat}>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{r.cat}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
              {r.links.map(([label, url], i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline truncate block py-0.5">↗ {label}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function doExport(sel) {
  let html = "";
  Object.entries(GB).forEach(([id, task]) => {
    const tg = [];
    task.cats.forEach(c => c.g.forEach(g => { if (sel.has(g.t)) tg.push(g.t); }));
    if (!tg.length) return;
    html += `<h2 style="font-family:Arial;color:#1a365d;font-size:14pt;border-bottom:1px solid #a0aec0;padding-bottom:4px;">${task.icon} ${task.label}</h2>`;
    html += `<ul style="font-family:Arial;font-size:11pt;line-height:1.8;">`;
    tg.forEach(g => html += `<li style="margin-bottom:8px;">${g}</li>`);
    html += `</ul><br/>`;
  });
  if (!html) { alert("Select at least one goal."); return; }
  const full = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>PCP Goals</title><style>@page{size:8.5in 11in;margin:1in;}body{font-family:Arial;font-size:11pt;line-height:1.5;color:#1a202c;}h1{font-size:18pt;color:#1a365d;text-align:center;border-bottom:3px solid #2b6cb0;padding-bottom:8px;}</style></head><body><h1>Person-Centered Plan: Selected Outcomes</h1><p style="text-align:center;font-size:10pt;color:#718096;">Generated ${new Date().toLocaleDateString()}</p><br/>${html}</body></html>`;
  const b = new Blob([full], { type: "application/msword" });
  const u = URL.createObjectURL(b);
  const a = document.createElement("a"); a.href = u; a.download = "PCP_Goals.doc";
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(u);
}

export default function App() {
  const [sel, setSel] = useState(new Set());
  const [open, setOpen] = useState(new Set());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [showRef, setShowRef] = useState(false);

  const togGoal = useCallback(t => { setSel(p => { const n = new Set(p); n.has(t) ? n.delete(t) : n.add(t); return n; }); }, []);
  const togTask = useCallback(id => { setOpen(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">PCP Goal Bank</h1>
          <p className="text-slate-500 text-sm">{totalGoals} outcomes • {Object.keys(GB).length} domains • {Object.keys(FW).length} frameworks • Click to copy or export</p>
        </div>

        <div className="mb-4">
          <button onClick={() => setShowRef(!showRef)} className="w-full flex items-center justify-between px-5 py-3 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-lg">📚</span>
              <span className="font-bold text-amber-900">Assessment Reference Library</span>
              <span className="text-xs text-amber-600">({REFS.reduce((s, c) => s + c.links.length, 0)} links)</span>
            </div>
            <svg className={`w-5 h-5 text-amber-500 transition-transform ${showRef ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          <RefLib show={showRef} />
        </div>

        <div className="mb-3 flex flex-col sm:flex-row gap-2">
          <input type="text" placeholder="Search goals..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-400 bg-white" />
          <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white">
            <option value="">All Frameworks</option>
            {Object.entries(FW).map(([id, fw]) => <option key={id} value={id}>{fw.l}</option>)}
          </select>
        </div>

        <div className="mb-5 flex flex-wrap gap-1">
          {Object.entries(FW).map(([id, fw]) => (
            <button key={id} onClick={() => setFilter(filter === id ? "" : id)}
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold text-white transition-opacity ${filter && filter !== id ? "opacity-25" : ""}`}
              style={{ backgroundColor: fw.c }}>{fw.l}</button>
          ))}
        </div>

        {TA.map(task => {
          const isOpen = open.has(task.id);
          const s = search.toLowerCase();
          const filt = task.cats.map(c => ({ ...c, g: c.g.filter(g => (!s || g.t.toLowerCase().includes(s)) && (!filter || g.k.includes(filter))) })).filter(c => c.g.length > 0);
          const vis = filt.reduce((a, c) => a + c.g.length, 0);
          const selCt = task.cats.reduce((a, c) => a + c.g.filter(g => sel.has(g.t)).length, 0);
          if (vis === 0 && (search || filter)) return null;
          return (
            <div key={task.id} className="mb-3 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <button onClick={() => togTask(task.id)} className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{task.icon}</span>
                  <span className="font-semibold text-gray-800">{task.label}</span>
                  <span className="text-xs text-gray-400">{vis}</span>
                  {selCt > 0 && <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">{selCt}</span>}
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isOpen && <div className="px-4 pb-4 space-y-4">
                {filt.map(c => (
                  <div key={c.n}>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2">{c.n}</h3>
                    <div className="space-y-2">{c.g.map((g, i) => <Card key={i} goal={g} sel={sel.has(g.t)} onTog={() => togGoal(g.t)} />)}</div>
                  </div>
                ))}
              </div>}
            </div>
          );
        })}

        <div className="sticky bottom-4 bg-white rounded-xl border border-gray-200 shadow-lg p-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-500"><span className="font-semibold text-slate-700">{sel.size}</span> / {totalGoals} selected</div>
            <button onClick={() => { const all = new Set(); Object.values(GB).forEach(t => t.cats.forEach(c => c.g.forEach(g => all.add(g.t)))); setSel(all); }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600">Select All</button>
            {sel.size > 0 && <button onClick={() => setSel(new Set())}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-300 text-gray-700 hover:bg-gray-400">Deselect All</button>}
          </div>
          <div className="flex gap-2">
            <button onClick={async () => { try { await navigator.clipboard.writeText([...sel].join("\n\n")); } catch {} }} disabled={!sel.size}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${sel.size ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>Copy All</button>
            <button onClick={() => doExport(sel)} disabled={!sel.size}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${sel.size ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>Export to Word</button>
          </div>
        </div>
      </div>
    </div>
  );
}
