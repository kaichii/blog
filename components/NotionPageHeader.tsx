import { navigationLinks, navigationStyle } from '@/lib/config';
import clsx from 'clsx';
import { CollectionViewPageBlock, PageBlock } from 'notion-types';
import { Breadcrumbs, Header, useNotionContext } from 'react-notion-x';
import ThemeSwitcher from './ThemeSwitcher';
import styles from './styles.module.css';
import SearchNotion from './SearchNotion';
import { useMemo } from 'react';
import { getPageBreadcrumbs } from 'notion-utils';

function NotionPageHeader(block: CollectionViewPageBlock | PageBlock) {
  const { components, recordMap, mapPageUrl } = useNotionContext();

  console.log({ ...block }, { ...recordMap.block });

  if (!block.id) return null;

  if (navigationStyle === 'default') {
    return <Header block={block} />;
  }

  console.log(recordMap.block, block);

  return (
    <header className='notion-header'>
      <div className='notion-nav-header'>
        {/* <Breadcrumbs block={recordMap.block[block.id]} rootOnly /> */}

        <div className='notion-nav-header-rhs breadcrumbs'>
          {/* <SearchNotion block={recordMap.block[block.id].value} /> */}
          {navigationLinks
            ?.map((link) => {
              if (!link.pageId && !link.url) {
                return null;
              }

              if (link.pageId) {
                return (
                  <components.PageLink
                    href={mapPageUrl(link.pageId)}
                    key={link.pageId}
                    className={clsx('breadcrumb button', styles.navLink)}
                  >
                    {link.title}
                  </components.PageLink>
                );
              }

              return (
                <components.Link
                  href={link.url}
                  key={link.url}
                  className={clsx('breadcrumb button', styles.navLink)}
                >
                  {link.title}
                </components.Link>
              );
            })
            .filter(Boolean)}

          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}

export default NotionPageHeader;
