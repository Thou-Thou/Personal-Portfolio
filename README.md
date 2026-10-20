# Met Chanthou — Portfolio (Next.js)

Built with Next.js 16 (App Router), React 19 and TypeScript, exported as a static site.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
npm run preview    # serve out/ locally
```

## Edit your content

Everything (name, contact, skills, jobs, projects, education) lives in
`data/profile.ts`. Change it there and every tile updates.
Add `link: "https://…"` to a project to make its card clickable.

Still to fill in: `email` and `github`.

## Structure

```text
app/
  layout.tsx            fonts, metadata, theme script
  page.tsx              renders the page
  globals.css           all styles and animations
  icon.svg              browser tab icon
components/
  bento/Bento.tsx       the page: summary, work, background and contact tiles
  bento/Mock.tsx        animated app preview in the featured project
  bento/Butterflies.tsx flying butterflies (customize them at the top of the file)
  Icons.tsx             SVG icons
  theme.ts              light / dark switch
data/profile.ts         your content
```

## Deploy

GitHub Pages, set up in `.github/workflows/deploy.yml`. Push to `main` and the site updates
automatically. Step-by-step guide: [DEPLOY.md](DEPLOY.md). (`.gitlab-ci.yml` does the same on GitLab.)
