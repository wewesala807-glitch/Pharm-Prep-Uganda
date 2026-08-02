import "react";

// The lite-youtube-embed package ships no type declarations at all (it's a
// plain side-effect import that registers a custom element), so we declare
// the module ourselves to satisfy TypeScript's build-time type check.
declare module "lite-youtube-embed";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "lite-youtube": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { videoid: string; playlabel?: string },
        HTMLElement
      >;
    }
  }
}
