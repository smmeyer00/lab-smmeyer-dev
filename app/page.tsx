import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import labHero from "@/public/lab-hero.png";

const buildNotes = [
  ["Input", "A tool or idea I can’t leave alone"],
  ["Rule", "Make something real with it"],
  ["Output", "Share the result, rough edges included"],
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
          <p>Current / 001</p>
          <p>Next / /desk</p>
          <p className="mt-2 text-white/60">Status / open</p>
        </div>
      </section>

      <section
        id="experiments"
        aria-labelledby="experiments-title"
        className="relative border-t border-white/10 bg-[#0c0c0b] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
      >
        <div className="reveal-on-scroll mx-auto max-w-[92rem]">
          <div className="flex items-end justify-between border-b border-white/14 pb-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                Projects / 01
              </p>
              <h2
                id="experiments-title"
                className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[#e8e5dd] sm:text-5xl"
              >
                Building now
              </h2>
            </div>
            <p className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 sm:block">
              One active project
            </p>
          </div>

          <Link
            href="/desk"
            aria-label="Open the desk experiment"
            className="group grid border-b border-white/14 py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:grid-cols-[0.82fr_1.18fr] md:gap-12 md:py-12 lg:gap-20"
          >
            <div className="flex flex-col justify-between py-2">
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                  <span>001 / Blender + GPT-6 Astra</span>
                  <span className="md:hidden">/desk</span>
                </div>
                <h3 className="mt-8 max-w-md text-4xl font-medium leading-[0.98] tracking-[-0.05em] text-[#e8e5dd] sm:text-6xl lg:text-7xl">
                  My desk,
                  <br />
                  rebuilt from photos.
                </h3>
                <p className="mt-7 max-w-md text-sm leading-6 text-white/50 sm:text-base sm:leading-7">
                  I gave GPT-6 Astra reference photos and access to Blender through
                  MCP. It handled the modeling. I put the result here so you can
                  look around it or walk through it.
                </p>
              </div>

              <div className="mt-12 flex items-end justify-between border-t border-white/10 pt-5 md:mt-16">
                <div className="font-mono text-[9px] uppercase leading-5 tracking-[0.18em] text-white/35">
                  <p>GPT-6 Astra / Blender / MCP</p>
                  <p className="text-white/65">Walk around the result</p>
                </div>
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 md:block">
                  /desk
                </span>
              </div>
            </div>

            <figure className="experiment-visual relative mt-10 aspect-[4/3] overflow-hidden bg-[#121211] md:mt-0 md:aspect-[16/11]">
              <Image
                src={labHero}
                alt="Wireframe details forming across a modeled desk and monitor"
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover object-[72%_center] transition-transform duration-1000 ease-out group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
              <div className="absolute left-0 top-0 size-5 border-l border-t border-white/45" />
              <div className="absolute right-0 top-0 size-5 border-r border-t border-white/45" />
              <div className="glass-panel absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/55 sm:bottom-5 sm:left-5 sm:right-5 sm:px-5">
                <span className="flex items-center gap-2.5">
                  <span className="signal-dot size-1.5 rounded-full bg-[#e7e3d8]" />
                  Model / complete
                </span>
                <span>Viewer / open</span>
              </div>
            </figure>
          </Link>

          <p className="mt-6 max-w-sm text-xs leading-5 text-white/35">
            This list will grow when I have something interesting enough to share.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="method-title"
        className="border-y border-white/10 bg-[#11110f] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
      >
        <div className="reveal-on-scroll mx-auto grid max-w-[92rem] gap-16 lg:grid-cols-[1.25fr_0.75fr] lg:gap-24">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              Why this exists
            </p>
            <h2
              id="method-title"
              className="mt-6 max-w-4xl text-5xl font-medium leading-[0.98] tracking-[-0.055em] text-[#e8e5dd] sm:text-7xl lg:text-8xl"
            >
              I learn faster when there’s something real to poke at.
            </h2>
            <p className="mt-8 max-w-xl text-base leading-7 text-white/48 sm:text-lg sm:leading-8">
              I use this space to learn new tools by building with them. The result
              doesn’t have to be useful. It does have to teach me something.
            </p>
          </div>

          <dl className="self-end border-t border-white/14">
            {buildNotes.map(([term, description], index) => (
              <div
                key={term}
                className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-white/14 py-5"
              >
                <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
                  {String(index + 1).padStart(2, "0")} / {term}
                </dt>
                <dd className="text-sm leading-5 text-white/65">{description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="relative bg-[#090908] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <div className="lab-grid absolute inset-0 opacity-25" />
        <div className="reveal-on-scroll relative mx-auto flex max-w-[92rem] flex-col items-start justify-between gap-12 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              That’s it for now
            </p>
            <h2 className="mt-5 max-w-3xl text-5xl font-medium leading-[0.98] tracking-[-0.055em] text-[#e8e5dd] sm:text-7xl lg:text-8xl">
              More when I make something worth sharing.
            </h2>
          </div>
          <a
            href="https://smmeyer.dev"
            className="group inline-flex shrink-0 items-center gap-5 border-b border-white/40 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:border-white hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            Back to smmeyer.dev
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#090908] px-5 py-7 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[92rem] items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
          <p>© 2026 SM Meyer</p>
          <p>No roadmap. That’s the point.</p>
        </div>
      </footer>
    </main>
  );
}
