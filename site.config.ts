import { siteConfig } from './lib/site-config';

export default siteConfig({
  rootNotionPageId: '54755ccc1a914a59806e07e532da3970',
  name: `kai's dev blog`,
  domain: 'kaichi.dev',
  author: 'kaichi',
  navigationStyle: 'custom',
  navigationLinks: [
    {
      pageId: '689537b0ba494fc4a550e4ce2fc56bda',
      title: '关于',
      url: '/about',
    },
  ],
  isSearchEnabled: true,
});
