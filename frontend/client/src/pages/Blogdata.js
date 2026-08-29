// Single source of truth for blog content. Both the Categories grid and the
// BlogDetails page import from here so ids, images, and copy always match.

export const categories = [
  { name: "All", path: "all", icon: "⊞" },
  { name: "Technology", path: "technology", icon: "⚡" },
  { name: "Lifestyle", path: "lifestyle", icon: "◻" },
  { name: "Travel", path: "travel", icon: "➤" },
  { name: "Health", path: "health", icon: "♡" },
  { name: "Education", path: "education", icon: "◈" },
];

export const blogs = {
  technology: [
    {
      id: 1,
      title: "Latest trends in AI",
      desc: "How AI is shaping the future.",
      fullDesc:
        "Artificial intelligence has moved from research labs into everyday tools — writing assistants, recommendation engines, and self-driving systems. Understanding where the technology is headed helps you separate genuine progress from hype.",
      extra:
        "Expect AI to keep showing up inside ordinary apps rather than as a separate product — the interesting shifts are happening under the hood.",
      img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=70",
    },
    {
      id: 2,
      title: "React vs Angular",
      desc: "A comparison of two giants.",
      fullDesc:
        "React and Angular solve the same problem — building interactive UIs — with very different philosophies. React leans on a lean library plus your own choices; Angular ships as a full, opinionated framework out of the box.",
      extra:
        "Teams that value flexibility tend to reach for React; teams that want conventions baked in from day one often prefer Angular.",
      img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=70",
    },
  ],
  lifestyle: [
    {
      id: 3,
      title: "Minimalist living",
      desc: "Tips for a simpler life.",
      fullDesc:
        "Minimalism isn't about owning nothing — it's about keeping only what earns its place in your home and your schedule. Small, deliberate changes to your space often ease mental clutter too.",
      extra:
        "Start with one drawer, one shelf, or one commitment you can let go of this week — momentum builds from there.",
      img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=70",
    },
    {
      id: 4,
      title: "Work-life balance",
      desc: "How to balance career and family.",
      fullDesc:
        "Balance rarely means an even split of hours — it means your time reflects your actual priorities. That takes honest boundaries, not just good intentions.",
      extra:
        "The clearest sign of balance isn't a perfectly even schedule, it's feeling present in whichever part of life you're in.",
      img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=70",
    },
  ],
  travel: [
    {
      id: 5,
      title: "Top 10 places in Europe",
      desc: "Must-visit destinations.",
      fullDesc:
        "From the canals of Amsterdam to the coastline of the Amalfi Drive, Europe packs an unusual amount of variety into a small area. A little planning goes a long way toward avoiding the crowds.",
      extra:
        "Shoulder-season travel (April–May or September–October) usually means thinner crowds and better prices without sacrificing good weather.",
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=70",
    },
    {
      id: 6,
      title: "Backpacking tips",
      desc: "Travel smart on a budget.",
      fullDesc:
        "Budget travel is less about cutting corners and more about spending on what actually matters to you — good meals, a great hostel, a once-in-a-lifetime excursion — and skipping the rest.",
      extra:
        "Packing light isn't just about the bag — it's what lets you say yes to the last-minute overnight train.",
      img: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=70",
    },
  ],
  health: [
    {
      id: 7,
      title: "Healthy eating",
      desc: "Nutrition tips for a better life.",
      fullDesc:
        "Good nutrition is built from repeatable habits, not strict rules. Simple swaps — more vegetables, better sleep-adjacent eating windows, fewer ultra-processed snacks — compound over time.",
      extra:
        "Consistency across weeks matters far more than any single meal — sustainable habits beat perfect ones.",
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=70",
    },
    {
      id: 8,
      title: "Home workouts",
      desc: "Stay fit without a gym.",
      fullDesc:
        "You don't need a gym membership to build real strength. Bodyweight circuits, resistance bands, and a bit of floor space can cover most of what a beginner or intermediate routine needs.",
      extra:
        "The best home workout is the one you'll actually repeat — pick something short enough that skipping it feels harder than doing it.",
      img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=70",
    },
  ],
  education: [
    {
      id: 9,
      title: "Online learning platforms",
      desc: "Best websites to learn.",
      fullDesc:
        "The best online course is the one that matches how you actually learn — some people need structured cohorts and deadlines, others do better with self-paced video and a project to build.",
      extra:
        "Look for platforms with active communities and real projects, not just video playlists — feedback is what actually builds skill.",
      img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=70",
    },
    {
      id: 10,
      title: "Study hacks",
      desc: "Boost your productivity.",
      fullDesc:
        "Productive studying is less about longer hours and more about how you spend them — spaced repetition, active recall, and short focused sessions consistently outperform marathon cramming.",
      extra:
        "Testing yourself, even badly, teaches your brain more than re-reading the same notes one more time.",
      img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=70",
    },
  ],
};

// Category → accent colors, shared by the badge on the grid and the
// signal rail on the detail page, so the two views feel like one system.
export const categoryAccents = {
  technology: {
    base: "#8B5CF6",
    dim: "rgba(139,92,246,0.16)",
    badge: "bg-violet-500/15 text-violet-300",
  },
  lifestyle: {
    base: "#F472B6",
    dim: "rgba(244,114,182,0.16)",
    badge: "bg-pink-500/12 text-pink-300",
  },
  travel: {
    base: "#34D399",
    dim: "rgba(52,211,153,0.16)",
    badge: "bg-emerald-500/12 text-emerald-300",
  },
  health: {
    base: "#F2A65A",
    dim: "rgba(242,166,90,0.18)",
    badge: "bg-amber-500/12 text-amber-300",
  },
  education: {
    base: "#60A5FA",
    dim: "rgba(96,165,250,0.16)",
    badge: "bg-blue-500/12 text-blue-300",
  },
};

export const categoryLabels = {
  technology: "Technology",
  lifestyle: "Lifestyle",
  travel: "Travel",
  health: "Health",
  education: "Education",
};

export function getAllBlogs() {
  return Object.entries(blogs).flatMap(([cat, items]) =>
    items.map((b) => ({ ...b, cat })),
  );
}

export function getDisplayedBlogs(selected) {
  if (!selected || selected === "all") return getAllBlogs();
  return (blogs[selected] || []).map((b) => ({ ...b, cat: selected }));
}

export function getBlogById(id) {
  const numId = parseInt(id, 10);
  return getAllBlogs().find((b) => b.id === numId) || null;
}

export function getRelatedBlogs(blog, limit = 3) {
  if (!blog) return [];
  const all = getAllBlogs().filter((b) => b.id !== blog.id);
  const sameCat = all.filter((b) => b.cat === blog.cat);
  const rest = all.filter((b) => b.cat !== blog.cat);
  return [...sameCat, ...rest].slice(0, limit);
}
