import { siteConfig } from './lib/site-config';

export default siteConfig({
  rootNotionPageId: '54755ccc1a914a59806e07e532da3970',
  name: `kai's dev blog`,
  domain: 'kaichi.dev',
  author: 'kaichi',
  isPreviewImageSupportEnabled: true,
  navigationStyle: 'custom',
  navigationLinks: [
    {
      pageId: 'f1199d37579b41cbabfc0b5174f4256a',
      title: '关于',
      url: '/about',
    },
  ],
  isSearchEnabled: true,
});
