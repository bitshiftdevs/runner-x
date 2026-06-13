import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import {
  profiles,
  jobs,
  messages,
  ratings,
  payments,
  jobStages,
} from "../src/db/schema";

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/main";

const sql = postgres(DATABASE_URL);
const db = drizzle(sql);

// ── Image helpers ─────────────────────────────────────────────────────────────
// randomuser.me portraits — indices 1-99 for men, 1-99 for women
const avatar = (gender: "men" | "women", n: number) =>
  `https://randomuser.me/api/portraits/${gender}/${n}.jpg`;

// picsum.photos provides stable landscape photos keyed by a numeric ID
const photo = (id: number, w = 640, h = 400) =>
  `https://picsum.photos/id/${id}/${w}/${h}`;

// ── Seed data ─────────────────────────────────────────────────────────────────

const SEED_PROFILES = [
  // Runners
  {
    fullName: "Kwame Asante",
    email: "kwame.asante@st.knust.edu.gh",
    phone: "+233241000001",
    photoUrl: avatar("men", 11),
    bio: "Final year CS student. Fast on two wheels, reliable on foot.",
    role: "runner" as const,
    studentIdVerified: true,
    campus: "KNUST",
    rating: "4.90",
    totalJobs: 87,
  },
  {
    fullName: "Abena Mensah",
    email: "abena.mensah@st.knust.edu.gh",
    phone: "+233241000002",
    photoUrl: avatar("women", 22),
    bio: "Nursing student. I run errands between lectures. DM anytime.",
    role: "runner" as const,
    studentIdVerified: true,
    campus: "KNUST",
    rating: "4.75",
    totalJobs: 64,
  },
  {
    fullName: "Yaw Darko",
    email: "yaw.darko@st.knust.edu.gh",
    phone: "+233241000003",
    photoUrl: avatar("men", 33),
    bio: "Mechanical Engineering. Motorbike delivery across campus.",
    role: "runner" as const,
    studentIdVerified: false,
    campus: "KNUST",
    rating: "4.60",
    totalJobs: 43,
  },
  {
    fullName: "Ama Osei",
    email: "ama.osei@st.knust.edu.gh",
    phone: "+233241000004",
    photoUrl: avatar("women", 44),
    bio: "Business student turned delivery queen. No quest too small.",
    role: "runner" as const,
    studentIdVerified: true,
    campus: "KNUST",
    rating: "4.85",
    totalJobs: 112,
  },
  {
    fullName: "Kofi Boateng",
    email: "kofi.boateng@st.knust.edu.gh",
    phone: "+233241000005",
    photoUrl: avatar("men", 55),
    bio: "Architecture student. I know every corner of this campus.",
    role: "runner" as const,
    studentIdVerified: true,
    campus: "KNUST",
    rating: "4.70",
    totalJobs: 58,
  },
  {
    fullName: "Efua Ankrah",
    email: "efua.ankrah@st.knust.edu.gh",
    phone: "+233241000006",
    photoUrl: avatar("women", 12),
    bio: "Pharmacy student. Accurate, careful, and always on time.",
    role: "runner" as const,
    studentIdVerified: false,
    campus: "KNUST",
    rating: "4.50",
    totalJobs: 29,
  },
  {
    fullName: "Kwabena Poku",
    email: "kwabena.poku@st.knust.edu.gh",
    phone: "+233241000007",
    photoUrl: avatar("men", 7),
    bio: "Mathematics. Precision in numbers, precision in delivery.",
    role: "runner" as const,
    studentIdVerified: true,
    campus: "KNUST",
    rating: "4.95",
    totalJobs: 145,
  },
  {
    fullName: "Adwoa Frimpong",
    email: "adwoa.frimpong@st.knust.edu.gh",
    phone: "+233241000008",
    photoUrl: avatar("women", 68),
    bio: "Law student. I handle your quests with legal precision.",
    role: "runner" as const,
    studentIdVerified: true,
    campus: "KNUST",
    rating: "4.80",
    totalJobs: 76,
  },
  // Requesters
  {
    fullName: "Nana Adu",
    email: "nana.adu@st.knust.edu.gh",
    phone: "+233241000009",
    photoUrl: avatar("men", 18),
    bio: "Level 200 EE student. Too many labs, too little time.",
    role: "requester" as const,
    studentIdVerified: true,
    campus: "KNUST",
    rating: "4.40",
    totalJobs: 22,
  },
  {
    fullName: "Akosua Amponsah",
    email: "akosua.amponsah@st.knust.edu.gh",
    phone: "+233241000010",
    photoUrl: avatar("women", 31),
    bio: "Chemistry student. Prefer to stay in the lab.",
    role: "requester" as const,
    studentIdVerified: false,
    campus: "KNUST",
    rating: "4.20",
    totalJobs: 15,
  },
  {
    fullName: "Fiifi Baidoo",
    email: "fiifi.baidoo@st.knust.edu.gh",
    phone: "+233241000011",
    photoUrl: avatar("men", 42),
    bio: "Computer Science. Always coding, rarely cooking.",
    role: "requester" as const,
    studentIdVerified: true,
    campus: "KNUST",
    rating: "4.60",
    totalJobs: 37,
  },
  {
    fullName: "Maame Serwah",
    email: "maame.serwah@st.knust.edu.gh",
    phone: "+233241000012",
    photoUrl: avatar("women", 57),
    bio: "Medicine student. On-call 24/7, quests save my day.",
    role: "requester" as const,
    studentIdVerified: true,
    campus: "KNUST",
    rating: "4.80",
    totalJobs: 51,
  },
  // Both roles
  {
    fullName: "Kweku Asiedu",
    email: "kweku.asiedu@st.knust.edu.gh",
    phone: "+233241000013",
    photoUrl: avatar("men", 63),
    bio: "Hustle hard, study harder. I run and I post.",
    role: "both" as const,
    studentIdVerified: true,
    campus: "KNUST",
    rating: "4.65",
    totalJobs: 89,
  },
  {
    fullName: "Araba Nyarko",
    email: "araba.nyarko@st.knust.edu.gh",
    phone: "+233241000014",
    photoUrl: avatar("women", 9),
    bio: "Textile Engineering. I run quests to fund my fabric addiction.",
    role: "both" as const,
    studentIdVerified: false,
    campus: "KNUST",
    rating: "4.55",
    totalJobs: 47,
  },
  {
    fullName: "Kojo Ofori",
    email: "kojo.ofori@st.knust.edu.gh",
    phone: "+233241000015",
    photoUrl: avatar("men", 27),
    bio: "Civil Engineering. Built for endurance. I'll carry your load.",
    role: "both" as const,
    studentIdVerified: true,
    campus: "KNUST",
    rating: "4.72",
    totalJobs: 93,
  },
  {
    fullName: "Akua Bonsu",
    email: "akua.bonsu@st.knust.edu.gh",
    phone: "+233241000016",
    photoUrl: avatar("women", 38),
    bio: "Social Work student. Community-minded runner.",
    role: "both" as const,
    studentIdVerified: true,
    campus: "KNUST",
    rating: "4.88",
    totalJobs: 120,
  },
  {
    fullName: "Nii Laryea",
    email: "nii.laryea@st.knust.edu.gh",
    phone: "+233241000017",
    photoUrl: avatar("men", 50),
    bio: "Statistics. Probability that I deliver on time: 99%.",
    role: "both" as const,
    studentIdVerified: true,
    campus: "KNUST",
    rating: "4.91",
    totalJobs: 137,
  },
  {
    fullName: "Esi Quansah",
    email: "esi.quansah@st.knust.edu.gh",
    phone: "+233241000018",
    photoUrl: avatar("women", 74),
    bio: "Food Science student. I know good food spots on campus.",
    role: "both" as const,
    studentIdVerified: false,
    campus: "KNUST",
    rating: "4.45",
    totalJobs: 32,
  },
  {
    fullName: "Ato Mensah",
    email: "ato.mensah@st.knust.edu.gh",
    phone: "+233241000019",
    photoUrl: avatar("men", 81),
    bio: "Philosophy student. Thinking and running aren't mutually exclusive.",
    role: "both" as const,
    studentIdVerified: true,
    campus: "KNUST",
    rating: "4.30",
    totalJobs: 18,
  },
  {
    fullName: "Abiba Alhassan",
    email: "abiba.alhassan@st.knust.edu.gh",
    phone: "+233241000020",
    photoUrl: avatar("women", 60),
    bio: "Development Studies. Running quests builds community.",
    role: "both" as const,
    studentIdVerified: true,
    campus: "KNUST",
    rating: "4.78",
    totalJobs: 66,
  },
];

