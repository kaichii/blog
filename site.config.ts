import { siteConfig } from "./lib/site-config";

export default siteConfig({
  rootNotionPageId: "54755ccc1a914a59806e07e532da3970",
  rootNotionSpaceId: "a216946e-b6f5-43f3-9663-c762a0ac71d9",
  name: `Kai's Dev Blog`,
  domain: "blog.kaichi.dev",
  author: "kaichi",
  defaultPageIcon: "https://blog.kaichi.dev/page-icon.png",
  defaultPageCover: "https://blog.kaichi.dev/page-cover.jpg",
  defaultPageCoverPosition: 0.5,
  navigationStyle: "custom",
  navigationLinks: [
    {
      pageId: "689537b0ba494fc4a550e4ce2fc56bda",
      title: "关于",
      url: "/about",
    },
  ],
  isSearchEnabled: true,
  isRedisEnabled: true,
  isPreviewImageSupportEnabled: true,
});
