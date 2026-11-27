// Copies dist/index.html to dist/404.html so static hosts without rewrite rules still serve SPA routes.
import { copyFileSync, existsSync } from "node:fs"
if (existsSync("dist/index.html")) copyFileSync("dist/index.html", "dist/404.html")
