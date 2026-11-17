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
