'use client';

import {
  useState,
  useMemo,
} from 'react';
import {
  Shield,
  Layers,
  Sliders,
  HelpCircle,
  Sparkles,
  Info,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Activity,
  Users,
  Heart,
  Plus,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  FileText
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface Policy {
  id: string;
  name: string;
  issuer: string;
  csr: string;
  csr3yr: string;
  icr: string;
  solvency: string;
  complaints: string;
  hospitals: string;
  premiumBase: { individual: number; couple: number; family: number; senior: number };
  pros: string[];
  cons: string[];
  features: Record<string, string>;
  sublimits: {
    cataract: { status: 'none' | 'partial' | 'capped'; text: string };
    joint_replacement: { status: 'none' | 'partial' | 'capped'; text: string };
    robotic_surgery: { status: 'none' | 'partial' | 'capped'; text: string };
    daycare_domiciliary: { status: 'none' | 'partial' | 'capped'; text: string };
    source: string;
  };
  score?: number;
  reasons?: string[];
}

type SheetFeature = { key: string; label: string };
type Profile = keyof Policy['premiumBase'];

// --- DATA: IRDAI NL-37 / NL-45 / NL-26, Q4 FY2024-25 ---
const POLICIES: Policy[] = [
  {
    id: "hdfc-optima",
    name: "HDFC ERGO Optima Secure",
    issuer: "HDFC ERGO General",
    csr: "97.45%",
    csr3yr: "96.71%",
    icr: "81.62%",
    solvency: "1.99x",
    complaints: "9.28",
    hospitals: "15,000+",
    premiumBase: {
      individual: 13459,
      couple: 21128,
      family: 26017,
      senior: 75608
    },
    pros: ["Double cover from Day 1", "Consumables covered by default", "No room rent capping"],
    cons: ["Slightly higher premium pricing", "Maternity needs separate Parenthood rider"],
    features: {
      sum_insured: "₹10 Lakhs (Can scale up to 50L)",
      waiting_period: "Pre-existing diseases: 3 years. Specific illnesses: 2 years. Initial wait: 30 days.",
      room_rent: "No restriction / sub-limits. Up to Single Private AC Room with no proportionate deductions.",
      pre_hospitalization: "60 days",
      post_hospitalization: "180 days",
      hospital_cash: "Available via optional rider",
      ambulance: "Fully covered up to actual bills (Air ambulance up to ₹5 Lakhs)",
      organ_donor: "Covered up to Sum Insured",
      copay: "No Co-payment (0% out-of-pocket share)",
      day_care: "All day care procedures covered",
      domiciliary: "Covered up to Sum Insured",
      ayush: "AYUSH treatments covered up to Sum Insured",
      maternity: "None (Not covered under core retail plan, Parenthood rider available)",
      newborn: "None",
      renewal: "Secure Benefit: 2X cover from Day 1. Plus Benefit: 50% increase in Yr 1, 100% in Yr 2 regardless of claims. Restore Benefit: 100% instant restoration.",
      loading: "No loading charges",
      health_checkup: "Yes (Complimentary every renewal year)",
      claim_record: "97.45% (FY2024-25) | 3yr avg: 96.71% | Source: IRDAI NL-37",
      opd_cover: "Not included in core plan. Available via the Optima Wellbeing add-on (covers consultations, diagnostics, pharmacy). Additional premium required. Source: Ditto (Jun 2026), Beshak (Jul 2025)"
    },
    sublimits: {
      cataract: { status: 'none', text: 'No cap — covered up to sum insured' },
      joint_replacement: { status: 'none', text: 'No cap — covered up to sum insured' },
      robotic_surgery: { status: 'none', text: 'No cap — covered up to sum insured' },
      daycare_domiciliary: { status: 'none', text: 'All daycare covered. Domiciliary up to sum insured' },
      source: 'Official policy wording PDF (UIN: HDFHLIP25011V052425)'
    }
  },
  {
    id: "niva-reassure",
    name: "Niva Bupa ReAssure 2.0 (Platinum+)",
    issuer: "Niva Bupa Standalone",
    csr: "92.39%",
    csr3yr: "91.62%",
    icr: "58.10%",
    solvency: "3.03x",
    complaints: "42.85",
    hospitals: "10,000+",
    premiumBase: {
      individual: 11271,
      couple: 19176,
      family: 25026,
      senior: 68239
    },
    pros: ["'Lock the Clock' premium freeze", "ReAssure Forever infinite restoration", "Booster+ rollover carryforward"],
    cons: ["Higher complaint rate", "Room category choice locked at purchase"],
    features: {
      sum_insured: "₹10 Lakhs",
      waiting_period: "Pre-existing diseases: 3 years. Specific illnesses: 2 years. Initial wait: 30 days.",
      room_rent: "No restriction / sub-limits. Any room category covered up to full Sum Insured.",
      pre_hospitalization: "60 days",
      post_hospitalization: "180 days",
      hospital_cash: "Built-in if choosing shared accommodation, or via rider",
      ambulance: "Fully covered up to actual bills (Air ambulance up to Sum Insured)",
      organ_donor: "Covered up to Sum Insured",
      copay: "No Co-payment (0% out-of-pocket share)",
      day_care: "All day care procedures covered",
      domiciliary: "Covered up to Sum Insured",
      ayush: "AYUSH treatments covered up to Sum Insured",
      maternity: "None (Not covered under the core retail plan, covered in premium variants)",
      newborn: "None",
      renewal: "Lock the Clock: Fixed premium based on entry age until first claim. ReAssure Forever: Unlimited infinite refills after 1st claim balance usage.",
      loading: "No loading charges",
      health_checkup: "Yes (Available annually from Year 1)",
      claim_record: "92.39% (FY2024-25) | 3yr avg: 91.62% | Source: IRDAI NL-37",
      opd_cover: "Not included in core plan. The Acute Care add-on provides unlimited tele-consultations via Apollo24X7 (GP, specialist, super-specialist). Additional premium required. Source: Ditto review (Jun 2026)"
    },
    sublimits: {
      cataract: { status: 'none', text: 'No cap — covered up to sum insured' },
      joint_replacement: { status: 'none', text: 'No cap — covered up to sum insured' },
      robotic_surgery: { status: 'partial', text: '₹1L cap per claim. Exceptions: cardiac, total radical prostatectomy, partial nephrectomy, malignancies' },
      daycare_domiciliary: { status: 'none', text: 'All daycare covered. Domiciliary up to sum insured' },
      source: 'Official policy wording PDF (UIN: NBHHLIP23169V012223, nivabupa.com)'
    }
  },
  {
    id: "care-supreme",
    name: "Care Health Care Supreme",
    issuer: "Care Health Standalone",
    csr: "92.77%",
    csr3yr: "92.50%",
    icr: "65.00%",
    solvency: "1.68x",
    complaints: "42.00",
    hospitals: "11,400+",
    premiumBase: {
      individual: 15111,
      couple: 21528,
      family: 27161,
      senior: 78923
    },
    pros: ["Up to 500% cumulative bonus via rider", "Immediate restoration upon partial usage", "Wellness program offers up to 30% discount"],
    cons: ["Slightly lower claim settlement ratio", "High complaints per 10k claims"],
    features: {
      sum_insured: "₹10 Lakhs",
      waiting_period: "Pre-existing diseases: 3 years. Specific illnesses: 2 years. Initial wait: 30 days.",
      room_rent: "No restriction / sub-limits (All room categories covered, including suites).",
      pre_hospitalization: "60 days",
      post_hospitalization: "180 days",
      hospital_cash: "Available via optional rider",
      ambulance: "Fully covered up to actual bills (Air ambulance available as add-on)",
      organ_donor: "Covered up to Sum Insured",
      copay: "No Co-payment (0% out-of-pocket share)",
      day_care: "All day care procedures covered",
      domiciliary: "Covered up to Sum Insured",
      ayush: "AYUSH treatments covered up to Sum Insured",
      maternity: "None (Not covered under core retail plan)",
      newborn: "None",
      renewal: "Cumulative Bonus Super: 100% increase per year up to 500% (via rider). Unlimited Recharge: Unlimited automatic restoration for subsequent claims.",
      loading: "No loading charges",
      health_checkup: "Yes (Available via wellness framework / add-on)",
      claim_record: "92.77% (FY2024-25) | 3yr avg: 92.50% | Source: IRDAI NL-37",
      opd_cover: "Not included in core plan. Care OPD add-on covers up to 4 GP consultations + 4 specialist consultations per year (₹500 cap per consult, from list of 14 specified specialists). Additional premium required. Source: careinsurance.com (Apr 2026), official brochure PDF"
    },
    sublimits: {
      cataract: { status: 'none', text: 'No cap — covered up to sum insured' },
      joint_replacement: { status: 'none', text: 'No cap — covered up to sum insured' },
      robotic_surgery: { status: 'none', text: 'No cap — covered up to sum insured' },
      daycare_domiciliary: { status: 'none', text: 'All daycare covered. Domiciliary up to sum insured' },
      source: 'careinsurance.com official product page + brochure PDF (Apr 2026)'
    }
  },
  {
    id: "tata-medicare",
    name: "TATA AIG MediCare Premier",
    issuer: "Tata AIG General",
    csr: "94.14%",
    csr3yr: "93.80%",
    icr: "77.50%",
    solvency: "2.03x",
    complaints: "10.65",
    hospitals: "11,000+",
    premiumBase: {
      individual: 14816,
      couple: 26810,
      family: 34828,
      senior: 69351
    },
    pros: ["Short 24-month pre-existing disease wait", "Inbuilt global cover option", "High-end outpatient diagnostic cover"],
    cons: ["Post-hospitalization capped at 90 days", "Premium pricing is relatively steep for families"],
    features: {
      sum_insured: "₹10 Lakhs",
      waiting_period: "Pre-existing diseases: 2 years. Specific illnesses: 2 years. Initial wait: 30 days.",
      room_rent: "No restriction / sub-limits (Up to Single Private Room).",
      pre_hospitalization: "60 days",
      post_hospitalization: "90 days (Unlike 180 days in others)",
      hospital_cash: "Built-in cash benefit if choosing shared accommodation",
      ambulance: "Fully covered up to actual bills (Air ambulance up to ₹5 Lakhs)",
      organ_donor: "Covered up to Sum Insured",
      copay: "No Co-payment (0% out-of-pocket share)",
      day_care: "All day care procedures covered",
      domiciliary: "Covered up to Sum Insured",
      ayush: "AYUSH treatments covered up to Sum Insured",
      maternity: "Covered up to ₹50,000 (Normal) / ₹60,000 (C-section) after 36 months wait",
      newborn: "Covered from Day 1 up to maternity limit, including core vaccinations",
      renewal: "Cumulative Bonus: 50% increase per claim-free year up to 100% max. Bonus does not reduce even if claims are filed.",
      loading: "No loading charges",
      health_checkup: "Once every policy year",
      claim_record: "94.14% (FY2024-25) | 3yr avg: 93.80% | Source: IRDAI NL-37",
      opd_cover: "🟡 Built-in with conditions. OPD consultations up to ₹5,000/year; OPD dental up to ₹10,000/year. Applies only after a 24-month waiting period. No additional premium required once waiting period is served. Source: Official policy wording PDF (UIN: TATHLIP21257V022021), Ditto (Jun 2026)"
    },
    sublimits: {
      cataract: { status: 'none', text: 'No cap — covered up to sum insured' },
      joint_replacement: { status: 'none', text: 'No cap — covered up to sum insured' },
      robotic_surgery: { status: 'none', text: 'No cap — covered up to sum insured' },
      daycare_domiciliary: { status: 'none', text: 'All daycare covered. Domiciliary up to sum insured' },
      source: 'Beshak.org (Apr 2026) + Ditto (Jun 2026) + official policy wording PDF (UIN: TATHLIP21257V022021)'
    }
  },
  {
    id: "ab-activ-one",
    name: "Aditya Birla Activ One MAX",
    issuer: "Aditya Birla Standalone",
    csr: "95.81%",
    csr3yr: "95.81%",
    icr: "68.00%",
    solvency: "1.98x",
    complaints: "18.67",
    hospitals: "13,000+",
    premiumBase: {
      individual: 10149,
      couple: 16299,
      family: 21478,
      senior: 66505
    },
    pros: ["Up to 100% premium back as HealthReturns", "Day-1 coverage for 7 chronic conditions", "100% Super Reload restoration"],
    cons: ["Slower physical claim verification", "Strict step-tracking compliance required"],
    features: {
      sum_insured: "₹10 Lakhs (Adjustable up to 3 Cr)",
      waiting_period: "Pre-existing diseases: 3 years. Chronic conditions: 0 days (via Chronic Care rider).",
      room_rent: "No restriction / sub-limits. Deluxe suites allowed.",
      pre_hospitalization: "60 days",
      post_hospitalization: "180 days",
      hospital_cash: "Available via optional rider",
      ambulance: "Fully covered up to actual bills (Road/Air)",
      organ_donor: "Covered up to Sum Insured",
      copay: "No Co-payment (0% out-of-pocket share)",
      day_care: "All day care procedures covered",
      domiciliary: "Covered up to Sum Insured",
      ayush: "AYUSH treatments covered up to Sum Insured",
      maternity: "None",
      newborn: "None",
      renewal: "Super Credit: Sum insured increases by 100% per year up to 500% regardless of claim status.",
      loading: "No loading charges",
      health_checkup: "Yes (Complimentary annual health assessment)",
      claim_record: "95.81% (FY2024-25) | 3yr avg: 95.81% | Source: IRDAI NL-37",
      opd_cover: "🟡 Partial built-in. Unlimited GP tele-consultations included in base plan at no extra cost. Full in-clinic OPD (medicines, diagnostics, in-person consults) available via the Chronic Care Management rider at additional premium. Source: Ditto (Jun 2026), Beshak (Apr 2026)"
    },
    sublimits: {
      cataract: { status: 'none', text: 'No cap — covered up to sum insured' },
      joint_replacement: { status: 'none', text: 'No cap — covered up to sum insured' },
      robotic_surgery: { status: 'none', text: 'No cap — covered up to sum insured' },
      daycare_domiciliary: { status: 'none', text: 'All daycare covered. Domiciliary up to sum insured' },
      source: 'Beshak.org (Apr 2026) + Policybazaar + insurer website (adityabirlacapital.com)'
    }
  },
  {
    id: "icici-elevate",
    name: "ICICI Lombard Elevate",
    issuer: "ICICI Lombard General",
    csr: "98.45%",
    csr3yr: "97.90%",
    icr: "71.00%",
    solvency: "2.69x",
    complaints: "10.67",
    hospitals: "10,200+",
    premiumBase: {
      individual: 12400,
      couple: 18584,
      family: 24101,
      senior: 73559
    },
    pros: ["Infinite sum insured option (lifetime cap)", "Strong solvency ratio (2.69x)", "Jumpstart rider reduces PED wait to 30 days"],
    cons: ["Exclusion period of 90 days for certain conditions", "Standard room limited to Single Private AC"],
    features: {
      sum_insured: "₹10 Lakhs",
      waiting_period: "Pre-existing diseases: 3 years. Reduces to 30 days via Jumpstart add-on.",
      room_rent: "Single Private AC room standard. Upgradeable via Room Modifier.",
      pre_hospitalization: "60 days",
      post_hospitalization: "180 days",
      hospital_cash: "Optional rider available",
      ambulance: "Covered up to actual bills",
      organ_donor: "Covered up to Sum Insured",
      copay: "No Co-payment (0% out-of-pocket share)",
      day_care: "All day care procedures covered",
      domiciliary: "Covered up to Sum Insured",
      ayush: "AYUSH treatments covered up to Sum Insured",
      maternity: "Optional rider with 24-month waiting period",
      newborn: "Optional rider add-on support",
      renewal: "20% loyalty bonus up to 100% guaranteed (doesn't reduce on claim). Reset Benefit: 100% restoration.",
      loading: "No loading charges",
      health_checkup: "Yes (Available via wellness program)",
      claim_record: "98.45% (FY2024-25) | 3yr avg: 97.90% | Source: IRDAI NL-37",
      opd_cover: "Not included in core plan. OPD available as an add-on covering consultations, medicines, and diagnostics. Additional premium required. Source: Ditto (Jun 2026), Coversure (2026)"
    },
    sublimits: {
      cataract: { status: 'none', text: 'No cap — covered up to sum insured' },
      joint_replacement: { status: 'none', text: 'No cap — covered up to sum insured' },
      robotic_surgery: { status: 'none', text: 'No cap — covered up to sum insured' },
      daycare_domiciliary: { status: 'partial', text: 'Only 150 listed daycare procedures covered (not all). Up to 15 domiciliary treatments excluded from coverage' },
      source: 'Beshak.org (Jul 2025) + Ditto (Jun 2026)'
    }
  }
];

const METRIC_DEFINITIONS = {
  csr: {
    title: "Claim Settlement Ratio (CSR)",
    desc: "% of claims settled in a year. Note: a CSR of 100% is a statistical artifact of how pending claims are counted — not a guarantee of full payout. Always prefer the 3-year average over a single-year figure."
  },
  icr: {
    title: "Incurred Claim Ratio (ICR)",
    desc: "Net claims paid ÷ net premiums earned. Ideal range: 60–80%. Below 50% may indicate overly restrictive claims handling. Above 100% signals financial stress. HDFC ERGO at ~81% is slightly above ideal but remains stable."
  },
  solvency: {
    title: "Solvency Ratio",
    desc: "Capital reserves vs. risk exposure. IRDAI minimum is 1.5x. Niva Bupa at 3.03x is the strongest in this comparison. Higher means greater ability to survive a high-claim event."
  },
  complaints: {
    title: "Complaint Volume",
    desc: "Consumer complaints filed with IRDAI per 10,000 claims. Industry average is ~27/10k. HDFC ERGO (9.28) and TATA AIG (10.65) are well below average — a strong positive signal."
  }
};

const SHEET_FEATURES = [
  { key: "sum_insured", label: "Basic Sum Insured" },
  { key: "waiting_period", label: "1. Waiting Period" },
  { key: "room_rent", label: "2. Hospital Accommodation / Room Rent" },
  { key: "pre_hospitalization", label: "3. Pre-Hospitalization" },
  { key: "post_hospitalization", label: "4. Post-Hospitalization" },
  { key: "hospital_cash", label: "5. Hospital Cash / Daily Cash" },
  { key: "ambulance", label: "6. Emergency Ambulance" },
  { key: "organ_donor", label: "7. Organ Donor Expense" },
  { key: "copay", label: "8. Co-payment / Annual Deductible" },
  { key: "day_care", label: "9. Day Care Procedures" },
  { key: "domiciliary", label: "10. Domiciliary Hospitalization" },
  { key: "ayush", label: "11. Alternative Treatments (AYUSH)" },
  { key: "maternity", label: "12. Maternity Benefits" },
  { key: "newborn", label: "13. New Born Baby Cover" },
  { key: "renewal", label: "14. Renewal Benefits" },
  { key: "loading", label: "15. Loading on Claims" },
  { key: "health_checkup", label: "16. Health Checkup" },
  { key: "claim_record", label: "17. Claim Settlement Record" },
  { key: "opd_cover", label: "18. OPD / Outpatient Cover" }
];

const SUBLIMIT_ROWS = [
  { key: "cataract", label: "Cataract Surgery" },
  { key: "joint_replacement", label: "Joint Replacement" },
  { key: "robotic_surgery", label: "Robotic Surgery" },
  { key: "daycare_domiciliary", label: "Daycare & Domiciliary" }
];

const sublimitColor = (status: string) => {
  if (status === 'none') return { bg: 'bg-emerald-900/20', text: 'text-emerald-400', icon: '✓' };
  if (status === 'partial') return { bg: 'bg-amber-900/20', text: 'text-amber-400', icon: '⚠' };
  return { bg: 'bg-rose-900/20', text: 'text-rose-400', icon: '✕' };
};

export default function Dashboard() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("comparison");
  const [selectedProfile, setSelectedProfile] = useState("individual");
  const [selectedSumInsured, setSelectedSumInsured] = useState("15");
  const [selectedZone, setSelectedZone] = useState("zone1");
  const [comparedPlanIds, setComparedPlanIds] = useState(["hdfc-optima", "niva-reassure", "care-supreme"]);
  const [selectedPlanDetail, setSelectedPlanDetail] = useState<Policy | null>(null);
  const [sublimitsExpanded, setSublimitsExpanded] = useState(false);

  // --- CALCULATOR STATES ---
  const [totalBill, setTotalBill] = useState(300000);
  const [roomRentLimit, setRoomRentLimit] = useState(3000);
  const [actualRoomRent, setActualRoomRent] = useState(6000);

  // --- RECOMMENDATION STATES ---
  const [answers, setAnswers] = useState({
    PED: "no",
    maternity: "no",
    priority: "features",
    ageGroup: "young"
  });

  // --- COMPUTE PREMIUMS DYNAMICALLY ---
  const calculatePremium = (basePrem: number) => {
    let prem = basePrem;

    if (selectedSumInsured === "10") prem = basePrem * 0.85;
    else if (selectedSumInsured === "15") prem = basePrem;
    else if (selectedSumInsured === "25") prem = basePrem * 1.25;
    else if (selectedSumInsured === "50") prem = basePrem * 1.55;

    if (selectedZone === "zone1") prem = prem * 1.0;
    else if (selectedZone === "zone2") prem = prem * 0.85;
    else if (selectedZone === "zone3") prem = prem * 0.75;

    return Math.round(prem);
  };

  // --- TOGGLE COMPARED PLANS (max 4) ---
  const toggleComparison = (id: string) => {
    if (comparedPlanIds.includes(id)) {
      if (comparedPlanIds.length > 1) {
        setComparedPlanIds(comparedPlanIds.filter((pId: string) => pId !== id));
      }
    } else {
      if (comparedPlanIds.length < 4) {
        setComparedPlanIds([...comparedPlanIds, id]);
      } else {
        setComparedPlanIds([comparedPlanIds[0], comparedPlanIds[1], comparedPlanIds[2], id]);
      }
    }
  };

  // --- PROPORTIONAL DEDUCTION COMPUTATION ---
  const proportionalDeductionResults = useMemo(() => {
    if (actualRoomRent <= roomRentLimit) {
      return {
        deductionApplied: false,
        admissibleAmount: totalBill,
        outOfPocket: 0,
        pct: 100
      };
    }
    const factor = roomRentLimit / actualRoomRent;
    const admissible = Math.round(totalBill * factor);
    const loss = totalBill - admissible;
    return {
      deductionApplied: true,
      admissibleAmount: admissible,
      outOfPocket: loss,
      pct: Math.round(factor * 100)
    };
  }, [totalBill, roomRentLimit, actualRoomRent]);

  // --- RECOMMENDER ENGINE LOGIC ---
  const recommendations = useMemo(() => {
    let list = [...POLICIES];

    return list.map((plan: Policy) => {
      let score = 0;
      let reasons = [];

      if (answers.PED === "yes") {
        if (plan.id === "ab-activ-one") {
          score += 4;
          reasons.push("Provides Day-1 coverage for 7 major chronic conditions");
        } else if (plan.id === "tata-medicare") {
          score += 3;
          reasons.push("Shorter standard PED waiting period (24 months vs 36)");
        } else if (plan.id === "icici-elevate") {
          score += 3;
          reasons.push("Jumpstart rider reduces waiting periods to 30 days");
        }
      }

      if (answers.maternity === "yes") {
        if (plan.id === "tata-medicare") {
          score += 5;
          reasons.push("Built-in maternity coverage up to ₹50k/60k after 36 months");
        } else if (plan.id === "icici-elevate" || plan.id === "hdfc-optima") {
          score += 2;
          reasons.push("Offers maternity coverage via optional riders");
        } else {
          score -= 2;
        }
      }

      if (answers.priority === "budget") {
        if (plan.id === "ab-activ-one" || plan.id === "niva-reassure") {
          score += 3;
          reasons.push("Competitive baseline premiums with excellent core benefits");
        }
      } else if (answers.priority === "wellness") {
        if (plan.id === "ab-activ-one") {
          score += 4;
          reasons.push("Outstanding fitness incentive (up to 100% premium back)");
        } else if (plan.id === "care-supreme") {
          score += 3;
          reasons.push("Earn up to 30% renewal discounts via tracked step goals");
        }
      } else if (answers.priority === "features") {
        if (plan.id === "hdfc-optima") {
          score += 4;
          reasons.push("Automatic doubling of cover & inbuilt consumables payout");
        } else if (plan.id === "niva-reassure") {
          score += 3;
          reasons.push("'Lock the Clock' freezes your entry-age premium rate");
        }
      }

      if (answers.ageGroup === "senior") {
        if (plan.id === "tata-medicare") {
          score += 2;
          reasons.push("Offers short waiting periods, optimal for aging health risks");
        } else if (plan.id === "niva-reassure") {
          score += 2;
          reasons.push("'Lock the Clock' provides security against compound premium hikes");
        }
      }

      return { ...plan, score, reasons };
    }).sort((a, b) => b.score - a.score);
  }, [answers]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased">
      {/* --- TOP HEADER --- */}
      <header className="border-b border-slate-800 bg-slate-950 px-6 py-5 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-slate-700/50 text-slate-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-600/40">
                Data: IRDAI Disclosures FY2024-25
              </span>
              <span className="text-slate-500 text-xs">• Individual policies GST-exempt w.e.f. 22 Sep 2025</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Shield className="h-6 text-emerald-500 fill-emerald-500/10" />
              Indian Retail Health Insurance Matrix
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Independent comparison of 6 retail health plans. Metrics sourced from IRDAI NL-37, NL-45 &amp; NL-26 (Q4 FY2024-25). Premiums shown are indicative — actual costs depend on age, zone &amp; underwriting.
            </p>
          </div>
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("comparison")}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${activeTab === "comparison" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
              <Layers className="inline-block h-3.5 w-3.5 mr-1.5" /> Compare Matrix
            </button>
            <button
              onClick={() => setActiveTab("calculators")}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${activeTab === "calculators" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
              <Sliders className="inline-block h-3.5 w-3.5 mr-1.5" /> Risk Simulators
            </button>
            <button
              onClick={() => setActiveTab("recommendation")}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${activeTab === "recommendation" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
              <Sparkles className="inline-block h-3.5 w-3.5 mr-1.5" /> Portfolio Advisor
            </button>
          </div>
        </div>
      </header>

      {/* --- UNDERWRITING BASELINE STRIP --- */}
      <section className="bg-emerald-950/20 border-b border-emerald-900/30 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-y-2 gap-x-6 text-xs text-emerald-400 justify-center md:justify-start">
          <span><strong>Waiting Period limit:</strong> Max 36 Months PED Cap</span>
          <span className="text-slate-600">|</span>
          <span><strong>Cashless Timelines:</strong> 1-Hour Authorization, 3-Hour Discharge</span>
          <span className="text-slate-600">|</span>
          <span><strong>Ayush Parity:</strong> Full Sum Insured Covered</span>
          <span className="text-slate-600">|</span>
          <span><strong>Moratorium:</strong> Reduced to 5 Years</span>
        </div>
      </section>

      {/* --- AMBER DISCLAIMER BANNER --- */}
      <div className="bg-amber-950/30 border-b border-amber-800/30 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300/80 leading-relaxed">
            <strong className="text-amber-400">Indicative data only.</strong> Metrics from IRDAI public disclosures (NL-37, NL-45, NL-26), Q4 FY2024-25. Premiums are illustrative — not quotes. Verify with your insurer before purchase. <span className="text-amber-500/70">Last updated: April 2026.</span>
          </p>
        </div>
      </div>

      {/* --- MAIN LAYOUT --- */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        {/* CONFIGURATOR WIDGET */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800/60">
            <Sliders className="h-5 w-5 text-emerald-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Personal Profile &amp; Actuarial Cost Engine
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Demographic Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                <Users className="h-3 w-3" /> Demographic Group
              </label>
              <select
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="individual">Individual (Age 25)</option>
                <option value="couple">Couple (Ages 31 &amp; 32)</option>
                <option value="family">Family (2 Adults, 1 Child - 35, 34, 5)</option>
                <option value="senior">Seniors (Ages 62 &amp; 63)</option>
              </select>
            </div>

            {/* Sum Insured Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                <Shield className="h-3 w-3" /> Desired Sum Insured
              </label>
              <div className="grid grid-cols-4 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                {["10", "15", "25", "50"].map((si: string) => (
                  <button
                    key={si}
                    onClick={() => setSelectedSumInsured(si)}
                    className={`py-1 px-1.5 rounded text-xs font-bold transition ${selectedSumInsured === si ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    {si}L
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Zone/Tier Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                <DollarSign className="h-3 w-3" /> Geographical Zone
              </label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="zone1">Zone 1 (Delhi NCR, Mumbai, Tier-1 Metros)</option>
                <option value="zone2">Zone 2 (Urban, Tier-2 Cities - 15% discount)</option>
                <option value="zone3">Zone 3 (Semi-Urban, Tier-3 Towns - 25% discount)</option>
              </select>
            </div>

            {/* Underwriting Highlight */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                <Info className="h-3.5 w-3.5 shrink-0" /> Actuarial Pricing Insight
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Individual health insurance is GST-exempt from 22 Sep 2025 (56th GST Council). Group policies still attract 18% GST. All premiums shown are illustrative — not quotes.
              </p>
            </div>

          </div>
        </div>

        {/* --- TAB 1: COMPARISON MATRIX --- */}
        {activeTab === "comparison" && (
          <div>

            {/* INSTRUCTIONS & METRICS SUMMARY */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-slate-950 p-5 rounded-xl border border-slate-800">
                <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-500" /> Underwriting &amp; Solvency Ratios
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(METRIC_DEFINITIONS).map(([key, item]: [string, { title: string; desc: string }]) => (
                    <div key={key} className="bg-slate-900 p-3 rounded-lg border border-slate-800/80 hover:border-slate-700 transition">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase mb-1 flex items-center justify-between">
                        {item.title.split(' ')[0]}
                        <span title={item.desc}><HelpCircle className="h-3 w-3 text-slate-600 hover:text-slate-400 cursor-pointer" /></span>
                      </div>
                      <p className="text-xs text-slate-500 leading-tight mt-1">{item.desc.substring(0, 52)}...</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-950/20 to-teal-950/20 p-5 rounded-xl border border-emerald-900/30 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wider mb-2">Matrix Controls</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Select up to 4 plans below to populate the detailed comparison grid.
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap mt-3">
                  {POLICIES.map((p: Policy) => {
                    const isSelected = comparedPlanIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => toggleComparison(p.id)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold transition flex items-center gap-1 ${isSelected ? "bg-emerald-600 text-white border border-emerald-500" : "bg-slate-900 text-slate-400 border border-slate-800"}`}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5" />}
                        {p.name.split(' ').slice(0, 2).join(' ')}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* QUICK OVERVIEW PLAN CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {POLICIES.map((plan: Policy) => {
                const isCompared = comparedPlanIds.includes(plan.id);
                const premium = calculatePremium(plan.premiumBase[selectedProfile as keyof typeof plan.premiumBase]);
                return (
                  <div
                    key={plan.id}
                    className={`rounded-xl border transition-all ${isCompared ? "border-emerald-500 bg-slate-950 ring-1 ring-emerald-500/20" : "border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-950"}`}
                  >
                    <div className="p-5 border-b border-slate-800/80">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-emerald-400 font-semibold tracking-wide">
                          {plan.issuer}
                        </span>
                        <button
                          onClick={() => toggleComparison(plan.id)}
                          className={`px-3 py-1 rounded text-[10px] font-bold tracking-wide transition ${isCompared ? "bg-emerald-950 text-emerald-300 border border-emerald-700" : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"}`}
                        >
                          {isCompared ? "Selected" : "+ Compare"}
                        </button>
                      </div>
                      <h3 className="text-base font-bold text-white mb-3 tracking-tight">{plan.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-emerald-400">₹{premium.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-slate-400 font-medium">/ year (indicative)</span>
                      </div>
                    </div>

                    <div className="px-5 py-4 bg-slate-900/40 border-b border-slate-800/60 grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div>
                        <div className="text-slate-500 font-semibold">CSR</div>
                        <div className="text-white font-bold text-xs mt-0.5">{plan.csr}</div>
                        <div className="text-slate-600 text-[9px] mt-0.5">3yr: {plan.csr3yr}</div>
                      </div>
                      <div className="border-x border-slate-800/80">
                        <div className="text-slate-500 font-semibold">ICR</div>
                        <div className="text-white font-bold text-xs mt-0.5">{plan.icr}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 font-semibold">Solvency</div>
                        <div className="text-white font-bold text-xs mt-0.5">{plan.solvency}</div>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h4 className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider mb-1.5">Highlighted Advantages</h4>
                        <ul className="space-y-1">
                          {plan.pros.map((pro: string, idx: number) => (
                            <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                              <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2 border-t border-slate-800/60 flex justify-between items-center">
                        <span className="text-[10px] text-slate-500">IRDAI Complaint Index: {plan.complaints}/10k claims</span>
                        <button
                          onClick={() => setSelectedPlanDetail(plan)}
                          className="text-xs text-slate-400 hover:text-white font-semibold flex items-center gap-1 transition"
                        >
                          All Features <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DYNAMIC COMPARISON MATRIX GRID */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
              <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-800 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-500" /> Side-by-Side Comparison
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Exhaustive side-by-side analysis of all 18 policy parameters.
                  </p>
                </div>
                <div className="text-xs font-semibold text-emerald-400">
                  Comparing {comparedPlanIds.length} of {POLICIES.length} Products
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950">
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-1/5 border-r border-slate-800">
                        Feature / Category
                      </th>
                      {comparedPlanIds.map((planId: string) => {
                        const plan = POLICIES.find(p => p.id === planId);
                        if (!plan) return null;
                        const calculatedPrem = calculatePremium(plan.premiumBase[selectedProfile as keyof typeof plan.premiumBase]);
                        return (
                          <th key={planId} className="p-4 text-xs font-bold text-center border-r border-slate-800 last:border-r-0">
                            <div className="text-white text-sm font-black mb-1">{plan.name}</div>
                            <div className="text-[10px] text-slate-500 tracking-wide font-semibold">{plan.issuer}</div>
                            <div className="mt-2 text-emerald-400 text-sm font-extrabold">₹{calculatedPrem.toLocaleString('en-IN')}/yr</div>
                            <div className="text-[9px] text-slate-600 mt-0.5">indicative premium</div>
                            <div className="text-[9px] text-slate-500 mt-0.5">CSR: {plan.csr} <span className="text-slate-600">(3yr: {plan.csr3yr})</span></div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {SHEET_FEATURES.map((feature: SheetFeature, featureIdx: number) => {
                      return (
                        <tr key={feature.key} className="border-b border-slate-800 hover:bg-slate-900/20 transition-all">
                          {/* Row Header */}
                          <td className="p-4 text-xs font-bold text-slate-300 border-r border-slate-800 align-top">
                            {feature.key === 'opd_cover' ? (
                              <span className="flex items-center gap-1.5">
                                {feature.label}
                                <span title="OPD (Outpatient Department) covers doctor visits, diagnostics, and medicines that do not require hospitalisation. Most Indian health plans do NOT include OPD in the base plan — you pay these costs out of pocket unless you buy an OPD add-on. TATA AIG MediCare Premier includes OPD in the base plan, but only after a 24-month waiting period.">
                                  <HelpCircle className="h-3 w-3 text-slate-600 hover:text-slate-400 cursor-pointer shrink-0" />
                                </span>
                              </span>
                            ) : feature.label}
                          </td>
                          {/* Plan Values */}
                          {comparedPlanIds.map((planId: string) => {
                            const plan = POLICIES.find(p => p.id === planId);
                            if (!plan) return null;
                            let value = (plan.features as Record<string, string>)[feature.key];

                            return (
                              <td key={planId} className="p-4 text-xs text-slate-300 border-r border-slate-800 last:border-r-0 align-top text-center">
                                {value === "None" ? (
                                  <div className="flex flex-col items-center justify-center text-slate-500 py-1">
                                    <X className="h-4 w-4 text-rose-500/50 mb-1" />
                                    <span>Not Covered</span>
                                  </div>
                                ) : value && value.includes("No restriction") || value && value.includes("No Co-payment") || value && value.includes("AYUSH treatments covered") ? (
                                  <div className="flex flex-col items-center">
                                    <Check className="h-4 w-4 text-emerald-500 mb-1" />
                                    <span className="leading-relaxed text-[11px] font-medium">{value}</span>
                                  </div>
                                ) : (
                                  <span className="leading-relaxed text-[11px] font-medium block max-w-xs mx-auto">
                                    {value}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SUB-LIMITS PANEL */}
            <div className="mt-4 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
              <button
                onClick={() => setSublimitsExpanded(!sublimitsExpanded)}
                className="w-full px-6 py-4 bg-slate-900/60 border-b border-slate-800 flex justify-between items-center hover:bg-slate-900/80 transition"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white uppercase tracking-wider">Sub-limits &amp; Surgery Caps</span>
                      <span title="A sub-limit is a cap on how much the insurer pays for a specific procedure, even if your total sum insured is much higher. For example, a ₹1L robotic surgery sub-limit on a ₹10L policy means you pay the remaining cost out of pocket. Plans with no sub-limits give you the full sum insured for any covered procedure.">
                        <HelpCircle className="h-3.5 w-3.5 text-slate-600 hover:text-slate-400 cursor-pointer" />
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Hidden policy caps that only appear at claim time — the most overlooked factor in plan selection
                    </p>
                  </div>
                </div>
                {sublimitsExpanded
                  ? <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                  : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                }
              </button>

              {sublimitsExpanded && (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-950">
                          <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-1/5 border-r border-slate-800">
                            Procedure / Benefit
                          </th>
                          {comparedPlanIds.map((planId: string) => {
                            const plan = POLICIES.find(p => p.id === planId);
                            if (!plan) return null;
                            return (
                              <th key={planId} className="p-4 text-xs font-bold text-center border-r border-slate-800 last:border-r-0">
                                <div className="text-white text-sm font-black">{plan.name}</div>
                                <div className="text-[10px] text-slate-500 mt-0.5">{plan.issuer}</div>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {SUBLIMIT_ROWS.map((row) => (
                          <tr key={row.key} className="border-b border-slate-800 hover:bg-slate-900/20 transition-all">
                            <td className="p-4 text-xs font-bold text-slate-300 border-r border-slate-800 align-top">
                              {row.label}
                            </td>
                            {comparedPlanIds.map((planId: string) => {
                              const plan = POLICIES.find(p => p.id === planId);
                              if (!plan) return null;
                              const entry = plan.sublimits[row.key as keyof typeof plan.sublimits];
                              if (typeof entry === 'string') return null;
                              const colors = sublimitColor(entry.status);
                              return (
                                <td key={planId} className={`p-4 text-xs border-r border-slate-800 last:border-r-0 align-top text-center ${colors.bg}`}>
                                  <span className={`font-bold text-sm ${colors.text}`}>{colors.icon}</span>
                                  <p className={`text-[11px] mt-1 leading-relaxed ${colors.text}`}>{entry.text}</p>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Source footnote */}
                  <div className="px-6 py-4 border-t border-slate-800 space-y-2">
                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                      {comparedPlanIds.map((planId: string) => {
                        const plan = POLICIES.find(p => p.id === planId);
                        if (!plan) return null;
                        return (
                          <p key={planId} className="text-[10px] text-slate-500">
                            <span className="text-slate-400 font-semibold">{plan.name.split(' ').slice(0, 3).join(' ')}:</span> {plan.sublimits.source}
                          </p>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Sub-limit data verified from official policy wording PDFs and insurer websites. Cross-checked against Beshak.org (Apr–Jul 2026) and Ditto (Jun 2026). Applies to ₹10L sum insured, base plan only, without add-ons.
                    </p>
                    <p className="text-[10px] text-slate-600">
                      ⚠ Policy terms can change at renewal. Always verify sub-limits in your policy schedule before purchase or at claim time. This data is for the base plan only — add-ons may remove or modify these caps.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* --- TAB 2: INTERACTIVE RISK CALCULATORS --- */}
        {activeTab === "calculators" && (
          <div className="space-y-8">

            {/* PROPORTIONAL DEDUCTION TRAP SIMULATOR */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 shadow-md">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 mb-6 gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" /> Proportional Deduction Trap Simulator
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    If your policy has room rent limits, choosing an expensive room will trigger a proportional deduction on your *entire hospital bill*.
                  </p>
                </div>
                <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/20">
                  Underwriting Pitfall #1
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* SLIDERS COLUMN */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Slider 1: Total Bill */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                      <span>Total Admissible Hospital Bill</span>
                      <span className="text-emerald-400">₹{totalBill.toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="1000000"
                      step="25000"
                      value={totalBill}
                      onChange={(e) => setTotalBill(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>₹50,000</span>
                      <span>₹10,000,000</span>
                    </div>
                  </div>

                  {/* Slider 2: Policy Room Limit */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                      <span>Room Rent Allowed in Policy (Per Day)</span>
                      <span className="text-sky-400">₹{roomRentLimit.toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="10000"
                      step="500"
                      value={roomRentLimit}
                      onChange={(e) => setRoomRentLimit(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>₹1,000</span>
                      <span>₹10,000</span>
                    </div>
                  </div>

                  {/* Slider 3: Chosen Room Rent */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                      <span>Actual Room Chosen (Per Day)</span>
                      <span className="text-rose-400 font-extrabold">₹{actualRoomRent.toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="20000"
                      step="500"
                      value={actualRoomRent}
                      onChange={(e) => setActualRoomRent(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>₹1,000</span>
                      <span>₹20,000</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex items-start gap-3">
                    <Info className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Admissible Claim Equation</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        Admissible Claim = Total Charges × (Room Rent Limit / Actual Room Rent)
                        If your policy states "Standard Single AC Room" instead of a flat numeric cap, you are immune to this deduction as long as you request that category!
                      </p>
                    </div>
                  </div>
                </div>

                {/* RESULTS GRAPHICS COLUMN */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Underwriting Impact</span>

                    {proportionalDeductionResults.deductionApplied ? (
                      <div className="mt-4">
                        <div className="text-xs font-bold text-rose-400 flex items-center justify-center gap-1.5 mb-1">
                          <AlertTriangle className="h-4 w-4" /> Deduction Activated
                        </div>
                        <div className="text-3xl font-black text-rose-500">
                          - ₹{proportionalDeductionResults.outOfPocket.toLocaleString('en-IN')}
                        </div>
                        <p className="text-xs text-slate-400 mt-1.5">This represents your personal out-of-pocket payout!</p>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 mb-1">
                          <Check className="h-4 w-4" /> Full Claim Approved
                        </div>
                        <div className="text-3xl font-black text-emerald-400">
                          ₹0.00 Loss
                        </div>
                        <p className="text-xs text-slate-400 mt-1.5">No proportionate penalties apply.</p>
                      </div>
                    )}
                  </div>

                  {/* BAR CHART GRAPHIC */}
                  <div className="my-6 space-y-4">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Paid by Insurer ({proportionalDeductionResults.pct}%)</span>
                        <span className="font-bold text-white">₹{proportionalDeductionResults.admissibleAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full transition-all duration-300"
                          style={{ width: `${proportionalDeductionResults.pct}%` }}
                        />
                      </div>
                    </div>

                    {proportionalDeductionResults.deductionApplied && (
                      <div>
                        <div className="flex justify-between text-[11px] text-rose-400 mb-1">
                          <span>You Pay (Out-of-Pocket)</span>
                          <span className="font-bold">₹{proportionalDeductionResults.outOfPocket.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                          <div
                            className="bg-rose-500 h-full transition-all duration-300"
                            style={{ width: `${100 - proportionalDeductionResults.pct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PROTECTIVE RE-ASSURANCE SUGGESTION */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">Immune Policies in our Study</span>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      <strong>HDFC Ergo Optima Secure</strong>, <strong>Care Supreme</strong>, and <strong>Aditya Birla Activ One</strong> do not hold room-rent caps in core configurations, paying bills at actuals.
                    </p>
                  </div>

                </div>

              </div>
            </div>


            {/* NO CLAIM BONUS ACCUMULATION VISUALIZER */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 shadow-md">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 mb-6 gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" /> 5-Year Cumulative Sum Insured Growth projection
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Visualizing how different renewal architectures (NCB, Plus Benefit, Super NCB) multiply your coverage across five claim-free years.
                  </p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Renewal Multipliers
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* EXPLANATORY CARDS */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Plan Architectures</h4>

                  <div className="border-l-2 border-emerald-500 pl-3">
                    <h5 className="text-xs font-bold text-slate-200">HDFC Ergo (Optima Secure)</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Doubles instantly on Day 1 (+100%), and guarantees another 100% by Yr 2 via Plus Benefit, capped at 3x total cover.
                    </p>
                  </div>

                  <div className="border-l-2 border-teal-500 pl-3">
                    <h5 className="text-xs font-bold text-slate-200">Care Supreme (Super NCB)</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Increases coverage by 100% per claim-free year using the Super NCB rider, maxing out at +500% (6x sum insured).
                    </p>
                  </div>

                  <div className="border-l-2 border-sky-500 pl-3">
                    <h5 className="text-xs font-bold text-slate-200">Tata AIG Medicare</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Offers 50% compound increase annually. Reduces in equivalent 50% steps if a claim is registered.
                    </p>
                  </div>
                </div>

                {/* GRAPH CONTAINER */}
                <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sum Insured Multiplier Growth (Base: ₹10 Lakhs)</span>
                    <span className="text-[10px] text-slate-500">Note: Capped by policy limits</span>
                  </div>

                  {/* CUSTOM SVG CHART */}
                  <div className="w-full h-56 bg-slate-950 rounded-lg p-2 relative border border-slate-800/80">

                    {/* Y-Axis Guidlines */}
                    <div className="absolute inset-x-0 top-1/4 border-t border-slate-800/40 text-[9px] text-slate-600 pt-0.5 pl-2">6X SI (₹60L)</div>
                    <div className="absolute inset-x-0 top-2/4 border-t border-slate-800/40 text-[9px] text-slate-600 pt-0.5 pl-2">3X SI (₹30L)</div>
                    <div className="absolute inset-x-0 top-3/4 border-t border-slate-800/40 text-[9px] text-slate-600 pt-0.5 pl-2">1X Base (₹10L)</div>

                    {/* Plot Elements */}
                    <div className="absolute inset-0 flex justify-around items-end px-12 pt-8 pb-4">
                      {/* Day 1 */}
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1.5 h-32 items-end">
                          <div className="w-3 bg-emerald-500 rounded-t" style={{ height: '66%' }} title="HDFC: 20L"></div>
                          <div className="w-3 bg-teal-500 rounded-t" style={{ height: '33%' }} title="Care: 10L"></div>
                          <div className="w-3 bg-sky-500 rounded-t" style={{ height: '33%' }} title="Tata AIG: 10L"></div>
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1">Day 1</span>
                      </div>

                      {/* Year 1 */}
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1.5 h-32 items-end">
                          <div className="w-3 bg-emerald-500 rounded-t" style={{ height: '82%' }} title="HDFC: 25L"></div>
                          <div className="w-3 bg-teal-500 rounded-t" style={{ height: '66%' }} title="Care: 20L"></div>
                          <div className="w-3 bg-sky-500 rounded-t" style={{ height: '50%' }} title="Tata AIG: 15L"></div>
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1">Year 1</span>
                      </div>

                      {/* Year 2 */}
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1.5 h-32 items-end">
                          <div className="w-3 bg-emerald-500 rounded-t" style={{ height: '100%' }} title="HDFC: 30L (Capped)"></div>
                          <div className="w-3 bg-teal-500 rounded-t" style={{ height: '100%' }} title="Care: 30L"></div>
                          <div className="w-3 bg-sky-500 rounded-t" style={{ height: '66%' }} title="Tata AIG: 20L (Capped)"></div>
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1">Year 2</span>
                      </div>

                      {/* Year 3 */}
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1.5 h-32 items-end">
                          <div className="w-3 bg-emerald-500 rounded-t" style={{ height: '100%' }} title="HDFC: 30L"></div>
                          <div className="w-3 bg-teal-500 rounded-t" style={{ height: '115px' }} title="Care: 40L"></div>
                          <div className="w-3 bg-sky-500 rounded-t" style={{ height: '66%' }} title="Tata AIG: 20L"></div>
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1">Year 3</span>
                      </div>

                      {/* Year 4 */}
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1.5 h-32 items-end">
                          <div className="w-3 bg-emerald-500 rounded-t" style={{ height: '100%' }} title="HDFC: 30L"></div>
                          <div className="w-3 bg-teal-500 rounded-t" style={{ height: '128px' }} title="Care: 60L (Max Capped)"></div>
                          <div className="w-3 bg-sky-500 rounded-t" style={{ height: '66%' }} title="Tata AIG: 20L"></div>
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1">Year 4</span>
                      </div>
                    </div>

                  </div>

                  {/* LEGEND */}
                  <div className="flex justify-center gap-6 mt-3 text-[10px]">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm inline-block"></span> HDFC Optima (300% Cap)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-teal-500 rounded-sm inline-block"></span> Care Supreme Super NCB (600% Cap)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-sky-500 rounded-sm inline-block"></span> Tata AIG (200% Cap)</span>
                  </div>

                </div>

              </div>
            </div>

          </div>
        )}

        {/* --- TAB 3: SMART ADVISOR --- */}
        {activeTab === "recommendation" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* INPUT PANEL (Left 1/3) */}
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 h-fit space-y-6 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-emerald-500" /> Profile Consultation Matcher
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                  Answer a few questions to isolate policies that match your specific healthcare and pricing parameters.
                </p>
              </div>

              {/* Question 1 */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  1. Do you or covered family members have any Pre-Existing Conditions (PED)?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAnswers({ ...answers, PED: "yes" })}
                    className={`py-1.5 rounded text-xs font-semibold border transition ${answers.PED === "yes" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400"}`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setAnswers({ ...answers, PED: "no" })}
                    className={`py-1.5 rounded text-xs font-semibold border transition ${answers.PED === "no" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400"}`}
                  >
                    No / Not Declaring
                  </button>
                </div>
              </div>

              {/* Question 2 */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  2. Is maternity/newborn cover a target priority over the next 2-3 years?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAnswers({ ...answers, maternity: "yes" })}
                    className={`py-1.5 rounded text-xs font-semibold border transition ${answers.maternity === "yes" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400"}`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setAnswers({ ...answers, maternity: "no" })}
                    className={`py-1.5 rounded text-xs font-semibold border transition ${answers.maternity === "no" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400"}`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Question 3 */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  3. What is your primary purchase alignment?
                </label>
                <select
                  value={answers.priority}
                  onChange={(e) => setAnswers({ ...answers, priority: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs font-semibold text-white focus:outline-none"
                >
                  <option value="features">Rich Base Features (Multiplier Covers, Inbuilt Consumables)</option>
                  <option value="budget">Aggressive Pricing (Maximum Coverage per Rupee)</option>
                  <option value="wellness">Wellness Incentive &amp; Active Lifestyle Discounts</option>
                </select>
              </div>

              {/* Question 4 */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  4. What age category best fits the primary policyholder?
                </label>
                <select
                  value={answers.ageGroup}
                  onChange={(e) => setAnswers({ ...answers, ageGroup: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs font-semibold text-white focus:outline-none"
                >
                  <option value="young">Young Individual / Couple (Under 35)</option>
                  <option value="family">Active Growing Family (With Dependent Children)</option>
                  <option value="senior">Senior Citizen Profile (Over 60)</option>
                </select>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-900/40 p-3.5 rounded-lg">
                <h4 className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" /> Actuarial Recommendation
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Our system evaluates parameters such as waiting reduction riders, maternity caps, and loading history to assign a semantic fit score.
                </p>
              </div>
            </div>

            {/* RECOMMENDED OPTIONS PANEL (Right 2/3) */}
            <div className="lg:col-span-2 space-y-6">

              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Personalized Plan Rankings
                </h3>
                <span className="text-xs text-slate-500">Sorted by actuary compatibility index</span>
              </div>

              {recommendations.slice(0, 3).map((plan: Policy, idx: number) => {
                const calculatedPrem = calculatePremium(plan.premiumBase[selectedProfile as keyof typeof plan.premiumBase]);
                const scorePercentage = Math.min(100, Math.max(20, 60 + ((plan.score ?? 0) * 8)));

                return (
                  <div
                    key={plan.id}
                    className="bg-slate-950 rounded-xl border border-slate-800 p-5 relative overflow-hidden flex flex-col md:flex-row justify-between gap-6 hover:border-slate-700 transition shadow"
                  >
                    {/* TOP MATCH BADGE */}
                    {idx === 0 && (
                      <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] uppercase font-black tracking-widest px-3.5 py-1.5 rounded-bl-lg shadow-sm flex items-center gap-1">
                        <Sparkles className="h-3 w-3 fill-white" /> Recommended Match
                      </div>
                    )}

                    {/* Left Details Block */}
                    <div className="space-y-4 md:w-2/3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-emerald-400 font-semibold">{plan.issuer}</span>
                          <span className="text-slate-700">•</span>
                          <span className="text-[10px] bg-slate-900 text-slate-400 font-bold px-2 py-0.5 rounded">
                            {scorePercentage}% Compatibility Fit
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-white tracking-tight">{plan.name}</h4>
                      </div>

                      {/* REASONS FOR SELECTION */}
                      <div>
                        <h5 className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider mb-1.5">Why this fits your profile:</h5>
                        <ul className="space-y-1.5">
                          {(plan.reasons ?? []).length > 0 ? (
                            (plan.reasons ?? []).map((reason: string, rIdx: number) => (
                              <li key={rIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                                <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{reason}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-xs text-slate-400 flex items-start gap-1.5">
                              <Check className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                              <span>Sturdy core coverage fulfilling all IRDAI guidelines perfectly.</span>
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="flex gap-4 pt-2">
                        <div className="text-[11px]">
                          <span className="text-slate-500 block">CSR (FY2024-25)</span>
                          <span className="font-extrabold text-white">{plan.csr}</span>
                          <span className="text-slate-600 text-[9px] block">3yr avg: {plan.csr3yr}</span>
                        </div>
                        <div className="border-l border-slate-800 pl-4 text-[11px]">
                          <span className="text-slate-500 block">Grievance Index</span>
                          <span className="font-extrabold text-white">{plan.complaints}/10k Claims</span>
                        </div>
                        <div className="border-l border-slate-800 pl-4 text-[11px]">
                          <span className="text-slate-500 block">Network</span>
                          <span className="font-extrabold text-white">{plan.hospitals} Hospitals</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Premium Callout */}
                    <div className="md:w-1/3 bg-slate-900/50 rounded-lg p-4 border border-slate-850 flex flex-col justify-between items-center text-center">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Calculated Premium</span>
                        <div className="text-2xl font-black text-emerald-400">₹{calculatedPrem.toLocaleString('en-IN')}</div>
                        <span className="text-[9px] text-slate-500 block mt-0.5">Annual cost (indicative)</span>
                      </div>

                      <button
                        onClick={() => setSelectedPlanDetail(plan)}
                        className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-xs font-bold py-2 rounded-lg text-slate-200 hover:text-white transition"
                      >
                        Review Plan Details
                      </button>
                    </div>

                  </div>
                );
              })}

              {/* RECOMMENDED PORTFOLIO STRATEGY SPLIT BANNER */}
              <div className="bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 p-6 rounded-xl border border-emerald-900/30">
                <div className="flex items-start gap-3.5">
                  <Shield className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5 fill-emerald-400/10" />
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Actuarial Diversification Advisory</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      Are you purchasing for a family that includes senior citizens or aging parents? **Do not purchase a single unified family floater policy.** Since floater premiums are priced using the eldest member's age, and a claim by one member wipes out the Cumulative No Claim Bonus (NCB) for everyone,
                      we highly recommend splitting your portfolio:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        <strong className="text-xs text-emerald-400 block mb-1">1. Family Floater (Self + Spouse + Kids)</strong>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          Opt for a high-value, feature-rich base like <strong>HDFC Ergo Optima Secure</strong> or <strong>Care Supreme</strong> to safely compound long-term bonuses.
                        </p>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        <strong className="text-xs text-emerald-400 block mb-1">2. Standalone Senior Cover (Parents)</strong>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          Isolate senior risks with a dedicated policy like <strong>TATA AIG Medicare Premier</strong>, leveraging shorter 24-month PED waiting times.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* --- FLOATING DETAIL MODAL (DRAWER) --- */}
      {selectedPlanDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">{selectedPlanDetail.issuer}</span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedPlanDetail.name}</h3>
              </div>
              <button
                onClick={() => setSelectedPlanDetail(null)}
                className="bg-slate-850 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Financial/Underwriting performance */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 block">CSR (FY2024-25)</span>
                  <strong className="text-sm text-white">{selectedPlanDetail.csr}</strong>
                  <span className="text-[9px] text-slate-600 block mt-0.5">3yr avg: {selectedPlanDetail.csr3yr}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Incurred Claim</span>
                  <strong className="text-sm text-white">{selectedPlanDetail.icr}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Solvency Margin</span>
                  <strong className="text-sm text-white">{selectedPlanDetail.solvency}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">IRDAI Complaints</span>
                  <strong className="text-sm text-white">{selectedPlanDetail.complaints}/10k</strong>
                </div>
              </div>

              {/* Terms breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800/60">
                  Detailed Parameters Breakdown
                </h4>

                {SHEET_FEATURES.map((feature: SheetFeature) => {
                  const val = selectedPlanDetail.features[feature.key];
                  return (
                    <div key={feature.key} className="grid grid-cols-1 md:grid-cols-3 gap-2 py-1 border-b border-slate-850 last:border-0 text-xs">
                      <span className="font-bold text-slate-400 md:col-span-1">{feature.label}</span>
                      <span className="text-slate-200 md:col-span-2 leading-relaxed">{val || "Not Capped / Standard Covered"}</span>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setSelectedPlanDetail(null)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg text-xs transition"
                >
                  Close Plan Breakdown
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 px-6 mt-16">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <p className="text-xs text-slate-400">
            <strong className="text-slate-300">Data Sources:</strong> CSR from IRDAI NL-37 &nbsp;|&nbsp; Complaints from IRDAI NL-45 &nbsp;|&nbsp; Solvency from IRDAI NL-26 &nbsp;|&nbsp; All from Q4 FY2024-25 public disclosures. Last updated: April 2026.
          </p>
          <p className="text-xs text-amber-400/70 flex items-center justify-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            Premiums are indicative only and will vary based on age, medical history, zone, add-ons, and underwriting. Individual health insurance premiums are GST-exempt from 22 September 2025 (56th GST Council). Group health insurance continues to attract 18% GST.
          </p>
          <p className="text-[11px] text-slate-600">
            This is an independent comparison tool and does not constitute financial advice. Not affiliated with any insurer. Always read the complete policy wording before purchase. Verify all data at irdai.gov.in
          </p>
        </div>
      </footer>
    </div>
  );
}
