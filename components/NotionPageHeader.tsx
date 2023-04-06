import {
  isSearchEnabled,
  navigationLinks,
  navigationStyle,
} from '@/lib/config';
import clsx from 'clsx';
import { CollectionViewPageBlock, PageBlock } from 'notion-types';
import { Breadcrumbs, Header, Search, useNotionContext } from 'react-notion-x';
import styles from './styles.module.css';
import ThemeSwitcher from './ThemeSwitcher';

function NotionPageHeader({
  block,
}: {
  block: CollectionViewPageBlock | PageBlock;
}) {
  const { components, mapPageUrl } = useNotionContext();

  if (navigationStyle === 'default') {
    return <Header block={block} />;
  }

  return (
    <header className='notion-header'>
      <div className='notion-nav-header'>
        <Breadcrumbs block={block} rootOnly />
        <div className='notion-nav-header-rhs breadcrumbs'>
          {isSearchEnabled && (
            <Search
              block={block}
              title={<p className={styles.navLink}>搜索</p>}
            />
          )}
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
