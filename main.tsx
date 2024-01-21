/** @jsx h */

import blog from "blog";

// This imports add syntax highlighting, bellow link is a list of available ones
// https://unpkg.com/browse/prismjs@1.29.0/components/
import "https://esm.sh/prismjs@1.28.0/components/prism-rust?no-check";
import "https://esm.sh/prismjs@1.28.0/components/prism-csharp?no-check";

blog({
  title: "vertin.dev",
  description: "My development journey",
  avatar: "./logo.svg",
  avatarClass: "border-hidden",
  // author: "Michał Tracewicz",
  links: [
    { title: "GitHub", url: "https://github.com/mtracewicz" },
    { title: "About", url: "https://mtracewicz.deno.dev/about" },
  ],
  favicon: "favicon.png",
  theme: "dark",
});
