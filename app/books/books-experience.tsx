"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Layers3, LocateFixed } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { books, getBookModelPath } from "./books";

const BooksScene = dynamic(
  () => import("./books-scene").then((module) => module.BooksScene),
  { ssr: false },
);

const COLLECTION_ID = "collection";
const COLLECTION_MODEL = "/models/books/reading-arrangement.glb";

export function BooksExperience() {
  const [selection, setSelection] = useState(COLLECTION_ID);
  const [ready, setReady] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const selectedBook = useMemo(
    () => books.find((book) => book.slug === selection),
    [selection],
  );
  const isCollection = selection === COLLECTION_ID;
  const modelPath = isCollection
    ? COLLECTION_MODEL
    : getBookModelPath(selection);

  const markReady = useCallback(() => setReady(true), []);
  const selectModel = useCallback(
    (slug: string) => {
      if (slug === selection) return;
      setReady(false);
      setSelection(slug);
    },
    [selection],
  );

  return (
    <main
      className="grid h-svh min-h-[40rem] grid-rows-[4.5rem_minmax(0,1fr)_14rem] overflow-hidden bg-[#090908] text-[#ece9e1] selection:bg-[#ece9e1] selection:text-[#090908] md:grid-cols-[minmax(0,1fr)_22rem] md:grid-rows-[5rem_minmax(0,1fr)]"
      data-testid="books-viewer"
      data-ready={ready}
      data-selection={selection}
    >
      <header className="z-30 col-span-full border-b border-white/10 bg-[#090908]/85 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-4 sm:px-7 lg:px-9">
          <Link
            href="/"
            className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/65 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            Smmeyer <span className="text-white/30">/</span> Lab
          </Link>

          <div
            className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/42"
            aria-live="polite"
          >
            <span
              className={`size-1.5 rounded-full ${
                ready ? "signal-dot bg-[#e7e3d8]" : "bg-white/25"
              }`}
            />
            {ready ? "Model ready" : "Loading model"}
          </div>
        </div>
      </header>

      <section className="relative min-h-0 overflow-hidden" aria-labelledby="books-title">
        <div className="absolute inset-0">
          <BooksScene
            modelPath={modelPath}
            isCollection={isCollection}
            resetToken={resetToken}
            onReady={markReady}
          />
        </div>

        <div className="desk-screen-vignette pointer-events-none absolute inset-0 z-10" />
        <div className="desk-noise pointer-events-none absolute inset-0 z-10 opacity-[0.028]" />

        <div className="pointer-events-none absolute left-4 top-5 z-20 sm:left-7 sm:top-7 lg:left-9 lg:top-9">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/42">
            Experiment / 002
          </p>
          <h1
            id="books-title"
            className="mt-2 text-[clamp(3.8rem,8vw,8rem)] font-semibold leading-[0.78] tracking-[-0.075em] text-[#ece9e1]"
          >
            BOOKS<span className="text-white/25">.</span>
          </h1>
          <p className="mt-4 max-w-[18rem] text-xs leading-5 text-white/48 sm:max-w-sm sm:text-sm sm:leading-6">
            Twenty recent reads, rebuilt as small 3D models.
          </p>
        </div>

        <button
          type="button"
          disabled={!ready}
          onClick={() => setResetToken((token) => token + 1)}
          className="glass-panel absolute right-4 top-5 z-20 inline-flex size-10 items-center justify-center text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-wait disabled:text-white/20 sm:right-7 sm:top-7 lg:right-9 lg:top-9"
          aria-label="Reset camera"
          title="Reset camera"
        >
          <LocateFixed aria-hidden="true" className="size-3.5" />
        </button>

        <div
          className={`pointer-events-none absolute inset-0 z-30 grid place-items-center bg-[#090908]/25 transition-opacity duration-300 ${
            ready ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden={ready}
        >
          <div className="w-40 font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
            <div className="mb-3 flex items-center justify-between">
              <span>Loading GLB</span>
              <span>{isCollection ? "20 / 20" : "01 / 01"}</span>
            </div>
            <div className="h-px overflow-hidden bg-white/14">
              <div className="desk-loader-bar h-px w-1/3 bg-[#e7e3d8]" />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-5 left-4 z-20 max-w-[70%] sm:bottom-7 sm:left-7 lg:bottom-9 lg:left-9">
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/35">
            {isCollection ? "Reading shelf / All 20" : selectedBook?.edition}
          </p>
          <h2 className="mt-2 text-xl font-medium leading-tight tracking-[-0.035em] text-[#e8e5dd] sm:text-3xl">
            {isCollection ? "The collection" : selectedBook?.title}
          </h2>
          <p className="mt-1 text-xs text-white/48 sm:text-sm">
            {isCollection
              ? "19 finished. One currently in progress."
              : `${selectedBook?.author} / ${selectedBook?.dimensions.join(" × ")} mm`}
          </p>
        </div>

        <p className="pointer-events-none absolute bottom-6 right-4 z-20 hidden text-right font-mono text-[8px] uppercase leading-5 tracking-[0.16em] text-white/35 sm:block sm:right-7 lg:bottom-9 lg:right-9">
          Drag to orbit / Scroll to zoom
          <br />
          Textured GLB / Actual proportions
        </p>
      </section>

      <aside
        className="z-20 flex min-h-0 flex-col border-t border-white/10 bg-[#0c0c0b] md:border-l md:border-t-0"
        aria-label="Book model index"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6 md:py-5">
          <div>
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/35">
              Model index
            </p>
            <p className="mt-1 text-sm font-medium tracking-[-0.02em] text-white/75">
              20 books + collection
            </p>
          </div>
          <Layers3 aria-hidden="true" className="size-4 text-white/30" />
        </div>

        <div className="books-model-list min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <button
            type="button"
            onClick={() => selectModel(COLLECTION_ID)}
            aria-pressed={isCollection}
            className={`grid w-full grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-white/8 px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70 sm:px-6 ${
              isCollection
                ? "bg-white/[0.07] text-white"
                : "text-white/48 hover:bg-white/[0.035] hover:text-white/80"
            }`}
          >
            <span className="font-mono text-[8px] tracking-[0.16em] text-white/30">00</span>
            <span className="truncate text-xs font-medium">The collection</span>
            <span className="font-mono text-[7px] uppercase tracking-[0.14em] text-white/28">
              All 20
            </span>
          </button>

          {books.map((book, index) => {
            const active = selection === book.slug;

            return (
              <button
                key={book.slug}
                type="button"
                onClick={() => selectModel(book.slug)}
                aria-pressed={active}
                className={`grid w-full grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-white/8 px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70 sm:px-6 ${
                  active
                    ? "bg-white/[0.07] text-white"
                    : "text-white/48 hover:bg-white/[0.035] hover:text-white/80"
                }`}
              >
                <span className="font-mono text-[8px] tracking-[0.16em] text-white/30">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium">{book.title}</span>
                  <span className="mt-0.5 block truncate font-mono text-[7px] uppercase tracking-[0.12em] text-white/28">
                    {book.author}
                  </span>
                </span>
                {book.status === "currently-reading" && (
                  <span className="size-1.5 rounded-full bg-[#e7e3d8]" title="Currently reading" />
                )}
              </button>
            );
          })}
        </div>
      </aside>
    </main>
  );
}
