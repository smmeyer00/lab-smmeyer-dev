export type Book = {
  slug: string;
  title: string;
  author: string;
  edition: string;
  dimensions: readonly [number, number, number];
  status: "read" | "currently-reading";
};

export const books: Book[] = [
  {
    slug: "white-nights",
    title: "White Nights",
    author: "Fyodor Dostoevsky",
    edition: "Foreign Languages Publishing House",
    dimensions: [128, 198, 11],
    status: "read",
  },
  {
    slug: "death-of-ivan-ilych",
    title: "The Death of Ivan Ilych",
    author: "Leo Tolstoy",
    edition: "Waking Lion Press",
    dimensions: [140, 216, 7],
    status: "read",
  },
  {
    slug: "stoner",
    title: "Stoner",
    author: "John Williams",
    edition: "NYRB Classics",
    dimensions: [130, 203, 20],
    status: "read",
  },
  {
    slug: "myth-of-sisyphus",
    title: "The Myth of Sisyphus",
    author: "Albert Camus",
    edition: "Vintage",
    dimensions: [132, 203, 13],
    status: "read",
  },
  {
    slug: "count-of-monte-cristo",
    title: "The Count of Monte Cristo",
    author: "Alexandre Dumas",
    edition: "Penguin Classics",
    dimensions: [129, 198, 55],
    status: "read",
  },
  {
    slug: "into-the-wild",
    title: "Into the Wild",
    author: "Jon Krakauer",
    edition: "Anchor",
    dimensions: [133, 203, 17],
    status: "read",
  },
  {
    slug: "so-long-and-thanks",
    title: "So Long, and Thanks for All the Fish",
    author: "Douglas Adams",
    edition: "Del Rey",
    dimensions: [106, 175, 16],
    status: "read",
  },
  {
    slug: "the-stranger",
    title: "The Stranger",
    author: "Albert Camus",
    edition: "Vintage",
    dimensions: [132, 203, 11],
    status: "read",
  },
  {
    slug: "dorian-gray",
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    edition: "Penguin Classics",
    dimensions: [129, 198, 19],
    status: "read",
  },
  {
    slug: "letters-from-a-stoic",
    title: "Letters from a Stoic",
    author: "Seneca",
    edition: "Penguin Classics",
    dimensions: [129, 198, 16],
    status: "read",
  },
  {
    slug: "life-universe-everything",
    title: "Life, the Universe and Everything",
    author: "Douglas Adams",
    edition: "Del Rey",
    dimensions: [106, 175, 17],
    status: "read",
  },
  {
    slug: "notes-from-underground",
    title: "Notes from Underground",
    author: "Fyodor Dostoevsky",
    edition: "Vintage",
    dimensions: [132, 203, 12],
    status: "read",
  },
  {
    slug: "epic-of-gilgamesh",
    title: "The Epic of Gilgamesh",
    author: "Anonymous",
    edition: "Penguin Classics",
    dimensions: [129, 198, 9],
    status: "read",
  },
  {
    slug: "brief-history-of-time",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    edition: "Bantam",
    dimensions: [106, 175, 19],
    status: "read",
  },
  {
    slug: "restaurant-end-universe",
    title: "The Restaurant at the End of the Universe",
    author: "Douglas Adams",
    edition: "Del Rey",
    dimensions: [106, 175, 18],
    status: "read",
  },
  {
    slug: "sapiens",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    edition: "Harper",
    dimensions: [153, 234, 32],
    status: "read",
  },
  {
    slug: "hitchhikers-guide",
    title: "The Hitchhiker's Guide to the Galaxy",
    author: "Douglas Adams",
    edition: "Del Rey",
    dimensions: [106, 175, 16],
    status: "read",
  },
  {
    slug: "great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    edition: "Scribner",
    dimensions: [132, 203, 13],
    status: "read",
  },
  {
    slug: "zero-to-one",
    title: "Zero to One",
    author: "Peter Thiel with Blake Masters",
    edition: "Crown Business",
    dimensions: [145, 218, 22],
    status: "read",
  },
  {
    slug: "madonna-fur-coat",
    title: "Madonna in a Fur Coat",
    author: "Sabahattin Ali",
    edition: "Penguin Classics",
    dimensions: [129, 198, 14],
    status: "currently-reading",
  },
];

export function getBookModelPath(slug: string) {
  return `/models/books/${slug}.glb`;
}
