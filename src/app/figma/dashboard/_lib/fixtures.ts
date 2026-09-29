// Exact UTF-8 fixtures extracted from the supplied HTML.
export const PERSONAS = {
  "free": {
    "tab": "Free user",
    "sub": "2025 · Lead",
    "role": "Explorer",
    "ent": {
      "CST": true,
      "ZENNA": false,
      "CONNECT": false,
      "P004": false
    },
    "stage": 0
  },
  "paid": {
    "tab": "Paid client",
    "sub": "2026 · Applicant",
    "role": "Applicant",
    "ent": {
      "CST": true,
      "ZENNA": true,
      "CONNECT": true,
      "P004": false
    },
    "stage": 1
  },
  "p004": {
    "tab": "Project004 era",
    "sub": "2027 · In Germany",
    "role": "Job seeker",
    "ent": {
      "CST": true,
      "ZENNA": "archived",
      "CONNECT": "mentor",
      "P004": true
    },
    "stage": 3
  }
} as const;

export const JOURNEY = [
  "Aspirant",
  "Applicant",
  "Admitted",
  "In Germany",
  "Working"
] as const;

export const FOCUS = {
  "free": {
    "cap": "Your next step",
    "b": "Your admit-chance report for 5 universities is ready.",
    "p": "One clear number per university — so you and your family know exactly where you stand before spending a single rupee on applications.",
    "cta": "See my chances",
    "go": "cst"
  },
  "paid": {
    "cap": "What matters today",
    "b": "Deggendorf portal submission is due in 8 days.",
    "p": "Everything else is on track — 2 offers already confirmed. Zenna and your mentor Jisha are both watching this deadline with you.",
    "cta": "Open in Zenna",
    "go": "zenna"
  },
  "p004": {
    "cap": "What matters today",
    "b": "Logistics Challenge finals are in 6 days — you're ranked #7.",
    "p": "Two employers viewed your profile this week. Finish in the top 10 and your profile card goes directly to hiring managers.",
    "cta": "Open Project004",
    "go": "p004"
  }
} as const;

export const HERO = {
  "free": [
    {
      "big": "80%",
      "badge": "Strong chance",
      "mono": "TUM",
      "uni": "TU Munich",
      "p": "M.Sc. Technical Logistics",
      "g": "linear-gradient(140deg,#6450E0,#241A54)"
    },
    {
      "big": "71%",
      "badge": "Strong chance",
      "mono": "THI",
      "uni": "TH Ingolstadt",
      "p": "M.Sc. Industrial Engineering",
      "g": "linear-gradient(140deg,#22B562,#0F4D33)"
    },
    {
      "big": "53%",
      "badge": "Fair chance",
      "mono": "UDE",
      "uni": "Uni Duisburg-Essen",
      "p": "M.Sc. Technical Logistics",
      "g": "linear-gradient(140deg,#5B7FD6,#2A2470)"
    }
  ],
  "paid": [
    {
      "big": "8d",
      "badge": "⚠ Deadline",
      "mono": "DIT",
      "uni": "Deggendorf Institute of Technology",
      "p": "Portal submission · 10 Jul",
      "g": "linear-gradient(140deg,#E3A417,#7A4E0B)"
    },
    {
      "big": "✓",
      "badge": "Offer received",
      "mono": "OTH",
      "uni": "OTH Amberg-Weiden",
      "p": "Confirm enrolment by 15 Aug",
      "g": "linear-gradient(140deg,#22B562,#0F4D33)"
    },
    {
      "big": "18d",
      "badge": "Docs due",
      "mono": "HFU",
      "uni": "HS Furtwangen",
      "p": "1 supporting document missing",
      "g": "linear-gradient(140deg,#6450E0,#241A54)"
    }
  ],
  "p004": [
    {
      "big": "86%",
      "badge": "New match",
      "mono": "KN",
      "uni": "Klinikum Nordbayern gGmbH",
      "p": "Junior Logistics Coordinator · Nürnberg",
      "g": "linear-gradient(140deg,#6450E0,#241A54)"
    },
    {
      "big": "#7",
      "badge": "🏆 Your rank",
      "mono": "LC",
      "uni": "Logistics Challenge 2027",
      "p": "Finals in 6 days · 412 participants",
      "g": "linear-gradient(140deg,#E3A417,#7A4E0B)"
    },
    {
      "big": "78%",
      "badge": "New match",
      "mono": "BW",
      "uni": "Bayernwerk Industrie GmbH",
      "p": "Supply Chain Analyst · Augsburg",
      "g": "linear-gradient(140deg,#22B562,#0F4D33)"
    }
  ]
} as const;

