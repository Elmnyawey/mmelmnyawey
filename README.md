# Muhammed Elmnyawey — Engineering Portfolio

A static, responsive English-language portfolio for a Civil & Structural Engineer specializing in Technical Office, BIM coordination, shop drawings and construction documentation.

## Live publishing (Cloudflare Pages)
1. Log into https://dash.cloudflare.com/ and open **Workers & Pages**.
2. Use **Continue to Pages** if Cloudflare displays the newer Workers-first flow.
3. Choose **Connect to Git** and select GitHub repository **Elmnyawey/mmelmnyawey** on branch **main**.
4. Choose **None** / **No framework** as build preset.
5. Leave build command **blank** and set output directory to **/** (repository root). If the interface uses **Build output directory**, enter a period (`.`) to represent root.
6. Deploy. Cloudflare will provide a `*.pages.dev` URL. Future commits to `main` will trigger deployment.

No paid plan or custom domain is required for the static site.

## Editing the website — no coding needed
Use the file editor: **https://github.com/Elmnyawey/mmelmnyawey/edit/main/data/site.json**

1. Open the link above.
2. Change values inside quotation marks, keeping the JSON syntax intact.
3. To change phone, email, Facebook, LinkedIn, or GitHub, edit `profile.phone`, `profile.email`, `profile.facebook`, `profile.linkedin`, or `profile.github`.
4. Each item in `projects` has `title`, `overview`, `myWork`, `tools`, `image`, `imageCredit`, and `sources`.
5. Click **Commit changes**. Once Cloudflare is connected, the site updates after redeployment.

**Facebook:** The URL is deliberately blank until the owner supplies their exact profile. Do not guess it.
**CV download:** `profile.cvUrl` is blank until a public-ready CV is approved.
**Photo:** `favicon.svg` is a small photo-based avatar derived from a previously supplied photo. Replace it only with the owner's approved portrait.

## Privacy, ownership, and credits
Public building descriptions and public promotional images are distinct from the owner's work experience. Project images link to external publishers and retain source credit; they may fail if a publisher disables hotlinking or removes content. Only publish drawings, models and on-site images with permission. The wider 113-project figure for Dar El Salam refers to the district's initiative rather than to the owner's individual contributions.

## Technology
Static HTML, CSS, JS and `data/site.json`; no server, database or paid build tooling.

## Files
- `index.html` — site structure
- `styles.css` — responsive design
- `script.js` — navigation, project filters and content loader
- `data/site.json` — editable bio, project notes, images, contact links
- `favicon.svg` — photo-derived site icon

## Arabic / English pages
- English home: https://mmelmnyawey.pages.dev/
- Arabic home: https://mmelmnyawey.pages.dev/ar/
- Services: `/services.html` and `/ar/services.html`
- Professional courses taken: `/courses.html` and `/ar/courses.html`
- Articles: `/articles.html` and `/ar/articles.html`
- Each article has its own English and Arabic URL.

### Easy editing
- Profile, contact, project images and descriptions: [data/site.json](https://github.com/Elmnyawey/mmelmnyawey/edit/main/data/site.json).
- Arabic project text: [data/ar.json](https://github.com/Elmnyawey/mmelmnyawey/edit/main/data/ar.json).
- Services, courses studied and articles in both languages: [data/content.json](https://github.com/Elmnyawey/mmelmnyawey/edit/main/data/content.json).
- Edit data in the GitHub editor and commit. Pages use JavaScript to update live text from JSON while retaining static initial article text for indexing and offline fallback. For new articles (not editing existing ones), add a new linked HTML page or ask ChatGPT to generate one.

### Google discovery
- `robots.txt` allows crawling and declares the sitemap.
- `sitemap.xml` lists English and Arabic pages.
- Each page has a descriptive title, description, canonical and alternate-language URLs.
- Home pages include Person structured data.

To appear in Google, go to https://search.google.com/search-console/ , add the **URL prefix** property `https://mmelmnyawey.pages.dev/` and complete verification. Submit `https://mmelmnyawey.pages.dev/sitemap.xml` under Sitemaps. Use URL Inspection to request crawling for the homepage and key pages. Google indexing is not automatic or guaranteed.

## Owner-only article publishing workflow
- Unlisted content editor: **https://mmelmnyawey.pages.dev/owner-publish.html**
- This page is not linked from public navigation or the XML sitemap and sends a `noindex` directive, but its URL is **not authentication**. Anyone who learns the URL could see the empty editor. They cannot publish without authenticated GitHub write permission.
- Fill the Arabic and English fields, preview, and use **Copy publishing data**.
- Log into the owner's GitHub account. Open **https://github.com/Elmnyawey/mmelmnyawey/actions/workflows/publish-article.yml**, choose **Run workflow**, paste into `article_json`, and confirm.
- The workflow validates fields and slug uniqueness, generates static pages in both languages, updates `data/content.json`, the English/Arabic article index pages and `sitemap.xml`, commits to `main`, then Cloudflare Pages deploys automatically.
- If the workflow cannot commit, inspect **Settings → Actions → General → Workflow permissions** and grant **Read and write permissions**, and ensure Actions are enabled.
- Articles become publicly visible after publishing. The publishing editor itself does not hold GitHub tokens, passwords or drafts on a server.
