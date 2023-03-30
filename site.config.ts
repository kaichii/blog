import { siteConfig } from './lib/site-config';

export default siteConfig({
  rootNotionPageId: '54755ccc1a914a59806e07e532da3970',
  name: 'blog',
  domain: 'blog.kaichi.dev',
  author: 'kaichi',
  isPreviewImageSupportEnabled: true,
  navigationStyle: 'custom',
  navigationLinks: [
    {
      pageId: 'f1199d37579b41cbabfc0b5174f4256a',
      title: '关于我',
      url: '/about-me',
    },
    {
      pageId: '6a29ebcb935a4f0689fe661ab5f3b8d1',
      title: '简历',
      url: '/resume',
    },
  ],
  isSearchEnabled: true,
});
