/**
 * Tactile Terminal page contract: an asymmetric work index rather than a
 * conventional landing page. Black and navy establish depth; Orbit Violet
 * (#A78BFA) only indicates interaction, position, and active technical signals.
 */
import { type FormEvent, useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { getCompanionLook } from "@/lib/companionMotion";
import { Document, Page, PDFViewer, StyleSheet, Text, View } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { Draggable } from "gsap/Draggable";
import { gsap } from "gsap";
import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Move,
  Sparkles,
  X,
} from "lucide-react";
import { Tooltip } from "react-tooltip";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

gsap.registerPlugin(Draggable);

type PortfolioState = {
  activeProject: number;
  resumeOpen: boolean;
  setActiveProject: (project: number) => void;
  setResumeOpen: (isOpen: boolean) => void;
};

const usePortfolioStore = create<PortfolioState>()(
  immer((set) => ({
    activeProject: 0,
    resumeOpen: false,
    setActiveProject: (project) => set((state) => { state.activeProject = project; }),
    setResumeOpen: (isOpen) => set((state) => { state.resumeOpen = isOpen; }),
  })),
);

const projects = [
  {
    number: "01",
    year: "2025",
    title: "RAG Financial Chatbot",
    type: "Access-controlled AI assistant",
    description: "A role-aware chatbot for teams retrieving financial insight from a large internal document library.",
    stack: ["Python", "FastAPI", "LangChain", "Gemini API", "ChromaDB", "Streamlit"],
    image: "/Rag_Chatbot.png",
    featured: "5+ departments · 500+ documents · 80% less data-access delay.",
    link: "https://github.com/arkokundu500/RAG_Chatbot"
  },
  {
    number: "02",
    year: "2026",
    title: "AI Video Assistance",
    type: "Youtube Video Summarizer and AI Assistant",
    description: "An AI assistant that can summarize Youtube videos and answer questions about them.",
    stack: ["Python", "ChromaDB", "Mistral AI", "Sarvam AI", "Open AI Whisper", "yt-dlp", "Langchain", "Streamlit"],
    image: "/ai_video_assistant_rag.png",
    featured: "Process Hindi Audio Youtube Videos · AI Assistant · RAG based Q/A system · Chunking system.",
    link: "https://github.com/arkokundu500/AI-Video-Assistant"
  },
  {
    number: "03",
    year: "2025",
    title: "INTERV-AK",
    type: "Remote interview platform",
    description: "A secure and real-time video interviewing platform focused on session clarity and reliable collaboration.",
    stack: ["Next.js", "Tailwind CSS", "Stream API", "Convex", "Clerk"],
    image: "/intervak.png",
    featured: "Real-time encrypted video and audio streaming · Secure session management · User role support.",
    link: "https://intervak-arkokundu2025.vercel.app/"
  },
];

const achievements = [
  {
    index: "A1",
    title: "Coder",
    detail: "Solved 700+ DSA problems on GeeksforGeeks with 3-star coder badge.Building and Testing projects with new technologies and reliable architecture.Focusing on MLOps and DevOps practices for real-world impact.",
  },
  {
    index: "A2",
    title: "Organizer",
    detail: "Organized and facilitated our college hackathon - BINARY - 2025, an event that brought together 150+ students from various colleges to compete and showcase their innovative ideas.",
  },
  {
    index: "A3",
    title: "Researcher",
    detail: "Published research in computer science and engineering innovation, with AI, cloud, and data analytics certifications.",
  },
];

const education = [
  {
    index: "EDU / 01",
    period: "SEP 2023 — AUG 2026",
    institution: "Kalyani Government Engineering College",
    location: "Nadia, India",
    program: "Bachelor of Technology — Electronics & Communication Engineering",
    result: "CGPA 7.33",
  },
  {
    index: "EDU / 02",
    period: "JUN 2020 — AUG 2023",
    institution: "The Calcutta Technical School",
    location: "Kolkata, India",
    program: "Diploma in Engineering & Technology — Computer Science & Technology",
    result: "CGPA 8.70",
  },
];

const devTitles = [
  "INDIAN SOFTWARE DEVELOPER",
  "भारतीय सॉफ़्टवेयर डेवलपर",
  "ভারতীয় সফটওয়্যার ডেভেলপার",
  "भारतीय सॉफ्टवेअर डेव्हलपर",
  "ભારતીય સોફ્ટવેર ડેવલપર",
  "ಭಾರತೀಯ ಸಾಫ್ಟ್ವೇರ್ ಡೆವಲಪರ್",
  "இந்திய மென்பொருள் உருவாக்குநர்",
];

