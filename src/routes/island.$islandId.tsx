import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { IslandExperience } from "@/components/IslandExperience";
import { ISLANDS, getIslandBySlug } from "@/data/pois";
import { setRevealed } from "@/lib/uiState";

export const Route = createFileRoute("/island/$islandId")({
  loader: ({ params }) => {
    const island = getIslandBySlug(params.islandId);
    if (!island) throw notFound();
    return { island };
  },
  head: ({ loaderData }) => {
    const island = loaderData?.island;
    if (!island) return {};
    const title = `${island.name} — Digital Twin · Trinacria`;
    const description = `${island.tagline}. ${island.description}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: island.hero },
        { name: "twitter:image", content: island.hero },
      ],
    };
  },
  notFoundComponent: IslandNotFound,
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center px-6 text-center">
      <div className="max-w-md space-y-3">
        <h1 className="font-serif text-3xl">Something went wrong</h1>
        <p className="text-muted-foreground">{error.message}</p>
        <Link to="/" className="text-[var(--lemon)] underline-offset-4 hover:underline">
          ← Back to Sicily
        </Link>
      </div>
    </div>
  ),
  component: IslandPage,
});

function IslandPage() {
  const { island } = Route.useLoaderData();
  // Locked island routes have no clean-entry hero — reveal chrome immediately.
  useEffect(() => {
    setRevealed(true);
    return () => setRevealed(false);
  }, []);
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute left-4 top-4 z-[500] md:left-8 md:top-8">
        <Link
          to="/"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-[var(--lemon)]/40 bg-[var(--navy-deep)]/70 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition duration-300 ease-in-out hover:border-[var(--lemon)] hover:text-[var(--lemon)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Islands
        </Link>
      </div>
      <IslandExperience initialIsland={island} lockIsland />
    </main>
  );
}

function IslandNotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-6 text-center">
      <div className="max-w-lg space-y-4">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--lemon)]">
          404
        </p>
        <h1 className="font-serif text-4xl">Island not found</h1>
        <p className="text-muted-foreground">
          That island isn't part of the Trinacria archipelago — yet. Try one of
          these:
        </p>
        <ul className="flex flex-wrap justify-center gap-2 pt-2">
          {ISLANDS.map((i) => (
            <li key={i.id}>
              <Link
                to="/island/$islandId"
                params={{ islandId: i.slug }}
                className="rounded-full border border-[var(--lemon)]/40 bg-[var(--navy-deep)]/60 px-4 py-2 text-sm text-white transition duration-300 ease-in-out hover:border-[var(--lemon)] hover:text-[var(--lemon)]"
              >
                {i.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/" className="inline-block text-sm text-[var(--lemon)] underline-offset-4 hover:underline">
          ← Back home
        </Link>
      </div>
    </div>
  );
}
