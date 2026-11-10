// import { memo } from "react";
import { memo, useEffect, useState } from "react";
import axios from "axios";
import greenrishabh from "../assets/greenrishabh.jpeg"
    
// import DynamicSections from "../components/DynamicSections";

/* ------------------------------------------------------------------ */
/*  CV DATA — edit the data here react will update automaticlly      */
/*  Jahan "TODO" likha hai wahan apni real details daalo               */
/* ------------------------------------------------------------------ */
const API_URL = import.meta.env.VITE_API_URL
const profile = {
  name: "Rishabh Prajapat",
  title: "AI/ML & Python Backend Developer",
  location: "Indore, Madhya Pradesh, India",
  email: "rp892422@gamil.com", // TODO
  phone: "+91 7509926228", // TODO
  github: "https://github.com/rishabhprajapat11070",
  linkedin: "https://linkedin.com/in/your-username", // TODO
  resume: "/resume.pdf", // TODO: public/ folder mein resume.pdf rakho
  summary:
    "Self-taught developer jo real-world web apps banata hai. Backend mujhe sabse natural lagta hai: FastAPI, SQL, auth, real-time features. Abhi internship ya junior Python backend role dhundh raha hoon.",
};

const education = [
  {
    degree: "B.Voc in Software Development",
    school: "Shree Hanuman Vyayam Prasarak Mandal (HVPM)",
    period: "2024 – 2027 (expected)",
  },
];

const projects = [
  {
    name: "NeedBro",
    type: "Home services marketplace",
    desc: "UrbanClap/Sulekha-style marketplace jisme customer, provider aur admin teeno roles hain. Real-time chat WebSocket se chalti hai.",
    stack: ["FastAPI", "SQLAlchemy", "MySQL", "WebSocket", "HTML/CSS/JS"],
    facts: ["20 database tables", "18 frontend pages", "3 user roles"],
    demo: "", // TODO
    repo: "", // TODO
  },

  {
    name: "Fake News Detector",
    type: "ML web app",
    desc: "News text ko classify karne wala Flask app, scikit-learn model ke saath. Render aur Railway par deploy kiya hai.",
    stack: ["Flask", "scikit-learn", "Python"],
    facts: ["Deployed on Render & Railway"],
    demo: "",
    repo: "",
  },
  
  {
    name: "Movie Recommender",
    type: "Recommendation system",
    desc: "Content-based recommender jo CountVectorizer aur cosine similarity se milti-julti movies suggest karta hai.",
    stack: ["Python", "Pandas", "scikit-learn"],
    facts: ["CountVectorizer + cosine similarity"],
    demo: "",
    repo: "",
  },
];

