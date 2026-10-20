// The site has no server features, so it is exported as plain static files (the `out/` folder).
// GitHub Pages and GitLab Pages can serve it under a sub-path, e.g. https://<user>.github.io/<repo>/.
// - GitHub: the workflow passes that sub-path as BASE_PATH.
// - GitLab: the final address arrives as CI_PAGES_URL.
// Locally neither is set and the site is served from the root.
const basePath =
  process.env.BASE_PATH ??
  (process.env.CI_PAGES_URL ? new URL(process.env.CI_PAGES_URL).pathname.replace(/\/$/, "") : "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  // Keeps Next from picking up a lockfile outside this folder
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
