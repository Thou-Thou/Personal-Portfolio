# Deploying the portfolio with GitHub

The site is published with **GitHub Pages**. It is free, needs no server, and redeploys
automatically every time you push to the `main` branch.

How it works:

- `next.config.mjs` exports the site as plain static files (`out/`), because the site has no
  server-side features.
- `.github/workflows/deploy.yml` tells GitHub to install and build the site on every push to
  `main`, and saves the finished files to the `gh-pages` branch, which GitHub Pages serves.

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

1. Open the **Actions** tab and wait for the **Deploy to GitHub Pages** run to show a green tick
   (about 1–2 minutes). It creates a `gh-pages` branch containing the finished site.
2. Open **Settings → Pages**. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `gh-pages`, folder `/ (root)`, then click **Save**.

   Do not pick `main`: that branch holds the source code, and GitHub would show the README instead.
3. GitHub then runs its own **pages build and deployment** job (about 1 minute). Your site is live at:

   ```text
   https://<your-username>.github.io/portfolio/
   ```

   The address is also shown at the top of **Settings → Pages**.

The workflow sets the site's path from the repository name, so nothing else needs changing.

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
4. In `.github/workflows/deploy.yml`, change `BASE_PATH` to `""` (the site now lives at the root of
   your domain), then commit and push.

---

## 6. Troubleshooting

| Problem | Fix |
| --- | --- |
| Site shows the **README** instead of the portfolio | **Settings → Pages → Branch** is set to `main`. Change it to `gh-pages` / `(root)` and click **Save**. |
| No `gh-pages` branch to choose | The **Deploy to GitHub Pages** run has not succeeded yet. Check the **Actions** tab and fix any error there first. |
| Run fails at **Publish to the gh-pages branch** with "permission denied" | **Settings → Actions → General → Workflow permissions**: choose **Read and write permissions**, save, and re-run. |
| Run fails at **npm run build** | Open the step's log. Run `npm run build` on your computer to see the same error, fix it and push again. |
| `git push` is **rejected** | The GitHub repository was created with a README. Run `git pull origin main --allow-unrelated-histories`, then push again. |
| Site shows **404** | Wait a minute after the first successful run, and check the address ends with `/portfolio/` (your repository name). |
| Page loads **without styles** | The site address changed (for example you added a custom domain). Update `BASE_PATH` in the workflow as described under "Use your own domain". |

---

## Other options

- **Vercel or Netlify:** both can import the GitHub repository directly (paste the repository URL
  from step 2). Build command `npm run build`, output folder `out`. No base path is needed.
- **GitLab Pages:** `.gitlab-ci.yml` is still included. Push the same folder to a GitLab project and
  it deploys to `https://<username>.gitlab.io/<project>/`, with the pipeline under
  **Build → Pipelines** and the address under **Deploy → Pages**.
