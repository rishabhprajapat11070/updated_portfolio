import { memo, useEffect, useState } from "react";
import { publicApi } from "../api";

const SAFE = /^(https?:|mailto:|tel:|#|\/(?!\/))/i;
const safeHref = (url) => (url && SAFE.test(url.trim()) ? url.trim() : undefined);

const Tag = ({ children }) => (
  <span className="rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-bold">
    {children}
  </span>
);

const Heading = ({ children }) => (
  <h2 className="text-3xl font-black uppercase leading-[0.9] tracking-tighter sm:text-5xl">
    {children}
    <span className="text-orange-600">✳</span>
  </h2>
);

const TextBlock = ({ s }) => (
  <div className="max-w-prose space-y-4 leading-relaxed text-black/75">
    {s.body
      .split(/\n{2,}/)
      .filter((p) => p.trim())
      .map((p, i) => (
        <p key={i}>{p}</p>
      ))}
  </div>
);

const Cards = ({ s }) => (
  <div className="grid gap-6 md:grid-cols-2">
    {s.items.map((it, i) => {
      const href = safeHref(it.link);
      return (
        <article
          key={i}
          className="flex flex-col rounded-3xl border-2 border-black bg-[#fff8eb] p-6 shadow-[6px_6px_0_0_#000]"
        >
          <h3 className="text-2xl font-black uppercase tracking-tighter">{it.title}</h3>
          {it.text && <p className="mt-3 text-sm leading-relaxed text-black/75">{it.text}</p>}
          {it.tags?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {it.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          )}
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 text-xs font-bold uppercase underline underline-offset-4 transition hover:text-orange-600"
            >
              Open →
            </a>
          )}
        </article>
      );
    })}
  </div>
);

const TagGroups = ({ s }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {s.items.map((g, i) => (
      <div key={i}>
        <h3 className="border-b-2 border-black pb-2 text-sm font-black uppercase">{g.title}</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {g.tags?.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const Links = ({ s }) => (
  <ul className="max-w-xl space-y-3 text-sm">
    {s.items.map((it, i) => {
      const href = safeHref(it.link);
      return (
        <li
          key={i}
          className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-black/10 pb-3"
        >
          <span className="text-xs font-bold text-orange-600">{it.title}</span>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all font-bold transition hover:text-orange-600"
            >
              {it.text || it.link}
            </a>
          ) : (
            <span className="font-bold">{it.text}</span>
          )}
        </li>
      );
    })}
  </ul>
);

const RENDERERS = { text: TextBlock, cards: Cards, tags: TagGroups, links: Links };

const DynamicSections = () => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    let alive = true;
    publicApi
      .get("/sections/")
      .then((res) => alive && setSections(res.data.results ?? res.data))
      .catch(() => {}); // fail ho to page bina extra sections ke chalta rahe
    return () => {
      alive = false;
    };
  }, []);

  return sections.map((s, i) => {
    const Body = RENDERERS[s.section_type];
    if (!Body) return null;
    return (
      <section
        key={s.id}
        id={`s-${s.slug}`}
        className={`border-t-2 border-black ${i % 2 === 0 ? "bg-white" : ""}`}
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-12">
          <Heading>{s.title}</Heading>
          <div className="mt-10">
            <Body s={s} />
          </div>
        </div>
      </section>
    );
  });
};

export default memo(DynamicSections); 
