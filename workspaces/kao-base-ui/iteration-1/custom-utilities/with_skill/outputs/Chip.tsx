import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { mergeProps } from '@base-ui/react/merge-props';

interface ChipState {
  variant: 'filled' | 'outlined';
  removable: boolean;
}

type ChipProps = useRender.ComponentProps<'div', ChipState> & {
  /**
   * The visual variant of the chip.
   * @default 'filled'
   */
  variant?: ChipState['variant'];
  /**
   * Whether the chip shows a remove (close) button.
   * @default false
   */
  removable?: boolean;
  /**
   * Callback fired when the remove button is clicked.
   */
  onRemove?: () => void;
  /**
   * The content of the chip.
   */
  children?: React.ReactNode;
};

interface ChipRemoveButtonState {
  removable: boolean;
}

type ChipRemoveButtonProps = useRender.ComponentProps<'button', ChipRemoveButtonState> & {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

function ChipRemoveButton(props: ChipRemoveButtonProps) {
  const { onClick, ...otherProps } = props;

  const state: ChipRemoveButtonState = { removable: true };

  const internalProps = {
    type: 'button' as const,
    'aria-label': 'Remove',
    className: 'chip-remove',
    onClick,
  };

  const { element } = useRender({
    defaultTagName: 'button',
    render: props.render,
    state,
    props: mergeProps(internalProps, otherProps),
    stateAttributesMapping: {
      removable: () => ({}),
    },
  });

  return element;
}

function Chip(props: ChipProps) {
  const {
    variant = 'filled',
    removable = false,
    onRemove,
    children,
    ...otherProps
  } = props;

  const state: ChipState = { variant, removable };

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (removable && (event.key === 'Delete' || event.key === 'Backspace')) {
        onRemove?.();
      }
    },
    [removable, onRemove],
  );

  const internalProps = {
    role: 'row' as const,
    className: 'chip',
    onKeyDown: handleKeyDown,
  };

  const { element } = useRender({
    defaultTagName: 'div',
    render: props.render,
    state,
    props: mergeProps(internalProps, otherProps),
    stateAttributesMapping: {
      variant: (value) => ({ 'data-variant': value }),
      removable: (value) => (value ? { 'data-removable': '' } : {}),
    },
  });

  // When using the render prop, the consumer controls the full output,
  // so we return the element directly. Otherwise, wrap children + remove button.
  if (props.render) {
    return element;
  }

  return React.cloneElement(element, {}, children, removable && (
    <ChipRemoveButton
      onClick={onRemove}
      aria-label="Remove"
    >
      &#x2715;
    </ChipRemoveButton>
  ));
}

export { Chip, ChipRemoveButton };
export type { ChipProps, ChipState, ChipRemoveButtonProps, ChipRemoveButtonState };
