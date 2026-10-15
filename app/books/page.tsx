import type { Metadata } from "next";

import { BooksExperience } from "./books-experience";

export const metadata: Metadata = {
  title: "Books — SM Meyer Lab",
  description:
    "Twenty recently read books rebuilt as small, inspectable 3D models with Blender and GPT-6 Astra.",
};

export default function BooksPage() {
  return <BooksExperience />;
}
