import { navigationLinks, navigationStyle } from '@/lib/config';
import { CollectionViewPageBlock, PageBlock } from 'notion-types';
import { Breadcrumbs, Header, useNotionContext } from 'react-notion-x';
import ThemeSwitcher from './ThemeSwitcher';

export default function NotionPageHeader(
  block: CollectionViewPageBlock | PageBlock
) {
  const { components, mapPageUrl } = useNotionContext();

  if (navigationStyle === 'default') {
    return <Header block={block} />;
  }

  return (
    <header className='notion-header'>
      <nav className='notion-nav-header'>
        <Breadcrumbs block={block} rootOnly={false} />
        <div className='notion-nav-header-rhs breadcrumbs'>
          {navigationLinks
            ?.map((link, index) => {
              if (!link.pageId && !link.url) {
                return null;
              }

              if (link.pageId) {
                return (
                  <components.PageLink
                    href={mapPageUrl(link.pageId)}
                    key={index}
                    className={'breadcrumb button'}
                  >
                    {link.title}
                  </components.PageLink>
                );
              } else {
                return (
                  <components.Link
                    href={link.url}
                    key={index}
                    className={'breadcrumb button'}
                  >
                    {link.title}
                  </components.Link>
                );
              }
            })
            .filter(Boolean)}
          <ThemeSwitcher />
        </div>
      </nav>
    </header>
  );
}
