'use client';

import Link from "next/link";
import Image from "next/image";
import { type MouseEvent, type TouchEvent, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./page.module.css";
import { CatalogGroupData, CatalogPreviewItem } from "./types";
import { COMPLETE_CATALOG_TEST_IDS } from "./test-ids";
import { getCategoryConfig } from "@/app/lib/category-config";
import SearchBar from "@/app/components/SearchBar";
import VideoThumbnail from "@/app/components/VideoThumbnail";
import { PatternContent } from "@/lib/types";

interface CatalogViewProps {
  groups: CatalogGroupData[];
  title: string;
}

interface SelectedCatalogItem {
  groupLabel: string;
  category: CatalogGroupData["category"];
  item: CatalogPreviewItem;
}

interface AuthorOption {
  id: string;
  name: string;
  github: string;
}

function extractAuthorOptions(groups: CatalogGroupData[]): AuthorOption[] {
  const authorMap = new Map<string, { name: string; github: string }>();

  groups.forEach((group) => {
    group.items.forEach((item) => {
      item.authorIds.forEach((authorId, index) => {
        if (!authorMap.has(authorId)) {
          const name = item.authorNames[index];
          const github = item.authorGithubs[index];
          if (name && github) {
            authorMap.set(authorId, { name, github });
          }
        }
      });
    });
  });

  const authorOrder = ['lada_kesseler', 'ivett_ordog', 'nitsan_avni', 'llewellyn_falco'];

  return Array.from(authorMap.entries())
    .map(([id, { name, github }]) => ({ id, name, github }))
    .sort((a, b) => {
      const indexA = authorOrder.indexOf(a.id);
      const indexB = authorOrder.indexOf(b.id);
      if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
}

export default function CatalogView({ groups, title }: CatalogViewProps) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }

    return window.matchMedia("(max-width: 768px)").matches;
  });
  const [activeTypes, setActiveTypes] = useState<string[]>(() => groups.map((group) => group.category));
  const [activeAuthorIds, setActiveAuthorIds] = useState<string[]>(() => {
    const options = extractAuthorOptions(groups);
    return options.map((option) => option.id);
  });

  const [selected, setSelected] = useState<SelectedCatalogItem | null>(null);
  const selectedConfig = selected ? getCategoryConfig(selected.category) : null;
  const selectedItemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const sidebarRef = useRef<HTMLElement>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const detailSwipeStartRef = useRef<number | null>(null);
  const detailSwipeDeltaRef = useRef<number>(0);

  const handleSearchSelect = (pattern: PatternContent) => {
    const group = groups.find((g) => g.category === pattern.category);
    const item = group?.items.find((i) => i.slug === pattern.slug);
    if (group && item) {
      setActiveTypes((prev) => {
        if (prev.includes(group.category)) {
          return prev;
        }

        const next = new Set(prev);
        next.add(group.category);
        const orderedCategories = typeOptions.map(({ category }) => category);
        const nextList = orderedCategories.filter((category) => next.has(category));
        return nextList.length === prev.length && prev.every((category, index) => category === nextList[index])
          ? prev
          : nextList;
      });

      if (authorOptions.length > 0 && item.authorIds.length > 0) {
        setActiveAuthorIds((prev) => {
          const next = new Set(prev);
          item.authorIds.forEach((authorId) => next.add(authorId));
          const orderedAuthorIds = authorOptions.map(({ id }) => id).filter((id) => next.has(id));
          if (orderedAuthorIds.length === prev.length && prev.every((id, index) => id === orderedAuthorIds[index])) {
            return prev;
          }
          return orderedAuthorIds;
        });
      }

      setSelected({ groupLabel: group.label, category: group.category, item });
    }
  };

  const allPatterns = useMemo(
    () =>
      groups.flatMap((group) =>
        group.items.map((item) => ({
          slug: item.slug,
          title: item.title,
          category: group.category,
          emojiIndicator: item.emojiIndicator,
          authors: item.authorIds,
          content: item.content,
          rawContent: item.content,
        }))
      ),
    [groups]
  );

  const typeOptions = useMemo(
    () => groups.map(({ category, label, icon, styleClass }) => ({ category, label, icon, styleClass })),
    [groups],
  );

  const authorOptions = useMemo(() => extractAuthorOptions(groups), [groups]);

  const allAuthorsSelected = activeAuthorIds.length === authorOptions.length || authorOptions.length === 0;
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() => ({}));
  const previousIsMobileRef = useRef(isMobile);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    handleChange(mediaQuery);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsFilterMenuOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isFilterMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsFilterMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFilterMenuOpen]);

  const filteredGroups = useMemo(() => {
    return groups
      .map((group) => {
        if (!activeTypes.includes(group.category)) {
          return { ...group, items: [] };
        }

        const items = group.items.filter((item) => {
          if (allAuthorsSelected) {
            return true;
          }

          if (item.authorIds.length === 0) {
            return false;
          }

          return item.authorIds.some((authorId) => activeAuthorIds.includes(authorId));
        });

        return { ...group, items };
      })
      .filter((group) => group.items.length > 0);
  }, [groups, activeTypes, activeAuthorIds, allAuthorsSelected]);

  useEffect(() => {
    const previousIsMobile = previousIsMobileRef.current;

    setCollapsedGroups((prev) => {
      const next: Record<string, boolean> = {};
      filteredGroups.forEach((group, index) => {
        if (!isMobile) {
          next[group.category] = false;
          return;
        }

        if (!previousIsMobile) {
          next[group.category] = index > 0;
          return;
        }

        if (prev[group.category] !== undefined) {
          next[group.category] = prev[group.category];
          return;
        }

        next[group.category] = index > 0;
      });
      return next;
    });

    previousIsMobileRef.current = isMobile;
  }, [filteredGroups, isMobile]);

  useEffect(() => {
    if (!selected) {
      return;
    }

    const stillVisible = filteredGroups.some(
      (group) =>
        group.category === selected.category &&
        group.items.some((item) => item.slug === selected.item.slug),
    );

    if (!stillVisible) {
      setSelected(null);
    }
  }, [filteredGroups, selected]);

  useEffect(() => {
    if (selected) {
      setCollapsedGroups((prev) => ({
        ...prev,
        [selected.category]: false,
      }));

      setTimeout(() => {
        const itemKey = `${selected.category}-${selected.item.slug}`;
        const itemElement = selectedItemRefs.current.get(itemKey);

        if (itemElement) {
          let offsetTop = 0;
          let element: HTMLElement | null = itemElement;

          while (element && element !== sidebarRef.current) {
            offsetTop += element.offsetTop;
            element = element.offsetParent as HTMLElement | null;
          }

          if (sidebarRef.current && typeof sidebarRef.current.scrollTo === "function") {
            sidebarRef.current.scrollTo({ top: offsetTop - 20, behavior: 'smooth' });
          }
        }
      }, 150);
    }
  }, [selected]);

  const toggleType = (category: string) => {
    setActiveTypes((prev) => {
      if (prev.includes(category)) {
        return prev.filter((value) => value !== category);
      }

      return [...prev, category];
    });
  };

  const toggleAuthor = (authorId: string) => {
    setActiveAuthorIds((prev) => {
      if (prev.includes(authorId)) {
        return prev.filter((value) => value !== authorId);
      }

      return [...prev, authorId];
    });
  };

  const handleSelect = (
    event: MouseEvent<HTMLAnchorElement>,
    groupLabel: string,
    category: SelectedCatalogItem["category"],
    item: CatalogPreviewItem
  ) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return;
    }

    event.preventDefault();
    setSelected({ groupLabel, category, item });
  };

  const isSelected = (groupLabel: string, item: CatalogPreviewItem) => {
    return selected?.groupLabel === groupLabel && selected.item.slug === item.slug;
  };

  const allTypesSelected = activeTypes.length === typeOptions.length;
  const toggleAllTypes = () => {
    if (allTypesSelected) {
      setActiveTypes([]);
    } else {
      setActiveTypes(typeOptions.map(({ category }) => category));
    }
  };
  const typeFilterControls = (
    <div className={styles.filterGroup}>
      <h3 className={styles.filterGroupLabel}>Type</h3>
      <div className={styles.typeButtonGroup} role="group" aria-label="Type filter">
        <button
          type="button"
          className={`${styles.typeButton} ${allTypesSelected ? styles.typeButtonActive : ""}`}
          onClick={toggleAllTypes}
          aria-pressed={allTypesSelected}
          title="Show All"
        >
          ∞
        </button>
        {typeOptions.map(({ category, label, icon }) => (
          <button
            key={category}
            type="button"
            className={`${styles.typeButton} ${activeTypes.includes(category) ? styles.typeButtonActive : ""}`}
            onClick={() => toggleType(category)}
            aria-pressed={activeTypes.includes(category)}
            aria-label={label}
            title={label}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
  const authorFilterControls =
    authorOptions.length > 0 ? (
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupLabel}>Author</h3>
        <div className={styles.authorButtonGroup} role="group" aria-label="Author filter">
          <button
            type="button"
            className={`${styles.authorButton} ${allAuthorsSelected ? styles.authorButtonActive : ""}`}
            onClick={() => {
              if (allAuthorsSelected) {
                setActiveAuthorIds([]);
              } else {
                setActiveAuthorIds(authorOptions.map(({ id }) => id));
              }
            }}
            aria-pressed={allAuthorsSelected}
            title="Show All"
          >
            ∞
          </button>
          {authorOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`${styles.authorButton} ${activeAuthorIds.includes(option.id) ? styles.authorButtonActive : ""}`}
              onClick={() => toggleAuthor(option.id)}
              aria-pressed={activeAuthorIds.includes(option.id)}
              aria-label={option.name}
              title={option.name}
            >
              <Image
                src={`https://github.com/${option.github}.png`}
                alt=""
                width={40}
                height={40}
                className={styles.authorAvatar}
                unoptimized
              />
            </button>
          ))}
        </div>
      </div>
    ) : null;

  const detailFallback = (
    <p className={styles.placeholderCopy}>Pick a pattern to see its guidance.</p>
  );

  const renderDetailArticle = () => {
    if (!selected || !selectedConfig) {
      return null;
    }

    return (
      <article className={styles.detailContent} aria-live="polite">
        <div className={styles.detailHeader}>
          <div className={styles.detailHeaderMain}>
            <div className={styles.detailTitleRow}>
              {selected.item.emojiIndicator && (
                <span className={styles.detailEmoji} aria-hidden="true">
                  {selected.item.emojiIndicator}
                </span>
              )}
              <div className={styles.detailTitleBlock}>
                <h2 className={styles.detailTitle}>{selected.item.title}</h2>
                {selected.item.alternativeTitles && selected.item.alternativeTitles.length > 0 && (
                  <p className={styles.detailMeta}>
                    Also known as: {selected.item.alternativeTitles.join(', ')}
                  </p>
                )}
                {selected.item.synonyms && selected.item.synonyms.length > 0 && (
                  <p className={styles.detailMeta}>
                    Synonyms: {selected.item.synonyms.join(', ')}
                  </p>
                )}
              </div>
            </div>
            <span className={`${styles.detailBadge} ${styles[selectedConfig.styleClass]}`}>
              <span className={styles.detailBadgeIcon}>{selectedConfig.icon}</span>
              {selectedConfig.label}
            </span>
          </div>
          {selected.item.video && (
            <VideoThumbnail
              url={selected.item.video}
              title={selected.item.title}
              videoTitle={selected.item.videoTitle}
            />
          )}
        </div>
        <div className={styles.detailBody}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {selected.item.content}
          </ReactMarkdown>
        </div>
        {selected.item.authorNames.length > 0 && (
          <div className={styles.authorsSection}>
            <div className={styles.authorsLabel}>Documented by</div>
            <div className={styles.authorsList}>
              {selected.item.authorIds.map((authorId, index) => {
                const name = selected.item.authorNames[index];
                const github = selected.item.authorGithubs[index];
                if (!name || !github) return null;

                return (
                  <Link
                    key={authorId}
                    href={`https://github.com/${github}`}
                    className={styles.authorLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={`https://github.com/${github}.png`}
                      alt={`${name}'s avatar`}
                      width={32}
                      height={32}
                      className={styles.authorAvatar}
                      unoptimized
                    />
                    <span className={styles.authorName}>{name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </article>
    );
  };

  useEffect(() => {
    if (!isMobile || !selected) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelected(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, selected]);

  const handleDetailTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!isMobile) {
      return;
    }
    const touch = event.touches[0] ?? event.changedTouches[0];
    if (!touch) {
      return;
    }
    detailSwipeStartRef.current = touch.clientY;
    detailSwipeDeltaRef.current = 0;
  };

  const handleDetailTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (!isMobile) {
      return;
    }

    if (detailSwipeStartRef.current === null) {
      return;
    }

    const touch = event.touches[0] ?? event.changedTouches[0];
    if (!touch) {
      return;
    }
    detailSwipeDeltaRef.current = touch.clientY - detailSwipeStartRef.current;
  };

  const handleDetailTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (!isMobile) {
      return;
    }

    const start = detailSwipeStartRef.current;
    if (start === null) {
      detailSwipeDeltaRef.current = 0;
      return;
    }

    const touch = event.changedTouches[0] ?? event.touches[0];
    const delta = touch ? touch.clientY - start : detailSwipeDeltaRef.current;
    detailSwipeStartRef.current = null;
    detailSwipeDeltaRef.current = 0;

    if (delta > 80) {
      setSelected(null);
    }
  };

  return (
    <>
      <div
        className={styles.mobileStickyHeader}
        data-testid={COMPLETE_CATALOG_TEST_IDS.stickyHeader}
      >
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.filterBar}>
          <div className={styles.searchContainer}>
            <SearchBar patterns={allPatterns} onSelect={handleSearchSelect} />
          </div>
          {isMobile ? (
            <button
              type="button"
              className={styles.filterToggleButton}
              onClick={() => setIsFilterMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isFilterMenuOpen}
            >
              Filters
            </button>
          ) : (
            <>
              {typeFilterControls}
              {authorFilterControls}
            </>
          )}
        </div>
      </div>
      {isMobile && isFilterMenuOpen && (
        <div className={styles.filterOverlay}>
          <button
            type="button"
            className={styles.filterOverlayBackdrop}
            aria-label="Dismiss filters"
            onClick={() => setIsFilterMenuOpen(false)}
          />
          <div
            className={styles.filterOverlayDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="filterOverlayTitle"
          >
            <div className={styles.filterOverlayHeader}>
              <h2 id="filterOverlayTitle" className={styles.filterOverlayTitle}>
                Filters
              </h2>
              <button
                type="button"
                className={styles.filterOverlayClose}
                onClick={() => setIsFilterMenuOpen(false)}
                aria-label="Close filters"
              >
                ×
              </button>
            </div>
            <div className={styles.filterOverlayBody}>
              {typeFilterControls}
              {authorFilterControls}
            </div>
          </div>
        </div>
      )}
      {isMobile && selected && selectedConfig && (
        <div className={styles.detailOverlay}>
          <button
            type="button"
            className={styles.detailOverlayBackdrop}
            aria-label="Dismiss pattern detail"
            onClick={() => setSelected(null)}
          />
          <div
            className={styles.detailOverlayPanel}
            role="dialog"
            aria-modal="true"
            aria-label="Pattern detail"
            onTouchStart={handleDetailTouchStart}
            onTouchMove={handleDetailTouchMove}
            onTouchEnd={handleDetailTouchEnd}
          >
            <div className={styles.detailOverlayHeader}>
              <button
                type="button"
                className={styles.detailOverlayClose}
                onClick={() => setSelected(null)}
                aria-label="Close pattern detail"
              >
                ×
              </button>
            </div>
            <div className={styles.detailOverlayBody}>
              {renderDetailArticle()}
            </div>
          </div>
        </div>
      )}
      <div className={styles.layout}>
      <aside ref={sidebarRef} data-testid={COMPLETE_CATALOG_TEST_IDS.sidebar} className={styles.sidebar}>
        <section className={styles.listSection}>
          {filteredGroups.length === 0 ? (
            <p className={styles.emptyState} role="status" aria-live="polite">
              No entries match these filters yet. Try adjusting the filters above.
            </p>
          ) : (
            filteredGroups.map((group) => {
              const isCollapsed = collapsedGroups[group.category] ?? false;
              return (
                <div key={group.category} className={styles.catalogGroup}>
                  <button
                    type="button"
                    className={styles.groupToggle}
                    onClick={() =>
                      setCollapsedGroups((prev) => ({
                        ...prev,
                        [group.category]: !isCollapsed,
                      }))
                    }
                    aria-expanded={!isCollapsed}
                  >
                    <span
                      className={`${styles.groupTitleIcon} ${styles[group.styleClass]}`}
                      aria-hidden="true"
                    >
                      {group.icon}
                    </span>
                    <span className={styles.groupTitleText}>
                      {group.label} ({group.items.length})
                    </span>
                    <span className={styles.groupToggleIndicator} aria-hidden="true">
                      {isCollapsed ? "▸" : "▾"}
                    </span>
                  </button>
                  {!isCollapsed && (
                    <ul className={styles.catalogList} aria-label={group.label}>
                      {group.items.map((item) => {
                        const itemKey = `${group.category}-${item.slug}`;
                        return (
                          <li
                            key={item.slug}
                            ref={(el) => {
                              if (el) {
                                selectedItemRefs.current.set(itemKey, el);
                              } else {
                                selectedItemRefs.current.delete(itemKey);
                              }
                            }}
                            className={`${styles.catalogListItem} ${
                              isSelected(group.label, item) ? styles.catalogListItemActive : ""
                            }`}
                          >
                          <Link
                            href={`/${group.category}/${item.slug}`}
                            className={styles.catalogLink}
                            aria-current={isSelected(group.label, item) ? "true" : undefined}
                            onClick={(event) => handleSelect(event, group.label, group.category, item)}
                          >
                            {item.emojiIndicator && (
                              <span aria-hidden="true" className={styles.catalogEmoji}>
                                {item.emojiIndicator}
                              </span>
                            )}
                            <span className={styles.catalogTitle}>{item.title}</span>
                          </Link>
                        </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })
          )}
        </section>
      </aside>
      <section data-testid={COMPLETE_CATALOG_TEST_IDS.detail} className={styles.detail}>
        {renderDetailArticle() ?? detailFallback}
      </section>
      </div>
    </>
  );
}
