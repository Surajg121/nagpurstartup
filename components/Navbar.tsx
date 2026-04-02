import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Insights", href: "/blog?category=Insights" },
  { label: "Founder Stories", href: "/blog?category=Founder+Stories" },
  { label: "Startup News", href: "/blog?category=Startup+News" },
  { label: "Job Opportunities", href: "/blog?category=Job+Opportunities" },
];

export default function Navbar() {
  return (
    <header>
      {/* Top black bar with logo */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold tracking-tight uppercase text-white hover:text-red-400 transition">
            Nagpur Startup Hub
          </Link>
          <span className="hidden md:block text-gray-400 text-sm italic">
            Nagpur&apos;s Growing Startup Ecosystem
          </span>
        </div>
      </div>

      {/* Bottom white nav bar with category links */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-0 overflow-x-auto">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-4 py-3 text-sm font-semibold uppercase tracking-wide text-gray-800 hover:text-red-700 hover:border-b-4 hover:border-red-700 transition-all whitespace-nowrap"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="ml-auto">
              <Link
                href="/blog"
                className="block px-4 py-2 my-2 bg-red-700 text-white text-sm font-bold uppercase tracking-wide hover:bg-red-800 transition rounded"
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

