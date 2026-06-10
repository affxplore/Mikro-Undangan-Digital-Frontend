import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ArrowUpRight,
  ShieldCheck,
  Wand2,
  Palette,
  Sparkles,
} from "lucide-react";


export default function Footer() {
  return (
    <footer className="bg-white/50 text-gray-700 py-2 px-2">
    <div className="mx-auto  bg-white w-full p-5 h-60" data-swiper-parallax="-40">
                      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3" >
                        <div>
                          <div className="mb-2 text-lg font-semibold">Mikro Undangan</div>
                          <p className="text-sm opacity-80">Solusi undangan digital website: bisa diakses lewat HP, mudah diedit,
                  lengkap fitur seperti galeri, RSVP, countdown, check-in QR, dan lainnya.
                  Bikin undangan impianmu dalam hitungan menit.</p>
                          <div className="mt-3 flex items-center gap-2 text-xs opacity-70"><ShieldCheck className="h-4 w-4"/> Privasi & Keamanan</div>
                        </div>
                        <div>
                          <div className="mb-2 text-sm font-semibold">Menu</div>
                          <ul className="space-y-2 text-sm opacity-90">
                            {[
                              { label: "Template", href: "/tema" },
                              { label: "Harga", href: "/price" },
                              { label: "Partner", href: "/partner" },
                              { label: "About", href: "/about" },
                            ].map((m) => (<li key={m.label}><a href={m.href} className="transition hover:underline">{m.label}</a></li>))}
                          </ul>
                        </div>
                        <div>
                          <div className="mb-2 text-sm font-semibold">Kontak</div>
                          <ul className="space-y-2 text-sm opacity-90">
                            <li>Email: halo@mikroundangan.app</li>
                            <li>IG: @mikroundangan</li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-10 border-t pt-6 text-xs opacity-70" >© {new Date().getFullYear()} Mikro Undangan. All rights reserved.</div>
                    </div>
    </footer>
  );
}