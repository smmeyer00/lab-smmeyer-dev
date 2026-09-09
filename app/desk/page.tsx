import type { Metadata } from "next";

import { DeskExperience } from "./desk-experience";

export const metadata: Metadata = {
  title: "Desk — SM Meyer Lab",
  description:
    "An interactive model of my desk, built in Blender from reference photos by GPT-6 Astra.",
};

export default function DeskPage() {
  return <DeskExperience />;
}
