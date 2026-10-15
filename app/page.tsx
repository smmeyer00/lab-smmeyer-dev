import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import labHero from "@/public/lab-hero.png";

const projects = [
  {
    number: "01",
    href: "/desk",
    label: "Open the desk experiment",
    title: "My desk, rebuilt from photos.",
    description:
      "I gave GPT-6 Astra reference photos and access to Blender through MCP. It handled the modeling. You can inspect the result or walk through it with game controls.",
    tools: ["GPT-6 Astra", "Blender", "MCP", "React Three Fiber"],
  },
  {
    number: "02",
    href: "/books",
    label: "Open the books experiment",
    title: "Twenty books, rebuilt in Blender.",
    description:
      "I had the Blender agent turn 20 books I’ve read recently into individual GLBs. The covers match the editions I had in mind. Most of the backs and spines are educated guesses.",
    tools: ["GPT-6 Astra", "Blender", "MCP", "React Three Fiber"],
  },
];

export default function Home() {
  return (
    <main className="overflow-clip bg-background text-foreground selection:bg-foreground selection:text-background">
      <header className="absolute inset-x-0 top-0 z-30 border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-[92rem] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a
            href="#top"
            className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-colors hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            smmeyer <span className="text-white/35">/</span> lab
          </a>

          <nav className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 sm:gap-9">
            <a
              href="#experiments"
              className="hidden transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:block"
            >
              Projects
            </a>
            <a
              href="https://smmeyer.dev"
              className="flex items-center gap-1.5 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Main site
              <ArrowUpRight aria-hidden="true" className="size-3" />
            </a>
          </nav>
        </div>
      </header>

      <section
        id="top"
        aria-labelledby="hero-title"
        className="relative isolate min-h-svh overflow-hidden bg-[#090908]"
      >
        <Image
          src={labHero}
          alt="A dark desk setup shifting from solid materials into a wireframe model"
          fill
          priority
          quality={92}
          sizes="100vw"
          className="hero-image object-cover object-[68%_center]"
        />
        <div className="hero-vignette absolute inset-0" />
        <div className="lab-grid absolute inset-0 opacity-60" />
        <div className="scan-beam absolute inset-x-0 top-0 h-px bg-white/25" />

        <div className="relative z-10 mx-auto flex min-h-svh max-w-[92rem] items-end px-5 pb-10 pt-32 sm:px-8 sm:pb-14 lg:items-center lg:px-12 lg:pb-0 lg:pt-20">
          <div className="w-full max-w-4xl">
            <div className="hero-enter flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
              <span className="signal-dot size-1.5 rounded-full bg-[#e7e3d8]" />
              Personal experiments
              <span className="h-px w-12 bg-white/25" />
              Est. 2026
            </div>

            <h1
              id="hero-title"
              className="hero-enter hero-delay-1 mt-7 text-[clamp(6rem,22vw,15rem)] font-semibold leading-[0.72] tracking-[-0.09em] text-[#ece9e1]"
            >
              LAB<span className="text-white/25">.</span>
            </h1>

            <div className="hero-enter hero-delay-2 mt-10 max-w-xl border-l border-white/25 pl-5 sm:mt-12 sm:pl-7">
              <p className="text-xl font-medium leading-snug tracking-[-0.025em] text-[#ece9e1] sm:text-2xl">
                Things I build to figure out whether they’ll work.
              </p>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/52 sm:text-base">
                Mostly software. Sometimes hardware. Usually still in progress.
              </p>
            </div>

            <a
              href="#experiments"
              className="hero-enter hero-delay-3 group mt-9 inline-flex items-center gap-5 border-b border-white/40 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:border-white hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:mt-11"
            >
              See what I’m working on
              <ArrowDownRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
              />
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 right-5 z-10 hidden text-right font-mono text-[9px] uppercase leading-5 tracking-[0.18em] text-white/35 sm:block sm:right-8 lg:right-12">
          <p>Current / 002</p>
          <p>Next / /books</p>
          <p className="mt-2 text-white/60">Status / open</p>
        </div>
      </section>

      <section
        id="experiments"
        aria-labelledby="experiments-title"
        className="relative border-t border-white/10 bg-[#0c0c0b] px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-32"
      >
        <div className="reveal-on-scroll mx-auto max-w-[92rem]">
          <div className="flex items-end justify-between border-b border-white/14 pb-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                Project index / 02
              </p>
              <h2
                id="experiments-title"
                className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[#e8e5dd] sm:text-5xl"
              >
                Experiments
              </h2>
            </div>
            <p className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 sm:block">
              Updated / Sep 2026
            </p>
          </div>

          {projects.map((project) => (
            <Link
              key={project.href}
              href={project.href}
              aria-label={project.label}
              className="project-row group relative grid overflow-hidden border-b border-white/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:grid-cols-[7rem_minmax(0,1fr)_15rem] lg:grid-cols-[8rem_minmax(0,1fr)_18rem]"
            >
              <div className="relative z-10 flex items-center justify-between border-b border-white/10 py-5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 md:flex-col md:items-start md:border-b-0 md:border-r md:py-9">
                <span className="text-2xl tracking-[-0.05em] text-white/70">
                  {project.number}
                </span>
                <span className="flex items-center gap-2">
                  <span className="signal-dot size-1.5 rounded-full bg-[#e7e3d8]" />
                  Open
                </span>
              </div>

              <div className="relative z-10 py-9 md:px-10 md:py-12 lg:px-14 lg:py-16">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/38">
                  Experiment / {project.number}
                </p>
                <h3 className="mt-5 max-w-3xl text-4xl font-medium leading-[0.98] tracking-[-0.05em] text-[#e8e5dd] transition-transform duration-500 ease-out group-hover:translate-x-1 sm:text-6xl lg:text-7xl">
                  {project.title}
                </h3>
                <p className="mt-7 max-w-xl text-sm leading-6 text-white/50 sm:text-base sm:leading-7">
                  {project.description}
                </p>
                <ul className="mt-9 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/32">
                  {project.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 flex items-center justify-between border-t border-white/10 py-6 md:flex-col md:items-start md:justify-between md:border-l md:border-t-0 md:px-7 md:py-10 lg:px-9 lg:py-12">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
                  {project.href}
                </span>
                <span className="inline-flex items-center gap-3 border-b border-white/35 pb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/75 transition-colors group-hover:border-white group-hover:text-white">
                  Open experiment
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#090908] px-5 py-7 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[92rem] items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
          <p>© 2026 Steven Meyer</p>
          <a
            href="https://smmeyer.dev"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            smmeyer.dev
            <ArrowUpRight aria-hidden="true" className="size-3" />
          </a>
        </div>
      </footer>
    </main>
  );
}
