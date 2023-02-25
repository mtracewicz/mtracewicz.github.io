/** @jsx h */

import blog from "blog";
import "https://esm.sh/prismjs@1.28.0/components/prism-rust?no-check";

blog({
  title: "mtracewicz",
  description: "My development journey",
  avatar: "./logo.svg",
  avatarClass: "border-hidden",
  author: "Michał Tracewicz",
  links: [
    { title: "Email", url: "mailto:m.tracewicz@gmail.com" },
    { title: "GitHub", url: "https://github.com/mtracewicz" },
    { title: "About", url: "https://mtracewicz.deno.dev/about" },
  ],
  favicon: "favicon.png",
  theme: "dark",
  dateStyle: "long",
});
