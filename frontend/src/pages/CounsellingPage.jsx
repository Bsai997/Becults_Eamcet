import { useState } from "react";
import { Share2, FileText, List, ArrowRight, CheckCircle2, ChevronDown, ImageOff } from "lucide-react";
import Header from "../components/landing/Header";
import Footer from "../components/landing/Footer";

const CARDS = [
  { key: "process", icon: Share2, label: "Counselling", label2: "Process" },
  { key: "documents", icon: FileText, label: "Counselling", label2: "Documents" },
  { key: "webOptions", icon: List, label: "Web Options", label2: "Strategy" },
];

// ---- EDIT THESE CONTENT BLOCKS AS NEEDED ----
// For each step's "image", put your screenshot in /public/counselling/<file>.png
// and reference it here as "/counselling/<file>.png". Leave as null until you have one.

const PROCESS_STEPS = [
  {
    title: "Registration & Fee Payment",
    detail: "Fill EAMCET web options registration form and pay the processing fee.",
    image: "/counselling/registration.png",
    subSteps: [
      "Visit the official AP EAPCET counselling portal once the registration link goes live.",
      "Log in using your EAPCET hall ticket number and date of birth.",
      "Verify the personal and academic details that get auto-filled from your application.",
      "Pay the non-refundable processing fee online via debit card, credit card, net banking or UPI (around ₹1,200 for OC/BC, ₹600 for SC/ST).",
      "Save or print the payment receipt and note the reference number / registration ID sent to you by SMS.",
    ],
  },
  {
    title: "Certificate Verification",
    detail: "Get your certificates verified online or at your allotted help line center.",
    image: "/counselling/certificate-verification.png",
    subSteps: [
      "After payment, the portal automatically cross-checks your certificate data against government records.",
      "If everything matches, you'll see \"eligible for exercising options\" and can skip visiting a center.",
      "If verification is incomplete, upload scanned certificates and/or visit your allotted Help Line Center (HLC) with originals plus two photocopy sets.",
      "Candidates claiming special categories (NCC, sports, PH, etc.) must visit an HLC in person regardless of online status.",
      "HLC officers verify the documents and update your eligibility status on the portal.",
    ],
  },
  {
    title: "Web Options Entry",
    detail: "Enter and arrange college + branch preferences in order of priority.",
    image: "/counselling/web-options.png",
    subSteps: [
      "Once marked eligible, log back in during the web-options window.",
      "Browse colleges and branches, cross-checking previous year's closing ranks for realistic choices.",
      "Add your preferred college + branch combinations and arrange them in strict order of priority.",
      "Save your list — you can revise it any number of times until the entry window closes.",
      "Lock/freeze your final options before the deadline; once locked, they can't be changed for that round.",
    ],
  },
  {
    title: "Seat Allotment",
    detail: "Check the seat allotment result released by the counselling authority.",
    image: "/counselling/seat-allotment.png",
    subSteps: [
      "Seats are allotted using your rank, category, local status, and your locked option order against seat availability.",
      "Log in on the allotment date to view your result.",
      "Download the seat allotment order/letter — you'll need this for reporting.",
      "If unsatisfied with your allotment, you may wait for a later round or use the upgrade option, per that year's rules.",
    ],
  },
  {
    title: "Self Reporting / College Reporting",
    detail: "Confirm your seat online and report to the allotted college with required documents.",
    image: "/counselling/self-reporting.png",
    subSteps: [
      "Confirm your allotted seat online (self-report) within the given window, if applicable.",
      "Visit the allotted college in person on the scheduled reporting dates.",
      "Carry the seat allotment letter, original certificates, and required photocopy sets.",
      "Pay the applicable tuition/admission fee at the college.",
      "The college verifies your documents and confirms admission — keep the acknowledgment/receipt safe.",
    ],
  },
];

const DOCUMENTS_BY_CATEGORY = {
  "AP Students": [
    "SSC / 10th Class Memo",
    "Intermediate Marks Memo & Pass Certificate",
    "EAMCET Rank Card",
    "Nativity / Residence Certificate",
    "Income Certificate",
    "Caste Certificate (if applicable)",
    "Aadhar Card",
    "Transfer Certificate (TC)",
    "Study Certificates (Class 6 to Intermediate)",
  ],
  "TG Students": [
    "SSC / 10th Class Memo",
    "Intermediate Marks Memo & Pass Certificate",
    "TS EAMCET Rank Card",
    "Local / Residence Certificate (Telangana)",
    "Income Certificate",
    "Caste Certificate (if applicable)",
    "Aadhar Card",
    "Transfer Certificate (TC)",
  ],
  "Migrated Students": [
    "SSC / 10th Class Memo",
    "Intermediate Marks Memo & Pass Certificate",
    "EAMCET Rank Card",
    "Migration Certificate from previous state board",
    "Bonafide / Study Certificate from institution of migration",
    "Aadhar Card",
    "Parent Employment / Transfer Order (if applicable for nativity)",
  ],
};

const WEB_OPTION_FACTORS = [
  { title: "College Fee", detail: "Compare tuition and hostel fee structures across colleges before ranking your options." },
  { title: "Branch Preference", detail: "Prioritize branches based on interest and placement trends, not just college reputation." },
  { title: "Location & Hostel", detail: "Consider distance from home, hostel availability, and connectivity." },
  { title: "Placement Record", detail: "Check average package, top recruiters, and placement percentage for your branch." },
  { title: "College Rank & Reviews", detail: "Cross-check NIRF ranking and senior reviews before finalizing your option order." },
];

// ----------------------------------------------

