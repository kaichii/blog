import { ExtendedRecordMap } from "notion-types";
import { parsePageId } from "notion-utils";
import {
  environment,
  pageUrlAdditions,
  pageUrlOverrides,
  site,
} from "./config";
import { getSiteMap } from "./get-site-map";
import { getPage } from "./notion";
import { pageAcl } from "./acl";
import { redis } from "./redis";

export async function resolveNotionPage(domain: string, rawPageId?: string) {
  let pageId: string;
  let recordMap: ExtendedRecordMap;

  if (rawPageId && rawPageId !== "index") {
    pageId = parsePageId(rawPageId);

    if (!pageId) {
      const override =
        pageUrlOverrides[rawPageId] || pageUrlAdditions[rawPageId];

      if (override) {
        pageId = parsePageId(override);
      }
    }

    const useUriToPageIdCache = true;
    const cacheKey = `uri-to-page-id:${domain}:${environment}:${rawPageId}`;
    // TODO: should we use a TTL for these mappings or make them permanent?
    // const cacheTTL = 8.64e7 // one day in milliseconds
    const cacheTTL = undefined; // disable cache TTL

    if (!pageId && useUriToPageIdCache) {
      try {
        // check if the database has a cached mapping of this URI to page ID
        pageId = await redis.get(cacheKey);

        // console.log(`redis get "${cacheKey}"`, pageId)
      } catch (err) {
        // ignore redis errors
        console.warn(`redis error get "${cacheKey}"`, err.message);
      }
    }

    if (pageId) {
      recordMap = await getPage(pageId);
    } else {
      const siteMap = await getSiteMap();
      pageId = siteMap.canonicalPageMap[rawPageId];

      if (pageId) {
        recordMap = await getPage(pageId);

        if (useUriToPageIdCache) {
          try {
            // update the database mapping of URI to pageId
            await redis.set(cacheKey, pageId, cacheTTL);

            // console.log(`redis set "${cacheKey}"`, pageId, { cacheTTL })
          } catch (err) {
            // ignore redis errors
            console.warn(`redis error set "${cacheKey}"`, err.message);
          }
        }
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

  const props = { site, recordMap, pageId };
  return { ...props, ...(await pageAcl(props)) };
}
