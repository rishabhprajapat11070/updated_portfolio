import { memo ,useState,useEffect} from "react";
import greenrishabh from "../assets/greenrishabh.jpeg"
import { publicApi } from "../api";      
import DynamicSections from "../components/DynamicSections";

/* ------------------------------------------------------------------ */
/*  CV DATA — edit the data here react will update automaticlly      */
/*  Jahan "TODO" likha hai wahan apni real details daalo               */
/* ------------------------------------------------------------------ */

const profile = {
  name: "Rishabh Prajapat",
  title: "AI/ML & Python Backend Developer",
  location: "Indore, Madhya Pradesh, India",
  email: "your-email@example.com", // TODO
  phone: "+91 XXXXX XXXXX", // TODO
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
const [sections, setSections] = useState([]);

useEffect(() => {
  publicApi.get("/sections/")
    .then(({ data }) => {
      console.log("sections:", data);              // debug ke liye
      setSections(Array.isArray(data) ? data : data.results || []);
    })
    .catch((e) => console.error("sections error:", e));
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
            <h1 className="mt-5 text-5xl font-black uppercase leading-[0.85] tracking-tighter sm:text-7xl lg:text-8xl">
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
      <DynamicSections />
    </div>
  );
};

export default memo(Home);
