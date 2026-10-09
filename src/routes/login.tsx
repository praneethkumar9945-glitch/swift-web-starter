import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { events } from "@/lib/data";
import { useSaved } from "@/lib/saved";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — SAC COMMUNITY" },
      { name: "description", content: "Log in to see your tickets, bookings and saved events." },
      { property: "og:title", content: "Log in — SAC COMMUNITY" },
      { property: "og:description", content: "Your tickets, bookings and saved events." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

type Tab = "All" | "Purchased" | "Saved";

function Tickets() {
  const [tab, setTab] = useState<Tab>("All");
  const saved = useSaved();
  const savedEvents = events.filter((e) => saved.includes(e.slug) || saved.includes(`event:${e.slug}`));
  const savedPosts = saved.filter((s) => s.startsWith("explore:")).length;
  const list = tab === "Purchased" ? [] : savedEvents;
  return (
    <section id="tickets" className="mt-6 w-full max-w-md bg-background p-6 text-foreground">
      <h2 className="font-display text-3xl">Tickets</h2>
      <div role="tablist" className="mt-4 flex gap-1 border-b">
        {(["All", "Purchased", "Saved"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={cn("relative px-3 py-2.5 text-[12px] font-bold uppercase tracking-[0.16em]", tab === t ? "text-foreground" : "text-muted-foreground")}>
            {t}
            <span className={cn("absolute inset-x-2 -bottom-px h-0.5 bg-primary transition-transform", tab === t ? "scale-x-100" : "scale-x-0")} />
          </button>
        ))}
      </div>
      <ul className="mt-4 space-y-3">
        {list.map((e) => (
          <li key={e.slug}>
            <Link to="/event/$slug" params={{ slug: e.slug }} className="flex items-center gap-3">
              <img src={e.img} alt="" className="h-12 w-12 shrink-0 object-cover" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{e.name}</span>
                <span className="block truncate text-xs text-muted-foreground">{e.date} · {e.city}</span>
              </span>
            </Link>
          </li>
        ))}
        {list.length === 0 && (
          <li className="text-sm text-muted-foreground">
            {tab === "Purchased" ? "No purchased tickets yet." : "Nothing saved yet."}
          </li>
        )}
        {tab !== "Purchased" && savedPosts > 0 && (
          <li className="text-xs text-muted-foreground">
            Plus {savedPosts} saved post{savedPosts > 1 ? "s" : ""} from <Link to="/explore" className="text-primary">Explore</Link>.
          </li>
        )}
      </ul>
    </section>
  );
}

function ProfilePage() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center bg-ink px-5 pb-10 pt-24 text-ink-foreground">
      <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md bg-background p-8 text-foreground">
        <h1 className="font-display text-5xl">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tickets, bookings and saved events — all in one place.</p>
        <input type="email" placeholder="Email" className="mt-8 w-full border-b-2 border-foreground bg-transparent py-3 outline-none" />
        <input type="password" placeholder="Password" className="mt-4 w-full border-b-2 border-foreground bg-transparent py-3 outline-none" />
        <button className="mt-8 w-full bg-primary py-4 text-[12px] font-bold uppercase tracking-[0.16em] text-primary-foreground">Log in</button>
        <p className="mt-4 text-center text-xs text-muted-foreground">Accounts are coming soon.</p>
      </form>
      <Tickets />
    </div>
  );
}