const skills = [
  { group: "Backend", items: ["Python", "FastAPI", "SQLAlchemy", "Pydantic", "Flask", "Django"] },
  { group: "Database", items: ["SQL", "MySQL", "SQLite"] },
  { group: "AI / Data", items: ["Pandas", "NumPy", "Matplotlib", "scikit-learn"] },
  { group: "Frontend", items: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"] },
];

const learning = ["React-native"];

/* ------------------------------------------------------------------ */

const SectionTitle = ({ children }) => (
  <h2 className="text-3xl font-black uppercase leading-[0.9] tracking-tighter sm:text-5xl">
    {children}
    <span className="text-orange-600">✳</span>
  </h2>
);

const Tag = ({ children }) => (
  <span className="rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-bold">
    {children}
  </span>
);

const Home = () => {

const [posts, setPosts] = useState([]);
const [blogLoading, setBlogLoading] = useState(true);
const [blogError, setBlogError] = useState(false);

useEffect(() => {
  const fetchPosts = async () => {
    try {
      setBlogLoading(true);
      setBlogError(false);

      const res = await axios.get(`${API_URL}/posts/`);

      // Handle both array and paginated API responses
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.results)
        ? res.data.results
        : [];

      setPosts(list.slice(0, 4));

    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setBlogError(true);
      setPosts([]);

    } finally {
      setBlogLoading(false);
    }
  };

  fetchPosts();
}, []);

  return (
    <div className="bg-[#fff8eb] text-black">
      <main>
        {/* HERO */}
        <section
          id="home"
          className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr] lg:px-12 lg:py-20"
        >
          <div>
            <p className="inline-block rounded-full border-2 border-black bg-white px-4 py-1 text-xs font-bold">
              Internship / junior roles ke liye available
            </p>
            {/* MAIN HEADING TOP LINE   */}
          <h1 className="mt-5 animate-[fade-up_0.7s_ease-out_both] text-5xl font-black uppercase leading-[0.85] tracking-tighter motion-reduce:animate-none sm:text-7xl lg:text-8xl">
              Python
              <br />
              backend,
              <br />
              <span className="text-orange-600">real</span> apps.
            </h1>
              
            <p className="mt-6 max-w-xl text-base leading-relaxed text-black/70 sm:text-lg">
              {profile.summary}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-3 rounded-full bg-black px-6 py-3 text-xs font-bold uppercase text-white transition hover:bg-orange-600"
              >
                Mere projects dekho
                <span aria-hidden="true" className="text-xl text-orange-400">
                  →
                </span>
              </a>
              <a
                href={profile.resume}
                download
                className="inline-flex items-center rounded-full border-2 border-black px-6 py-3 text-xs font-bold uppercase transition hover:bg-black hover:text-white"
              >
                Resume download
              </a>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xs">
            <div className="rounded-3xl border-2 border-black bg-orange-500 p-4 shadow-[8px_8px_0_0_#000]">
              <img
                src={greenrishabh}
                alt={`${profile.name} avatar`}
                className="aspect-square w-full rounded-2xl bg-[#fff8eb] object-cover"
              />
              <p className="mt-4 text-lg font-black uppercase leading-none tracking-tighter text-black">
                {profile.name}
              </p>
              <p className="mt-1 text-xs font-bold text-black/80">{profile.location}</p>
            </div>
          </div>
        </section>

        {/* BLOG */}
        <section id="blog" className="border-t-2 border-black bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionTitle>Blog</SectionTitle>
              <a
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border-2 border-black px-5 py-2 text-xs font-bold uppercase transition hover:bg-black hover:text-white"
              >
                Saare posts
                <span aria-hidden="true">→</span>
              </a>
            </div>

            {blogLoading && (
              <p className="mt-10 text-sm text-black/60">Posts load ho rahe hain...</p>
            )}

            {blogError && (
              <p className="mt-10 text-sm text-black/60">
                Posts abhi load nahi ho paye. Thodi der baad try karo.
              </p>
            )}

            {!blogLoading && !blogError && posts.length === 0 && (
              <p className="mt-10 text-sm text-black/60">Jaldi hi naye posts aayenge.</p>
            )}

            {posts.length > 0 && (
              <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                {/* FEATURED (latest post) */}
                <a
                  href={`/blog/${posts[0].id}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border-2 border-black bg-orange-500 shadow-[8px_8px_0_0_#000] transition hover:-translate-y-1"
                >
                  {posts[0].image && (
                    <img
                      src={posts[0].image}
                      alt={posts[0].title}
                      loading="lazy"
                      className="aspect-[16/9] w-full border-b-2 border-black object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <span className="inline-block w-fit rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-bold uppercase">
                      Latest
                    </span>
                    <h3 className="mt-4 text-3xl font-black uppercase leading-[0.95] tracking-tighter sm:text-4xl">
                      {posts[0].title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-black/80">
                      {posts[0].excerpt || posts[0].content}
                    </p>
                    <div className="mt-6 flex items-center justify-between text-xs font-bold uppercase">
                      <span>
                        {posts[0].created_at &&
                          new Date(posts[0].created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                      </span>
                      <span className="transition group-hover:translate-x-1">Padho →</span>
                    </div>
                  </div>
                </a>

                {/* BAAKI POSTS (numbered list) */}
                <ul className="flex flex-col gap-4">
                  {posts.slice(1).map((post, idx) => (
                    <li key={post.id}>
                      <a
                        href={`/blog/${post.id}`}
                        className="group flex gap-4 rounded-2xl border-2 border-black bg-[#fff8eb] p-4 shadow-[4px_4px_0_0_#000] transition hover:-translate-y-0.5 hover:bg-orange-100"
                      >
                        <span className="text-4xl font-black leading-none tracking-tighter text-orange-600">
                          {String(idx + 2).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1">
                          {post.created_at && (
                            <p className="text-[11px] font-bold uppercase text-black/60">
                              {new Date(post.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          )}
                          <h3 className="mt-1 text-lg font-black uppercase leading-tight tracking-tighter">
                            {post.title}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm text-black/70">
                            {post.excerpt || post.content}
                          </p>
                        </div>
                        <span
                          aria-hidden="true"
                          className="self-center text-xl transition group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* ABOUT + EDUCATION */}
        <section
          id="about"
          className="border-t-2 border-black"
        >
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-12">
            <div>
              <SectionTitle>About</SectionTitle>
              <p className="mt-6 max-w-prose leading-relaxed text-black/75">
                Main formal job ke bina, project-driven tareeke se seekh raha hoon. Mere portfolio
                projects (NeedBro, Jal Sahay) production-style backend skills dikhate hain: roles,
                authentication, database design aur real-time features. Saath hi React/frontend
                aur AI/ML par kaam kar raha hoon taaki end-to-end build kar sakoon.
              </p>
            </div>

            <div>
              <SectionTitle>Education</SectionTitle>
              <ul className="mt-6 space-y-4">
                {education.map((e) => (
                  <li
                    key={e.degree}
                    className="rounded-2xl border-2 border-black bg-white p-5"
                  >
                    <p className="text-sm font-black uppercase">{e.degree}</p>
                    <p className="mt-1 text-sm text-black/70">{e.school}</p>
                    <p className="mt-2 text-xs font-bold text-orange-600">{e.period}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="border-t-2 border-black bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-12">
            <SectionTitle>Projects</SectionTitle>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {projects.map((p) => (
                <article
                  key={p.name}
                  className="flex flex-col rounded-3xl border-2 border-black bg-[#fff8eb] p-6 shadow-[6px_6px_0_0_#000]"
                >
                  <p className="text-xs font-bold text-orange-600">{p.type}</p>
                  <h3 className="mt-1 text-2xl font-black uppercase tracking-tighter">
                    {p.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-black/75">{p.desc}</p>

                  <ul className="mt-4 space-y-1 text-sm text-black/80">
                    {p.facts.map((f) => (
                      <li key={f} className="flex gap-2">
                        <span aria-hidden="true" className="text-orange-600">
                          ✳
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                  </div>

                  {(p.demo || p.repo) && (
                    <div className="mt-6 flex gap-4 text-xs font-bold uppercase">
                      {p.demo && (
                        <a
                          href={p.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-4 transition hover:text-orange-600"
                        >
                          Live demo
                        </a>
                      )}
                      {p.repo && (
                        <a
                          href={p.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-4 transition hover:text-orange-600"
                        >
                          Source code
                        </a>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="border-t-2 border-black">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-12">
            <SectionTitle>Skills</SectionTitle>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {skills.map((g) => (
                <div key={g.group}>
                  <h3 className="border-b-2 border-black pb-2 text-sm font-black uppercase">
                    {g.group}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {g.items.map((i) => (
                      <Tag key={i}>{i}</Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border-2 border-dashed border-black p-5">
              <p className="text-sm font-black uppercase">Abhi seekh raha hoon</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {learning.map((l) => (
                  <span
                    key={l}
                    className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-black"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
                
        {/* CONTACT */}
        <section id="contact" className="border-t-2 border-black bg-black text-[#fff8eb]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-12">
            <div>
              <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tighter sm:text-6xl">
                Chalo kuch
                <br />
                <span className="text-orange-500">banate</span> hain.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-[#fff8eb]/75">
                Internship, junior backend role ya koi project idea ho to message karo. Main
                jaldi reply karne ki koshish karta hoon.
              </p>
            </div>

            <ul className="space-y-4 text-sm">
              {[
                { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
                { label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
                { label: "GitHub", value: "rishabhprajapat11070", href: profile.github },
                { label: "LinkedIn", value: profile.linkedin.replace("https://", ""), href: profile.linkedin },
                { label: "Location", value: profile.location },
              ].map((c) => (
                <li
                  key={c.label}
                  className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#fff8eb]/20 pb-3"
                >
                  <span className="text-xs font-bold text-orange-500">{c.label}</span>
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="break-all font-bold transition hover:text-orange-500"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <span className="font-bold">{c.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
     </div>
  );
};

export default memo(Home);