export const HERO_T = {
  "free": "Your top chances",
  "paid": "Your applications at a glance",
  "p004": "Your matches & rank"
} as const;

export const HERO_GO = {
  "free": "cst",
  "paid": "zenna",
  "p004": "p004"
} as const;

export const APPLICATIONS = [
  {
    "mono": "DIT",
    "c": "#177A45",
    "uni": "Deggendorf Institute of Technology",
    "course": "International Management",
    "status": "warn",
    "stTxt": "In progress",
    "prog": 82,
    "dl": "10 Jul",
    "dld": "8 days left",
    "id": "application-0"
  },
  {
    "mono": "DIT",
    "c": "#177A45",
    "uni": "Deggendorf Institute of Technology",
    "course": "BA Intl. Tourism Development",
    "status": "warn",
    "stTxt": "In progress",
    "prog": 76,
    "dl": "10 Jul",
    "dld": "8 days left",
    "id": "application-1"
  },
  {
    "mono": "OTH",
    "c": "#E3A417",
    "uni": "OTH Amberg-Weiden",
    "course": "BA International Business",
    "status": "ok",
    "stTxt": "Offer received",
    "prog": 100,
    "dl": "15 Aug",
    "dld": "Confirm enrolment",
    "id": "application-2"
  },
  {
    "mono": "OTH",
    "c": "#E3A417",
    "uni": "OTH Amberg-Weiden",
    "course": "BSc Digital Technology & Mgmt.",
    "status": "ok",
    "stTxt": "Offer received",
    "prog": 100,
    "dl": "15 Aug",
    "dld": "Confirm enrolment",
    "id": "application-3"
  },
  {
    "mono": "HFU",
    "c": "#C33A34",
    "uni": "Hochschule Furtwangen",
    "course": "BSc Intl. Business Information Systems",
    "status": "info",
    "stTxt": "In review",
    "prog": 64,
    "dl": "20 Jul",
    "dld": "1 doc missing",
    "id": "application-4"
  },
  {
    "mono": "THN",
    "c": "#6450E0",
    "uni": "TH Nürnberg",
    "course": "M.Sc. Logistics",
    "status": "info",
    "stTxt": "Submitted",
    "prog": 100,
    "dl": "—",
    "dld": "Decision late July",
    "id": "application-5"
  },
  {
    "mono": "HM",
    "c": "#5B7FD6",
    "uni": "Hochschule München",
    "course": "M.Sc. Engineering & Mgmt.",
    "status": "bad",
    "stTxt": "Rejected",
    "prog": 100,
    "dl": "—",
    "dld": "Closed",
    "id": "application-6"
  },
  {
    "mono": "THK",
    "c": "#5B7FD6",
    "uni": "TH Köln",
    "course": "M.Sc. Production Engineering",
    "status": "bad",
    "stTxt": "Rejected",
    "prog": 100,
    "dl": "—",
    "dld": "Closed",
    "id": "application-7"
  },
  {
    "mono": "FRA",
    "c": "#9C8CF5",
    "uni": "Frankfurt UAS",
    "course": "M.Sc. Global Logistics",
    "status": "bad",
    "stTxt": "Rejected",
    "prog": 100,
    "dl": "—",
    "dld": "Closed",
    "id": "application-8"
  }
] as const;