function InfoCard({ icon: Icon, label, label2, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 rounded-xl border transition-colors px-6 py-5 w-[150px] sm:w-[170px] ${
        active
          ? "text-white border-transparent shadow-sm"
          : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
      }`}
      style={active ? { backgroundColor: "#1A699F" } : {}}
    >
      <Icon size={24} strokeWidth={1.75} />
      <span className="text-sm font-semibold text-center leading-snug">
        {label}
        <br />
        {label2}
      </span>
    </button>
  );
}

function StepImage({ src, title }) {
  if (!src) {
    return (
      <div className="mt-3 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 py-8 text-slate-400">
        <ImageOff size={22} />
        <span className="text-xs">Add a screenshot for "{title}" in /public/counselling/</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={title}
      className="mt-3 w-full rounded-lg border border-slate-200 object-cover max-h-72"
    />
  );
}

function ProcessPanel() {
  const [openStep, setOpenStep] = useState(0);

  return (
    <ol className="space-y-3 text-left max-w-2xl mx-auto">
      {PROCESS_STEPS.map((step, i) => {
        const isOpen = openStep === i;
        return (
          <li key={step.title} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setOpenStep(isOpen ? -1 : i)}
              className="w-full flex gap-3 items-start px-4 py-3 text-left"
            >
              <span
                className="shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center mt-0.5"
                style={{ backgroundColor: "#1A699F" }}
              >
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{step.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{step.detail}</p>
              </div>
              <ChevronDown
                size={18}
                className={`shrink-0 text-slate-400 transition-transform mt-1 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pl-13 sm:pl-[52px]">
                <ul className="space-y-2 mb-1">
                  {step.subSteps.map((sub, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 size={13} className="shrink-0 mt-0.5" style={{ color: "#D3540D" }} />
                      {sub}
                    </li>
                  ))}
                </ul>
                <StepImage src={step.image} title={step.title} />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function DocumentsPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
      {Object.entries(DOCUMENTS_BY_CATEGORY).map(([category, docs]) => (
        <div key={category} className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-bold mb-3" style={{ color: "#1A699F" }}>
            {category}
          </p>
          <ul className="space-y-2">
            {docs.map((doc) => (
              <li key={doc} className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: "#D3540D" }} />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function WebOptionsPanel() {
  return (
    <ul className="space-y-3 max-w-2xl mx-auto text-left">
      {WEB_OPTION_FACTORS.map((f) => (
        <li key={f.title} className="bg-white rounded-xl border border-slate-200 px-4 py-3">
          <p className="text-sm font-semibold text-slate-800">{f.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{f.detail}</p>
        </li>
      ))}
    </ul>
  );
}

const PANELS = {
  process: ProcessPanel,
  documents: DocumentsPanel,
  webOptions: WebOptionsPanel,
};

export default function CounsellingPage() {
  const [activeCard, setActiveCard] = useState("documents");
  const [doubt, setDoubt] = useState("");
  const [status, setStatus] = useState(null); // null | "sending" | "sent" | "error"

  const ActivePanel = PANELS[activeCard];

  const handleSubmitDoubt = async () => {
    if (!doubt.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/doubts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: doubt }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      setDoubt("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="w-full overflow-x-hidden" style={{ fontFamily: "Inter" }}>
      <Header />

      <main className="bg-white">
        {/* You Know About Counselling? */}
        <section className="w-full" style={{ backgroundColor: "#FBF7F0" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
              You <span className="font-extrabold">Know</span> About
            </h2>
            <div className="mb-2">
              <span
                className="inline-block text-white text-xl md:text-2xl font-extrabold rounded-lg px-6 py-1.5"
                style={{ backgroundColor: "#D3540D" }}
              >
                Counselling ?
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-8">
              Get all EAMCET <span className="font-semibold text-slate-600">counselling information</span> and senior experiences in one place.
            </p>

            <div className="flex flex-row items-center justify-center gap-3 mb-8">
              {CARDS.map((c) => (
                <InfoCard
                  key={c.key}
                  icon={c.icon}
                  label={c.label}
                  label2={c.label2}
                  active={activeCard === c.key}
                  onClick={() => setActiveCard(c.key)}
                />
              ))}
            </div>

            <ActivePanel />
          </div>
        </section>

        {/* EAMCET Rank -> College Join / Doubts */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 flex flex-wrap items-center justify-center gap-2 mb-1">
            <span style={{ color: "#1A699F" }}>EAMCET Rank</span>
            <ArrowRight size={18} className="text-slate-700" />
            <span
              className="text-white text-sm font-semibold rounded-lg px-4 py-1"
              style={{ backgroundColor: "#D3540D" }}
            >
              College Join
            </span>
          </h3>
          <p className="text-base font-bold text-slate-700 mb-5">
            Any Doubts Enter Here
          </p>

          <div className="max-w-lg mx-auto">
            <textarea
              value={doubt}
              onChange={(e) => setDoubt(e.target.value)}
              placeholder="e.g : I Have Doubt in Counselling........"
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 mb-4 resize-none"
              style={{ backgroundColor: "#EAF6FE" }}
            />
            <button
              onClick={handleSubmitDoubt}
              disabled={status === "sending"}
              className="text-white text-sm font-semibold rounded-full px-8 py-2 hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "#1A699F" }}
            >
              {status === "sending" ? "Sending..." : "Submit"}
            </button>

            {status === "sent" && (
              <p className="text-xs text-green-600 mt-3">Your doubt has been sent. We'll get back to you soon.</p>
            )}
            {status === "error" && (
              <p className="text-xs text-red-500 mt-3">Something went wrong. Please try again.</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}