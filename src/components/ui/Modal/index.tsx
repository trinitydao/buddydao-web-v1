'use client';

import type { PropsWithChildren, ReactNode } from 'react';
import { css } from '@emotion/css';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import classNames from 'classnames';

export interface ModalProps extends PropsWithChildren<{}> {
  open?: boolean;
  title?: ReactNode;
  footer?: ReactNode;
  onClose?: (value: boolean) => void;
}

export function Modal({ open, title, footer, children, onClose }: ModalProps) {
  function close(value: boolean) {
    onClose?.(value);
  }
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.modal} onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={styles.overlay} />
        </Transition.Child>
        <div className={styles.panelWrapper}>
          <div className={styles.panelInnerWrapper}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={styles.panel}>
                {title && (
                  <Dialog.Title as="h3" className={styles.title}>
                    {title}
                  </Dialog.Title>
                )}

                <div className={styles.content}>{children}</div>
                {footer && <div className={styles.footer}>{footer}</div>}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

const styles = createStyles();
function createStyles() {
  const title = css({});
  const content = css({
    [`.${title} + &`]: {
      marginTop: '24px',
    },
  });

  return {
    modal: '',
    overlay: 'fixed z-20 inset-0 bg-black bg-opacity-20',
    panelWrapper: 'fixed z-20 inset-0 overflow-y-auto',
    panelInnerWrapper: 'flex min-h-full items-center justify-center p-4',
    panel: classNames(
      'w-full',
      'max-w-md',
      'transform',
      'overflow-hidden',
      'rounded-[10px]',
      'bg-white',
      'p-[36px]',
      'pb-[60px]',
      'text-left',
      'align-middle',
      'shadow-xl',
      'transition-all',
    ),
    title: classNames(title, 'text-lg font-normal text-[#333333]'),
    content: classNames(content),
    footer: classNames('mt-[36px]'),
  };
}