export const MENTORS = [
  {
    "n": "Geen Geo",
    "init": "GG",
    "c": "linear-gradient(140deg,#6450E0,#241A54)",
    "role": "M.Sc. Logistics & Production · TU München",
    "tags": [
      "Mechanical",
      "TUM admits",
      "Winter intake"
    ],
    "rate": "★ 4.9 · 41 sessions",
    "id": "mentor-0"
  },
  {
    "n": "Gladia Thomas",
    "init": "GT",
    "c": "linear-gradient(140deg,#5B7FD6,#2A2470)",
    "role": "M.Sc. Electrical Engineering · TU Dresden",
    "tags": [
      "Electrical",
      "Scholarships",
      "DAAD"
    ],
    "rate": "★ 4.8 · 33 sessions",
    "id": "mentor-1"
  },
  {
    "n": "Anee Mathew",
    "init": "AM",
    "c": "linear-gradient(140deg,#22B562,#0F4D33)",
    "role": "M.Sc. Computer Engineering · Uni Duisburg-Essen",
    "tags": [
      "CS/IT",
      "UDE",
      "Part-time jobs"
    ],
    "rate": "★ 5.0 · 27 sessions",
    "id": "mentor-2"
  },
  {
    "n": "Rahul Nair",
    "init": "RN",
    "c": "linear-gradient(140deg,#E3A417,#7A4E0B)",
    "role": "Working Professional · Automotive · Munich",
    "tags": [
      "Job market",
      "Blue Card",
      "Salary talk"
    ],
    "rate": "★ 4.9 · 52 sessions",
    "id": "mentor-3"
  },
  {
    "n": "Sneha Pillai",
    "init": "SP",
    "c": "linear-gradient(140deg,#9C8CF5,#4E3DBE)",
    "role": "Ausbildung Nurse · Klinikum · Bavaria",
    "tags": [
      "Nursing",
      "Ausbildung",
      "B2 German"
    ],
    "rate": "★ 4.8 · 38 sessions",
    "id": "mentor-4"
  },
  {
    "n": "Kevin Joseph",
    "init": "KJ",
    "c": "linear-gradient(140deg,#C33A34,#5E1815)",
    "role": "M.Sc. Data Science · RWTH Aachen",
    "tags": [
      "Data/AI",
      "RWTH",
      "Uni assist"
    ],
    "rate": "★ 4.7 · 19 sessions",
    "id": "mentor-5"
  }
] as const;

export const CHANCE_UNIVERSITIES = [
  {
    "mono": "TUM",
    "university": "TU Munich",
    "course": "M.Sc. Technical Logistics",
    "difficulty": 1.2
  },
  {
    "mono": "THI",
    "university": "TH Ingolstadt",
    "course": "M.Sc. Industrial Engineering",
    "difficulty": 0.82
  },
  {
    "mono": "UDE",
    "university": "Uni Duisburg-Essen",
    "course": "M.Sc. Technical Logistics",
    "difficulty": 0.95
  },
  {
    "mono": "TUD",
    "university": "TU Darmstadt",
    "course": "M.Sc. Logistics & SCM",
    "difficulty": 1.12
  },
  {
    "mono": "THN",
    "university": "TH Nürnberg",
    "course": "M.Sc. Logistics",
    "difficulty": 0.78
  }
] as const;