const milestones = [
  {
    title: "Oracle Cloud Certified AI Foundations Associate",
    issuer: "Oracle Cloud Infrastructure",
    date: "Feb 2025",
    type: "Certification",
  },
  {
    title: "JUNIOR SOFTWARE ENGINEER",
    issuer: "Dynamic Pro Technology Solutions",
    date: "Jan 2026 – Feb 2026",
    type: "Internship",
  },
  {
    title: "TCS Codevita Season 13 Qualifier",
    issuer: "Round 1 - 6320 | Round 2 - 344",
    date: "2025",
    type: "Competition",
  },
  {
    title: "Summer Intern at AAI",
    issuer: "Gained comprehensive knowledge of Communication, Navigation, and Surveillance (CNS) systems critical to airport operations.",
    date: "July 2025",
    type: "Internship",
  },
];

const resumeStyles = StyleSheet.create({
  page: { padding: 38, backgroundColor: "#0D0D14", color: "#F0EEF8", fontFamily: "Helvetica" },
  kicker: { color: "#A78BFA", fontSize: 8, letterSpacing: 1.6, marginBottom: 10 },
  name: { fontSize: 27, fontWeight: 700, marginBottom: 3 },
  role: { color: "#B7B3C5", fontSize: 11, marginBottom: 20 },
  line: { height: 1, backgroundColor: "#393547", marginBottom: 20 },
  heading: { color: "#A78BFA", fontSize: 8, letterSpacing: 1.2, marginBottom: 8 },
  body: { color: "#D8D5E4", fontSize: 9.4, lineHeight: 1.45, marginBottom: 15 },
  meta: { color: "#9993AA", fontSize: 8, marginBottom: 3 },
});

function ResumeDocument() {
  return (
    <Document title="Arko Kundu — Resume" author="Arko Kundu">
      <Page size="A4" style={resumeStyles.page}>
        <Text style={resumeStyles.kicker}>ARKO KUNDU / RESUME</Text>
        <Text style={resumeStyles.name}>Arko Kundu</Text>
        <Text style={resumeStyles.role}>Your Friendly Neighbourhood Developer</Text>
        <View style={resumeStyles.line} />
        <Text style={resumeStyles.heading}>PROFILE</Text>
        <Text style={resumeStyles.body}>Software developer building practical web, AI, and real-time product systems with an interest in thoughtful interfaces and reliable implementation.</Text>
        <Text style={resumeStyles.heading}>EDUCATION</Text>
        <Text style={resumeStyles.meta}>KALYANI GOVERNMENT ENGINEERING COLLEGE — SEP 2023 TO AUG 2026</Text>
        <Text style={resumeStyles.body}>Bachelor of Technology, Electronics and Communication Engineering · CGPA 7.33</Text>
        <Text style={resumeStyles.meta}>THE CALCUTTA TECHNICAL SCHOOL — JUN 2020 TO AUG 2023</Text>
        <Text style={resumeStyles.body}>Diploma in Engineering and Technology, Computer Science and Technology · CGPA 8.70</Text>
        <Text style={resumeStyles.heading}>SELECTED PROJECTS</Text>
        <Text style={resumeStyles.meta}>RAG-BASED FINANCIAL CHATBOT WITH ACCESS CONTROL</Text>
        <Text style={resumeStyles.body}>Role-specific Retrieval-Augmented Generation for five or more departments working across 500+ financial documents.</Text>
        <Text style={resumeStyles.meta}>INTERV-AK — REMOTE INTERVIEW PLATFORM</Text>
        <Text style={resumeStyles.body}>A secure video interview platform built with Next.js, Stream API, Clerk, and Convex.</Text>
        <Text style={resumeStyles.heading}>CORE TOOLS</Text>
        <Text style={resumeStyles.body}>Python · C++ · SQL · JavaScript · React · Next.js · Tailwind CSS · FastAPI · OpenCV · LangChain</Text>
      </Page>
    </Document>
  );
}

