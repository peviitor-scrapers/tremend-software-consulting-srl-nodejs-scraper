# job_seeker_ro_spider

**job_seeker_ro_spider** — scraper pentru job-urile TREMEND SOFTWARE CONSULTING SRL din România.

Extrage anunțurile de pe [Tremend Careers](https://tremend.com/career/) și le publică în [peviitor.ro](https://peviitor.ro) prin API-ul Peviitor.

> **🌱 Derived scraper.** Acest repo este derivat din [EPAM nodejs template](https://github.com/sebiboga/epam-systems-international-srl-nodejs-scraper) — implementarea de referință pentru scraper-ele Node.js din ecosistemul peviitor.ro.

## Identificare

Toate request-urile HTTP folosesc User-Agent-ul:

```
job_seeker_ro_spider
```

## Ce face

1. **Validează compania** — interoghează API-ul public ANAF ([demoanaf.ro](https://demoanaf.ro)) după CIF-ul TREMEND (18089451) și verifică:
   - Denumirea oficială: TREMEND SOFTWARE CONSULTING SRL
   - Status: activ/inactiv/radiat
   - Adresa completă din registrul comerțului
2. **Cross-validează cu Peviitor** — verifică existența companiei în API-ul Peviitor
3. **Scrape-uiește job-urile** — interoghează endpoint-ul WordPress AJAX (`/wp-admin/admin-ajax.php`, `action=career_filter`) de pe [tremend.com/career/](https://tremend.com/career/) și extrage cardurile de job-uri, filtrat pe locații din România
4. **Transformă datele** — normalizează locațiile (doar orașe românești), tag-urile (lowercase), workmode-ul (remote/on-site/hybrid)
5. **Stochează în Peviitor** — upsert prin API-ul Peviitor (job-uri și date companie)
6. **Generează jobs.md** — fișier markdown cu informații companie + toate job-urile curente

## API-uri folosite

| API | URL | Autentificare |
|---|---|---|
| Tremend Careers (WordPress AJAX) | `https://tremend.com/wp-admin/admin-ajax.php` | Public |
| ANAF (demoanaf) | `https://demoanaf.ro/api/...` | Public |
| Peviitor | `https://api.peviitor.ro/v1/company/` | Public |

## Robots.txt

Tremend [robots.txt](https://tremend.com/robots.txt) permite accesul de bază pe site. Scraper-ul folosește endpoint-ul AJAX cu rate limiting (1s delay între pagini) și un singur User-Agent identificabil. Paginile individuale de job sunt doar verificate (HEAD request), nu parse-uite.

Pentru analiza completă, vezi [ai/ROBOTS.md](../ai/ROBOTS.md).

## Testare

```bash
# Toate testele
npm test

# Doar unitare
npm run test:unit

# Doar integrare (necesită ANAF live, Peviitor API conditional)
npm run test:integration

# Doar E2E (API real Tremend AJAX + ANAF + Peviitor)
npm run test:e2e
```

Testele Peviitor API folosesc `itIfApi` — se auto-skip dacă API-ul Peviitor nu e disponibil.