export const PAGE_COPY = {
  "free": {
    "dashboard": {
      "crumb": "Home",
      "title": "Good morning, Tino!",
      "subtitle": "One place for everything you do with LTA — nothing to hunt for."
    },
    "zenna": {
      "crumb": "My Suite / Zenna",
      "title": "Zenna — your application tracker",
      "subtitle": "See every application, deadline and document in one place."
    },
    "connect": {
      "crumb": "My Suite / LTA Connect",
      "title": "Connect — ask someone who's living it",
      "subtitle": "Why take advice about a mechanical master's from someone who never studied mechanical? Talk to real students and professionals in Germany."
    },
    "cst": {
      "crumb": "My Suite / Course Shortlisting",
      "title": "Check your real admit chances",
      "subtitle": "No fake \"100% guarantee\" promises. Enter your basics and get an honest estimate — the same starting point our own application team uses."
    },
    "p004": {
      "crumb": "My Suite / Project004",
      "title": "Project004 — get hired for what you can do",
      "subtitle": "Job search shouldn't feel like throwing CVs into a void. Coming 2027."
    },
    "documents": {
      "crumb": "Documents",
      "title": "One vault, every product",
      "subtitle": "Upload a document once and it follows you everywhere — applications today, job search tomorrow. You will never email the same PDF twice."
    },
    "notifications": {
      "crumb": "Notifications",
      "title": "Everything, one feed",
      "subtitle": "From every product on your account — so you check one place, not five apps."
    },
    "support": {
      "crumb": "Support",
      "title": "We're actual humans",
      "subtitle": "Built by people who've lived this journey — ask us anything, in English, Malayalam or German."
    }
  },
  "paid": {
    "dashboard": {
      "crumb": "Home",
      "title": "Welcome back, Tino.",
      "subtitle": "One place for everything you do with LTA — nothing to hunt for."
    },
    "zenna": {
      "crumb": "My Suite / Zenna",
      "title": "Zenna — your applications, live",
      "subtitle": "Every application, its status, and what happens next. Simple enough for your parents to follow, powerful enough to never miss a deadline."
    },
    "connect": {
      "crumb": "My Suite / LTA Connect",
      "title": "Connect — real people, real answers",
      "subtitle": "Book a 1:1 with students and professionals who are already where you want to be."
    },
    "cst": {
      "crumb": "My Suite / Course Shortlisting",
      "title": "Check your real admit chances",
      "subtitle": "No fake \"100% guarantee\" promises. Enter your basics and get an honest estimate — the same starting point our own application team uses."
    },
    "p004": {
      "crumb": "My Suite / Project004",
      "title": "Project004 — get hired for what you can do",
      "subtitle": "Job search shouldn't feel like throwing CVs into a void. Coming 2027."
    },
    "documents": {
      "crumb": "Documents",
      "title": "One vault, every product",
      "subtitle": "Upload a document once and it follows you everywhere — applications today, job search tomorrow. You will never email the same PDF twice."
    },
    "notifications": {
      "crumb": "Notifications",
      "title": "Everything, one feed",
      "subtitle": "From every product on your account — so you check one place, not five apps."
    },
    "support": {
      "crumb": "Support",
      "title": "We're actual humans",
      "subtitle": "Built by people who've lived this journey — ask us anything, in English, Malayalam or German."
    }
  },
  "p004": {
    "dashboard": {
      "crumb": "Home",
      "title": "Servus from Bavaria, Tino!",
      "subtitle": "One place for everything you do with LTA — nothing to hunt for."
    },
    "zenna": {
      "crumb": "My Suite / Zenna",
      "title": "Zenna — journey complete 🎓",
      "subtitle": "Your admissions record is archived on your account forever — for visa renewals, Anerkennung and references."
    },
    "connect": {
      "crumb": "My Suite / LTA Connect",
      "title": "Connect — real people, real answers",
      "subtitle": "Book a 1:1 with students and professionals who are already where you want to be."
    },
    "cst": {
      "crumb": "My Suite / Course Shortlisting",
      "title": "Check your real admit chances",
      "subtitle": "No fake \"100% guarantee\" promises. Enter your basics and get an honest estimate — the same starting point our own application team uses."
    },
    "p004": {
      "crumb": "My Suite / Project004",
      "title": "Your job search, upgraded",
      "subtitle": "Applications, competitions and your rank — the things German employers actually see."
    },
    "documents": {
      "crumb": "Documents",
      "title": "One vault, every product",
      "subtitle": "Upload a document once and it follows you everywhere — applications today, job search tomorrow. You will never email the same PDF twice."
    },
    "notifications": {
      "crumb": "Notifications",
      "title": "Everything, one feed",
      "subtitle": "From every product on your account — so you check one place, not five apps."
    },
    "support": {
      "crumb": "Support",
      "title": "We're actual humans",
      "subtitle": "Built by people who've lived this journey — ask us anything, in English, Malayalam or German."
    }
  }
} as const;

