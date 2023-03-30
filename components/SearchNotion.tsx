import { Block } from '@/lib/types';
import clsx from 'clsx';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { SearchNotionFn, useNotionContext } from 'react-notion-x';
import styles from './styles.module.css';

type SearchNotionProps = {
  block: Block;
  search?: SearchNotionFn;
  tittle?: ReactNode;
};

export default function SearchNotion({
  block,
  search,
  tittle,
}: SearchNotionProps) {
  const { searchNotion, rootPageId, isShowingSearch, onHideSearch } =
    useNotionContext();

  const onSearchNotion = search || searchNotion;

  const [isSearchOpen, setIsSearchOpen] = useState(isShowingSearch);

  useEffect(() => {
    setIsSearchOpen(isShowingSearch);
  }, [isShowingSearch]);

  const onOpenSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const onCloseSearch = useCallback(() => {
    setIsSearchOpen(false);
    if (onHideSearch) {
      onHideSearch();
    }
  }, [onHideSearch]);

  const hasSearch = !!onSearchNotion;

  return (
    <>
      <div
        className={clsx(
          'breadcrumb button notion-search-button',
          styles.searchButton
        )}
      >
        搜索
      </div>
    </>
  );
}
