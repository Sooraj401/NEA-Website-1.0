import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import {
  ShieldCheck,
  Scale,
  Search,
  Lock,
  Briefcase,
  FileText,
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  Star,
  Users,
  Award,
  Clock,
  Mail,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Quote,
  CheckCircle2,
  Check, Loader2
} from "lucide-react";
import FloatingActions from "./components/FloatingActions";
import PageLoader from "./components/PageLoader";
import { FaLinkedin, FaLinkedinIn } from "react-icons/fa";

// Clean numeric targets paired with their display suffixes
const stats = [
  { icon: Award, target: 98, suffix: "%", label: "Success Rate" },
  { icon: Users, target: 500, suffix: "+", label: "Clients Represented" },
  { icon: Briefcase, target: 490, suffix: "+", label: "Cases Resolved" },
  { icon: Clock, target: 5, suffix: "+", label: "Years of Experience" },
];

const services = [
  {
    icon: ShieldCheck,
    title: "Bank Account Unfreezing",
    desc: "Expedited legal motions and regulatory compliance to release blocked financial assets.",
  },
  {
    icon: Scale,
    title: "Financial Fraud & Scam Recovery",
    desc: "Strategic asset-tracing, cross-border claims, and swift civil restitution.",
  },
  {
    icon: Lock,
    title: "Cybersecurity & Data Protection",
    desc: "Comprehensive regulatory compliance audits, breach response, and liability shields.",
  },
  {
    icon: FileText,
    title: "Legal Consultation & Retainers",
    desc: "High-stakes advisory for private corporate risk, cyber litigation, and contract dispute.",
  },
  {
    icon: Search,
    title: "Private & Digital Investigation",
    desc: "Discreet evidentiary collection, digital forensics, and investigative intelligence.",
  },
  {
    icon: Briefcase,
    title: "Corporate Due Diligence",
    desc: "M&A verification, background risk assessment, and regulatory compliance screening.",
  },
];

const team = [
  {
    name: "Vimal",
    role: "CEO & Founder of NestEgg Assurance",
    specialty: "High-Value Asset Tracing & Injunctions",
    experience: "5+ Yrs Exp",
    bar: "Founder of NestEgg Assurance",
    img: "/ceo-image.jpeg",
    bio: "Former federal prosecutor specializing in institutional recovery, frozen offshore liquidity, and multi-tier bank dispute litigation.",
    linkedin: "#",
    email: "m.vance@nealegal.com",
  },
  {
    name: "Shinju K S",
    role: "Head of Cyber & Digital Assets",
    specialty: "Ransomware Shield & Crypto Forensics",
    experience: "5+ Yrs Exp",
    bar: "Certified Forensic Legal Specialist",
    img: "/security-analyst.jpeg",
    bio: "Pioneered rapid blockchain address freeze petitions across 14 jurisdictions and sovereign cyber defense compliance frameworks.",
    linkedin: "#",
    email: "e.rostova@nealegal.com",
  },
  {
    name: "Ebin Johny",
    role: "Advocate",
    specialty: "Corporate Espionage & Anti-Fraud",
    experience: "15+ Yrs Exp",
    bar: "ACFE Certified Examiner",
    img: "/lawyer.jpeg",
    bio: "Cyber Law Consultant specializing in digital forensics advisory, cybercrime regulatory compliance, and technology law.",
    linkedin: "#",
    email: "d.sterling@nealegal.com",
  },
];