export const GATES = {
  "free": {
    "zenna": {
      "title": "Zenna unlocks when you apply through LTA",
      "text": "Most consultancies keep you in the dark. Zenna is the opposite: live status for every application, auto-tracked deadlines, WhatsApp alerts for you and your parents, and an AI agent that reads your offer letters for critical dates.",
      "features": [
        "Live application status",
        "Deadline alerts on WhatsApp",
        "AI reads your documents",
        "Parents can follow along"
      ],
      "primary": "Apply with LTA",
      "secondary": "Talk to us first"
    },
    "connect": {
      "title": "LTA Connect is launching to everyone soon",
      "text": "A B.Com counselor shouldn't decide your engineering future based on Google. On Connect, a mechanical graduate books a call with a mechanical engineer already in Germany — real course insight, real job-market truth, real life answers.",
      "features": [
        "1:1 video sessions",
        "Mentors from your exact field",
        "Honest answers, no sales talk",
        "WhatsApp chat option"
      ],
      "primary": "Join the waitlist",
      "secondary": "See how it works"
    },
    "p004": {
      "title": "Coming 2027 — and your account already works here",
      "text": "Jobs, hackathons and leaderboards in one platform. Show your skills in real competitions, climb rankings employers actually watch, and get matched with German companies — instead of waiting like a duck for an ATS to read keywords.",
      "features": [
        "Verified job listings",
        "Hackathons & competitions",
        "Employer-watched leaderboards",
        "Shareable profile card"
      ],
      "primary": "Notify me at launch",
      "secondary": "How it will work"
    }
  },
  "paid": {
    "p004": {
      "title": "Coming 2027 — and your account already works here",
      "text": "Jobs, hackathons and leaderboards in one platform. Show your skills in real competitions, climb rankings employers actually watch, and get matched with German companies — instead of waiting like a duck for an ATS to read keywords.",
      "features": [
        "Verified job listings",
        "Hackathons & competitions",
        "Employer-watched leaderboards",
        "Shareable profile card"
      ],
      "primary": "Notify me at launch",
      "secondary": "How it will work"
    }
  },
  "p004": {}
} as const;

export const DOCUMENTS = {
  "free": [],
  "paid": [
    {
      "id": "doc-0",
      "name": "Passport_TinoSunny.pdf",
      "meta": "Uploaded Mar 2026 · verified ✓",
      "used": [
        "Zenna"
      ]
    },
    {
      "id": "doc-1",
      "name": "IELTS_TRF_7.0.pdf",
      "meta": "Uploaded Mar 2026 · verified ✓",
      "used": [
        "Zenna"
      ]
    },
    {
      "id": "doc-2",
      "name": "B.Tech_Transcripts.pdf",
      "meta": "Uploaded Apr 2026 · verified ✓",
      "used": [
        "Zenna",
        "CST"
      ]
    },
    {
      "id": "doc-3",
      "name": "German_A2_Goethe.pdf",
      "meta": "Uploaded May 2026",
      "used": [
        "Zenna"
      ]
    }
  ],
  "p004": [
    {
      "id": "doc-0",
      "name": "Passport_TinoSunny.pdf",
      "meta": "Uploaded Mar 2026 · verified ✓",
      "used": [
        "Zenna",
        "P004"
      ]
    },
    {
      "id": "doc-1",
      "name": "IELTS_TRF_7.0.pdf",
      "meta": "Uploaded Mar 2026 · verified ✓",
      "used": [
        "Zenna",
        "P004"
      ]
    },
    {
      "id": "doc-2",
      "name": "B.Tech_Transcripts.pdf",
      "meta": "Uploaded Apr 2026 · verified ✓",
      "used": [
        "Zenna",
        "CST"
      ]
    },
    {
      "id": "doc-3",
      "name": "German_A2_Goethe.pdf",
      "meta": "Uploaded May 2026",
      "used": [
        "Zenna"
      ]
    }
  ]
} as const;

