import { NotionPage } from "@/components/NotionPage";
import { domain } from "@/lib/config";
import { resolveNotionPage } from "@/lib/resolve-notion-page";
import Giscus from "@giscus/react";
import { GetStaticProps, InferGetStaticPropsType } from "next";

export const getStaticProps: GetStaticProps = async () => {
  try {
    const props = await resolveNotionPage(domain);
    return { props, revalidate: 10 };
  } catch (err) {
    throw err;
  }
};

function Home(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return <NotionPage {...props} />;
  return (
    <Giscus
      id='comments'
      repo='kaichii/blog'
      repoId='R_kgDOJOwG0A'
      category='General'
      categoryId='DIC_kwDOJOwG0M4CV8fK'
      mapping='pathname'
      reactionsEnabled='1'
      emitMetadata='0'
      inputPosition='bottom'
      theme='preferred_color_scheme'
      lang='zh-CN'
      // loading="lazy"
    />
  );
}

export default Home;
