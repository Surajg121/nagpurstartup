import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Insights", href: "/insights" },
  { label: "Founder Stories", href: "/founder-stories" },
  { label: "Startup News", href: "/startup-news" },
  { label: "Job Opportunities", href: "/job-opportunities" },
];

export default function Navbar() {
  return (
    <header>
      {/* Top bar with logo */}
      <div className="bg-gray-100 border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Nagpur Startup Hub"
              width={360}
              height={130}
              className="h-28 w-auto object-contain"
              priority
            />
          </Link>
          <span className="hidden md:block text-gray-700 text-sm font-semibold tracking-widest uppercase">
            Insights &bull; Stories &bull; Opportunities
          </span>
        </div>
      </div>

      {/* Navy nav bar matching logo's dark blue */}
      <nav style={{ backgroundColor: "#1a2f5e" }}>
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-0 overflow-x-auto">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:text-orange-400 hover:border-b-4 hover:border-orange-400 transition-all whitespace-nowrap"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="ml-auto">
              <Link
                href="/blog"
                className="block px-4 py-2 my-2 bg-orange-500 text-white text-sm font-bold uppercase tracking-wide hover:bg-orange-600 transition rounded"
              >
                All Stories
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