export const NOTIFICATIONS = {
  "free": [
    {
      "id": "free-notification-0",
      "text": "Your admit-chance report is ready — 5 universities checked.",
      "time": "Today · 09:12",
      "view": "cst"
    },
    {
      "id": "free-notification-1",
      "text": "LTA Connect is opening to the public soon. You're on the list.",
      "time": "2 days ago",
      "view": "connect"
    },
    {
      "id": "free-notification-2",
      "text": "Welcome to your LTA Account — the only login you'll ever need with us.",
      "time": "4 days ago",
      "view": "dashboard"
    }
  ],
  "paid": [
    {
      "id": "paid-notification-0",
      "text": "DIT portal submission due in 8 days — Zenna is tracking it.",
      "time": "Today · 08:00",
      "view": "zenna"
    },
    {
      "id": "paid-notification-1",
      "text": "Zenna AI found an enrolment date in your OTH offer letter.",
      "time": "Yesterday",
      "view": "zenna"
    },
    {
      "id": "paid-notification-2",
      "text": "Session confirmed with Geen Geo (TUM) — Friday 17:00.",
      "time": "2 days ago",
      "view": "connect"
    },
    {
      "id": "paid-notification-3",
      "text": "Offer received from OTH Amberg-Weiden. Congratulations! 🎉",
      "time": "5 days ago",
      "view": "zenna"
    }
  ],
  "p004": [
    {
      "id": "p004-notification-0",
      "text": "You moved up to #7 on the Logistics Challenge leaderboard.",
      "time": "Today · 10:40",
      "view": "p004"
    },
    {
      "id": "p004-notification-1",
      "text": "An employer in Augsburg viewed your Project004 profile.",
      "time": "Yesterday",
      "view": "p004"
    },
    {
      "id": "p004-notification-2",
      "text": "New mentor request from an aspirant applying to DIT.",
      "time": "2 days ago",
      "view": "connect"
    },
    {
      "id": "p004-notification-3",
      "text": "New job match: Junior Logistics Coordinator · 86%.",
      "time": "3 days ago",
      "view": "p004"
    }
  ]
} as const;

export const FAQS = [
  {
    "question": "Is my one LTA Account really enough for everything?",
    "answer": "Yes. The same login opens Course Shortlisting, Connect, Zenna and Project004 (when live). If a product is locked, your account simply doesn't have that entitlement yet — nothing to re-register."
  },
  {
    "question": "Can my parents see my application progress?",
    "answer": "Yes — WhatsApp updates can include a family member, and your Zenna overview is designed to be readable without any tech knowledge."
  },
  {
    "question": "Is the chance checker really honest?",
    "answer": "It's 60–70% accurate on basic data, and we say so openly. Anyone promising a \"100% admission guarantee\" to German public universities is not being honest with you."
  }
] as const;

export const HELP_CARDS = [
  {
    "title": "WhatsApp us",
    "text": "Fastest reply · usually within 2 hours, IST daytime"
  },
  {
    "title": "Book a call",
    "text": "15-minute video call with our team — free"
  },
  {
    "title": "Email",
    "text": "info@letterstoabroad.com · replies within 1 day"
  }
] as const;