const testimonials = [
  {
    quote:
      "Their intervention on our frozen operational accounts saved our firm from severe contractual breaches. Handled within 72 hours with zero regulatory friction.",
    client: "TechCorp Logistics",
    author: "Alexander Chen",
    role: "CFO, Global Operations",
    caseType: "Cross-Border Account Freeze",
    rating: 5,
  },
  {
    quote:
      "Discreet, ruthlessly efficient, and technically literate in dealing with multi-jurisdictional cyber extortion and ransom negotiations.",
    client: "Apex Capital Partners",
    author: "Sarah Jenkins, Esq.",
    role: "Managing General Counsel",
    caseType: "Ransomware Defense",
    rating: 5,
  },
  {
    quote:
      "Recovered over $1.8M lost to an unauthorized SWIFT wire diversion. Their forensic tracing speed was unmatched by standard law enforcement channels.",
    client: "Vanguard Maritime Ltd.",
    author: "Dmitri Volkov",
    role: "Director of Asset Protection",
    caseType: "Wire Fraud Recovery",
    rating: 5,
  },
  {
    quote:
      "NEA handled our company's high-stakes whistleblower subpoena with complete discretion and shielded our intellectual infrastructure without public leak.",
    client: "BioSynthetix Labs",
    author: "Claire Moreau",
    role: "Chief Compliance Officer",
    caseType: "Corporate Investigation",
    rating: 5,
  },
];
// Counting component with viewport trigger
function MetricCounter({ target, suffix = "", duration = 2 }) {
  const ref = useRef(null);
  // once: false triggers every time the section enters/leaves view
  const isInView = useInView(ref, { once: false, margin: "-80px" });
  const count = useMotionValue(0);

  const rounded = useTransform(count, (latest) => {
    return Math.floor(latest).toLocaleString() + suffix;
  });

  useEffect(() => {
    if (isInView) {
      // Reset to 0 first, then smoothly animate to the target number
      count.set(0);
      const controls = animate(count, target, {
        duration: duration,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      });
      return controls.stop;
    } else {
      // Reset back to 0 when user leaves the section
      count.set(0);
    }
  }, [isInView, target, duration, count]);

  return (
    <motion.span ref={ref} className="tabular-nums font-extrabold text-white">
      {rounded}
    </motion.span>
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Video Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = React.useRef(null);
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  category: "Frozen Bank Account",
  message: "",
});
const [submitting, setSubmitting] = useState(false);
const [submitStatus, setSubmitStatus] = useState(null);

const handleChange = (e) => {
  setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
};

const handleContactSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setSubmitStatus(null);

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        category: "Frozen Bank Account",
        message: "",
      });
    } else {
      setSubmitStatus("error");
    }
  } catch (err) {
    setSubmitStatus("error");
  } finally {
    setSubmitting(false);
  }
};

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);


    // Allow menu exit animation to start, then smoothly scroll to target section
    setTimeout(() => {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
  };

  return (
    <>
      {loading && <PageLoader onComplete={() => setLoading(false)} />}
      <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-600 selection:text-white font-smooch">
        {/* Navbar */}
        <nav className="fixed md:py-2.5 py-1  left-0 right-0 z-50 bg-transparent backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-24 w-24 object-contain"
            />

            <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-950 bg-slate-100 pl-3 pr-2 py-2 rounded-lg">
              <a
                href="#about"
                className="hover:text-amber-400 transition-colors"
              >
                ABOUT
              </a>
              <a
                href="#services"
                className="hover:text-amber-400 transition-colors"
              >
                SERVICES
              </a>
              <a
                href="#team"
                className="hover:text-amber-400 transition-colors"
              >
                TEAM
              </a>
              <a
                href="#testimonials"
                className="hover:text-amber-400 transition-colors"
              >
                TESTIMONIALS
              </a>
              <div className="relative">
                <a
                  href="#contact"
                  className="w-48 h-10 flex items-center justify-center rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium transition-all shadow-lg shadow-amber-900/20"
                >
                  SCHEDULE CONSULTATION
                </a>
              </div>
            </div>

            <button
              className="md:hidden text-slate-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation Dropdown */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-6 py-6 space-y-4"
              >
                <a
                  href="#about"
                  onClick={(e) => handleNavClick(e, "#about")}
                  className="block text-slate-300 text-lg hover:text-amber-400 transition-colors"
                >
                  About
                </a>
                <a
                  href="#services"
                  onClick={(e) => handleNavClick(e, "#services")}
                  className="block text-slate-300 text-lg hover:text-amber-400 transition-colors"
                >
                  Services
                </a>
                <a
                  href="#team"
                  onClick={(e) => handleNavClick(e, "#team")}
                  className="block text-slate-300 text-lg hover:text-amber-400 transition-colors"
                >
                  Team
                </a>
                <a
                  href="#testimonials"
                  onClick={(e) => handleNavClick(e, "#testimonials")}
                  className="block text-slate-300 text-lg hover:text-amber-400 transition-colors"
                >
                  Testimonials
                </a>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "#contact")}
                  className="block text-center py-3 rounded-lg bg-amber-600 text-white font-medium shadow-md shadow-amber-900/30"
                >
                  SCHEDULE CONSULTATION
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col md:flex-row md:items-center justify-between pt-28 pb-16 md:py-36 overflow-hidden">
          {/* Background Image with Slow Zoom-Out */}
          <motion.img
            src="/hero.png"
            alt="Hero Background"
            initial={{ scale: 1.08, filter: "blur(4px)" }}
            animate={
              !loading
                ? { scale: 1, filter: "blur(0px)" }
                : { scale: 1.08, filter: "blur(4px)" }
            }
            transition={{
              duration: 1.4,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Contrast Vignette Gradient */}
          <div className="absolute inset-0 bg-linear-to-b md:bg-linear-to-r from-slate-950/70 via-slate-950/60 to-slate-950/75" />

          {/* Main Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 w-full flex flex-col items-start justify-center">
            {/* Left Column Content */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={!loading ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
              transition={{
                duration: 0.9,
                delay: 0.2,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              className="max-w-xl w-full flex flex-col items-start"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700 bg-slate-900/80 text-amber-400 text-xs tracking-wider uppercase mb-5 backdrop-blur-md">
                <ShieldCheck size={14} /> Confidential & Regulated Practice
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-5xl font-bold tracking-tight text-white leading-[1.18] sm:leading-tight">
                NestEggAssurance Delivering Trust, Transparency, & Results
              </h1>

              <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-300 max-w-md leading-relaxed">
                Combining legal expertise, technology acumen, and a commitment
                to excellence, NestEggAssurance is a trusted partner for
                individuals and organizations navigating cyber, corporate, and
                general legal challenges.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <a
                  href="#contact"
                  className="w-full sm:w-auto px-7 py-3.5 bg-amber-600 hover:bg-amber-500 rounded-full text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-900/30"
                >
                  Free Consultation
                </a>
                <a
                  href="#services"
                  className="w-full sm:w-auto px-7 py-3.5 bg-slate-900/80 hover:bg-slate-800 rounded-full text-slate-300 font-medium text-sm sm:text-base transition-all flex items-center justify-center gap-2 border border-slate-700 backdrop-blur-sm"
                >
                  Explore Capabilities <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Video Player: Polished mobile centering and margins; exact desktop corner docking preserved */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={
              !loading
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.92, y: 20 }
            }
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 mt-10 md:mt-0 w-full px-5 sm:px-6 md:px-0 max-w-sm sm:max-w-md md:max-w-none md:w-80 lg:w-80 md:absolute md:bottom-20 md:right-20 mx-auto md:mx-0"
          >
            <div
              onClick={togglePlay}
              className="group relative rounded-2xl overflow-hidden bg-slate-950/90 border border-slate-800 hover:border-amber-500/50 shadow-2xl backdrop-blur-xl transition-all duration-300 cursor-pointer p-2"
            >
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900">
                <video
                  ref={videoRef}
                  src="/fraud-calling.mp4"
                  poster="/prev1.png"
                  playsInline
                  muted={isMuted}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-full object-cover"
                />

                <div
                  className={`absolute inset-0 bg-slate-950/40 transition-opacity duration-300 ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
                />

                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-slate-950/80 text-amber-400 border border-amber-500/20 backdrop-blur-sm pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Briefing
                </div>

                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-amber-500/90 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg transition-all ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
                  >
                    {isPlaying ? (
                      <Pause size={16} className="fill-slate-950" />
                    ) : (
                      <Play size={16} className="fill-slate-950 ml-0.5" />
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="absolute top-2.5 right-2.5 z-20 p-1.5 rounded-full bg-slate-950/70 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700/60 backdrop-blur-sm transition-colors"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                </button>
              </div>

              <div className="px-2 pt-2.5 pb-1 flex items-center justify-between pointer-events-none">
                <div>
                  <p className="text-white text-xs font-bold tracking-tight">
                    Cyber Case Briefing
                  </p>
                  <p className="text-slate-400 text-[10px]">
                    Asset tracing & scam defense
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded-md">
                  {isPlaying ? "Playing" : "Watch"}
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Metrics Section with Animated Count-Up */}
        <section className="relative overflow-hidden border-y border-slate-800 bg-slate-950/80 py-20 px-6">
          <div className="absolute inset-0 pointer-events-none -z-10 flex justify-center">
            <div className="w-150 h-50 bg-amber-500/10 blur-[120px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                // Set once: false so the entrance effect replays on repeat visits
                viewport={{ once: false, margin: "-60px" }}
                whileHover={{
                  y: -6,
                  transition: { duration: 0.25, ease: "easeOut" },
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: index * 0.1,
                }}
                className="group relative flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md transition-colors hover:border-amber-500/30 hover:bg-slate-900/70"
              >
                <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                  className="relative p-3 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:bg-amber-500/20 group-hover:text-amber-300 transition-colors shadow-inner"
                >
                  <item.icon size={26} strokeWidth={2.2} />
                </motion.div>

                {/* Metric Number that increases from 0 on every scroll reach */}
                <p className="text-3xl md:text-5xl font-extrabold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-white group-hover:via-slate-100 group-hover:to-amber-200 transition-all">
                  <MetricCounter
                    target={item.target}
                    suffix={item.suffix}
                    duration={1.8 + index * 0.2}
                  />
                </p>

                <p className="text-xs md:text-sm font-medium text-slate-400 uppercase tracking-wider mt-2 group-hover:text-slate-300 transition-colors">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-amber-500 font-semibold tracking-wider uppercase text-xs">
                Firm Profile
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">
                Discreet. Swift. Uncompromising.
              </h2>
              <p className="mt-4 text-slate-400 leading-relaxed">
                Modern financial and digital threats bypass traditional legal
                avenues. Our firm merges seasoned trial attorneys, certified
                cyber specialists, and financial forensic accountants to deliver
                decisive outcomes where ordinary recourse fails.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  "Cross-Border Jurisdictional Reach",
                  "Strict Client Anonymity Standards",
                  "Rapid Emergency Injunction Capability",
                ].map((bullet, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-slate-300"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-linear-to-tr from-amber-600/10 to-slate-800 border border-slate-800 p-8 rounded-2xl relative overflow-hidden">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">
                  Immediate Legal Intervention
                </h3>
                <p className="text-sm text-slate-400">
                  Facing severe regulatory inquiry, unnotified account freeze,
                  or targeted fraud? Time is the key variable in capital
                  recovery.
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center text-amber-400 text-sm font-semibold hover:underline"
                >
                  File an emergency intake ticket <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section
          id="services"
          className="py-24 px-6 bg-slate-900/30 border-t border-slate-800"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-amber-500 font-semibold tracking-wider uppercase text-xs">
                Core Practice Areas
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">
                Targeted Legal & Cyber Solutions
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {services.map((srv, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <srv.icon className="text-amber-500 mb-4" size={32} />
                    <h3 className="text-lg font-bold text-white mb-2">
                      {srv.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                  <a
                    href="#contact"
                    className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-amber-500 hover:text-amber-400"
                  >
                    Request Case Review <ChevronRight size={16} />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section
          id="team"
          className="relative py-28 px-6 bg-slate-950 overflow-hidden"
        >
          {/* Ambient Background Glows */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/5 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/5 blur-[140px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs tracking-widest uppercase mb-4">
                  Partners & Counsel
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                  Practicing Leadership
                </h2>
              </div>
              <p className="text-slate-400 text-sm md:text-base max-w-md leading-relaxed">
                Cross-disciplinary advocates combining federal trial litigators,
                certified blockchain investigators, and forensic accountants.
              </p>
            </div>

            {/* Team Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/90 hover:border-amber-500/50 transition-all duration-500 shadow-2xl h-130 flex flex-col justify-end"
                >
                  {/* Portrait Image with Zoom & Dark Gradient Overlay */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover object-top filter grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                    {/* Cinematic Gradient Fade */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/70 to-transparent" />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:opacity-0 transition-opacity duration-500" />
                  </div>

                  {/* Top Pill Badges */}
                  <div className="absolute top-5 left-5 right-5 z-10 flex items-center justify-between pointer-events-none">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-slate-950/70 text-amber-300 border border-amber-500/20 backdrop-blur-md">
                      {member.experience}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-medium text-slate-300 bg-slate-950/70 border border-slate-800 backdrop-blur-md">
                      {member.bar}
                    </span>
                  </div>

                  {/* Content Card Body */}
                  <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-end">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                      {member.specialty}
                    </span>
                    <h3 className="text-2xl font-bold text-white group-hover:text-amber-200 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {member.role}
                    </p>

                    {/* Expandable Hover Details */}
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-400 ease-out">
                      <div className="overflow-hidden">
                        <p className="text-xs text-slate-300 leading-relaxed pt-3 border-t border-slate-800/80 mt-3 font-normal">
                          {member.bio}
                        </p>

                        {/* Action Contact Links */}
                        <div className="flex items-center gap-3 pt-4">
                          <a
                            href={`mailto:${member.email}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-amber-600 text-white text-xs font-medium transition-colors border border-slate-700"
                            title="Direct Counsel Email"
                          >
                            <Mail size={13} /> Email
                          </a>
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-amber-600 text-slate-200 hover:text-white transition-colors border border-slate-700"
                            title="LinkedIn Profile"
                          >
                            <FaLinkedin size={14} />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Subtle bottom indicator that shifts on hover */}
                    <div className="w-8 h-1 bg-amber-500/40 rounded-full mt-4 group-hover:w-full group-hover:bg-amber-500 transition-all duration-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden border-t border-slate-800/80"
        >
          {/* Ambient Lighting Gradients */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-87.5 bg-amber-500/5 blur-[160px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-5 sm:px-6 relative z-10 mb-14 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs tracking-widest uppercase mb-4 backdrop-blur-md">
              Proven Precedents
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
              Client Retrospective
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
              Direct feedback from enterprises, general counsels, and private
              investors who retained our firm for emergency remediation.
            </p>
          </div>

          {/* Infinite Marquee Strip Container */}
          <div className="relative w-full overflow-hidden flex items-center group">
            {/* Side Edge Fade Gradients for Seamless Infinity Look */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-linear-to-r from-slate-950 via-slate-950/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-linear-to-l from-slate-950 via-slate-950/80 to-transparent z-20 pointer-events-none" />

            {/* Framer Motion Infinite Track (Duplicated list for seamless zero-gap looping) */}
            <motion.div
              className="flex gap-6 shrink-0 py-4 cursor-grab active:cursor-grabbing"
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                ease: "linear",
                duration: 28, // Adjust scroll speed (higher = slower, smoother)
                repeat: Infinity,
              }}
              whileHover={{ transition: { duration: 0 } }} // Pauses smoothly on hover
            >
              {[...testimonials, ...testimonials].map((item, idx) => (
                <div
                  key={idx}
                  className="w-85 sm:w-105 shrink-0 p-7 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 backdrop-blur-xl shadow-2xl transition-all duration-300 flex flex-col justify-between group/card hover:bg-slate-900/90"
                >
                  {/* Card Top: Rating Stars & Decorative Watermark Quote */}
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex gap-1 text-amber-400">
                        {[...Array(item.rating)].map((_, starIdx) => (
                          <Star
                            key={starIdx}
                            size={15}
                            fill="currentColor"
                            strokeWidth={0}
                          />
                        ))}
                      </div>
                      <Quote
                        className="text-amber-500/20 group-hover/card:text-amber-500/40 transition-colors"
                        size={28}
                      />
                    </div>

                    {/* Matter Badge */}
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] uppercase font-semibold tracking-wider bg-slate-950 text-amber-300/90 border border-amber-500/20 mb-4">
                      {item.caseType}
                    </span>

                    {/* Quote Body */}
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed italic font-normal">
                      "{item.quote}"
                    </p>
                  </div>

                  {/* Card Bottom: Client Info */}
                  <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-white text-sm font-bold tracking-tight">
                          {item.author}
                        </h4>
                        <CheckCircle2 size={13} className="text-amber-400" />
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {item.role}
                      </p>
                      <p className="text-slate-500 text-[11px] font-medium mt-0.5">
                        {item.client}
                      </p>
                    </div>

                    {/* Initials Badge Avatar */}
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                      {item.client.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 px-6 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-500 font-semibold tracking-wider uppercase text-xs">
              Confidential Intake
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">
              Initiate Case Assessment
            </h2>
          </div>
         <form
  onSubmit={handleContactSubmit}
  className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 p-8 rounded-2xl border border-slate-800"
>
  <div className="space-y-2">
    <label className="text-xs uppercase text-slate-400 font-medium">Full Legal Name</label>
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 text-sm focus:border-amber-500 focus:outline-none"
      required
    />
  </div>

  <div className="space-y-2">
    <label className="text-xs uppercase text-slate-400 font-medium">Contact Email</label>
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 text-sm focus:border-amber-500 focus:outline-none"
      required
    />
  </div>

  <div className="md:col-span-2 space-y-2">
    <label className="text-xs uppercase text-slate-400 font-medium">Subject / Case Category</label>
    <select
      name="category"
      value={formData.category}
      onChange={handleChange}
      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 text-sm focus:border-amber-500 focus:outline-none"
    >
      <option value="Frozen Bank Account">Frozen Bank Account</option>
      <option value="Digital/Crypto/Scam Asset Recovery">Digital/Crypto/Scam Asset Recovery</option>
      <option value="Cyber Incident Legal Retainer">Cyber Incident Legal Retainer</option>
      <option value="Corporate Investigation / Due Diligence">Corporate Investigation / Due Diligence</option>
    </select>
  </div>

  <div className="md:col-span-2 space-y-2">
    <label className="text-xs uppercase text-slate-400 font-medium">Brief Matter Summary (Confidential)</label>
    <textarea
      rows={4}
      name="message"
      value={formData.message}
      onChange={handleChange}
      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 text-sm focus:border-amber-500 focus:outline-none"
      required
    />
  </div>

  <button
    type="submit"
    disabled={submitting}
    className="md:col-span-2 w-full py-3.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium text-sm transition-all shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2"
  >
    {submitting ? (
      <>
        <Loader2 className="animate-spin" size={18} /> Transmitting Matter...
      </>
    ) : (
      "Submit Case for Priority Review"
    )}
  </button>

  {submitStatus === "success" && (
    <div className="md:col-span-2 p-3 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm flex items-center gap-2">
      <Check size={16} /> Case submitted. Our lead counsel will contact you via encrypted channels.
    </div>
  )}

  {submitStatus === "error" && (
    <div className="md:col-span-2 p-3 bg-red-950/60 border border-red-500/30 text-red-400 rounded-lg text-sm">
      Failed to transmit inquiry. Please email our office directly or try again shortly.
    </div>
  )}
</form>
          <FloatingActions />
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-950 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} NEA Legal Solutions. All rights
              reserved. Communications are protected under standard
              attorney-client privilege.
            </p>
            <div className="flex gap-6 text-xs text-slate-400">
              <a href="#" className="hover:text-amber-500">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-amber-500">
                Terms of Representation
              </a>
              <a href="#" className="hover:text-amber-500">
                Regulatory Disclosures
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
