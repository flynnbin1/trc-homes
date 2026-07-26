# 301 Redirect Plan — therenovationcentre.ie → trchomes.ie

These are **301 (permanent) redirects** from the old business site
(`therenovationcentre.ie`, WordPress) to the new site (`trchomes.ie`). Setting
them up at launch preserves the SEO authority and inbound links the old domain
has earned, so existing rankings and bookmarks carry over to the new pages
instead of dropping visitors on 404s.

## Mapping

The list below is the **complete** set of indexed URLs from the old site — taken
from its nav, footer, and Google's index. No other pages exist.

| Old URL (therenovationcentre.ie) | New URL (trchomes.ie) | Notes |
| --- | --- | --- |
| `/` | `/` | Homepage → homepage |
| `/about/` | `/about.html` | |
| `/service/` | `/services.html` | |
| `/projects/` | `/projects.html` | |
| `/testimonials/` | `/projects.html` | No direct equivalent; testimonials live on the projects page |
| `/contact/` | `/contact.html` | |
| `/renovation/` | `/services/full-renovations.html` | |
| `/house-building/` | `/services.html` | No exact equivalent; send to the services hub |
| `/interior/` | `/services.html` | No exact equivalent; send to the services hub |

## How to implement

These redirects are **not** part of this codebase — do **not** add redirect code
to any HTML file. They must be configured at the **hosting / DNS level**, on the
old domain, at launch:

- On the old domain's host (e.g. its `.htaccess` / WordPress redirect plugin /
  host redirect rules), **or**
- Via Vercel once `therenovationcentre.ie` is pointed at the new project (a
  `vercel.json` `redirects` block or the dashboard redirect settings).

Whichever route is used, every old URL above must issue an HTTP **301** to its
new target. **This is a launch-time task** — it happens when the domains are
switched over, not before, and not inside these page files.

## Still to confirm with Adrian

1. **Old domain ownership / access.** Confirm Adrian controls and can log in to
   `therenovationcentre.ie` and its hosting. The old site was built by
   `pluspromotions.ie` — they may still hold the domain and/or hosting login,
   which we'll need in order to apply the redirects at launch.
2. **Real Google reviews for testimonials.** The old site has genuine Google
   reviews from named 2020–2021 clients (Janet Kelleher, Karen Barton,
   Laura O'Mahony and others). With permission, these could be used as real
   testimonials on the new site — confirm before publishing any of them.
3. **Real email address live before launch.** Confirm the real `trchomes.ie`
   email address is set up and being monitored before go-live. The old site used
   `info@therenovationcentre.ie`; the new site currently shows a placeholder that
   must be replaced with the confirmed, working address.
