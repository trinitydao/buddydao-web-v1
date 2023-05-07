import type { Placement } from '@floating-ui/react';
import * as React from 'react';
import { mergeRefs } from 'react-merge-refs';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  // useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
} from '@floating-ui/react';
import classNames from 'classnames';

interface TooltipOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useTooltip({
  initialOpen = false,
  placement = 'top',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TooltipOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (changedOpen: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(changedOpen);
    setControlledOpen?.(changedOpen);
  };

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift()],
  });

  const context = data.context;

  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null,
  });
  // const focus = useFocus(context, {
  //   enabled: controlledOpen == null,
  // });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const interactions = useInteractions([
    hover,
    //  focus,
    dismiss,
    role,
  ]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data],
  );
}

type ContextType = ReturnType<typeof useTooltip> | null;

const TooltipContext = React.createContext<ContextType>(null);

export const useTooltipState = () => {
  const context = React.useContext(TooltipContext);

  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />');
  }

  return context;
};

export function Tooltip({ children, ...options }: { children: React.ReactNode } & TooltipOptions) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const tooltip = useTooltip(options);
  return <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>;
}

export const TooltipTrigger = React.forwardRef<HTMLElement, React.HTMLProps<HTMLElement> & { asChild?: boolean }>(
  function TooltipTrigger({ children, asChild = false, ...props }, propRef) {
    const state = useTooltipState();

    const childrenRef = (children as any).ref;
    const ref: any = React.useMemo(
      () => mergeRefs([state.reference, propRef, childrenRef]),
      [state.reference, propRef, childrenRef],
    );

    // `asChild` allows the user to pass any element as the anchor
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children,
        state.getReferenceProps({
          ref,
          ...props,
          ...children.props,
          'data-state': state.open ? 'open' : 'closed',
        }),
      );
    }

    return (
      <button
        ref={ref}
        // The user can style the trigger based on the state
        data-state={state.open ? 'open' : 'closed'}
        {...state.getReferenceProps(props)}
      >
        {children}
      </button>
    );
  },
);

export const TooltipContent = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(function TooltipContent(
  props,
  propRef,
) {
  const state = useTooltipState();

  const ref = React.useMemo(() => mergeRefs([state.floating, propRef]), [state.floating, propRef]);

  return (
    <FloatingPortal>
      {state.open && (
        <div
          ref={ref}
          className={classNames(styles.tooltip, props.className)}
          style={{
            position: state.strategy,
            top: state.y ?? 0,
            left: state.x ?? 0,
            visibility: state.x == null ? 'hidden' : 'visible',
            zIndex: 1000,
            ...props.style,
          }}
          {...state.getFloatingProps(props)}
        />
      )}
    </FloatingPortal>
  );
});

const styles = {
  tooltip: classNames('width-max-content', 'bg-gray-700', 'text-white', 'rounded', 'p-2', 'text-sm'),
};
