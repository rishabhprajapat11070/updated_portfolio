import { memo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import avatar from "../assets/avatar.png";


const links = [
  { label: "Home", href: "/#home" },
  { label: "Projects", href: "/#projects" },
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
  { label: "Blog", href: "/blog" },
];


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const timer = window.setTimeout(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [location]);

  // Escape dabane pe menu band
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Screen desktop size ho jaye to mobile menu reset
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => e.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const close = () => setOpen(false);



  return (
    <header className="sticky top-0 z-50 border-t-2 border-black bg-[#fff8eb]">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-12"
        aria-label="Main navigation"
      >
        {/* Avatar + name */}
        <Link to="/#home" onClick={close} className="flex items-center gap-2">
          <img
            src={avatar}
            alt="Rishabh avatar"
            className="h-12 w-12 object-contain sm:h-16 sm:w-16"
          />
          <span className="text-lg font-black uppercase leading-[0.9] tracking-tighter text-black sm:text-xl">
            Rishabh<span className="text-orange-600">✳</span>
            <br />
            Prajapat
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 text-xs font-bold uppercase lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="transition hover:text-orange-600"
            >
              
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link
          to="/#contact"

          className="hidden items-center gap-3 rounded-full bg-black px-5 py-1 text-xs font-bold uppercase text-white transition duration-200 hover:bg-orange-600 active:scale-105 lg:flex"
        >
          Let’s work together
          <span aria-hidden="true" className="text-xl text-orange-400">
            →
          </span>
        </Link>

        {/* Hamburger button (mobile/tablet) */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 items-center justify-center rounded-full border-black transition hover:bg-orange-600 hover:text-white lg:hidden"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`grid overflow-hidden border-black bg-[#fff8eb] transition-all duration-300 lg:hidden ${
          open
            ? "grid-rows-[1fr] border-t-2 opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={close}
                className="rounded-lg px-3 py-3 text-sm font-bold uppercase transition hover:bg-orange-100 hover:text-orange-600"
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/#contact"
              onClick={close}
              className="mt-3 flex items-center justify-between rounded-full bg-black px-5 py-3 text-xs font-bold uppercase text-white transition hover:bg-orange-600"
            >
              Let’s work together
              <span aria-hidden="true" className="text-xl text-orange-400">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
      
    </header>
  );
};

export default memo(Navbar);
