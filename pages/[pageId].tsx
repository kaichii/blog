import { NotionPage } from "@/components/NotionPage";
import { domain, isDev } from "@/lib/config";
import { getSiteMap } from "@/lib/get-site-map";
import { resolveNotionPage } from "@/lib/resolve-notion-page";
import type { InferGetStaticPropsType, GetStaticProps } from "next";

export async function getStaticPaths() {
  if (isDev) {
    return {
      paths: [],
      fallback: true,
    };
  }

  const siteMap = await getSiteMap();

  const staticPaths = {
    paths: Object.keys(siteMap.canonicalPageMap).map((pageId) => ({
      params: {
        pageId,
      },
    })),
    fallback: true,
  };

  return staticPaths;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const rawPageId = params.pageId as string;

  try {
    const props = await resolveNotionPage(domain, rawPageId);

    return { props, revalidate: 10 };
  } catch (err) {
    throw err;
  }
};

function BlogPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return <NotionPage {...props} />;
}

export default BlogPage;
