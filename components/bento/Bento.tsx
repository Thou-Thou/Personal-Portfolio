"use client";

import { useEffect, useState } from "react";
import {
  education, jobs, learningNote, profile, projects, skillGroups, typedWords, type ProjectIcon,
} from "@/data/profile";
import {
  ArrowRightIcon, ArrowUpRightIcon, BriefcaseIcon, CapIcon, ChartIcon, CheckIcon, ClockIcon, CopyIcon, GithubIcon,
  GlobeIcon, LayersIcon, MailIcon, MoonIcon, PhoneIcon, PinIcon, PosIcon, ServicesIcon, StarIcon, SunIcon, TicketIcon,
} from "../Icons";
import { setTheme } from "../theme";
import Butterflies from "./Butterflies";
import Mock from "./Mock";

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;
const icons: Record<ProjectIcon, typeof GlobeIcon> = {
  ticket: TicketIcon, globe: GlobeIcon, pos: PosIcon, report: ChartIcon, services: ServicesIcon, star: StarIcon,
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  return reduced;
}

/* ---------- Small animated pieces ---------- */

function TypedRole() {
  const reduced = useReducedMotion();
  const [text, setText] = useState(typedWords[0]);

  useEffect(() => {
    if (reduced) return;
    let word = 0;
    let chars = typedWords[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const current = typedWords[word];
      chars += deleting ? -1 : 1;
      setText(current.slice(0, chars));
      let delay = deleting ? 55 : 95;
      if (!deleting && chars === current.length) {
        deleting = true;
        delay = 1600;
      } else if (deleting && chars === 0) {
        deleting = false;
        word = (word + 1) % typedWords.length;
        delay = 300;
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 2000);
    return () => clearTimeout(timer);
  }, [reduced]);

  return <b>{text}</b>;
}

// Counts a label like "4.5+" up from zero
function CountUp({ value }: { value: string }) {
  const reduced = useReducedMotion();
  const [, digits = "0", suffix = ""] = value.match(/^([\d.]+)(.*)$/) ?? [];
  const target = parseFloat(digits);
  const decimals = digits.split(".")[1]?.length ?? 0;
  const [n, setN] = useState(target);

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    let start = 0;
    const tick = (t: number) => {
      start ||= t;
      const p = Math.min(1, (t - start) / 1600);
      setN(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    setN(0);
    const timer = setTimeout(() => (frame = requestAnimationFrame(tick)), 600);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [reduced, target]);

  return <>{n.toFixed(decimals)}{suffix}</>;
}

// Current hour and minute in Phnom Penh
function usePhnomPenhTime() {
  const [time, setTime] = useState<{ h: number; m: number } | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Phnom_Penh", hour: "numeric", minute: "numeric", hourCycle: "h23" });
    const tick = () => {
      const parts = fmt.formatToParts(new Date());
      const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
      setTime({ h: get("hour"), m: get("minute") });
    };
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // Clipboard API blocked (e.g. not https): fall back to a hidden textarea
      const field = document.createElement("textarea");
      field.value = profile.email;
      field.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className={`btn light${copied ? " done" : ""}`} onClick={copy} aria-live="polite">
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? "Email copied!" : "Copy email"}
    </button>
  );
}

/* ---------- Layout pieces ---------- */

function Tile({
  d, label, icon, className = "", children, id,
}: {
  d: number; label?: string; icon?: React.ReactNode; className?: string; children: React.ReactNode; id?: string;
}) {
  return (
    <section className={`tile ${className}`} style={css({ "--d": `${d * 70}ms` })} id={id}>
      {label && <h2 className="t-label">{icon}{label}</h2>}
      {children}
    </section>
  );
}

function SectionHead({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div className="sec-head" id={id}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
    </div>
  );
}

function ExternalLink({ href, label, className = "tile-link" }: { href: string; label: string; className?: string }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
      <ArrowUpRightIcon />
    </a>
  );
}

/* ---------- Page ---------- */

