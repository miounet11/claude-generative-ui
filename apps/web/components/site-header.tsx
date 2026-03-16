import Link from "next/link";

import { siteNavigation } from "../lib/marketing";

export function SiteHeader() {
  return (
    <header className="site-nav">
      <Link className="brand" href="/">
        StreamCanvas
      </Link>
      <nav className="nav-links">
        {siteNavigation.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
        <a href="https://github.com/miounet11/claude-generative-ui" rel="noreferrer">
          GitHub
        </a>
      </nav>
    </header>
  );
}
