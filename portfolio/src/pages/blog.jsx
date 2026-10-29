import { memo, useEffect, useMemo, useState } from "react";
import axios from "axios";

/* Django se posts laao aur field names component ke hisaab se map karo */
import { publicApi } from "../api";

const fetchPosts = async (signal) => {
  const { data } = await publicApi.get("/posts/", { signal });
  const list = Array.isArray(data) ? data : data.results || [];
  return list.map((p) => ({
    ...p,
    createdAt: p.created_at,
    tags: p.tags || [],
    cover: p.cover || "",
    excerpt: p.excerpt || "",
    content: p.content || "",
  }));
};

const readingTime = (text) =>
  Math.max(1, Math.round(text.trim().split(/\s+/).filter(Boolean).length / 200));

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/* Minimal markdown: # heading, ## subheading, - list, blank line = paragraph */
const renderContent = (text) => {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let list = [];

  const flushList = () => {
    if (!list.length) return;
    out.push(
      <ul key={`ul-${out.length}`} className="mt-4 list-disc space-y-1 pl-5">
        {list.map((l, j) => <li key={j}>{l}</li>)}
      </ul>
    );
    list = [];
  };

  lines.forEach((raw, i) => {
    const t = raw.trim();
    if (!t) return flushList();
    if (t.startsWith("- ")) return list.push(t.slice(2));
    flushList();

    const h = t.match(/^(#{1,2})\s*(.+)$/);   // "#Heading" aur "# Heading" dono chalega
    if (h) {
      const Tag = h[1].length === 1 ? "h2" : "h3";
      out.push(
        <Tag key={i} className={`mt-8 font-black uppercase tracking-tighter ${h[1].length === 1 ? "text-2xl" : "text-xl"}`}>
          {h[2]}
        </Tag>
      );
    } else {
      out.push(<p key={i} className="mt-4 leading-relaxed">{t}</p>);
    }
  });

  flushList();
  return out;
};
 
const Tag = ({ children, active, onClick }) => {
  const cls = `rounded-full border-2 border-black px-3 py-1 text-xs font-bold transition ${
    active ? "bg-black text-white" : "bg-white hover:bg-orange-600 hover:text-white"
  }`;
  return onClick ? (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  ) : (
    <span className="rounded-full border-2 border-black bg-[#fff8eb] px-3 py-0.5 text-xs font-bold">
      {children}
    </span>
  );
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [openId, setOpenId] = useState(() => {
    const m = window.location.hash.match(/^#post-(\d+)$/);
    return m ? Number(m[1]) : null;
  });

  // Django API se posts load karo
useEffect(() => {
  const controller = new AbortController();
  fetchPosts(controller.signal)
    .then(setPosts)
    .catch((err) => {
      if (axios.isCancel(err)) return;
      setError("Posts load nahi hue. Server chal raha hai?");
    })
    .finally(() => !controller.signal.aborted && setLoading(false));
  return () => controller.abort();
}, []);

  // Browser back/forward se article open/close
  useEffect(() => {
    const onHash = () => {
      const m = window.location.hash.match(/^#post-(\d+)$/);
      setOpenId(m ? Number(m[1]) : null);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const open = (id) => {
    window.location.hash = `post-${id}`;
    window.scrollTo({ top: 0 });
  };
  const close = () => {
    history.pushState("", document.title, window.location.pathname + window.location.search);
    setOpenId(null);
  };

  const allTags = useMemo(
    () => [...new Set(posts.flatMap((p) => p.tags))].sort(),
    [posts]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (!activeTag || p.tags.includes(activeTag)) &&
        (!q ||
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }, [posts, query, activeTag]);

  const current = openId ? posts.find((p) => p.id === openId) : null;

  /* ------------------------- Single article view ------------------------- */
  if (openId) {
    return (
      <div className="min-h-screen bg-[#fff8eb] text-black">
        <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <button
            type="button"
            onClick={close}
            className="inline-flex items-center gap-2 rounded-full border-2 border-black px-5 py-2 text-xs font-bold uppercase transition hover:bg-black hover:text-white"
          >
            <span aria-hidden="true">←</span> Saare posts
          </button>

          {loading ? (
            <p className="mt-10 text-sm text-black/60">Post load ho rahi hai...</p>
          ) : current ? (
            <article className="mt-8">
              <p className="text-xs font-bold text-orange-600">
                {formatDate(current.createdAt)} · {readingTime(current.content)} min read
              </p>
              <h1 className="mt-2 text-4xl font-black uppercase leading-[0.95] tracking-tighter sm:text-6xl">
                {current.title}
              </h1>

              {current.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {current.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              )}

              {current.cover && (
                <img
                  src={current.cover}
                  alt=""
                  className="mt-8 max-h-96 w-full rounded-3xl border-2 border-black object-cover shadow-[8px_8px_0_0_#000]"
                />
              )}

              <div className="mt-8 text-black/85">{renderContent(current.content)}</div>

              <button
                type="button"
                onClick={close}
                className="mt-12 inline-flex items-center gap-3 rounded-full bg-black px-6 py-3 text-xs font-bold uppercase text-white transition hover:bg-orange-600"
              >
                Aur posts padho
                <span aria-hidden="true" className="text-xl text-orange-400">
                  →
                </span>
              </button>
            </article>
          ) : (
            <p className="mt-10 rounded-2xl border-2 border-dashed border-black p-6 text-sm text-black/60">
              Ye post nahi mila. Ho sakta hai delete ho gaya ho.
            </p>
          )}
        </main>
      </div>
    );
  }

  /* ------------------------------ Listing view ------------------------------ */
  const [featured, ...rest] = filtered;
  const showFeatured = featured && !query && !activeTag;
  const grid = showFeatured ? rest : filtered;

  return (
    <div className="min-h-screen bg-[#fff8eb] text-black">
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-12">
        <header>
          <p className="inline-block rounded-full border-2 border-black bg-white px-4 py-1 text-xs font-bold">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
          <h1 className="mt-4 text-5xl font-black uppercase leading-[0.85] tracking-tighter sm:text-7xl">
            Mera <span className="text-orange-600">blog</span>
            <span className="text-orange-600">✳</span>
          </h1>
          <p className="mt-4 max-w-xl text-black/70">
            Backend, Python aur AI seekhte hue jo kuch samajh aaya, wo yahan likhta hoon.
          </p>
        </header>

        {posts.length > 0 && (
          <div className="mt-8 space-y-4">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Posts search karo..."
              aria-label="Search posts"
              className="w-full rounded-full border-2 border-black bg-white px-5 py-3 text-sm outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-200 sm:max-w-md"
            />
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Tag active={!activeTag} onClick={() => setActiveTag("")}>
                  All
                </Tag>
                {allTags.map((t) => (
                  <Tag
                    key={t}
                    active={activeTag === t}
                    onClick={() => setActiveTag(activeTag === t ? "" : t)}
                  >
                    {t}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        )}

        {loading && <p className="mt-10 text-sm text-black/60">Posts load ho rahe hain...</p>}

        {!loading && error && (
          <p className="mt-10 rounded-2xl border-2 border-black bg-red-200 p-6 text-sm font-bold">
            {error}
          </p>
        )}

        {!loading && !error && posts.length === 0 && (
          <p className="mt-10 rounded-2xl border-2 border-dashed border-black p-8 text-sm text-black/60">
            Abhi koi post publish nahi hua. /admin se pehla blog likho, wo yahan dikhega.
          </p>
        )}

        {posts.length > 0 && filtered.length === 0 && (
          <p className="mt-10 rounded-2xl border-2 border-dashed border-black p-8 text-sm text-black/60">
            Is search/tag se koi post match nahi hua.
          </p>
        )}

        {/* Featured (latest) post */}
        {showFeatured && (
          <button
            type="button"
            onClick={() => open(featured.id)}
            className="group mt-10 grid w-full overflow-hidden rounded-3xl border-2 border-black bg-orange-500 text-left shadow-[8px_8px_0_0_#000] transition hover:-translate-y-1 md:grid-cols-2"
          >
            {featured.cover ? (
              <img
                src={featured.cover}
                alt=""
                className="h-56 w-full border-b-2 border-black object-cover md:h-full md:border-b-0 md:border-r-2"
              />
            ) : (
              <div className="hidden items-center justify-center border-black bg-[#fff8eb] text-8xl text-orange-600 md:flex md:border-r-2">
                ✳
              </div>
            )}
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <p className="text-xs font-bold">
                Latest · {formatDate(featured.createdAt)} · {readingTime(featured.content)} min read
              </p>
              <h2 className="mt-2 text-3xl font-black uppercase leading-[0.95] tracking-tighter sm:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-black/80">{featured.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase">
                Padho
                <span aria-hidden="true" className="transition group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </button>
        )}

        {/* Grid */}
        {grid.length > 0 && (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {grid.map((p) => (
              <li key={p.id} className="flex">
                <button
                  type="button"
                  onClick={() => open(p.id)}
                  className="flex w-full flex-col overflow-hidden rounded-3xl border-2 border-black bg-white text-left shadow-[6px_6px_0_0_#000] transition hover:-translate-y-1"
                >
                  {p.cover && (
                    <img
                      src={p.cover}
                      alt=""
                      className="h-40 w-full border-b-2 border-black object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-bold text-orange-600">
                      {formatDate(p.createdAt)} · {readingTime(p.content)} min read
                    </p>
                    <h3 className="mt-1 text-xl font-black uppercase leading-tight tracking-tighter">
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-black/70">
                      {p.excerpt}
                    </p>
                    {p.tags.length > 0 && (
                      <div className="mt-auto flex flex-wrap gap-2 pt-4">
                        {p.tags.slice(0, 3).map((t) => (
                          <Tag key={t}>{t}</Tag>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default memo(Blog);
