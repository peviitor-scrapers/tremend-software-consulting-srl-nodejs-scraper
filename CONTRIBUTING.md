# Contributing

Thank you for your interest in contributing!

## 🌱 This Repo Is a Derived Scraper

This repo is a scraper derived from the [EPAM nodejs template](https://github.com/sebiboga/epam-systems-international-srl-nodejs-scraper) — the reference implementation for Node.js scrapers in the peviitor.ro ecosystem.

Changes specific to Tremend belong in `scraper/index.js` (scraping logic) and `scraper/config/company.json` (company identity). The shared modules (`scraper/anaf.js`, `scraper/company.js`, `scraper/job-validator.js`, `scraper/validate-jobs.js`) are inherited from the template and should not be modified here — improvements to those belong upstream.

## Development Setup

```bash
npm install
npm test
```

## Reporting Issues

Open a [GitHub Issue](https://github.com/peviitor-scrapers/tremend-software-consulting-srl-nodejs-scraper/issues) with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
