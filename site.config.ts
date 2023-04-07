import { siteConfig } from './lib/site-config';

export default siteConfig({
  rootNotionPageId: '54755ccc1a914a59806e07e532da3970',
  rootNotionSpaceId: 'a216946e-b6f5-43f3-9663-c762a0ac71d9',
  name: `kai's dev blog`,
  domain: 'kaichi.dev',
  author: 'kaichi',
  defaultPageIcon: 'http://127.0.0.1:3000/page-icon.png',
  defaultPageCover: 'http://127.0.0.1:3000/page-cover.jpg',
  defaultPageCoverPosition: 0.5,
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
