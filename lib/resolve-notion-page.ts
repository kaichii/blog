import { ExtendedRecordMap } from 'notion-types';
import { parsePageId } from 'notion-utils';
import { pageUrlAdditions, pageUrlOverrides, site } from './config';
import { getSiteMap } from './get-site-map';
import { getPage } from './notion';

export async function resolveNotionPage(domain: string, rawPageId?: string) {
  let pageId: string;
  let recordMap: ExtendedRecordMap;

  if (rawPageId && rawPageId !== 'index') {
    pageId = parsePageId(rawPageId);

    if (!pageId) {
      const override =
        pageUrlOverrides[rawPageId] || pageUrlAdditions[rawPageId];

      if (override) {
        pageId = parsePageId(override);
      }
    }

    if (pageId) {
      recordMap = await getPage(pageId);
    } else {
      const siteMap = await getSiteMap();
      pageId = siteMap.canonicalPageMap[rawPageId];

      if (pageId) {
        recordMap = await getPage(pageId);
      } else {
        return {
          error: {
            message: `Not found "${rawPageId}"`,
            statusCode: 404,
          },
        };
      }
    }
  } else {
    pageId = site.rootNotionPageId;

    recordMap = await getPage(pageId);
  }

  return {
    site,
    recordMap,
    pageId,
  };
}
