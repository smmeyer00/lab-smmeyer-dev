import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { CharacterTopography } from "@/components/character-topography";
import { ProjectMark } from "@/components/project-mark";

const projects = [
  {
    kind: "desk" as const,
    href: "/desk",
    label: "Open the desk experiment",
    title: "My desk, rebuilt from photos.",
    description:
      "I gave GPT-6 Astra reference photos and access to Blender through MCP. It handled the modeling. You can inspect the result or walk through it with game controls.",
  },
  {
    kind: "books" as const,
    href: "/books",
    label: "Open the books experiment",
    title: "Twenty books, rebuilt in Blender.",
    description:
      "I had the Blender agent turn 20 books I’ve read recently into individual GLBs. The covers match the editions I had in mind. Most of the backs and spines are educated guesses.",
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
        <CharacterTopography />
        <div aria-hidden="true" className="hero-handoff pointer-events-none absolute inset-x-0 bottom-0" />

        <div className="relative z-10 mx-auto flex min-h-svh max-w-[92rem] items-end px-5 pb-10 pt-32 sm:px-8 sm:pb-14 lg:items-center lg:px-12 lg:pb-0 lg:pt-20">
          <div className="w-full max-w-4xl">
            <div className="hero-enter flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
              <span className="size-1.5 rounded-full bg-[#e7e3d8]" />
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
      </section>

      <section
        id="experiments"
        aria-labelledby="experiments-title"
        className="relative bg-[#090908] px-5 pb-20 pt-10 sm:px-8 sm:pb-24 sm:pt-12 lg:px-12 lg:pb-28 lg:pt-14"
      >
        <div className="mx-auto max-w-[92rem]">
          <div className="project-index-heading flex items-baseline justify-between gap-5 border-b border-white/16 pb-7 sm:pb-8">
            <h2
              id="experiments-title"
              className="text-4xl font-medium leading-none tracking-[-0.045em] text-[#e8e5dd] sm:text-5xl"
            >
              Experiments
            </h2>
            <p className="text-xs text-white/40 sm:text-sm">
              {projects.length} projects
            </p>
          </div>

          <ul aria-label="Experiments" className="divide-y divide-white/12 border-b border-white/12">
            {projects.map((project) => (
              <li key={project.href}>
                <Link
                  href={project.href}
                  aria-label={project.label}
                  className="project-row group relative grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-x-5 gap-y-5 py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-8 focus-visible:ring-offset-[#090908] sm:py-9 md:grid-cols-[6rem_minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-x-8 lg:grid-cols-[8rem_minmax(0,0.95fr)_minmax(0,1.15fr)_auto] lg:gap-x-10 lg:py-10"
                >
                  <ProjectMark kind={project.kind} />

                  <h3 className="relative z-10 col-start-2 row-start-1 max-w-md text-2xl font-medium leading-[1.18] tracking-[-0.035em] text-[#e8e5dd] transition-colors duration-200 group-hover:text-white sm:text-3xl">
                    {project.title}
                  </h3>

                  <p className="relative z-10 col-span-2 max-w-xl text-sm leading-6 text-white/50 md:col-span-1 md:col-start-3 md:row-span-2 md:row-start-1 lg:row-span-1">
                    {project.description}
                  </p>

                  <span className="relative z-10 col-span-2 mt-1 inline-flex w-fit items-center gap-3 border-b border-white/30 pb-1 text-sm text-white/70 transition-colors duration-200 group-hover:border-white/70 group-hover:text-white md:col-span-1 md:col-start-2 md:row-start-2 lg:col-start-4 lg:row-start-1">
                    Open experiment
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#090908] px-5 py-7 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[92rem] items-center justify-between text-xs text-white/40">
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
