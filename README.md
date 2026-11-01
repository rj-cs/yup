# Yup

Indie software lab built with HTML, CSS, and JavaScript.

### Local preview

```sh
python3 -m http.server 8000 --directory src
```

Open <http://localhost:8000>.

### GitHub Pages

Site: <https://rj-cs.github.io/yup/>

The workflow in `.github/workflows/deploy-pages.yml` publishes `src/` on every push to `main`. No build step is required. Assets use relative paths so they work under `/yup/`.

In the repository's **Settings → Pages**, the source must be **GitHub Actions**. Deployments can also be started manually from **Actions → Deploy to GitHub Pages → Run workflow**.
