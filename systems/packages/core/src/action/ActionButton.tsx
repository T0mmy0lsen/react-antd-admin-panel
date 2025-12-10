import React, { useState, useCallback } from 'react';
import { Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Action } from './Action';
import { useAccess } from '../hooks/useAccess';
import type { Formula } from '../formula/Formula';

/**
 * Props for ActionButton component
 */
export interface ActionButtonProps {
  /** The Action model to render */
  action: Action;
  /** Formula to submit (for 'submit' type actions) */
  formula?: Formula;
  /** Additional arguments to pass to callback */
  args?: unknown;
  /** Navigate function for 'link' type actions */
  navigate?: (path: string) => void;
  /** Override disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
  /** Button size */
  size?: 'small' | 'middle' | 'large';
}

/**
 * ActionButton - Renders an Action as an Ant Design Button
 * 
 * Handles confirmation dialogs, loading states, and access control.
 * 
 * @example
 * ```tsx
 * const deleteAction = new Action()
 *   .label('Delete')
 *   .danger(true)
 *   .confirm('Are you sure?')
 *   .callback(async () => {
 *     await api.deleteUser(id);
 *   });
 * 
 * <ActionButton action={deleteAction} />
 * 
 * // With formula submission
 * const saveAction = new Action()
 *   .label('Save')
 *   .buttonType('primary');
 * 
 * <ActionButton action={saveAction} formula={formula} />
 * ```
 */
export function ActionButton({
  action,
  formula,
  args,
  navigate,
  disabled: disabledProp,
  className,
  size,
}: ActionButtonProps): React.ReactElement | null {
  const [loading, setLoading] = useState(false);
  const access = useAccess();

  // Check access requirements
  const accessConfig = action.getAccess();
  const hasAccess = useCallback(() => {
    if (!accessConfig) return true;
    
    if (accessConfig.role && !access.hasRole(accessConfig.role)) {
      return false;
    }
    if (accessConfig.roles && !access.hasAnyRole(accessConfig.roles)) {
      return false;
    }
    if (accessConfig.permission && !access.hasPermission(accessConfig.permission)) {
      return false;
    }
    if (accessConfig.feature && !access.hasFeature(accessConfig.feature, accessConfig.level)) {
      return false;
    }
    return true;
  }, [accessConfig, access]);

  // Don't render if no access
  if (!hasAccess()) {
    return null;
  }

  const isDisabled = disabledProp ?? action.isDisabled();
  const isLoading = loading || action.isLoading();
  const confirmConfig = action.getConfirm();

  const executeAction = async () => {
    const actionType = action.getType();

    try {
      setLoading(true);

      switch (actionType) {
        case 'submit':
          if (formula) {
            await formula.submit();
          }
          break;

        case 'callback':
          await action.execute(args);
          break;

        case 'link':
          const route = action.getRoute();
          if (route && navigate) {
            navigate(route);
          } else if (route) {
            window.location.href = route;
          }
          break;

        case 'reset':
          if (formula) {
            formula.reset();
          }
          break;
      }
    } catch {
      // Error already handled by callbacks in Action/Formula
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (confirmConfig) {
      Modal.confirm({
        title: confirmConfig.title || 'Confirm',
        icon: <ExclamationCircleOutlined />,
        content: confirmConfig.content,
        okText: confirmConfig.okText || 'OK',
        cancelText: confirmConfig.cancelText || 'Cancel',
        okButtonProps: confirmConfig.danger ? { danger: true } : undefined,
        onOk: executeAction,
      });
    } else {
      executeAction();
    }
  };

  return (
    <Button
      type={action.getButtonType()}
      danger={action.isDanger()}
      disabled={isDisabled}
      loading={isLoading}
      icon={action.getIcon()}
      onClick={handleClick}
      className={className}
      size={size}
    >
      {action.getLabel()}
    </Button>
  );
}

export default ActionButton;