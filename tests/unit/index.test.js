import { jest } from '@jest/globals';

const SAMPLE_HTML = `
  <article class="career__job-card">
    <header>
      <div class="career__job-meta">Product Management | Fulltime</div>
      <h3 class="career__job-title">
        <a href="https://tremend.com/career/business-analyst-cms-dam-aem-specialist-2/" target="_blank" rel="noopener">Business Analyst&ndash; CMS/DAM (AEM)- Specialist</a>
      </h3>
      <div class="career__job-location">Romania, Iasi</div>
    </header>
  </article>
  <article class="career__job-card">
    <header>
      <div class="career__job-meta">Quality Engineering | Fulltime</div>
      <h3 class="career__job-title">
        <a href="https://tremend.com/career/quality-engineer-trading-platforms-specialist-energy-commodities-7/" target="_blank" rel="noopener">Quality Engineer (Trading Platforms) &#8211; Specialist- Energy &amp; Commodities</a>
      </h3>
      <div class="career__job-location">Bulgaria, Sofia</div>
    </header>
  </article>
  <article class="career__job-card">
    <header>
      <div class="career__job-meta">Engineering | Fulltime</div>
      <h3 class="career__job-title">
        <a href="https://tremend.com/career/backend-engineer-bucharest/" target="_blank" rel="noopener">Backend Engineer</a>
      </h3>
      <div class="career__job-location">Romania, Bucharest</div>
    </header>
  </article>
`;

describe('index.js Component Tests', () => {
  let index;

  beforeAll(async () => {
    index = await import('../../scraper/index.js');
  });

  describe('transformJobsForSOLR', () => {
    it('should filter locations to only Romanian cities', () => {
      const payload = {
        jobs: [
          { url: 'https://test.com/1', title: 'Job 1', location: ['România'] },
          { url: 'https://test.com/2', title: 'Job 2', location: ['Bucharest'] },
          { url: 'https://test.com/3', title: 'Job 3', location: ['Bulgaria'] },
          { url: 'https://test.com/4', title: 'Job 4', location: ['Cluj-Napoca'] },
          { url: 'https://test.com/5', title: 'Job 5', location: [] }
        ]
      };

      const result = index.transformJobsForSOLR(payload);

      expect(result.jobs[0].location).toEqual(['România']);
      expect(result.jobs[1].location).toEqual(['Bucharest']);
      expect(result.jobs[2].location).toEqual(['România']);
      expect(result.jobs[3].location).toEqual(['Cluj-Napoca']);
      expect(result.jobs[4].location).toEqual(['România']);
    });

    it('should keep company uppercase', () => {
      const payload = {
        source: 'tremend.com',
        company: 'tremend software consulting srl',
        cif: '18089451',
        jobs: [
          { url: 'https://test.com/1', title: 'Job 1', company: 'tremend software', cif: '18089451' }
        ]
      };

      const result = index.transformJobsForSOLR(payload);

      expect(result.company).toBe('TREMEND SOFTWARE CONSULTING SRL');
    });

    it('should normalize workmode values', () => {
      const payload = {
        jobs: [
          { url: 'https://test.com/1', title: 'Job 1', workmode: 'Remote' },
          { url: 'https://test.com/2', title: 'Job 2', workmode: 'ON-SITE' },
          { url: 'https://test.com/3', title: 'Job 3', workmode: 'Hybrid' },
          { url: 'https://test.com/4', title: 'Job 4', workmode: 'hybrid' }
        ]
      };

      const result = index.transformJobsForSOLR(payload);

      expect(result.jobs[0].workmode).toBe('remote');
      expect(result.jobs[1].workmode).toBe('on-site');
      expect(result.jobs[2].workmode).toBe('hybrid');
      expect(result.jobs[3].workmode).toBe('hybrid');
    });

    it('should handle empty jobs array', () => {
      const result = index.transformJobsForSOLR({ jobs: [] });
      expect(result.jobs).toEqual([]);
    });
  });

  describe('mapToJobModel', () => {
    it('should map raw job to job model format', () => {
      const rawJob = {
        url: 'https://tremend.com/career/backend-engineer-bucharest/',
        title: 'Backend Engineer',
        location: ['Bucharest'],
        tags: ['Engineering', 'Fulltime'],
        workmode: 'hybrid'
      };

      const COMPANY_NAME = 'TREMEND SOFTWARE CONSULTING SRL';
      const COMPANY_CIF = '18089451';

      const result = index.mapToJobModel(rawJob, COMPANY_CIF, COMPANY_NAME);

      expect(result.url).toBe(rawJob.url);
      expect(result.title).toBe(rawJob.title);
      expect(result.company).toBe(COMPANY_NAME);
      expect(result.cif).toBe(COMPANY_CIF);
      expect(result.location).toEqual(rawJob.location);
      expect(result.tags).toEqual(rawJob.tags);
      expect(result.workmode).toBe(rawJob.workmode);
      expect(result.status).toBe('scraped');
      expect(result.date).toBeDefined();
    });

    it('should remove undefined fields', () => {
      const rawJob = {
        url: 'https://tremend.com/career/1',
        title: 'Job 1'
      };

      const result = index.mapToJobModel(rawJob, '18089451');

      expect(result.location).toBeUndefined();
      expect(result.tags).toBeUndefined();
      expect(result.workmode).toBeUndefined();
    });

    it('should handle missing title', () => {
      const rawJob = { url: 'https://tremend.com/career/1' };

      const result = index.mapToJobModel(rawJob, '18089451');

      expect(result.title).toBeUndefined();
      expect(result.url).toBe('https://tremend.com/career/1');
    });
  });

  describe('parseHtmlJobs', () => {
    it('should parse job cards from career board HTML', () => {
      const result = index.parseHtmlJobs(SAMPLE_HTML);

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Business Analyst– CMS/DAM (AEM)- Specialist');
      expect(result[0].url).toBe('https://tremend.com/career/business-analyst-cms-dam-aem-specialist-2/');
      expect(result[0].location).toEqual(['Iasi']);
      expect(result[0].tags).toEqual(['Product Management', 'Fulltime']);
      expect(result[1].location).toEqual(['Bucharest']);
    });

    it('should filter out non-Romanian jobs', () => {
      const result = index.parseHtmlJobs(SAMPLE_HTML);

      expect(result.every(j => j.country === 'Romania')).toBe(true);
      expect(result.some(j => j.url.includes('quality-engineer-trading'))).toBe(false);
    });

    it('should decode HTML entities in titles', () => {
      const result = index.parseHtmlJobs(SAMPLE_HTML);

      expect(result[0].title).not.toContain('&ndash;');
      expect(result[0].title).not.toContain('&amp;');
      expect(result[1].title).toBe('Backend Engineer');
    });

    it('should handle empty HTML', () => {
      const result = index.parseHtmlJobs('');
      expect(result).toEqual([]);
    });

    it('should handle HTML with no job cards', () => {
      const result = index.parseHtmlJobs('<div class="career__results"><p>No jobs</p></div>');
      expect(result).toEqual([]);
    });

    it('should default location to Romania when no city is present', () => {
      const html = `
        <article class="career__job-card">
          <header>
            <div class="career__job-meta">Engineering | Fulltime</div>
            <h3 class="career__job-title"><a href="https://tremend.com/career/test/">Test Job</a></h3>
            <div class="career__job-location">Romania</div>
          </header>
        </article>
      `;

      const result = index.parseHtmlJobs(html);
      expect(result[0].location).toEqual(['România']);
    });
  });
});
