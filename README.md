# PrettyJSON

A responsive set of browser-based tools to format, minify, validate, and compare JSON, plus count characters. Copy or download formatted JSON. Your data is processed locally and is not sent to a server.

## Screenshots

| Format and validate JSON | Compare JSON |
| --- | --- |
| ![PrettyJSON formatting and validating JSON](docs/images/prettyjson-format.png) | ![PrettyJSON JSON comparison results](docs/images/prettyjson-compare.png) |

### Count characters

![PrettyJSON character counter](docs/images/prettyjson-count.png)

## What to install

1. Install **Node.js LTS** from [nodejs.org](https://nodejs.org/). npm is included with Node.js.
2. Unzip this folder and open a terminal in `prettyjson-react`.
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local address printed by Vite (usually `http://localhost:5173`). Press `Ctrl+C` in the terminal to stop the development server.

## Production build

Run `npm run build`. The website files will be generated in the `dist` folder. To preview that build locally, run `npm run preview`.

## Deploy to GitHub Pages

This project is published at <https://sanjaykpatel09.github.io/> from the `sanjaykpatel09.github.io` repository.

1. Push this project to the `main` branch of the `sanjaykpatel09.github.io` repository.
2. In the repository, open **Settings → Pages** and set the build and deployment source to **GitHub Actions**.
3. Each push to `main` will build and deploy the site. The published URL will appear in the workflow run and in **Settings → Pages**.

The GitHub Actions workflow automatically uses the root path for this `*.github.io` repository.

## Fake(Json) Data

The site publishes fixed, read-only JSON data about fictional employees and related workplace resources for development and demos:

- Netlify: <https://prettyjson2.netlify.app/employees/>
- GitHub Pages: <https://sanjaykpatel09.github.io/employees/>
- Example employee by ID: <https://prettyjson2.netlify.app/employees/1/>

The **Fake(Json) Data** tab lists routes and provides copyable client examples for Python/FastAPI, Java/Spring Boot, C#/.NET/ASP.NET Core, Node.js/Express, Go/Gin, PHP/Laravel, and Ruby/Rails. Available GET collections are `/employees/` (10), `/departments/` (8), `/projects/` (10), `/tasks/` (11), `/locations/` (10), and `/roles/` (10). GET `/employees/1/` returns one employee; `/employees/1/projects/` and `/employees/1/tasks/` return related resources for the sample employee. The classic SCOTT sample is available at `/scott/employees/` (14) and `/scott/departments/` (4), with a downloadable PostgreSQL-compatible `scott.sql` script that creates a separate `scott` schema containing `emp`, `dept`, `bonus`, and `salgrade`. These are static files with cross-origin GET access enabled; they do not provide CRUD operations or server-side filtering. POST, PUT, PATCH, and DELETE routes shown in the UI are illustrative only.

## Deploy to Netlify

This project is also published at <https://prettyjson2.netlify.app/>. Netlify is connected to the same GitHub repository and automatically deploys changes pushed to `main`.

SEO metadata, social sharing tags, structured data, and crawlable page copy are maintained in `index.html`. The public crawl rules and sitemap are in `public/robots.txt` and `public/sitemap.xml`; update their canonical URL if the primary site address changes.

## Customize

- Change the page behavior in `src/App.jsx`.
- Change colors and layout in `src/styles.css`.
- Update the browser title and description in `index.html`.

This is a front-end starter only. It does not include hosting, a domain, ads, analytics, payment processing, or a backend. Before publishing, replace the placeholder product branding and add your own privacy, contact, and policy pages. The Google Fonts import is optional; system fonts will be used if the font service is unavailable.
