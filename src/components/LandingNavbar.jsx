import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useSystemContent from "../api/system_content/useSystemContent";

const LandingNav = ({ currentSlide = 0 }) => {
  const [hasBackground, setHasBackground] = useState(false);
  const location = useLocation();
  const { getByKey } = useSystemContent();
  const [logoUrl, setLogoUrl] = useState(""); // State untuk URL logo dinamis
  const appName = import.meta.env.VITE_APP_NAME || "Mikro Undangan";

  useEffect(() => {
    const isHomePage = location.pathname === "/";

    if (isHomePage) {
      // pakai swiper di home
      setHasBackground(currentSlide > 0);
    } else {
      // pakai scroll listener di page lain
      const handleScroll = () => {
        if (window.scrollY > 20) {
          setHasBackground(true);
        } else {
          setHasBackground(false);
        }
      };

      handleScroll(); // cek langsung posisi awal
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [currentSlide, location]);

  // Efek untuk mengambil URL logo dari system content
  useEffect(() => {
    const fetchLogo = async () => {
      const logoContent = await getByKey('logo_app');
      if (logoContent && logoContent.content) {
        const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:2222";
        const finalUrl = `${SERVER_URL}${logoContent.content}`;
        setLogoUrl(finalUrl);
      }
    };
    fetchLogo();
  }, [getByKey]);

  return (
    <div
      className={`pointer-events-none fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 transition-colors duration-300 ${
        hasBackground ? "bg-blue-300/80 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="pointer-events-auto flex items-center gap-2">
        <img src={logoUrl} alt="Logo" className="w-8 h-8 rounded-lg" />
        <a href="/" className="text-sm font-semibold tracking-wide text-black">
          {appName}
        </a>
      </div>

      <nav className="pointer-events-auto hidden items-center gap-5 md:flex">
        {[
          { label: "Templates", href: "/tema" },
          { label: "Harga", href: "/price" },
          { label: "Partner", href: "/partner" },
          { label: "About", href: "/about" },
        ].map((l) => (
          <Link
            key={l.label}
            to={l.href}
            className="text-sm transition text-black hover:underline"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="pointer-events-auto flex items-center gap-2">
        <Link
          to="/login"
          className="rounded-full border border-white bg-white px-4 py-2 text-sm text-blue-900 font-semibold hover:bg-white shadow transition hover:shadow-lg"
        >
          Login
        </Link>
        <Link
          to="/regis"
          className="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-900 shadow transition hover:shadow-lg"
        >
          Register{" "}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};

export default LandingNav;
 
