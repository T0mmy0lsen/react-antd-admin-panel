import type { ReactNode } from 'react';
import type { ButtonType } from 'antd/es/button';

/**
 * Action types
 */
export type ActionType = 'submit' | 'callback' | 'link' | 'reset';

/**
 * Confirmation dialog configuration
 */
export interface ActionConfirm {
  /** Confirmation dialog title */
  title?: string;
  /** Confirmation dialog content/message */
  content: string;
  /** OK button text */
  okText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Danger mode (red OK button) */
  danger?: boolean;
}

/**
 * Access requirement for the action
 */
export interface ActionAccess {
  /** Required role */
  role?: string;
  /** Required roles (any match) */
  roles?: string[];
  /** Required permission */
  permission?: string;
  /** Required feature */
  feature?: string;
  /** Required feature level */
  level?: number;
}

/**
 * Action - Clickable action builder with confirmation and callbacks
 * 
 * Defines an action that can be triggered by user interaction.
 * Supports confirmation dialogs, loading states, and callbacks.
 * 
 * @example
 * ```typescript
 * // Submit action with confirmation
 * const saveAction = new Action()
 *   .key('save')
 *   .label('Save Changes')
 *   .icon(<SaveOutlined />)
 *   .buttonType('primary')
 *   .confirm('Are you sure you want to save?')
 *   .onComplete(() => message.success('Saved!'))
 *   .onError(() => message.error('Failed'));
 * 
 * // Callback action
 * const deleteAction = new Action()
 *   .key('delete')
 *   .label('Delete')
 *   .buttonType('primary')
 *   .danger(true)
 *   .confirm({ content: 'Delete this item?', danger: true })
 *   .callback(async (action) => {
 *     await api.delete(itemId);
 *   });
 * 
 * // Link action
 * const viewAction = new Action()
 *   .key('view')
 *   .label('View Details')
 *   .type('link')
 *   .route('/users/123');
 * ```
 */
export class Action {
  private _key?: string;
  private _label?: string;
  private _icon?: ReactNode;
  private _type: ActionType = 'submit';
  private _buttonType: ButtonType = 'default';
  private _danger = false;
  private _disabled = false;
  private _loading = false;
  private _confirm?: ActionConfirm;
  private _route?: string;
  private _access?: ActionAccess;
  
  // Callbacks
  private _callback?: (action: Action, args?: unknown) => void | Promise<void>;
  private _onComplete?: (result?: unknown) => void;
  private _onError?: (error: Error) => void;

  /**
   * Set action key/identifier
   */
  key(value: string): this {
    this._key = value;
    return this;
  }

  /**
   * Get action key
   */
  getKey(): string | undefined {
    return this._key;
  }

  /**
   * Set action label
   */
  label(value: string): this {
    this._label = value;
    return this;
  }

  /**
   * Get action label
   */
  getLabel(): string | undefined {
    return this._label;
  }

  /**
   * Set action icon
   */
  icon(value: ReactNode): this {
    this._icon = value;
    return this;
  }

  /**
   * Get action icon
   */
  getIcon(): ReactNode {
    return this._icon;
  }

  /**
   * Set action type
   */
  type(value: ActionType): this {
    this._type = value;
    return this;
  }

  /**
   * Get action type
   */
  getType(): ActionType {
    return this._type;
  }

  /**
   * Set button type (Ant Design ButtonType)
   */
  buttonType(value: ButtonType): this {
    this._buttonType = value;
    return this;
  }

  /**
   * Get button type
   */
  getButtonType(): ButtonType {
    return this._buttonType;
  }

  /**
   * Set danger mode
   */
  danger(value = true): this {
    this._danger = value;
    return this;
  }

  /**
   * Check if danger mode
   */
  isDanger(): boolean {
    return this._danger;
  }

  /**
   * Set disabled state
   */
  disabled(value = true): this {
    this._disabled = value;
    return this;
  }

  /**
   * Check if disabled
   */
  isDisabled(): boolean {
    return this._disabled;
  }

  /**
   * Set loading state
   */
  loading(value = true): this {
    this._loading = value;
    return this;
  }

  /**
   * Check if loading
   */
  isLoading(): boolean {
    return this._loading;
  }

  /**
   * Set confirmation dialog (string shorthand or full config)
   */
  confirm(value: string | ActionConfirm): this {
    this._confirm = typeof value === 'string' 
      ? { content: value }
      : value;
    return this;
  }

  /**
   * Get confirmation config
   */
  getConfirm(): ActionConfirm | undefined {
    return this._confirm;
  }

  /**
   * Set route for link type actions
   */
  route(value: string): this {
    this._route = value;
    return this;
  }

  /**
   * Get route
   */
  getRoute(): string | undefined {
    return this._route;
  }

  /**
   * Set access requirements
   */
  access(value: ActionAccess): this {
    this._access = value;
    return this;
  }

  /**
   * Get access requirements
   */
  getAccess(): ActionAccess | undefined {
    return this._access;
  }

  /**
   * Set callback function for 'callback' type actions
   */
  callback(fn: (action: Action, args?: unknown) => void | Promise<void>): this {
    this._type = 'callback';
    this._callback = fn;
    return this;
  }

  /**
   * Get callback function
   */
  getCallback(): ((action: Action, args?: unknown) => void | Promise<void>) | undefined {
    return this._callback;
  }

  /**
   * Set completion callback
   */
  onComplete(fn: (result?: unknown) => void): this {
    this._onComplete = fn;
    return this;
  }

  /**
   * Call completion callback
   */
  callComplete(result?: unknown): void {
    this._onComplete?.(result);
  }

  /**
   * Set error callback
   */
  onError(fn: (error: Error) => void): this {
    this._onError = fn;
    return this;
  }

  /**
   * Call error callback
   */
  callError(error: Error): void {
    this._onError?.(error);
  }

  /**
   * Execute the action's callback
   * For 'callback' type actions
   */
  async execute(args?: unknown): Promise<void> {
    if (this._type !== 'callback' || !this._callback) {
      return;
    }

    this._loading = true;
    try {
      await this._callback(this, args);
      this._onComplete?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this._onError?.(err);
      throw err;
    } finally {
      this._loading = false;
    }
  }

  /**
   * Clone this action
   */
  clone(): Action {
    const cloned = new Action();
    cloned._key = this._key;
    cloned._label = this._label;
    cloned._icon = this._icon;
    cloned._type = this._type;
    cloned._buttonType = this._buttonType;
    cloned._danger = this._danger;
    cloned._disabled = this._disabled;
    cloned._confirm = this._confirm;
    cloned._route = this._route;
    cloned._access = this._access;
    cloned._callback = this._callback;
    cloned._onComplete = this._onComplete;
    cloned._onError = this._onError;
    return cloned;
  }
}

export default Action;