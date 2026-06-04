"use client";

import { ReactNode, useState } from "react";
import styles from "./MapTabs.module.css";

export interface MapTab {
  id: string;
  label: string;
  title: string;
  content: ReactNode;
}

interface MapTabsProps {
  tabs: MapTab[];
  defaultTabId?: string;
}

export default function MapTabs({ tabs, defaultTabId }: MapTabsProps) {
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id);
  const activeTab = tabs.find(tab => tab.id === activeId) ?? tabs[0];

  return (
    <div className={styles.tabs}>
      <div className={styles.titleBar}>
        <h1>{activeTab.title}</h1>
      </div>
      <div role="tablist" className={styles.tabBar}>
        {tabs.map(tab => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              className={isActive ? styles.tabActive : styles.tab}
              onClick={() => setActiveId(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map(tab => (
        <div
          key={tab.id}
          role="tabpanel"
          hidden={tab.id !== activeId}
          className={styles.panel}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
