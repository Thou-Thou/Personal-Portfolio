# Deploying the portfolio with GitHub

The site is published with **GitHub Pages**. It is free, needs no server, and redeploys
automatically every time you push to the `main` branch.

How it works:

- `next.config.mjs` exports the site as plain static files (`out/`), because the site has no
  server-side features.
- `.github/workflows/deploy.yml` tells GitHub to install, build and publish those files on every
  push to `main`.

You only need to do steps 1–4 once.

---

## 1. Before you start

- A GitHub account: <https://github.com/signup>
- Git installed on your computer (`git --version` should print a version).

## 2. Create the repository on GitHub

1. Go to <https://github.com/new>.
2. **Repository name:** for example `portfolio`.
3. **Public** (GitHub Pages is free for public repositories; private ones need a paid plan).
4. Leave **Add a README**, **.gitignore** and **license** all unticked, because this folder
   already has them.
5. Click **Create repository**. The next page shows your repository URL:

   ```text
   https://github.com/<your-username>/portfolio.git
   ```

   This is "the URL for your source repository" if another service asks for it.

## 3. Push this folder to GitHub

Open a terminal in this project folder and run (replace `<your-username>`):

```bash
git init -b main
git add .
git commit -m "First version of my portfolio"
git remote add origin https://github.com/<your-username>/portfolio.git
git push -u origin main
```

`node_modules`, `.next` and `out` are listed in `.gitignore`, so they are not uploaded.
On Windows a GitHub sign-in window opens the first time you push. Sign in, and Git remembers it.

## 4. Turn on GitHub Pages

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Open the **Actions** tab. If the first run failed because Pages was not on yet, open it and click
   **Re-run all jobs** (or **Deploy to GitHub Pages → Run workflow**).
4. When the run shows a green tick (about 1–2 minutes), your site is live at:

   ```text
   https://<your-username>.github.io/portfolio/
   ```

   The address is also shown on **Settings → Pages** and in the `deploy` job of the run.

The build reads the address from GitHub and adjusts the paths itself, so nothing else needs changing.

---

## 5. Updating the site

Edit your content (usually `data/profile.ts`), then:

```bash
git add .
git commit -m "Update projects"
git push
```

GitHub rebuilds and republishes automatically. Refresh the site after the Actions run turns green.

**Check before you push.** Run this locally:

```bash
npm run build      # must finish without errors
npm run preview    # opens the built site at http://localhost:3000
```

During development use `npm run dev` as usual. `npm start` is no longer used, because the site is
static files rather than a Node server.

### Optional: use your own domain

1. **Settings → Pages → Custom domain**, then enter your domain (for example `metchanthou.dev`)
   and save.
2. At your domain provider, add the DNS records GitHub lists: a `CNAME` record pointing to
   `<your-username>.github.io` for a subdomain like `www`, or GitHub's four `A` records for a root
   domain.
3. When the DNS check passes, tick **Enforce HTTPS**.
4. Run the workflow again (**Actions → Deploy to GitHub Pages → Run workflow**) so the build uses
   the new address.

---

## 6. Troubleshooting

| Problem | Fix |
| --- | --- |
| Run fails at **configure-pages** or **deploy** with a "Pages not enabled" / 404 error | Do step 4: set **Settings → Pages → Source** to **GitHub Actions**, then re-run. |
| Run fails at **npm run build** | Open the step's log. Run `npm run build` on your computer to see the same error, fix it and push again. |
| `git push` is **rejected** | The GitHub repository was created with a README. Run `git pull origin main --allow-unrelated-histories`, then push again. |
| Site shows **404** | Wait a minute after the first successful run, and check the address ends with `/portfolio/` (your repository name). |
| Page loads **without styles** | The site address changed (for example you added a custom domain). Run the workflow again so the build picks up the new address. |

---

## Other options

- **Vercel or Netlify:** both can import the GitHub repository directly (paste the repository URL
  from step 2). Build command `npm run build`, output folder `out`. No base path is needed.
- **GitLab Pages:** `.gitlab-ci.yml` is still included. Push the same folder to a GitLab project and
  it deploys to `https://<username>.gitlab.io/<project>/`, with the pipeline under
  **Build → Pipelines** and the address under **Deploy → Pages**.
