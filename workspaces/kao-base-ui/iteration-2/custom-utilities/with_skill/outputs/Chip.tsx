import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { mergeProps } from '@base-ui/react/merge-props';

// --- State & Props ---

interface ChipState {
  variant: 'filled' | 'outlined';
  removable: boolean;
}

type ChipProps = useRender.ComponentProps<'div', ChipState> & {
  variant?: ChipState['variant'];
  removable?: boolean;
  onRemove?: () => void;
  children?: React.ReactNode;
};

// --- Remove Button ---

interface RemoveButtonState {
  removing: boolean;
}

type RemoveButtonProps = useRender.ComponentProps<'button', RemoveButtonState> & {
  onRemove: () => void;
};

function RemoveButton(props: RemoveButtonProps) {
  const { onRemove, ...otherProps } = props;
  const [removing, setRemoving] = React.useState(false);

  const state: RemoveButtonState = { removing };

  const internalProps: React.ComponentPropsWithRef<'button'> = {
    type: 'button',
    'aria-label': 'Remove',
    className: 'chip-remove',
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setRemoving(true);
      onRemove();
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        setRemoving(true);
        onRemove();
      }
    },
  };

  const { element } = useRender({
    defaultTagName: 'button',
    render: props.render,
    state,
    props: mergeProps(internalProps, otherProps),
    stateAttributesMapping: {
      removing: (value) => (value ? { 'data-removing': '' } : {}),
    },
  });

  return element;
}

// --- Chip ---

function Chip(props: ChipProps) {
  const {
    variant = 'filled',
    removable = false,
    onRemove,
    children,
    ...otherProps
  } = props;

  const state: ChipState = { variant, removable };

  const internalProps: React.ComponentPropsWithRef<'div'> = {
    role: 'status',
    className: 'chip',
    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (removable && (event.key === 'Delete' || event.key === 'Backspace')) {
        onRemove?.();
      }
    },
  };

  const { element } = useRender({
    defaultTagName: 'div',
    render: props.render ?? ((renderProps, renderState) => (
      <div {...renderProps}>
        <span className="chip-label">{children}</span>
        {renderState.removable && onRemove && (
          <RemoveButton onRemove={onRemove} />
        )}
      </div>
    )),
    state,
    props: mergeProps(internalProps, otherProps),
    stateAttributesMapping: {
      variant: (value) => ({ 'data-variant': value }),
      removable: (value) => (value ? { 'data-removable': '' } : {}),
    },
  });

  return element;
}

export { Chip, RemoveButton };
export type { ChipProps, ChipState, RemoveButtonProps, RemoveButtonState };
