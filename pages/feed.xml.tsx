import type { GetServerSideProps } from 'next';

import { ExtendedRecordMap } from 'notion-types';
import {
  getBlockParentPage,
  getBlockTitle,
  getPageProperty,
  idToUuid,
} from 'notion-utils';
import RSS from 'rss';

import * as config from '@/lib/config';
import { getSiteMap } from '@/lib/get-site-map';
import { getSocialImageUrl } from '@/lib/get-social-image-url';
import { getCanonicalPageUrl } from '@/lib/map-page-url';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({ error: 'method not allowed' }));
    res.end();
    return { props: {} };
  }

  const siteMap = await getSiteMap();
  const ttlMinutes = 24 * 60; // 24 hours
  const ttlSeconds = ttlMinutes * 60;

  const feed = new RSS({
    title: config.name,
    site_url: config.host,
    feed_url: `${config.host}/feed.xml`,
    language: config.language,
    ttl: ttlMinutes,
  });

  const pages: Array<[string, number]> = [];

  for (const pagePath of Object.keys(siteMap.canonicalPageMap)) {
    const pageId = siteMap.canonicalPageMap[pagePath];
    const recordMap = siteMap.pageMap[pageId] as ExtendedRecordMap;

    if (!recordMap) continue;

    const keys = Object.keys(recordMap?.block || {});
    const block = recordMap?.block?.[keys[0]]?.value;
    if (!block) continue;

    const parentPage = getBlockParentPage(block, recordMap);
    const isBlogPost =
      block.type === 'page' &&
      block.parent_table === 'collection' &&
      parentPage?.id === idToUuid(config.rootNotionPageId);

    const isPublic = getPageProperty<boolean>(
      'Public',
      block,
      recordMap
    );

    if (!isBlogPost || !isPublic) continue;

    const publishedTime = getPageProperty<number>(
      'Published',
      block,
      recordMap
    );

    pages.push([pageId, publishedTime]);
  }

  pages.sort(([, date1], [, date2]) => date2 - date1)

  for (const [pageId, pubDate] of pages) {
    const recordMap = siteMap.pageMap[pageId] as ExtendedRecordMap;

    const keys = Object.keys(recordMap?.block || {});
    const block = recordMap?.block?.[keys[0]]?.value;

    const title = getBlockTitle(block, recordMap) || config.name;
    const description =
      getPageProperty<string>('Description', block, recordMap) ||
      config.description;
    const url = getCanonicalPageUrl(config.site, recordMap)(pageId);

    const date = new Date(pubDate);

    const socialImageUrl = getSocialImageUrl(pageId);

    feed.item({
      title,
      url,
      date,
      description,
      enclosure: socialImageUrl
        ? {
          url: socialImageUrl,
          type: 'image/jpeg',
        }
        : undefined,
      custom_elements: [
        {
          'content:encoded': `<p>${description}</p>
              <div style='margin-top: 50px; font-style: italic;'>
                <strong>
                  <a href='${url}'>
                   继续阅读
                  </a>
                </strong>
              </div>
              <br /> <br />
            `,
        },
      ],
    });
  }

  const feedText = feed.xml({ indent: true });

  res.setHeader(
    'Cache-Control',
    `public, max-age=${ttlSeconds}, stale-while-revalidate=${ttlSeconds}`
  );
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.write(feedText);
  res.end();

  return { props: {} };
};

export default () => null;