function scrollToSection(section: string) {
  document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const slabRef = useRef<HTMLDivElement>(null);
  const companionRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(dayjs());
  const [contactOpen, setContactOpen] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [contactDraft, setContactDraft] = useState({ name: "", email: "", subject: "", message: "" });
  const [titleIndex, setTitleIndex] = useState(0);
  const [titleVisible, setTitleVisible] = useState(true);
  const { activeProject, resumeOpen, setActiveProject, setResumeOpen } = usePortfolioStore();
  const contactMutation = trpc.contact.send.useMutation({
    onSuccess: () => {
      setMessageSent(true);
      setContactDraft({ name: "", email: "", subject: "", message: "" });
    },
  });

  const openContactComposer = () => {
    contactMutation.reset();
    setMessageSent(false);
    setContactOpen(true);
  };

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    contactMutation.mutate(contactDraft);
  };

  useEffect(() => {
    const timer = window.setInterval(() => setNow(dayjs()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let timeoutId: number | undefined;
    const intervalId = window.setInterval(() => {
      setTitleVisible(false);
      timeoutId = window.setTimeout(() => {
        setTitleIndex((prev) => (prev + 1) % devTitles.length);
        setTitleVisible(true);
      }, 400);
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const companion = companionRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!companion || reducedMotion || !finePointer) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = companion.getBoundingClientRect();
      const look = getCompanionLook(
        event.clientX,
        event.clientY,
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );
      companion.style.setProperty("--look-x", `${look.x}px`);
      companion.style.setProperty("--look-y", `${look.y}px`);
      companion.style.setProperty("--companion-tilt", `${look.tilt}deg`);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        ".intro-reveal",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07, ease: "power3.out", delay: 0.08 },
      );
      gsap.fromTo(
        ".rule-reveal",
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 0.85, ease: "power3.out", delay: 0.35 },
      );
    }, rootRef);
    const draggable = [orbitRef.current, cubeRef.current, slabRef.current]
      .filter((artifact): artifact is HTMLDivElement => artifact !== null)
      .flatMap((artifact) => Draggable.create(artifact, {
        bounds: "#hero-stage",
        inertia: true,
        onPress: function () { gsap.to(this.target, { scale: 1.025, duration: 0.15 }); },
        onRelease: function () { gsap.to(this.target, { scale: 1, duration: 0.2 }); },
      }));
    return () => {
      draggable.forEach((item) => item.kill());
      context.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="site-noise selection-violet overflow-x-clip bg-[#07070c] text-[#e9e7f1]">
      <div className="persistent-orbit" aria-hidden="true">
        <span className="orbit-ring orbit-ring-a" />
        <span className="orbit-ring orbit-ring-b" />
        <span className="orbit-ring orbit-ring-c" />
        <span className="orbit-core" />
        <span className="orbit-satellite" />
      </div>
      <div ref={companionRef} className="cursor-companion" aria-hidden="true">
        <div className="companion-antenna"><span /></div>
        <div className="companion-shell">
          <div className="companion-face">
            <span className="companion-eye"><i /></span>
            <span className="companion-eye"><i /></span>
            <span className="companion-mouth" />
          </div>
        </div>
        <span className="companion-caption">I CAN WATCH YOU</span>
      </div>
      <aside className="main-rail" aria-label="Primary navigation">
        <div>
          <button onClick={() => scrollToSection("top")} className="group flex items-center gap-3 text-left" aria-label="Back to top">
            <img src="/arko-orbit-mark_4911fc05.png" alt="Arko Kundu mark" className="h-10 w-10 object-contain transition-transform duration-200 group-hover:rotate-12" />
            <span className="font-mono text-[.72rem] tracking-[.12em] text-[#f0eef8]">AK/DEV</span>
          </button>
          <div className="mt-16 flex flex-col">
            {[["01", "WORK", "work"], ["02", "PROFILE", "impact"], ["03", "ABOUT", "about"], ["04", "EDUCATION", "education"], ["05", "CONTACT", "contact"]].map(([num, label, section]) => (
              <button key={section} onClick={() => scrollToSection(section)} className="rail-link text-left">
                <span>{num}</span>{label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3 font-mono text-[.62rem] tracking-[.07em] text-[#817b96]">
          <div className="flex items-center gap-2 text-[#a8a2bb]"><span className="h-1.5 w-1.5 rounded-full bg-[#a78bfa] shadow-[0_0_10px_#a78bfa]" />ALWAYS A DEV</div>
          <p>{now.format("DD MMM YYYY / HH:mm:ss")}</p>
        </div>
      </aside>

      <header className="mobile-header">
        <button onClick={() => scrollToSection("top")} className="flex items-center gap-2" aria-label="Back to top">
          <img src="/arko-orbit-mark_4911fc05.png" alt="Arko Kundu mark" className="h-7 w-7 object-contain" />
          <span className="font-mono text-[.68rem] tracking-[.14em]">AK/DEV</span>
        </button>
        <button onClick={() => scrollToSection("contact")} className="font-mono text-[.62rem] tracking-[.12em] text-[#c9c2e7]">CONTACT ↗</button>
      </header>

      <main className="desktop-offset">
        <section id="top" className="relative min-h-[min(800px,100svh)] overflow-hidden border-b border-white/10" aria-labelledby="hero-title">
          <img src="/arko-hero-orbit_ceab094d.jpg" alt="Abstract midnight orbital composition" className="absolute inset-0 h-full w-full object-cover object-[61%_center] opacity-70" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#07070c_0%,rgba(7,7,12,.93)_34%,rgba(7,7,12,.28)_72%,rgba(7,7,12,.7)_100%)]" />
          <div id="hero-stage" className="constellation artifact-field absolute right-0 top-0 h-full w-[52%] opacity-[.72]">
            <div ref={cubeRef} className="hero-artifact hero-cube" aria-hidden="true">
              <div className="cube-core"><span className="cube-face cube-front" /><span className="cube-face cube-right" /><span className="cube-face cube-top" /></div>
              <span className="artifact-caption">CORE / 01</span>
            </div>
            <div ref={slabRef} className="hero-artifact hero-slab" aria-hidden="true">
              <div className="slab-core"><span className="slab-side slab-top" /><span className="slab-side slab-front" /><span className="slab-side slab-right" /></div>
              <span className="artifact-caption">AXIS / 02</span>
            </div>
          </div>
          <div className="relative mx-auto flex min-h-[min(800px,100svh)] max-w-[1500px] flex-col justify-between px-5 pb-7 pt-8 sm:px-8 lg:px-14 lg:pb-10 lg:pt-11">
            <div className="intro-reveal flex items-center justify-between font-mono text-[.62rem] tracking-[.12em] text-[#aea9be]">
              <span className="flex items-center gap-2"><img src="/arko-orbit-mark_4911fc05.png" alt="" className="h-4 w-4 object-contain" />PORTFOLIO / 2026</span>
              <span className="hidden sm:block">NOT YOUR TYPE DEV</span>
            </div>
            <div className="max-w-5xl pb-12 pt-28 md:pb-24 md:pt-36">
              <div className="intro-reveal section-kicker mb-7">CORPORATE EMPLOYEE</div>
              <p className="intro-reveal friendly-tag">YOUR FRIENDLY NEIGHBOURHOOD DEVELOPER</p>
              <h1 id="hero-title" className="intro-reveal max-w-5xl text-[clamp(3.7rem,9vw,9.25rem)] font-semibold leading-[.83] tracking-[-.08em] text-[#f4f2fb]">
                ARKO<br /><span className="font-normal italic text-[#c8c0ea]">KUNDU</span>
              </h1>
              <div className="intro-reveal mt-6 flex min-h-[2rem] items-center gap-3 font-mono text-[.80rem] tracking-[.12em] text-[#aaa4ba]">
                <img src="/arko-orbit-mark_4911fc05.png" alt="Split orbital monogram" className="h-8 w-8 shrink-0 object-contain" />
                <span
                  className={`transition-all duration-300 ease-in-out ${titleVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-1"
                    }`}
                >
                  {devTitles[titleIndex]}
                </span>
              </div>
              <div className="rule-reveal hairline mt-10 max-w-3xl" />
              <div className="intro-reveal mt-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-md text-[1.02rem] leading-relaxed text-[#c4c0d0] sm:text-[1.1rem]">
                  I am an AI-driven software developer from India, skilled in Full-stack development,Data Science,Gen AI and Agentic AI, passionate about building scalable and intelligent solutions that solve real-world problems.
                </p>
                <button onClick={() => scrollToSection("about")} className="group inline-flex w-fit items-center gap-3 border border-[#a78bfa]/60 bg-[#a78bfa] px-4 py-3 font-mono text-[.68rem] tracking-[.1em] text-[#0b0911] transition hover:bg-[#c0abff] active:scale-[.97]">
                  KNOW ME BETTER <ArrowDownRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-1" />
                </button>
              </div>
            </div>
            <div className="intro-reveal flex items-end justify-between gap-3">
              <p className="font-mono text-[.62rem] leading-relaxed tracking-[.09em] text-[#a5a0b4]">PRACTICAL SYSTEMS.<br />FRIENDLY BUILDER.</p>
              <div ref={orbitRef} className="orbit-note relative z-10 w-[144px] rotate-[-5deg] border border-[#d8ccff]/70 bg-[#8b6de8] p-3 text-[#0c0a12] sm:w-[166px] sm:p-4" data-tooltip-id="drag-tip" data-tooltip-content="You can DRAG me :)">
                <div className="flex items-center justify-between font-mono text-[.57rem] font-medium tracking-[.08em]"><span>MOVE / 01</span><Move className="h-3.5 w-3.5" /></div>
                <p className="mt-7 font-mono text-[.67rem] font-medium leading-snug">HELLO !!!<br />I am a Developer from भारत</p>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="relative border-b border-white/10 px-5 py-20 sm:px-8 lg:px-14 lg:py-28" aria-labelledby="work-title">
          <div className="section-axis hidden lg:block" aria-hidden="true" />
          <div className="absolute right-0 top-0 h-40 w-1/3 bg-[#151329]" />
          <div className="relative mx-auto max-w-[1500px]">
            <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
              <div>
                <div className="section-kicker">01 / PROJECT WORKS</div>
                <h2 id="work-title" className="mt-6 max-w-2xl text-5xl font-semibold leading-[.9] tracking-[-.06em] text-[#f2f0fa] sm:text-7xl">Friendly Systems.<br /><span className="font-normal italic text-[#ada7c2]">Each having purpose.</span></h2>
              </div>
              <p className="max-w-xs border-l border-[#a78bfa] pl-4 font-mono text-[.69rem] leading-relaxed tracking-[.04em] text-[#aaa4ba]">A curated selection of full-stack applications, intelligent AI systems, and real-time platforms engineered for practical, real-world impact.</p>
            </div>
            <div className="mt-16 grid gap-x-6 gap-y-14 lg:grid-cols-3">
              {projects.map((project, index) => (
                <article key={project.number} className={index === 1 ? "lg:mt-24" : index === 2 ? "lg:mt-11" : ""}>
                  <button onClick={() => setActiveProject(index)} className="project-frame aspect-[3/2] w-full text-left" aria-label={`Inspect ${project.title}`}>
                    <img src={project.image} alt={`${project.title} abstract project artwork`} />
                    <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-4">
                      <span className="font-mono text-[.63rem] tracking-[.1em] text-[#ded9eb]">{project.number} / {project.year}</span>
                      <span className={`flex h-8 w-8 items-center justify-center border transition ${activeProject === index ? "border-[#a78bfa] bg-[#a78bfa] text-[#0c0a12]" : "border-white/35 bg-black/25 text-white"}`}><ArrowUpRight className="h-4 w-4" /></span>
                    </div>
                  </button>
                  <div className="mt-5 border-t border-white/15 pt-4">
                    <p className="font-mono text-[.62rem] tracking-[.1em] text-[#a78bfa]">{project.type.toUpperCase()}</p>
                    <h3 className="mt-2 text-2xl font-medium tracking-[-.04em] text-[#f0eef8]">{project.title}</h3>
                    <p className="mt-3 max-w-sm text-[.91rem] leading-relaxed text-[#aaa5b6]">{activeProject === index ? project.featured : project.description}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      {project.stack.map((tech) => <span key={tech} className="border border-white/15 px-2 py-1 font-mono text-[.59rem] tracking-[.05em] text-[#b6b1c2]">{tech}</span>)}
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto inline-flex items-center gap-1 font-mono text-[.62rem] tracking-[.08em] text-[#d8d2ef] transition hover:text-[#a78bfa]"
                        aria-label={`Open ${project.title} project link`}
                      >
                        DETAIL <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="impact" className="relative border-b border-white/10 bg-[#0b0b12] px-5 py-20 sm:px-8 lg:px-14 lg:py-28" aria-labelledby="impact-title">
          <div className="section-axis hidden lg:block" aria-hidden="true" />
          <div className="mx-auto grid max-w-[1500px] gap-16 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
            <div>
              <div className="section-kicker">02 / Who do you think I am?</div>
              <h2 id="impact-title" className="mt-6 text-5xl font-semibold leading-[.9] tracking-[-.06em] text-[#f2f0fa] sm:text-7xl">Let's get<br /><span className="font-normal italic text-[#ada7c2]">Friendly</span></h2>
              <div className="mt-12 border-y border-white/10 py-5">
                <div className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-[#a78bfa]" /><span className="font-mono text-[.63rem] tracking-[.1em] text-[#b7b1c6]">WORKING PRINCIPLES, NOT VANITY METRICS</span></div>
              </div>
            </div>
            <div className="pt-2">
              {achievements.map((achievement) => (
                <article key={achievement.index} className="achievement-line flex gap-6 pb-8 sm:gap-9">
                  <div className="relative z-10 flex h-2.5 w-2.5 shrink-0 translate-y-1.5 items-center justify-center bg-[#0b0b12] ring-1 ring-[#a78bfa]"><span className="h-1 w-1 bg-[#a78bfa]" /></div>
                  <div className="-mt-1 pb-2">
                    <span className="font-mono text-[.61rem] tracking-[.1em] text-[#a78bfa]">{achievement.index}</span>
                    <h3 className="mt-2 text-2xl tracking-[-.04em] text-[#edeaf6] sm:text-3xl">{achievement.title}</h3>
                    <p className="mt-3 max-w-lg leading-relaxed text-[#a9a4b5]">{achievement.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="relative overflow-hidden border-b border-white/10 px-5 py-20 sm:px-8 lg:px-14 lg:py-28" aria-labelledby="about-title">
          <div className="section-axis hidden lg:block" aria-hidden="true" />
          <div className="constellation absolute bottom-0 right-0 h-72 w-1/2 opacity-[.18]" />
          <div className="relative mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <div className="section-kicker">03 / You can know me better here</div>
              <h2 id="about-title" className="mt-6 max-w-4xl text-5xl font-semibold leading-[.9] tracking-[-.065em] text-[#f2f0fa] sm:text-7xl">Useful things should feel <span className="font-normal italic text-[#bdb6d3]">obvious</span>—not oversimplified.</h2>
            </div>
            <div className="border-l border-[#a78bfa] pl-5 lg:mb-2">
              <p className="text-lg leading-relaxed text-[#c0bbca]">I build practical web, AI, and real-time systems with a friendly, collaborative approach—making product flows calm and technical decisions easier to carry forward.</p>
              <button onClick={() => setResumeOpen(true)} className="group mt-8 inline-flex items-center gap-3 border-b border-[#a78bfa] pb-2 font-mono text-[.67rem] tracking-[.1em] text-[#ddd7ee] transition hover:text-[#a78bfa]" data-tooltip-id="resume-tip" data-tooltip-content="Open a rendered resume preview">
                VIEW RESUME <Download className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-y-0.5" />
              </button>
            </div>
          </div>
        </section>

        <section id="education" className="relative overflow-hidden border-b border-white/10 bg-[#090913] px-5 py-20 sm:px-8 lg:px-14 lg:py-28" aria-labelledby="education-title">
          <div className="section-axis hidden lg:block" aria-hidden="true" />
          <div className="education-gridlines absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="relative mx-auto max-w-[1500px]">
            <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
              <div>
                <div className="section-kicker">04 / EDUCATION</div>
                <h2 id="education-title" className="mt-6 text-5xl font-semibold leading-[.9] tracking-[-.06em] text-[#f2f0fa] sm:text-7xl">Built on <span className="font-normal italic text-[#bdb6d3]">curiosity</span><br />and continuity.</h2>
              </div>
              <p className="max-w-xl border-l border-[#a78bfa] pl-5 text-lg leading-relaxed text-[#b8b2c5]">A graduate with a strong foundation moving from computer science fundamentals into electronics, communication, and applied software systems.</p>
            </div>
            <div className="education-timeline mt-16 grid gap-7 lg:grid-cols-2">
              {education.map((item) => (
                <article key={item.index} className="education-record relative border border-white/15 bg-[#0e0d18]/80 p-6 backdrop-blur-sm sm:p-8">
                  <div className="flex items-start justify-between gap-5 border-b border-white/10 pb-5">
                    <span className="font-mono text-[.62rem] tracking-[.11em] text-[#a78bfa]">{item.index}</span>
                    <span className="text-right font-mono text-[.58rem] leading-relaxed tracking-[.08em] text-[#9791a5]">{item.period}</span>
                  </div>
                  <GraduationCap className="mt-8 h-6 w-6 text-[#a78bfa]" aria-hidden="true" />
                  <h3 className="mt-5 max-w-md text-2xl font-medium leading-tight tracking-[-.04em] text-[#efebf8]">{item.institution}</h3>
                  <p className="mt-2 font-mono text-[.6rem] tracking-[.08em] text-[#a9a4b5]">{item.location.toUpperCase()}</p>
                  <p className="mt-8 max-w-md text-[.95rem] leading-relaxed text-[#c0bbcb]">{item.program}</p>
                  <div className="mt-7 flex items-center gap-3 font-mono text-[.62rem] tracking-[.08em] text-[#d4ceed]"><span className="h-1.5 w-1.5 bg-[#a78bfa] shadow-[0_0_12px_#a78bfa]" />{item.result}</div>
                </article>
              ))}
            </div>

            {/* Recognition & Certifications */}
            <div className="mt-20 border-t border-white/10 pt-16">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <div className="section-kicker">RECOGNITION &amp; CERTIFICATIONS</div>
                  <h3 className="mt-4 text-3xl font-semibold tracking-[-.04em] text-[#f2f0fa] sm:text-4xl">
                    Validated milestones &amp; credentials.
                  </h3>
                </div>
                <p className="max-w-md font-mono text-[.66rem] leading-relaxed tracking-[.06em] text-[#a9a4b5]">
                  Industry certifications,internships, competitive programming ranks, and verified program accomplishments.
                </p>
              </div>

              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {milestones.map((item) => (
                  <article
                    key={item.title}
                    className="education-record relative flex flex-col justify-between border border-white/15 bg-[#0e0d18]/80 p-6 backdrop-blur-sm transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="font-mono text-[.58rem] tracking-[.1em] text-[#a78bfa] uppercase">
                          {item.type}
                        </span>
                        <span className="font-mono text-[.56rem] tracking-[.06em] text-[#8e889e]">
                          {item.date}
                        </span>
                      </div>
                      <div className="mt-6 flex items-center gap-2">
                        <Award className="h-5 w-5 text-[#a78bfa]" />
                      </div>
                      <h4 className="mt-3 text-base font-medium leading-snug tracking-[-.02em] text-[#eeeaf7]">
                        {item.title}
                      </h4>
                    </div>
                    <div className="mt-6 border-t border-white/10 pt-3">
                      <p className="font-mono text-[.6rem] tracking-[.05em] text-[#ada7bc]">
                        {item.issuer}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer id="contact" className="relative bg-[#121021] px-5 pb-7 pt-20 sm:px-8 lg:px-14 lg:pt-28" aria-label="Contact Arko Kundu">
          <div className="section-axis hidden lg:block" aria-hidden="true" />
          <div className="mx-auto max-w-[1500px]">
            <div className="section-kicker">05 / CONTACT</div>
            <div className="mt-7 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="max-w-xl text-4xl font-medium leading-[.96] tracking-[-.055em] text-[#f2f0fa] sm:text-6xl">A good project starts with a thoughtful <span className="italic text-[#bfb7e4]">first note.</span></p>
                <button onClick={openContactComposer} className="group mt-10 inline-flex items-center gap-3 border border-[#a78bfa] bg-[#a78bfa] px-5 py-4 font-mono text-[.7rem] tracking-[.1em] text-[#0c0a12] transition hover:bg-[#c0abff] active:scale-[.97]">WRITE A MESSAGE <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></button>
              </div>
              <div className="grid gap-4 border-t border-white/15 pt-5 sm:grid-cols-2 sm:gap-x-14">
                <div>
                  <p className="font-mono text-[.6rem] tracking-[.12em] text-[#8e889e]">LOCATION</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-[#d4cfdf]"><MapPin className="h-3.5 w-3.5 text-[#a78bfa]" />India</p>
                  <a href="mailto:arkokundu500@gmail.com" className="mt-2 block text-sm text-[#bbb5c8] transition hover:text-[#a78bfa]">arkokundu500@gmail.com</a>
                </div>
                <div>
                  <p className="font-mono text-[.6rem] tracking-[.12em] text-[#8e889e]">SOCIAL INDEX</p>
                  <div className="mt-3 flex gap-3">
                    <a href="https://github.com/arkokundu500" target="_blank" rel="noreferrer" aria-label="GitHub" className="flex h-9 w-9 items-center justify-center border border-white/15 text-[#d8d3e5] transition hover:border-[#a78bfa] hover:bg-[#a78bfa] hover:text-[#0c0a12]"><Github className="h-4 w-4" /></a>
                    <a href="https://www.linkedin.com/in/arkokundu5000/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center border border-white/15 text-[#d8d3e5] transition hover:border-[#a78bfa] hover:bg-[#a78bfa] hover:text-[#0c0a12]"><Linkedin className="h-4 w-4" /></a>
                    <button onClick={openContactComposer} aria-label="Write an email" className="flex h-9 w-9 items-center justify-center border border-white/15 text-[#d8d3e5] transition hover:border-[#a78bfa] hover:bg-[#a78bfa] hover:text-[#0c0a12]"><Mail className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-20 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 font-mono text-[.6rem] tracking-[.08em] text-[#817b94] sm:flex-row">
              <p className="flex items-center gap-2"><img src="/arko-orbit-mark_4911fc05.png" alt="" className="h-4 w-4 object-contain" />© {now.format("YYYY")} ARKO KUNDU. NOT A BAD DEV.</p>
              <p className="flex items-center gap-2"><Code2 className="h-3 w-3" />REACT / GSAP / ZUSTAND / DAYJS</p>
            </div>
          </div>
        </footer>
      </main>

      <Tooltip id="drag-tip" place="top" style={{ backgroundColor: "#a78bfa", color: "#0d0b14", fontFamily: "DM Mono", fontSize: "11px", borderRadius: 0 }} />
      <Tooltip id="resume-tip" place="bottom" style={{ backgroundColor: "#a78bfa", color: "#0d0b14", fontFamily: "DM Mono", fontSize: "11px", borderRadius: 0 }} />

      {resumeOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#050509]/85 px-3 py-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Arko Kundu resume preview">
          <div className="resume-dialog flex h-[min(88vh,760px)] w-full max-w-3xl flex-col overflow-hidden border border-white/20 bg-[#0c0c14] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2 font-mono text-[.64rem] tracking-[.1em] text-[#bdb7ca]"><BriefcaseBusiness className="h-3.5 w-3.5 text-[#a78bfa]" />ARKO_KUNDU_RESUME.PDF</div>
              <button onClick={() => setResumeOpen(false)} aria-label="Close resume preview" className="flex h-8 w-8 items-center justify-center border border-white/15 text-[#d9d4e6] transition hover:border-[#a78bfa] hover:bg-[#a78bfa] hover:text-[#0c0a12]"><X className="h-4 w-4" /></button>
            </div>
            <div className="min-h-0 flex-1 bg-[#06060b] p-2 sm:p-4"><PDFViewer width="100%" height="100%" className="border-0" showToolbar><ResumeDocument /></PDFViewer></div>
          </div>
        </div>
      )}

      {contactOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#050509]/85 px-3 py-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="contact-dialog-title">
          <div className="resume-dialog flex w-full max-w-xl flex-col overflow-hidden border border-white/20 bg-[#0c0c14] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2 font-mono text-[.64rem] tracking-[.1em] text-[#bdb7ca]"><Mail className="h-3.5 w-3.5 text-[#a78bfa]" />MESSAGE_COMPOSER</div>
              <button onClick={() => setContactOpen(false)} aria-label="Close message composer" className="flex h-8 w-8 items-center justify-center border border-white/15 text-[#d9d4e6] transition hover:border-[#a78bfa] hover:bg-[#a78bfa] hover:text-[#0c0a12]"><X className="h-4 w-4" /></button>
            </div>
            {messageSent ? (
              <div className="p-7 sm:p-10">
                <div className="flex h-10 w-10 items-center justify-center border border-[#a78bfa] bg-[#a78bfa] text-[#0c0a12]"><ArrowUpRight className="h-5 w-5" /></div>
                <p className="mt-7 font-mono text-[.64rem] tracking-[.12em] text-[#a78bfa]">TRANSMISSION ACCEPTED</p>
                <h2 id="contact-dialog-title" className="mt-3 text-4xl font-medium tracking-[-.055em] text-[#f1eef9]">Thanks for the note.</h2>
                <p className="mt-4 max-w-md leading-relaxed text-[#aaa4b7]">Your message is on its way to Arko. You can expect a reply at the address you provided.</p>
                <button onClick={() => setContactOpen(false)} className="mt-8 border border-white/20 px-4 py-3 font-mono text-[.65rem] tracking-[.1em] text-[#e5e0ee] transition hover:border-[#a78bfa] hover:text-[#a78bfa]">CLOSE COMPOSER</button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="p-5 sm:p-7">
                <div className="mb-7">
                  <p className="font-mono text-[.62rem] tracking-[.12em] text-[#a78bfa]">CONTACT ME</p>
                  <h2 id="contact-dialog-title" className="mt-3 text-3xl font-medium tracking-[-.05em] text-[#f1eef9]">Let's get Connected.</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#aaa4b7]">Share a little about your thoughts,maybe an idea, or discuss about anything.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block"><span className="font-mono text-[.59rem] tracking-[.1em] text-[#918a9f]">YOUR NAME</span><input required minLength={2} value={contactDraft.name} onChange={(event) => setContactDraft((draft) => ({ ...draft, name: event.target.value }))} className="mt-2 w-full border border-white/15 bg-[#11111a] px-3 py-3 text-sm text-[#eeeaf7] outline-none transition focus:border-[#a78bfa]" placeholder="Name" /></label>
                  <label className="block"><span className="font-mono text-[.59rem] tracking-[.1em] text-[#918a9f]">YOUR EMAIL</span><input required type="email" value={contactDraft.email} onChange={(event) => setContactDraft((draft) => ({ ...draft, email: event.target.value }))} className="mt-2 w-full border border-white/15 bg-[#11111a] px-3 py-3 text-sm text-[#eeeaf7] outline-none transition focus:border-[#a78bfa]" placeholder="you@company.com" /></label>
                </div>
                <label className="mt-4 block"><span className="font-mono text-[.59rem] tracking-[.1em] text-[#918a9f]">SUBJECT</span><input required minLength={3} value={contactDraft.subject} onChange={(event) => setContactDraft((draft) => ({ ...draft, subject: event.target.value }))} className="mt-2 w-full border border-white/15 bg-[#11111a] px-3 py-3 text-sm text-[#eeeaf7] outline-none transition focus:border-[#a78bfa]" placeholder="What would you like to explore?" /></label>
                <label className="mt-4 block"><span className="font-mono text-[.59rem] tracking-[.1em] text-[#918a9f]">MESSAGE</span><textarea required minLength={10} maxLength={3000} rows={5} value={contactDraft.message} onChange={(event) => setContactDraft((draft) => ({ ...draft, message: event.target.value }))} className="mt-2 w-full resize-y border border-white/15 bg-[#11111a] px-3 py-3 text-sm leading-relaxed text-[#eeeaf7] outline-none transition focus:border-[#a78bfa]" placeholder="A few lines are enough to start." /></label>
                {contactMutation.isError && <p role="alert" className="mt-4 border-l border-red-400 pl-3 text-sm text-red-300">{contactMutation.error.message}</p>}
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                  <p className="max-w-[13rem] font-mono text-[.55rem] leading-relaxed tracking-[.06em] text-[#827b91]">DELIVERED SECURELY VIA RESEND</p>
                  <button type="submit" disabled={contactMutation.isPending} className="inline-flex shrink-0 items-center gap-2 border border-[#a78bfa] bg-[#a78bfa] px-4 py-3 font-mono text-[.63rem] tracking-[.09em] text-[#0c0a12] transition hover:bg-[#c0abff] disabled:cursor-wait disabled:opacity-60 active:scale-[.97]">{contactMutation.isPending ? "SENDING…" : "SEND MESSAGE"}<ArrowUpRight className="h-3.5 w-3.5" /></button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
