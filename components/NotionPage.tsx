import {
  defaultPageCover,
  defaultPageCoverPosition,
  defaultPageIcon,
  description,
  isDev,
  isServer,
  site,
} from "@/lib/config";
import type { PageBlock, PageProps } from "@/lib/types";
import clsx from "clsx";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, ReactNode, useState, useEffect } from "react";
import { formatDate, NotionRenderer } from "react-notion-x";
import Footer from "./Footer";
import LoadingPage from "./LoadingPage";
import NotionPageHeader from "./NotionPageHeader";
import { isSearchEnabled } from "@/lib/config";
import { searchNotion } from "@/lib/search-notion";
import BodyClassName from "react-body-classname";
import { PageHead } from "./PageHead";
import { Page404 } from "./Page404";
import { getBlockTitle, getPageProperty, normalizeTitle } from "notion-utils";
import { getCanonicalPageUrl, mapPageUrl } from "@/lib/map-page-url";
import { mapImageUrl } from "@/lib/map-image-url";
import Giscus from "@giscus/react";
import { TweetEmbed } from "./TweetEmbed";

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then(async (m) => {
    // add / remove any prism syntaxes here
    await Promise.all([
      import("prismjs/components/prism-bash.js"),
      import("prismjs/components/prism-docker.js"),
      import("prismjs/components/prism-diff.js"),
      import("prismjs/components/prism-git.js"),
      import("prismjs/components/prism-go.js"),
      import("prismjs/components/prism-graphql.js"),
      import("prismjs/components/prism-markdown.js"),
      import("prismjs/components/prism-rust.js"),
      import("prismjs/components/prism-css"),
      import("prismjs/components/prism-cshtml"),
      import("prismjs/components/prism-javascript"),
      import("prismjs/components/prism-json"),
      import("prismjs/components/prism-yaml"),
    ]);
    return m.Code;
  })
);

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
);
const Modal = dynamic(
  () =>
    import("react-notion-x/build/third-party/modal").then((m) => {
      m.Modal.setAppElement(".notion-viewport");
      return m.Modal;
    }),
  {
    ssr: false,
  }
);

const propertyLastEditedTimeValue = (
  { block, pageHeader },
  defaultFn: () => ReactNode
) => {
  if (pageHeader && block?.last_edited_time) {
    return `Last updated ${formatDate(block?.last_edited_time, {
      month: "long",
    })}`;
  }

  return defaultFn();
};

const propertyDateValue = (
  { data, schema, pageHeader },
  defaultFn: () => ReactNode
) => {
  if (pageHeader && schema?.name?.toLowerCase() === "published") {
    const publishDate = data?.[0]?.[1]?.[0]?.[1]?.start_date;

    if (publishDate) {
      return `${formatDate(publishDate, {
        month: "short",
      })}`;
    }
  }

  return defaultFn();
};

const propertyTextValue = (
  { schema, pageHeader },
  defaultFn: () => ReactNode
) => {
  if (pageHeader && schema?.name?.toLowerCase() === "author") {
    return <b>{defaultFn()}</b>;
  }

  return defaultFn();
};

const propertySelectValue = (
  { schema, value, key, pageHeader },
  defaultFn: () => React.ReactNode
) => {
  value = normalizeTitle(value);

  if (pageHeader && schema.type === "multi_select" && value) {
    return (
      <Link href={`/tags/${value}`} key={key}>
        {defaultFn()}
      </Link>
    );
  }

  return defaultFn();
};

export function NotionPage({
  error,
  recordMap,
  pageId,
  tagsPage,
  propertyToFilterName,
}: PageProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  const components = useMemo(
    () => ({
      nextImage: Image,
      nextLink: Link,
      Code,
      Collection,
      Equation,
      Pdf,
      Modal,
      Tweet: TweetEmbed,
      Header: NotionPageHeader,
      propertyLastEditedTimeValue,
      propertyTextValue,
      propertyDateValue,
      propertySelectValue,
    }),
    [recordMap?.block[0]]
  );

  const siteMapPageUrl = useMemo(() => {
    const params: any = {};

    const searchParams = new URLSearchParams(params);
    return mapPageUrl(site, recordMap, searchParams);
  }, [site, recordMap]);

  const keys = Object.keys(recordMap?.block || {});
  const block = recordMap?.block?.[keys[0]]?.value;
  const isDarkMode = resolvedTheme === "dark";

  const isBlogPost =
    block?.type === "page" && block?.parent_table === "collection";

  const footer = useMemo(() => <Footer />, []);

  if (router.isFallback) return <LoadingPage />;

  if (error || !site || !block) {
    return <Page404 site={site} pageId={pageId} error={error} />;
  }

  const name = getBlockTitle(block, recordMap) || site.name;
  const title = tagsPage && propertyToFilterName ? propertyToFilterName : name;

  if (!isServer) {
    const g = window as any;
    g.pageId = pageId;
    g.recordMap = recordMap;
    g.block = block;
  }

  const canonicalPageUrl =
    !isDev && getCanonicalPageUrl(site, recordMap)(pageId);

  const socialImage = mapImageUrl(
    getPageProperty<string>("Social Image", block, recordMap) ||
      (block as PageBlock).format?.page_cover ||
      defaultPageCover,
    block
  );

  const socialDescription =
    getPageProperty<string>("Description", block, recordMap) || description;

  return (
    <>
      <PageHead
        pageId={pageId}
        site={site}
        title={title}
        description={socialDescription}
        image={socialImage}
        url={canonicalPageUrl}
      />
      {isDarkMode && <BodyClassName className='dark-mode' />}
      <NotionRenderer
        darkMode={mounted && isDarkMode}
        bodyClassName={clsx({
          "index-page": pageId === site.rootNotionPageId,
          "tags-page": tagsPage,
        })}
        recordMap={recordMap}
        fullPage
        components={components}
        rootDomain={site.domain}
        rootPageId={site.rootNotionPageId}
        showCollectionViewDropdown={false}
        showTableOfContents={false}
        footer={footer}
        searchNotion={isSearchEnabled ? searchNotion : null}
        defaultPageCover={defaultPageCover}
        defaultPageCoverPosition={defaultPageCoverPosition}
        defaultPageIcon={defaultPageIcon}
        mapImageUrl={mapImageUrl}
        mapPageUrl={siteMapPageUrl}
        previewImages={!!recordMap.preview_images}
        pageTitle={tagsPage && propertyToFilterName ? title : void 0}
        pageAside={
          mounted && isBlogPost ? (
            <Giscus
              id='comments'
              repo='kaichii/blog'
              repoId='R_kgDOJOwG0A'
              category='General'
              categoryId='DIC_kwDOJOwG0M4CV8fK'
              mapping='pathname'
              reactionsEnabled='1'
              emitMetadata='0'
              inputPosition='top'
              theme={isDarkMode ? "dark_dimmed" : "light"}
              lang='zh-CN'
              loading='lazy'
            />
          ) : (
            false
          )
        }
      />
    </>
  );
}
