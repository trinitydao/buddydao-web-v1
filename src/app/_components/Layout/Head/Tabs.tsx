'use client';

import { COLORS, TEXT_COLORS } from '@/styles/vars';
import { css } from '@emotion/css';
import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

const tabs = [
  {
    title: 'Your Lenders',
    href: '/lenders',
  },
  {
    title: 'Your Borrowers',
    href: '/borrowers',
  },
];

export function Tabs() {
  const pathname = usePathname();
  const selectedIndex = tabs.findIndex((tab) => tab.href === pathname);

  return (
    <Tab.Group selectedIndex={selectedIndex}>
      <Tab.List className={styles.tabList}>
        {tabs.map((tabItem) => (
          <Tab key={tabItem.title} as={Fragment}>
            {({ selected }) => (
              <Link
                className={classNames(styles.tab, selected ? styles.tabSelected : styles.tabUnselected)}
                href={tabItem.href}
              >
                {tabItem.title}
              </Link>
            )}
          </Tab>
        ))}
      </Tab.List>
    </Tab.Group>
  );
}

const styles = {
  tabList: classNames('flex', 'space-x-2', 'sm:space-x-8', 'md:space-x-20'),
  tab: classNames('rounded-lg', 'font-normal', 'p-1', 'focus:outline-none', 'text-base'),
  tabUnselected: classNames(css({ color: TEXT_COLORS.SECONDARY })),
  tabSelected: classNames(
    css({
      color: COLORS.PRIMARY,
    }),
  ),
};
