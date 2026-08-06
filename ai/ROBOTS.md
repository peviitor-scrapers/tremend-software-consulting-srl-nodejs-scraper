# Robots.txt Analysis — Tremend

Sursa: https://tremend.com/robots.txt

## Reguli

```
User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
```

## Interpretare

| Cale | Accesibil? | Ce conține |
|---|---|---|
| `/career/` (pagina de cariere) | ✅ Allow | Arhiva de job-uri (SSR) |
| `/career/*/` (paginile individuale) | ✅ Allow | Detalii job |
| `/wp-admin/admin-ajax.php` | ✅ Allow (explicit) | Endpoint-ul AJAX de care scraper-ul se folosește |
| `/wp-admin/` (restul) | ❌ Disallowed | Backend-ul WordPress |

## Recomandare

robots.txt NU este legal binding, dar reprezintă intenția proprietarului site-ului.

- Endpoint-ul `/wp-admin/admin-ajax.php` (folosit cu `action=career_filter`) e **explicit permis** de robots.txt — răspunde cu 200 OK cu `X-Requested-With: XMLHttpRequest` și `User-Agent` normal, fără autentificare.
- Paginile individuale de job le verificăm doar accesibilitatea (HEAD request) în teste, nu le scrape-um direct.
- Scraperul curent face o singură cerere per pagină cu delay de 1s între pagini — comportament rezonabil, nu agresiv.

**Concluzie**: Risc minim. Endpoint-ul e public, răspunde fără autentificare și e chiar permis explicit în robots.txt, iar scraperul e politicos (rate limiting, User-Agent standard, o singură cerere simultană).
