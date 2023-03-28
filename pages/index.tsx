import { NotionPage } from '@/components/NotionPage';
import { domain } from '@/lib/config';
import { resolveNotionPage } from '@/lib/resolve-notion-page';
import { GetStaticProps, InferGetStaticPropsType } from 'next';

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
}

export default Home;
