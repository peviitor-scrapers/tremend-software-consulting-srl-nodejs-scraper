# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-06

### Added
- Initial release of the Tremend scraper, derived from the [EPAM nodejs template](https://github.com/sebiboga/epam-systems-international-srl-nodejs-scraper) (v1.5.2).
- `scraper/index.js`: Tremend-specific scraping of `https://tremend.com/career/` via WordPress AJAX endpoint (`/wp-admin/admin-ajax.php`, `action=career_filter`, paginated) — replaces the EPAM JSON API fetch.
- `parseHtmlJobs`: regex-based card parser for `div.career__job-card`, decodes HTML entities, filters to Romanian locations only.
- Company identity (`scraper/config/company.json`): `TREMEND SOFTWARE CONSULTING SRL`, CIF `18089451`, brand `Tremend`, career `https://tremend.com/career/`.
- Test suite updated for Tremend: unit (`parseHtmlJobs`), company ANAF mock, markdown-generator, E2E (real AJAX fetch), integration and consistency tests.
- `docs/` refreshed with Tremend identity (`docs/jobs.md`, `docs/company.json`, `docs/index.html`).
