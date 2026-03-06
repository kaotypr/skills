'use client';

import * as React from 'react';
import { useRenderElement } from '@base-ui-components/react/use-render-element';
import { mergeProps } from '@base-ui-components/react/merge-props';
import { useComponentRenderer } from '@base-ui-components/react/use-component-renderer';

// ---- Types ----

type ChipVariant = 'filled' | 'outlined';

interface ChipState {
  variant: ChipVariant;
  removable: boolean;
}

interface ChipRootProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  /**
   * The visual variant of the chip.
   * @default 'filled'
   */
  variant?: ChipVariant;
  /**
   * Whether the chip displays a remove/close button.
   * @default false
   */
  removable?: boolean;
  /**
   * Callback fired when the remove button is clicked.
   */
  onRemove?: () => void;
  /**
   * Render prop or React node children.
   */
  children?:
    | React.ReactNode
    | ((state: ChipState, props: Record<string, unknown>) => React.ReactElement);
  /**
   * Custom render element for the root.
   */
  render?: React.ReactElement | ((props: Record<string, unknown>, state: ChipState) => React.ReactElement);
  /**
   * Additional CSS class or class function based on state.
   */
  className?: string | ((state: ChipState) => string);
}

// ---- Context ----

const ChipContext = React.createContext<{
  state: ChipState;
  onRemove?: () => void;
}>({
  state: { variant: 'filled', removable: false },
});

function useChipContext() {
  return React.useContext(ChipContext);
}

// ---- ChipRoot ----

const ChipRoot = React.forwardRef<HTMLDivElement, ChipRootProps>(
  function ChipRoot(props, forwardedRef) {
    const {
      variant = 'filled',
      removable = false,
      onRemove,
      children,
      render,
      className: classNameProp,
      onKeyDown,
      ...otherProps
    } = props;

    const state: ChipState = React.useMemo(
      () => ({ variant, removable }),
      [variant, removable],
    );

    const contextValue = React.useMemo(
      () => ({ state, onRemove }),
      [state, onRemove],
    );

    // Internal keyboard handler: Delete/Backspace triggers remove
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (removable && (event.key === 'Delete' || event.key === 'Backspace')) {
          onRemove?.();
        }
      },
      [removable, onRemove],
    );

    // Merge internal props with consumer-supplied props using Base UI's mergeProps
    const mergedProps = mergeProps<Record<string, unknown>>(
      {
        role: 'row',
        tabIndex: 0,
        onKeyDown: handleKeyDown,
        'data-variant': variant,
        ...(removable ? { 'data-removable': '' } : {}),
      },
      {
        ref: forwardedRef,
        onKeyDown,
        ...otherProps,
      },
    );

    // Resolve className
    const resolvedClassName =
      typeof classNameProp === 'function' ? classNameProp(state) : classNameProp;

    if (resolvedClassName) {
      mergedProps.className = mergedProps.className
        ? `${mergedProps.className} ${resolvedClassName}`
        : resolvedClassName;
    }

    // Render via render prop or default element
    const renderElement = useRenderElement('div', {
      ref: forwardedRef,
      props: mergedProps as React.ComponentPropsWithoutRef<'div'> & { ref?: React.Ref<HTMLDivElement> },
      state,
      render: render as React.ReactElement | undefined,
    });

    const renderedChildren =
      typeof children === 'function' ? children(state, mergedProps) : children;

    return (
      <ChipContext.Provider value={contextValue}>
        {render ? (
          renderElement()
        ) : (
          <div {...(mergedProps as React.ComponentPropsWithoutRef<'div'>)} ref={forwardedRef} className={resolvedClassName ? `${(mergedProps as any).className ?? ''}`.trim() || resolvedClassName : (mergedProps as any).className}>
            {renderedChildren}
          </div>
        )}
      </ChipContext.Provider>
    );
  },
);

// ---- ChipLabel ----

interface ChipLabelProps extends React.ComponentPropsWithoutRef<'span'> {
  render?: React.ReactElement;
}

const ChipLabel = React.forwardRef<HTMLSpanElement, ChipLabelProps>(
  function ChipLabel(props, forwardedRef) {
    const { render, children, ...otherProps } = props;
    const { state } = useChipContext();

    const mergedProps = mergeProps<Record<string, unknown>>(
      { 'data-part': 'label' },
      { ref: forwardedRef, ...otherProps },
    );

    if (render) {
      const renderElement = useRenderElement('span', {
        ref: forwardedRef,
        props: mergedProps as React.ComponentPropsWithoutRef<'span'> & { ref?: React.Ref<HTMLSpanElement> },
        state,
        render,
      });
      return renderElement();
    }

    return (
      <span {...(mergedProps as React.ComponentPropsWithoutRef<'span'>)} ref={forwardedRef}>
        {children}
      </span>
    );
  },
);

// ---- ChipRemove ----

interface ChipRemoveProps extends React.ComponentPropsWithoutRef<'button'> {
  render?: React.ReactElement;
}

const ChipRemove = React.forwardRef<HTMLButtonElement, ChipRemoveProps>(
  function ChipRemove(props, forwardedRef) {
    const { render, children, onClick, ...otherProps } = props;
    const { state, onRemove } = useChipContext();

    const handleClick = React.useCallback(() => {
      onRemove?.();
    }, [onRemove]);

    // Merge internal click handler with consumer's onClick via mergeProps
    const mergedProps = mergeProps<Record<string, unknown>>(
      {
        type: 'button' as const,
        'aria-label': 'Remove',
        'data-part': 'remove',
        onClick: handleClick,
      },
      {
        ref: forwardedRef,
        onClick,
        ...otherProps,
      },
    );

    if (!state.removable) {
      return null;
    }

    if (render) {
      const renderElement = useRenderElement('button', {
        ref: forwardedRef,
        props: mergedProps as React.ComponentPropsWithoutRef<'button'> & { ref?: React.Ref<HTMLButtonElement> },
        state,
        render,
      });
      return renderElement();
    }

    return (
      <button {...(mergedProps as React.ComponentPropsWithoutRef<'button'>)} ref={forwardedRef}>
        {children ?? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        )}
      </button>
    );
  },
);

// ---- Exports ----

export const Chip = {
  Root: ChipRoot,
  Label: ChipLabel,
  Remove: ChipRemove,
};

export type { ChipRootProps, ChipLabelProps, ChipRemoveProps, ChipState, ChipVariant };