export default function Bento() {
  const time = usePhnomPenhTime();
  const [featured, ...others] = projects;
  const FeaturedIcon = icons[featured.icon];
  const skills = skillGroups.flatMap((g) => g.items);
  const night = time ? time.h >= 18 || time.h < 6 : false;
  const greeting = !time ? "" : time.h < 12 ? "Good morning" : time.h < 18 ? "Good afternoon" : "Good evening";

  // Reveal tiles as they enter the screen, and move the hover glow with the cursor
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".tile, .sec-head").forEach((t) => io.observe(t));

    const onMove = (e: PointerEvent) => {
      const tile = (e.target as Element).closest<HTMLElement>(".tile");
      if (!tile) return;
      const r = tile.getBoundingClientRect();
      tile.style.setProperty("--mx", `${e.clientX - r.left}px`);
      tile.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      document.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <>
      <div className="backdrop" aria-hidden="true"><span className="blob" /><span className="blob" /></div>
      <Butterflies />

      <header className="top wrap">
        <a href="#" className="logo" aria-label="Back to top">
          <span className="logo-mark">{profile.initials}</span>
          {profile.name}
        </a>
        <nav className="top-nav" aria-label="Main">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
          <button className="icon-btn theme-btn" onClick={() => setTheme()} aria-label="Switch light or dark theme">
            <SunIcon className="sun" />
            <MoonIcon className="moon" />
          </button>
        </nav>
      </header>

      <main className="wrap">
        {/* 1. Summary */}
        <div className="grid summary">
          <Tile d={0} className="intro">
            <span className="status"><span className="dot" />{profile.status}</span>
            <h1>
              <span className="line"><span>Hi, I’m {profile.name}.</span></span>
              <span className="line"><span className="grad">I build web apps.</span></span>
            </h1>
            <p className="role">{profile.role} working with <TypedRole /></p>
            <div className="cta">
              <a href="#work" className="btn primary">See my work <ArrowRightIcon /></a>
              <a href={`mailto:${profile.email}`} className="btn"><MailIcon /> Email me</a>
            </div>
          </Tile>

          <Tile d={1} label="Experience" icon={<BriefcaseIcon />} className="years">
            <div className="ring">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="52" className="ring-bg" />
                <circle cx="60" cy="60" r="52" className="ring-fg" />
              </svg>
              <strong><CountUp value={profile.yearsLabel} /></strong>
            </div>
            <p className="t-foot">years building for the web</p>
          </Tile>

          <Tile d={2} label="Based in" icon={<PinIcon />} className="time">
            <div className="map" aria-hidden="true"><i className="ping" /></div>
            <div className="clock" aria-label={time ? `Local time ${time.h}:${String(time.m).padStart(2, "0")}` : undefined}>
              {time ? String(time.h).padStart(2, "0") : "--"}
              <span className="colon">:</span>
              {time ? String(time.m).padStart(2, "0") : "--"}
            </div>
            <p className="t-foot">
              {night ? <MoonIcon /> : <SunIcon />} {greeting && `${greeting} from `}{profile.location}
            </p>
          </Tile>

          <Tile d={3} label="My stack" icon={<LayersIcon />} className="stack">
            <ul className="chips">
              {skills.map((s, i) => <li className="chip" key={s} style={css({ "--i": i })}>{s}</li>)}
            </ul>
            <p className="t-foot">{learningNote}</p>
          </Tile>
        </div>

        {/* 2. Work */}
        <SectionHead id="work" eyebrow="Selected work" title="Things I’ve built" />
        <div className="grid work">
          <Tile d={0} className="feat">
            <div className="feat-text">
              <span className="t-label"><StarIcon /> Featured project</span>
              <h3>
                {featured.link
                  ? <a href={featured.link} target="_blank" rel="noopener noreferrer">{featured.title}</a>
                  : featured.title}
              </h3>
              <p>{featured.description}</p>
              <div className="tags">{featured.tags.map((t) => <span key={t}>{t}</span>)}</div>
              {featured.link && (
                <a className="btn primary visit" href={featured.link} target="_blank" rel="noopener noreferrer">
                  Visit project <ArrowUpRightIcon />
                </a>
              )}
            </div>
            <div className="cover">
              <div className="p-icon"><FeaturedIcon /></div>
              <Mock kind={featured.icon} />
            </div>
          </Tile>

          {others.map((p, i) => {
            const Icon = icons[p.icon];
            return (
              <Tile d={(i % 2) + 1} className="card" key={p.title}>
                <div className="card-top">
                  <span className="card-icon"><Icon /></span>
                  {p.link && <ExternalLink href={p.link} label={`Open ${p.title}`} />}
                </div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
              </Tile>
            );
          })}
        </div>

        {/* 3. Experience & education */}
        <SectionHead id="experience" eyebrow="Background" title="Experience & education" />
        <div className="grid background">
          <Tile d={0} label="Where I’ve worked" icon={<BriefcaseIcon />} className="exp">
            <ol className="timeline">
              {jobs.map((j, i) => (
                <li key={j.company} style={css({ "--i": i })}>
                  <div className="row-head">
                    <h3>{j.company}</h3>
                    {i === 0 && <span className="now">Latest</span>}
                    <span className="dur">{j.duration}</span>
                  </div>
                  <p>{j.description}</p>
                </li>
              ))}
            </ol>
          </Tile>

          <Tile d={1} label="Education" icon={<CapIcon />} className="edu">
            <ol className="timeline">
              {education.map((e, i) => (
                <li key={e.school} style={css({ "--i": i })}>
                  <div className="row-head">
                    <h3>{e.school}</h3>
                    <span className="dur">{e.years}</span>
                  </div>
                  <p>{e.detail}</p>
                </li>
              ))}
            </ol>
          </Tile>
        </div>

        {/* 4. Contact */}
        <Tile d={0} className="contact" id="contact">
          <div className="rings" aria-hidden="true" />
          <div>
            <h2 className="contact-title">Let’s build something together.</h2>
            <p>I’m open to frontend and full-stack roles and freelance projects.</p>
          </div>
          <div className="contact-actions">
            <CopyEmail />
            <a className="btn ghost" href={`mailto:${profile.email}`}><MailIcon /> Email</a>
            <a className="btn ghost" href={profile.phoneHref}><PhoneIcon /> {profile.phone}</a>
            <a className="btn ghost" href={profile.github} target="_blank" rel="noopener noreferrer"><GithubIcon /> GitHub</a>
          </div>
        </Tile>
      </main>

      <footer className="foot wrap">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span><ClockIcon /> Built in Phnom Penh</span>
      </footer>
    </>
  );
}