type JobInsert = typeof jobs.$inferInsert;

function makeJob(
  requesterId: string,
  runnerId: string | null,
  overrides: Partial<JobInsert>
): JobInsert {
  const base = 5.0;
  const dist = 2.0;
  const urg = 0;
  const cat = 0;
  const total = base + dist + urg + cat;
  return {
    requesterId,
    runnerId,
    title: "Generic Quest",
    description: "A generic quest description.",
    category: "general_errands",
    urgency: "normal",
    pickupLocation: { lat: 6.673, lng: -1.565, address: "Unity Hall, KNUST" },
    deliveryLocation: {
      lat: 6.675,
      lng: -1.567,
      address: "Great Hall, KNUST",
    },
    baseFee: String(base),
    distanceFee: String(dist),
    urgencyFee: String(urg),
    categoryFee: String(cat),
    totalFee: String(total),
    runnerEarnings: String(total * 0.8),
    platformFee: String(total * 0.2),
    status: "posted",
    photoUrls: [],
    ...overrides,
  };
}

async function main() {
  console.log("🌱 Seeding database…");

  // 1. Wipe existing seed data (order matters for FK constraints)
  await db.delete(payments);
  await db.delete(ratings);
  await db.delete(messages);
  await db.delete(jobStages);
  await db.delete(jobs);
  await db.delete(profiles);
  console.log("  ✓ Cleared existing data");

  // 2. Insert profiles
  const insertedProfiles = await db
    .insert(profiles)
    .values(SEED_PROFILES)
    .returning();
  console.log(`  ✓ Inserted ${insertedProfiles.length} profiles`);

  // Handy lookup by email
  const byEmail = Object.fromEntries(
    insertedProfiles.map((p) => [p.email, p])
  );

  const runners = insertedProfiles.filter(
    (p) => p.role === "runner" || p.role === "both"
  );
  const requesters = insertedProfiles.filter(
    (p) => p.role === "requester" || p.role === "both"
  );

  const r = (arr: typeof insertedProfiles) =>
    arr[Math.floor(Math.random() * arr.length)];

  // 3. Insert jobs
  const jobsToInsert: JobInsert[] = [
    // ── Completed jobs ────────────────────────────────────────────────────────
    makeJob(r(requesters).id, r(runners).id, {
      title: "KFC Family Feast — Cathedral & New Site delivery",
      description:
        "Pick up a family bucket (8 pc + 4 sides) from KFC near the main gate and bring it to New Site Block C, Room 204.",
      category: "food_drinks",
      urgency: "30min",
      vendorName: "KFC KNUST",
      pickupLocation: {
        lat: 6.6694,
        lng: -1.5654,
        address: "KFC Main Gate, KNUST",
      },
      deliveryLocation: {
        lat: 6.678,
        lng: -1.572,
        address: "New Site Block C Rm 204",
      },
      baseFee: "5.00",
      distanceFee: "3.50",
      urgencyFee: "5.00",
      categoryFee: "1.50",
      totalFee: "15.00",
      runnerEarnings: "12.00",
      platformFee: "3.00",
      status: "completed",
      photoUrls: [photo(292), photo(431)],
    }),
    makeJob(r(requesters).id, r(runners).id, {
      title: "Biochemistry lab manual — Balme Library",
      description:
        "Collect my reserved lab manual (Biochemistry 301) from Balme Library counter and drop at College of Science building, Room 108.",
      category: "academic_materials",
      urgency: "normal",
      pickupLocation: {
        lat: 6.6717,
        lng: -1.5667,
        address: "Balme Library Counter",
      },
      deliveryLocation: {
        lat: 6.6698,
        lng: -1.566,
        address: "College of Science Rm 108",
      },
      baseFee: "5.00",
      distanceFee: "1.50",
      urgencyFee: "0.00",
      categoryFee: "2.00",
      totalFee: "8.50",
      runnerEarnings: "6.80",
      platformFee: "1.70",
      status: "completed",
      photoUrls: [photo(256), photo(174)],
    }),
    makeJob(r(requesters).id, r(runners).id, {
      title: "Laundry pickup from Conti Hall",
      description:
        "Collect laundry bag from Conti Hall Room 3B and drop at Unity Hall Room 12A.",
      category: "pickup_delivery",
      urgency: "normal",
      pickupLocation: {
        lat: 6.6745,
        lng: -1.5721,
        address: "Continental Hall Rm 3B",
      },
      deliveryLocation: {
        lat: 6.672,
        lng: -1.568,
        address: "Unity Hall Rm 12A",
      },
      baseFee: "5.00",
      distanceFee: "2.50",
      urgencyFee: "0.00",
      categoryFee: "0.00",
      totalFee: "7.50",
      runnerEarnings: "6.00",
      platformFee: "1.50",
      status: "completed",
      photoUrls: [photo(326)],
    }),
    makeJob(r(requesters).id, r(runners).id, {
      title: "Charger & power bank from SRC building",
      description:
        "My power bank and charger are in the SRC games room locker. Please collect with the key I'll share and drop at Casely Hayford Hall.",
      category: "pickup_delivery",
      urgency: "15min",
      pickupLocation: {
        lat: 6.673,
        lng: -1.5673,
        address: "SRC Games Room, KNUST",
      },
      deliveryLocation: {
        lat: 6.676,
        lng: -1.571,
        address: "Casely Hayford Hall",
      },
      baseFee: "5.00",
      distanceFee: "2.00",
      urgencyFee: "3.00",
      categoryFee: "0.00",
      totalFee: "10.00",
      runnerEarnings: "8.00",
      platformFee: "2.00",
      status: "completed",
      photoUrls: [photo(48)],
    }),
    makeJob(r(requesters).id, r(runners).id, {
      title: "Breakfast from Food Court — Pinkies waakye",
      description:
        "One large waakye with fried egg, wele, and extra stew. I'll tip if it arrives hot.",
      category: "food_drinks",
      urgency: "10min",
      vendorName: "Pinkies Food Court",
      pickupLocation: {
        lat: 6.6706,
        lng: -1.5683,
        address: "Pinkies Food Court, KNUST",
      },
      deliveryLocation: {
        lat: 6.671,
        lng: -1.566,
        address: "Brunei Hall Rm 202",
      },
      baseFee: "5.00",
      distanceFee: "1.00",
      urgencyFee: "8.00",
      categoryFee: "1.50",
      totalFee: "15.50",
      runnerEarnings: "12.40",
      platformFee: "3.10",
      status: "completed",
      photoUrls: [photo(103), photo(429)],
    }),
    makeJob(r(requesters).id, r(runners).id, {
      title: "Print 3 engineering drawings — Computer Lab B",
      description:
        "CAD files are in my email. Log in on Lab B PC-07, open the files and print on A1 paper. I'll pay for the paper separately.",
      category: "academic_materials",
      urgency: "30min",
      pickupLocation: {
        lat: 6.6738,
        lng: -1.5659,
        address: "Computer Lab B, KNUST",
      },
      deliveryLocation: {
        lat: 6.675,
        lng: -1.567,
        address: "College of Engineering Atrium",
      },
      baseFee: "5.00",
      distanceFee: "1.50",
      urgencyFee: "5.00",
      categoryFee: "2.00",
      totalFee: "13.50",
      runnerEarnings: "10.80",
      platformFee: "2.70",
      status: "completed",
      photoUrls: [photo(214)],
    }),
    makeJob(r(requesters).id, r(runners).id, {
      title: "Airtel top-up GHS 20",
      description: "Top up Airtel number 0241000009 with GHS 20 credit.",
      category: "general_errands",
      urgency: "normal",
      pickupLocation: {
        lat: 6.6715,
        lng: -1.568,
        address: "Vodafone kiosk near Main Gate",
      },
      deliveryLocation: {
        lat: 6.6715,
        lng: -1.568,
        address: "Virtual — receipt photo required",
      },
      baseFee: "5.00",
      distanceFee: "0.50",
      urgencyFee: "0.00",
      categoryFee: "0.00",
      totalFee: "5.50",
      runnerEarnings: "4.40",
      platformFee: "1.10",
      status: "completed",
      photoUrls: [],
    }),
    makeJob(r(requesters).id, r(runners).id, {
      title: "Evening snack run — Chicken Inn + Malta",
      description:
        "Two Chicken Inn spicy burgers and two Malta Guinness cans from the shop near ATL Hall.",
      category: "food_drinks",
      urgency: "normal",
      vendorName: "Chicken Inn KNUST",
      pickupLocation: {
        lat: 6.6762,
        lng: -1.5698,
        address: "Chicken Inn ATL Hall area",
      },
      deliveryLocation: {
        lat: 6.677,
        lng: -1.568,
        address: "ATL Hall Rm 508",
      },
      baseFee: "5.00",
      distanceFee: "1.00",
      urgencyFee: "0.00",
      categoryFee: "1.50",
      totalFee: "7.50",
      runnerEarnings: "6.00",
      platformFee: "1.50",
      status: "completed",
      photoUrls: [photo(452)],
    }),
    makeJob(r(requesters).id, r(runners).id, {
      title: "Collect letter from Dean's office",
      description:
        "Collect my admission verification letter from the Dean's office (Faculty of Engineering) and bring to Hall.",
      category: "general_errands",
      urgency: "normal",
      pickupLocation: {
        lat: 6.6742,
        lng: -1.567,
        address: "Dean's Office, Faculty of Engineering",
      },
      deliveryLocation: {
        lat: 6.6753,
        lng: -1.5705,
        address: "Queen Elizabeth Hall Rm 14B",
      },
      baseFee: "5.00",
      distanceFee: "2.00",
      urgencyFee: "0.00",
      categoryFee: "0.00",
      totalFee: "7.00",
      runnerEarnings: "5.60",
      platformFee: "1.40",
      status: "completed",
      photoUrls: [],
    }),
    makeJob(r(requesters).id, r(runners).id, {
      title: "Return library books — 3 items",
      description:
        "Three overdue library books need to go back to Balme Library. Please scan them in at the return counter.",
      category: "academic_materials",
      urgency: "normal",
      pickupLocation: {
        lat: 6.6738,
        lng: -1.5682,
        address: "Independence Hall Rm 201",
      },
      deliveryLocation: {
        lat: 6.6717,
        lng: -1.5667,
        address: "Balme Library Return Counter",
      },
      baseFee: "5.00",
      distanceFee: "2.50",
      urgencyFee: "0.00",
      categoryFee: "2.00",
      totalFee: "9.50",
      runnerEarnings: "7.60",
      platformFee: "1.90",
      status: "completed",
      photoUrls: [photo(133)],
    }),

    // ── Active / in-progress jobs ─────────────────────────────────────────────
    makeJob(r(requesters).id, r(runners).id, {
      title: "Jollof rice + fried plantain from Kitchen 47",
      description:
        "Large jollof with extra plantain and a bottle of water. Room is on 3rd floor.",
      category: "food_drinks",
      urgency: "15min",
      vendorName: "Kitchen 47",
      pickupLocation: {
        lat: 6.672,
        lng: -1.5655,
        address: "Kitchen 47, KNUST",
      },
      deliveryLocation: {
        lat: 6.676,
        lng: -1.568,
        address: "Katanga Hall 3rd Floor",
      },
      baseFee: "5.00",
      distanceFee: "2.00",
      urgencyFee: "3.00",
      categoryFee: "1.50",
      totalFee: "11.50",
      runnerEarnings: "9.20",
      platformFee: "2.30",
      status: "heading_to_vendor",
      photoUrls: [],
    }),
    makeJob(r(requesters).id, r(runners).id, {
      title: "Biology past questions — SRC bookshop",
      description:
        "Pick up Biology 201 past question booklets (2019–2023) from SRC bookshop.",
      category: "academic_materials",
      urgency: "normal",
      pickupLocation: {
        lat: 6.6724,
        lng: -1.5671,
        address: "SRC Bookshop, KNUST",
      },
      deliveryLocation: {
        lat: 6.673,
        lng: -1.5695,
        address: "Republic Hall Rm 307",
      },
      baseFee: "5.00",
      distanceFee: "1.50",
      urgencyFee: "0.00",
      categoryFee: "2.00",
      totalFee: "8.50",
      runnerEarnings: "6.80",
      platformFee: "1.70",
      status: "accepted",
      photoUrls: [],
    }),
    makeJob(r(requesters).id, r(runners).id, {
      title: "iPhone cable from GiZland",
      description:
        "Buy one MFi-certified iPhone lightning cable from GiZland shop on campus.",
      category: "pickup_delivery",
      urgency: "30min",
      vendorName: "GiZland Electronics",
      pickupLocation: {
        lat: 6.6705,
        lng: -1.5649,
        address: "GiZland Electronics, KNUST",
      },
      deliveryLocation: {
        lat: 6.671,
        lng: -1.566,
        address: "Brunei Hall Rm 405",
      },
      baseFee: "5.00",
      distanceFee: "1.50",
      urgencyFee: "5.00",
      categoryFee: "0.00",
      totalFee: "11.50",
      runnerEarnings: "9.20",
      platformFee: "2.30",
      status: "at_vendor",
      photoUrls: [],
    }),
    makeJob(r(requesters).id, r(runners).id, {
      title: "Coconut water × 4 — Sports Complex kiosk",
      description:
        "Four chilled coconut water bottles from the kiosk by the sports complex.",
      category: "food_drinks",
      urgency: "10min",
      vendorName: "Sports Complex Kiosk",
      pickupLocation: {
        lat: 6.6755,
        lng: -1.5629,
        address: "Sports Complex Kiosk",
      },
      deliveryLocation: {
        lat: 6.6748,
        lng: -1.5651,
        address: "Queen Elizabeth Hall Poolside",
      },
      baseFee: "5.00",
      distanceFee: "1.00",
      urgencyFee: "8.00",
      categoryFee: "1.50",
      totalFee: "15.50",
      runnerEarnings: "12.40",
      platformFee: "3.10",
      status: "heading_to_delivery",
      photoUrls: [photo(339)],
    }),
    makeJob(r(requesters).id, null, {
      title: "Scan & email 10-page handout — Library Copy Center",
      description:
        "Handout is at the library copy center under my name (Fiifi Baidoo). Scan and email to fiifi@knust.edu.gh.",
      category: "academic_materials",
      urgency: "normal",
      pickupLocation: {
        lat: 6.6717,
        lng: -1.5667,
        address: "Balme Library Copy Center",
      },
      deliveryLocation: {
        lat: 6.6717,
        lng: -1.5667,
        address: "Virtual — email delivery",
      },
      baseFee: "5.00",
      distanceFee: "0.50",
      urgencyFee: "0.00",
      categoryFee: "2.00",
      totalFee: "7.50",
      runnerEarnings: "6.00",
      platformFee: "1.50",
      status: "posted",
      photoUrls: [],
    }),
    makeJob(r(requesters).id, null, {
      title: "Puff-puff and tea — Morning glory stall",
      description:
        "6 puff-puff and one milo tea from Morning Glory stall near the main entrance.",
      category: "food_drinks",
      urgency: "normal",
      vendorName: "Morning Glory Stall",
      pickupLocation: {
        lat: 6.671,
        lng: -1.564,
        address: "Morning Glory Stall, Main Entrance",
      },
      deliveryLocation: {
        lat: 6.6742,
        lng: -1.568,
        address: "New Site Hall Block A Rm 109",
      },
      baseFee: "5.00",
      distanceFee: "3.00",
      urgencyFee: "0.00",
      categoryFee: "1.50",
      totalFee: "9.50",
      runnerEarnings: "7.60",
      platformFee: "1.90",
      status: "posted",
      photoUrls: [],
    }),
    makeJob(r(requesters).id, null, {
      title: "Photocopy 50 pages — Exam prep notes",
      description:
        "Photocopy my exam prep notes (50 double-sided pages, A4) at the library copy center.",
      category: "academic_materials",
      urgency: "15min",
      pickupLocation: {
        lat: 6.6735,
        lng: -1.568,
        address: "Unity Hall Rm 7C",
      },
      deliveryLocation: {
        lat: 6.6717,
        lng: -1.5667,
        address: "Balme Library Copy Center",
      },
      baseFee: "5.00",
      distanceFee: "2.00",
      urgencyFee: "3.00",
      categoryFee: "2.00",
      totalFee: "12.00",
      runnerEarnings: "9.60",
      platformFee: "2.40",
      status: "posted",
      photoUrls: [],
    }),
    makeJob(r(requesters).id, null, {
      title: "Buy Panadol + hand sanitizer — Campus pharmacy",
      description:
        "One pack Panadol Extra and one 100ml Dettol hand sanitizer from the campus pharmacy.",
      category: "general_errands",
      urgency: "30min",
      vendorName: "Campus Pharmacy",
      pickupLocation: {
        lat: 6.6709,
        lng: -1.5648,
        address: "KNUST Campus Pharmacy",
      },
      deliveryLocation: {
        lat: 6.676,
        lng: -1.571,
        address: "Casely Hayford Hall Rm 22",
      },
      baseFee: "5.00",
      distanceFee: "3.50",
      urgencyFee: "5.00",
      categoryFee: "0.00",
      totalFee: "13.50",
      runnerEarnings: "10.80",
      platformFee: "2.70",
      status: "posted",
      photoUrls: [],
    }),
    makeJob(r(requesters).id, null, {
      title: "Pick up package at main gate security",
      description:
        "A package was left for me at the main gate security post. Please collect and bring to Hall.",
      category: "pickup_delivery",
      urgency: "normal",
      pickupLocation: {
        lat: 6.6694,
        lng: -1.5654,
        address: "KNUST Main Gate Security Post",
      },
      deliveryLocation: {
        lat: 6.675,
        lng: -1.568,
        address: "Independence Hall Rm 104",
      },
      baseFee: "5.00",
      distanceFee: "4.00",
      urgencyFee: "0.00",
      categoryFee: "0.00",
      totalFee: "9.00",
      runnerEarnings: "7.20",
      platformFee: "1.80",
      status: "posted",
      photoUrls: [],
    }),
    makeJob(r(requesters).id, null, {
      title: "Shoebox delivery — Sports Hall to Conti",
      description:
        "My new trainers are at the Sports Hall office. Please collect and bring to Continental Hall.",
      category: "pickup_delivery",
      urgency: "normal",
      pickupLocation: {
        lat: 6.6757,
        lng: -1.563,
        address: "Sports Hall Office, KNUST",
      },
      deliveryLocation: {
        lat: 6.6745,
        lng: -1.572,
        address: "Continental Hall Rm 7A",
      },
      baseFee: "5.00",
      distanceFee: "3.50",
      urgencyFee: "0.00",
      categoryFee: "0.00",
      totalFee: "8.50",
      runnerEarnings: "6.80",
      platformFee: "1.70",
      status: "posted",
      photoUrls: [],
    }),
    makeJob(r(requesters).id, null, {
      title: "Gari and groundnut from Osei Stores",
      description:
        "Half kg of gari and one small pack of roasted groundnuts from Osei Stores near SRC.",
      category: "food_drinks",
      urgency: "normal",
      vendorName: "Osei Stores",
      pickupLocation: {
        lat: 6.6728,
        lng: -1.5668,
        address: "Osei Stores, near SRC",
      },
      deliveryLocation: {
        lat: 6.676,
        lng: -1.57,
        address: "Katanga Hall Rm 14",
      },
      baseFee: "5.00",
      distanceFee: "2.50",
      urgencyFee: "0.00",
      categoryFee: "1.50",
      totalFee: "9.00",
      runnerEarnings: "7.20",
      platformFee: "1.80",
      status: "posted",
      photoUrls: [],
    }),
    makeJob(r(requesters).id, null, {
      title: "Charge my power bank at the Engineering Lab",
      description:
        "Drop my power bank at Engineering Lab socket 12 and collect it after 2 hours.",
      category: "general_errands",
      urgency: "normal",
      pickupLocation: {
        lat: 6.6743,
        lng: -1.567,
        address: "Requester's Hall",
      },
      deliveryLocation: {
        lat: 6.674,
        lng: -1.5665,
        address: "Engineering Lab Socket 12",
      },
      baseFee: "5.00",
      distanceFee: "1.00",
      urgencyFee: "0.00",
      categoryFee: "0.00",
      totalFee: "6.00",
      runnerEarnings: "4.80",
      platformFee: "1.20",
      status: "posted",
      photoUrls: [],
    }),
    makeJob(r(requesters).id, null, {
      title: "Collect financial aid form — Bursary",
      description:
        "Collect the financial aid application form from the bursary office.",
      category: "general_errands",
      urgency: "normal",
      pickupLocation: {
        lat: 6.671,
        lng: -1.5665,
        address: "KNUST Bursary Office",
      },
      deliveryLocation: {
        lat: 6.676,
        lng: -1.5698,
        address: "Republic Hall Rm 103",
      },
      baseFee: "5.00",
      distanceFee: "3.50",
      urgencyFee: "0.00",
      categoryFee: "0.00",
      totalFee: "8.50",
      runnerEarnings: "6.80",
      platformFee: "1.70",
      status: "posted",
      photoUrls: [],
    }),
    // Others category
    makeJob(r(requesters).id, r(runners).id, {
      title: "Queue at mobile money agent — MTN",
      description:
        "Queue at the MTN MoMo agent near the main gate and send GHS 50 to 0241000015.",
      category: "others",
      urgency: "normal",
      pickupLocation: {
        lat: 6.6694,
        lng: -1.5654,
        address: "MTN MoMo Agent, Main Gate",
      },
      deliveryLocation: {
        lat: 6.6694,
        lng: -1.5654,
        address: "Virtual — transaction screenshot",
      },
      baseFee: "5.00",
      distanceFee: "0.50",
      urgencyFee: "0.00",
      categoryFee: "0.00",
      totalFee: "5.50",
      runnerEarnings: "4.40",
      platformFee: "1.10",
      status: "completed",
      photoUrls: [],
    }),
    makeJob(r(requesters).id, null, {
      title: "Water sachet pack — Vendor near Great Hall",
      description:
        "One full sachet pack (30 sachets) of ice-cold water from the vendor near Great Hall.",
      category: "food_drinks",
      urgency: "10min",
      pickupLocation: {
        lat: 6.6712,
        lng: -1.5658,
        address: "Sachet water vendor, Great Hall area",
      },
      deliveryLocation: {
        lat: 6.6738,
        lng: -1.568,
        address: "Unity Hall Common Room",
      },
      baseFee: "5.00",
      distanceFee: "2.50",
      urgencyFee: "8.00",
      categoryFee: "1.50",
      totalFee: "17.00",
      runnerEarnings: "13.60",
      platformFee: "3.40",
      status: "posted",
      photoUrls: [],
    }),
    makeJob(r(requesters).id, r(runners).id, {
      title: "Group project binder — 5 reports bound",
      description:
        "5 project reports (80 pages each) need binding from the printing shop near Balme Library.",
      category: "academic_materials",
      urgency: "15min",
      vendorName: "Quick Print, Balme Library",
      pickupLocation: {
        lat: 6.6718,
        lng: -1.567,
        address: "Quick Print shop, Balme Library",
      },
      deliveryLocation: {
        lat: 6.6745,
        lng: -1.5685,
        address: "Unity Hall Rm 5C",
      },
      baseFee: "5.00",
      distanceFee: "2.50",
      urgencyFee: "3.00",
      categoryFee: "2.00",
      totalFee: "12.50",
      runnerEarnings: "10.00",
      platformFee: "2.50",
      status: "delivered",
      photoUrls: [photo(367)],
    }),
    makeJob(r(requesters).id, r(runners).id, {
      title: "Confirm hall allocation — Student Affairs",
      description:
        "Visit Student Affairs Office and confirm my hall allocation for next semester. Bring printout.",
      category: "general_errands",
      urgency: "normal",
      pickupLocation: {
        lat: 6.671,
        lng: -1.565,
        address: "Student Affairs Office",
      },
      deliveryLocation: {
        lat: 6.672,
        lng: -1.568,
        address: "Brunei Hall Rm 301",
      },
      baseFee: "5.00",
      distanceFee: "2.00",
      urgencyFee: "0.00",
      categoryFee: "0.00",
      totalFee: "7.00",
      runnerEarnings: "5.60",
      platformFee: "1.40",
      status: "confirmed",
      photoUrls: [],
    }),
    makeJob(r(requesters).id, null, {
      title: "Shawarma × 3 — Lebanese Spot",
      description:
        "Three large chicken shawarma from the Lebanese spot near the hospital junction.",
      category: "food_drinks",
      urgency: "30min",
      vendorName: "Lebanese Shawarma Spot",
      pickupLocation: {
        lat: 6.6685,
        lng: -1.5643,
        address: "Lebanese Spot, Hospital Junction",
      },
      deliveryLocation: {
        lat: 6.671,
        lng: -1.567,
        address: "Independence Hall Rm 408",
      },
      baseFee: "5.00",
      distanceFee: "2.50",
      urgencyFee: "5.00",
      categoryFee: "1.50",
      totalFee: "14.00",
      runnerEarnings: "11.20",
      platformFee: "2.80",
      status: "posted",
      photoUrls: [],
    }),
    makeJob(r(requesters).id, r(runners).id, {
      title: "Pick up spectacles from optical center",
      description:
        "My new glasses are ready at the optical center opposite Melcom. Collect and bring to Hall.",
      category: "pickup_delivery",
      urgency: "normal",
      vendorName: "Campus Eye Care Optical",
      pickupLocation: {
        lat: 6.6698,
        lng: -1.5645,
        address: "Campus Eye Care, opposite Melcom",
      },
      deliveryLocation: {
        lat: 6.676,
        lng: -1.571,
        address: "Casely Hayford Hall Rm 31",
      },
      baseFee: "5.00",
      distanceFee: "4.00",
      urgencyFee: "0.00",
      categoryFee: "0.00",
      totalFee: "9.00",
      runnerEarnings: "7.20",
      platformFee: "1.80",
      status: "completed",
      photoUrls: [photo(20)],
    }),
    makeJob(r(requesters).id, null, {
      title: "Fresh kenkey and pepper sauce",
      description:
        "Two wrapped kenkey balls and a medium container of fresh pepper sauce from Madam Abena's stall.",
      category: "food_drinks",
      urgency: "normal",
      vendorName: "Madam Abena's Kenkey Stall",
      pickupLocation: {
        lat: 6.6722,
        lng: -1.5674,
        address: "Madam Abena's Stall, near Republic Hall",
      },
      deliveryLocation: {
        lat: 6.6745,
        lng: -1.569,
        address: "Unity Hall Rm 18",
      },
      baseFee: "5.00",
      distanceFee: "2.00",
      urgencyFee: "0.00",
      categoryFee: "1.50",
      totalFee: "8.50",
      runnerEarnings: "6.80",
      platformFee: "1.70",
      status: "posted",
      photoUrls: [],
    }),
    makeJob(r(requesters).id, null, {
      title: "Return borrowed projector to IT services",
      description:
        "The projector is in Room 22B of the College of Science. Please return it to IT Services office.",
      category: "pickup_delivery",
      urgency: "normal",
      pickupLocation: {
        lat: 6.67,
        lng: -1.5661,
        address: "College of Science Rm 22B",
      },
      deliveryLocation: {
        lat: 6.671,
        lng: -1.5643,
        address: "KNUST IT Services Office",
      },
      baseFee: "5.00",
      distanceFee: "1.50",
      urgencyFee: "0.00",
      categoryFee: "0.00",
      totalFee: "6.50",
      runnerEarnings: "5.20",
      platformFee: "1.30",
      status: "posted",
      photoUrls: [],
    }),
  ];

  const insertedJobs = await db.insert(jobs).values(jobsToInsert).returning();
  console.log(`  ✓ Inserted ${insertedJobs.length} jobs`);

  // 4. Messages for active jobs
  const activeJobs = insertedJobs.filter((j) =>
    ["accepted", "heading_to_vendor", "at_vendor", "heading_to_delivery"].includes(j.status)
  );

  const messagesData = activeJobs.flatMap((job) => [
    {
      jobId: job.id,
      senderId: job.requesterId,
      content: "Hey, are you on your way yet?",
      isSystem: false,
    },
    {
      jobId: job.id,
      senderId: job.runnerId ?? job.requesterId,
      content: "Yes! Just picked it up, heading to you now.",
      isSystem: false,
    },
    {
      jobId: job.id,
      senderId: job.requesterId,
      content: "Thanks! I'm in my room.",
      isSystem: false,
    },
  ]);

  if (messagesData.length > 0) {
    await db.insert(messages).values(messagesData);
    console.log(`  ✓ Inserted ${messagesData.length} messages`);
  }

  // 5. Ratings for completed jobs
  const completedJobs = insertedJobs.filter((j) => j.status === "completed");
  const ratingsData = completedJobs.flatMap((job) => {
    if (!job.runnerId) return [];
    const score = 4 + Math.floor(Math.random() * 2); // 4 or 5
    const reviews = [
      "Super fast and reliable. Will post again!",
      "Delivered everything perfectly.",
      "No issues at all. Great runner.",
      "Arrived on time, items intact.",
      "Excellent service. Five stars easily.",
      "Very professional, communicated well.",
    ];
    return [
      {
        jobId: job.id,
        raterId: job.requesterId,
        rateeId: job.runnerId,
        score,
        comment: reviews[Math.floor(Math.random() * reviews.length)],
      },
    ];
  });

  if (ratingsData.length > 0) {
    await db.insert(ratings).values(ratingsData);
    console.log(`  ✓ Inserted ${ratingsData.length} ratings`);
  }

  // 6. Payments for completed jobs
  const paymentsData = completedJobs.map((job) => ({
    jobId: job.id,
    userId: job.requesterId,
    amount: job.totalFee,
    currency: "GHS",
    provider: "moolre",
    providerRef: `MR-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    status: "success" as const,
  }));

  await db.insert(payments).values(paymentsData);
  console.log(`  ✓ Inserted ${paymentsData.length} payments`);

  console.log("\n✅ Seed complete!");
  await sql.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
