import avatar from "../assets/avatar.png";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const projects = [
  { label: "NeedBro", href: "#projects" },
  { label: "Jal Sahay", href: "#projects" },
  { label: "Fake News Detector", href: "#projects" },
  { label: "Movie Recommender", href: "#projects" },
];

const stack = ["Python", "FastAPI", "Django", "React", "Tailwind CSS"];

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/rishabhprajapat11070",
    path: "M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.76 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/your-username", // TODO: apna link daalo
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z",
  },
  {
    label: "Email",
    href: "mailto:your-email@example.com", // TODO: apna email daalo
    path: "M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5v-13Zm2.2.5L12 11.9 19.8 6H4.2Zm15.8 2.4-7.4 5.6a1 1 0 0 1-1.2 0L4 8.4V18h16V8.4Z",
  },
];

const Skyline = () => (
  <svg
    viewBox="0 0 1200 120"
    preserveAspectRatio="xMidYMax slice"
    className="block h-20 w-full sm:h-28 lg:h-32"
    aria-hidden="true"
  >
    <g fill="#000">
      <rect x="0" y="70" width="60" height="50" />
      <rect x="70" y="40" width="50" height="80" />
      <rect x="130" y="85" width="70" height="35" />
      <rect x="210" y="25" width="45" height="95" />
      <rect x="265" y="60" width="80" height="60" />
    </g>
    <g fill="#ea580c">
      <rect x="355" y="45" width="55" height="75" />
      <rect x="420" y="75" width="90" height="45" />
      <rect x="520" y="20" width="40" height="100" />
      <rect x="570" y="55" width="70" height="65" />
    </g>
    <g fill="#000">
      <rect x="650" y="80" width="60" height="40" />
      <rect x="720" y="35" width="50" height="85" />
      <rect x="780" y="65" width="90" height="55" />
      <rect x="880" y="45" width="45" height="75" />
    </g>
    <g fill="#ea580c">
      <rect x="935" y="70" width="70" height="50" />
      <rect x="1015" y="30" width="50" height="90" />
      <rect x="1075" y="60" width="60" height="60" />
      <rect x="1145" y="85" width="55" height="35" />
    </g>
  </svg>
);

const Footer = () => {
  return (
    <footer className="border-t-2 border-black bg-[#fff8eb]">
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-12">
        {/* Top: brand + CTA */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <a href="#home" className="flex items-center gap-2">
              <img
                src={avatar}
                alt="Rishabh avatar"
                className="h-14 w-14 object-contain"
              />
              <span className="text-xl font-black uppercase leading-[0.9] tracking-tighter text-black">
                Rishabh<span className="text-orange-600">✳</span>
                <br />
                Prajapat
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-black/70">
              AI/ML &amp; Python Backend Developer from Indore. Main real-world
              web apps banata hoon: clean APIs, solid backend, aur thoda AI.
            </p>
          </div>

          <div className="lg:max-w-xs">
            <h3 className="text-sm font-black uppercase">Open to work</h3>
            <p className="mt-2 text-sm text-black/70">
              Internships aur junior backend roles ke liye available hoon.
            </p>
            <a
              href="#contact"
              className="mt-4 inline-flex items-center gap-3 rounded-full bg-black px-5 py-3 text-xs font-bold uppercase text-white transition hover:bg-orange-600"
            >
              Let’s work together
              <span aria-hidden="true" className="text-xl text-orange-400">
                →
              </span>
            </a>
          </div>
        </div>

        {/* Columns */}
        <div className="mt-10 grid grid-cols-2 gap-8 border-t-2 border-black/10 pt-10 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-black uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm text-black/70">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="transition hover:text-orange-600">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase">Projects</h3>
            <ul className="mt-4 space-y-2 text-sm text-black/70">
              {projects.map((p) => (
                <li key={p.label}>
                  <a href={p.href} className="transition hover:text-orange-600">
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase">Tech Stack</h3>
            <ul className="mt-4 space-y-2 text-sm text-black/70">
              {stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-black uppercase">Connect With Me</h3>
            <ul className="mt-4 space-y-2 text-sm text-black/70">
              <li>your-email@example.com</li>
              <li>Indore, Madhya Pradesh, India</li>
            </ul>

            <div className="mt-4 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white text-black transition hover:bg-orange-600 hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-10 pb-6 text-center text-xs text-black/60">
          © {new Date().getFullYear()} Rishabh Prajapat. All Rights Reserved.
        </p>
      </div>

      {/* Bottom skyline */}
      <Skyline />
    </footer>
  );
};

export default Footer;
