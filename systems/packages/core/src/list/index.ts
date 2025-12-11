import React from 'react';
import { Table, TableProps, Avatar, Tag, Button, Space, Tooltip, Input, Row, Col, Popconfirm } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { SearchOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { BaseBuilder } from '../base/BaseBuilder';
import type { ComponentConfig } from '../types';
import { Get } from '../http/Get';

export interface ListColumnConfig<T = any> {
  key: string;
  title: string;
  dataIndex?: string | string[];
  width?: number | string;
  fixed?: 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  sorter?: boolean | ((a: T, b: T) => number);
  filters?: { text: string; value: any }[];
  render?: (value: any, record: T, index: number) => React.ReactNode;
  ellipsis?: boolean;
  hidden?: boolean;
  searchable?: boolean;
}

export interface ListActionConfig<T = any> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (record: T, index: number) => void;
  danger?: boolean;
  disabled?: boolean | ((record: T) => boolean);
  confirm?: string;
  tooltip?: string;
}

export interface BulkActionConfig<T = any> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (selectedRows: T[], selectedKeys: React.Key[]) => void | Promise<void>;
  danger?: boolean;
  confirm?: string;
}

export interface ListHeaderConfig {
  title?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  showCreate?: boolean;
  createLabel?: string;
  onCreate?: () => void;
  showRefresh?: boolean;
  onRefresh?: () => void;
  extra?: React.ReactNode;
}

export interface ListConfig<T = any> extends ComponentConfig {
  columns?: ListColumnConfig<T>[];
  actions?: ListActionConfig<T>[];
  bulkActions?: BulkActionConfig<T>[];
  dataSource?: T[];
  rowKey?: string | ((record: T) => string);
  loading?: boolean;
  pagination?: false | {
    pageSize?: number;
    current?: number;
    total?: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    showTotal?: (total: number, range: [number, number]) => React.ReactNode;
    onChange?: (page: number, pageSize: number) => void;
  };
  size?: 'small' | 'middle' | 'large';
  bordered?: boolean;
  showHeader?: boolean;
  sticky?: boolean;
  scroll?: { x?: number | string; y?: number | string };
  rowSelection?: {
    type?: 'checkbox' | 'radio';
    selectedRowKeys?: React.Key[];
    onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  };
  expandable?: {
    expandedRowRender?: (record: T) => React.ReactNode;
    rowExpandable?: (record: T) => boolean;
  };
  onRow?: (record: T, index?: number) => React.HTMLAttributes<HTMLElement>;
  // New advanced config
  header?: ListHeaderConfig;
  get?: Get<T[]>;
  emptyText?: string;
  virtual?: boolean;
  virtualHeight?: number;
  virtualScrollX?: number | string;
}

/**
 * List Builder - Table/List component with builder pattern
 * Wrapper for Ant Design Table with fluent API
 * 
 * @example
 * // Basic usage
 * const userList = new List<User>()
 *   .rowKey('id')
 *   .column('name', 'Name')
 *   .column('email', 'Email')
 *   .tagColumn('role', 'Role', { admin: 'red', user: 'blue' })
 *   .action('edit', 'Edit', (record) => navigate(`/users/${record.id}`))
 *   .pagination({ pageSize: 10 })
 *   .dataSource(users);
 * 
 * @example
 * // With header controls and bulk actions
 * const userList = new List<User>()
 *   .rowKey('id')
 *   .header({
 *     title: 'Users',
 *     showSearch: true,
 *     onSearch: (q) => setSearch(q),
 *     showCreate: true,
 *     onCreate: () => navigate('/users/new'),
 *     showRefresh: true,
 *     onRefresh: () => refresh(),
 *   })
 *   .selectable('checkbox')
 *   .bulkAction('delete', 'Delete Selected', (rows) => deleteUsers(rows), { danger: true, confirm: 'Delete?' })
 *   .column('name', 'Name')
 *   .dataSource(users);
 */
export class List<T extends object = any> extends BaseBuilder<ListConfig<T>> {
  // These are used by selectable() for initial state, but actual state is managed in ListComponent
  private _selectedRowKeys: React.Key[] = [];

  constructor() {
    super();
    this._config.columns = [];
    this._config.actions = [];
    this._config.bulkActions = [];
  }

  /**
   * Set the data source
   */
  dataSource(data: T[]): this {
    this._config.dataSource = data;
    return this;
  }

  /**
   * Set the row key field or function
   */
  rowKey(key: string | ((record: T) => string)): this {
    this._config.rowKey = key;
    return this;
  }

  /**
   * Add a column to the table
   * Supports multiple signatures:
   * - column(key, title) - basic column
   * - column(key, title, config) - column with options
   * - column(key, title, render) - column with custom render
   * - column(key, title, render, config) - column with render and options
   */
  column(
    key: string,
    title: string,
    renderOrConfig?: ((value: any, record: T, index: number) => React.ReactNode) | Partial<ListColumnConfig<T>>,
    configIfRender?: Partial<ListColumnConfig<T>>
  ): this {
    const columnConfig: ListColumnConfig<T> = {
      key,
      title,
      dataIndex: key,
    };

    if (typeof renderOrConfig === 'function') {
      columnConfig.render = renderOrConfig;
      // If render function is provided, merge any additional config
      if (configIfRender) {
        Object.assign(columnConfig, configIfRender);
      }
    } else if (renderOrConfig) {
      Object.assign(columnConfig, renderOrConfig);
    }

    this._config.columns!.push(columnConfig);
    return this;
  }

  /**
   * Add an avatar column
   */
  avatarColumn(key: string, title: string = 'Avatar', size: number = 40): this {
    this._config.columns!.push({
      key,
      title,
      dataIndex: key,
      width: size + 32,
      render: (url: string) => React.createElement(Avatar, { src: url, size }),
    });
    return this;
  }

  /**
   * Add a tag column
   */
  tagColumn(
    key: string,
    title: string,
    colorMap?: Record<string, string>,
    options?: Omit<ListColumnConfig<T>, 'key' | 'title' | 'dataIndex' | 'render'>
  ): this {
    this._config.columns!.push({
      key,
      title,
      dataIndex: key,
      ...options,
      render: (value: string) => {
        const color = colorMap?.[value] || 'default';
        return React.createElement(Tag, { color }, value);
      },
    });
    return this;
  }

  /**
   * Add a date column with formatting
   */
  dateColumn(
    key: string,
    title: string,
    format: 'date' | 'datetime' | 'relative' = 'date',
    options?: Omit<ListColumnConfig<T>, 'key' | 'title' | 'dataIndex' | 'render'>
  ): this {
    this._config.columns!.push({
      key,
      title,
      dataIndex: key,
      ...options,
      render: (value: string | Date) => {
        if (!value) return '-';
        const date = new Date(value);
        if (format === 'datetime') {
          return date.toLocaleString();
        } else if (format === 'relative') {
          const diff = Date.now() - date.getTime();
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          if (days === 0) return 'Today';
          if (days === 1) return 'Yesterday';
          if (days < 7) return `${days} days ago`;
          return date.toLocaleDateString();
        }
        return date.toLocaleDateString();
      },
    });
    return this;
  }

  /**
   * Add a boolean column with Yes/No or custom labels
   */
  booleanColumn(
    key: string,
    title: string,
    options?: { trueLabel?: string; falseLabel?: string; trueColor?: string; falseColor?: string }
  ): this {
    const { trueLabel = 'Yes', falseLabel = 'No', trueColor = 'green', falseColor = 'default' } = options || {};
    this._config.columns!.push({
      key,
      title,
      dataIndex: key,
      render: (value: boolean) =>
        React.createElement(Tag, { color: value ? trueColor : falseColor }, value ? trueLabel : falseLabel),
    });
    return this;
  }

  /**
   * Add an action button
   */
  action(
    key: string,
    label: string,
    onClick: (record: T, index: number) => void,
    options?: Partial<Omit<ListActionConfig<T>, 'key' | 'label' | 'onClick'>>
  ): this {
    this._config.actions!.push({
      key,
      label,
      onClick,
      ...options,
    });
    return this;
  }

  /**
   * Set loading state
   */
  loading(value: boolean = true): this {
    this._config.loading = value;
    return this;
  }

  /**
   * Configure pagination
   */
  pagination(config: false | ListConfig<T>['pagination']): this {
    this._config.pagination = config;
    return this;
  }

  /**
   * Set table size
   */
  size(value: 'small' | 'middle' | 'large'): this {
    this._config.size = value;
    return this;
  }

  /**
   * Enable bordered style
   */
  bordered(value: boolean = true): this {
    this._config.bordered = value;
    return this;
  }

  /**
   * Show/hide header
   */
  showHeader(value: boolean = true): this {
    this._config.showHeader = value;
    return this;
  }

  /**
   * Enable sticky header
   */
  sticky(value: boolean = true): this {
    this._config.sticky = value;
    return this;
  }

  /**
   * Set scroll dimensions
   */
  scroll(x?: number | string, y?: number | string): this {
    this._config.scroll = { x, y };
    return this;
  }

  /**
   * Enable row selection
   */
  rowSelection(config: ListConfig<T>['rowSelection']): this {
    this._config.rowSelection = config;
    return this;
  }

  /**
   * Enable row expansion
   */
  expandable(config: ListConfig<T>['expandable']): this {
    this._config.expandable = config;
    return this;
  }

  /**
   * Enable row expansion with a render function
   */
  expandableRow(
    render: (record: T) => React.ReactNode,
    isExpandable?: (record: T) => boolean
  ): this {
    this._config.expandable = {
      expandedRowRender: render,
      rowExpandable: isExpandable,
    };
    return this;
  }

  /**
   * Set row event handlers
   */
  onRow(handler: (record: T, index?: number) => React.HTMLAttributes<HTMLElement>): this {
    this._config.onRow = handler;
    return this;
  }

  /**
   * Configure header controls (search, create, refresh, etc.)
   */
  header(config: ListHeaderConfig): this {
    this._config.header = config;
    return this;
  }

  /**
   * Enable simple row selection (state is managed by ListComponent)
   */
  selectable(type: 'checkbox' | 'radio' = 'checkbox'): this {
    this._config.rowSelection = {
      type,
      selectedRowKeys: this._selectedRowKeys,
      onChange: (keys) => {
        this._selectedRowKeys = keys;
      },
    };
    return this;
  }

  /**
   * Add a bulk action (for selected rows)
   */
  bulkAction(
    key: string,
    label: string,
    onClick: (selectedRows: T[], selectedKeys: React.Key[]) => void | Promise<void>,
    options?: Partial<Omit<BulkActionConfig<T>, 'key' | 'label' | 'onClick'>>
  ): this {
    this._config.bulkActions!.push({
      key,
      label,
      onClick,
      ...options,
    });
    return this;
  }

  /**
   * Set a Get request for data fetching
   */
  get(request: Get<T[]>): this {
    this._config.get = request;
    return this;
  }

  /**
   * Set empty state text
   */
  emptyText(text: string): this {
    this._config.emptyText = text;
    return this;
  }

  /**
   * Enable virtual scrolling for large datasets
   * @param height - The height of the virtual scroll container (default 400)
   * @param scrollX - The horizontal scroll width (default 'max-content'). Set to calculated width for best performance.
   */
  virtual(height: number = 400, scrollX?: number | string): this {
    this._config.virtual = true;
    this._config.virtualHeight = height;
    if (scrollX !== undefined) {
      this._config.virtualScrollX = scrollX;
    }
    return this;
  }

  /**
   * Get the current configuration (for advanced use cases)
   */
  getConfig(): ListConfig<T> {
    // Return the config directly without spreading to preserve reference identity
    // This is important for React.useMemo dependency checks
    return this._config;
  }

  /**
   * Render the table component
   */
  render(): React.ReactNode {
    if (this._config.hidden) {
      return null;
    }

    // Use a functional component to handle state for selection and header
    return React.createElement(ListComponent, { list: this as List<any> });
  }
}

/**
 * ListComponent - React component that handles state for the List builder
 * Wrapped in React.memo to prevent unnecessary re-renders
 */
interface ListComponentProps<T extends object> {
  list: List<T>;
}

const ListComponent = React.memo(function ListComponent<T extends object>({ list }: ListComponentProps<T>): React.ReactElement | null {
  const config = list.getConfig();
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<T[]>([]);
  const [searchValue, setSearchValue] = React.useState('');

  // Memoize columns to prevent rebuilding on every render (critical for virtual scrolling performance)
  const columns = React.useMemo((): ColumnsType<T> => {
    const cols: ColumnsType<T> = [];

    // Add data columns
    for (const col of config.columns || []) {
      if (col.hidden) continue;

      const column: ColumnType<T> = {
        key: col.key,
        title: col.title,
        dataIndex: col.dataIndex,
        width: col.width,
        fixed: col.fixed,
        align: col.align,
        ellipsis: col.ellipsis,
        render: col.render,
      };

      if (col.sorter) {
        column.sorter = col.sorter;
      }

      if (col.filters) {
        column.filters = col.filters;
        column.onFilter = (value, record) => {
          const dataIndex = col.dataIndex as string;
          return (record as any)[dataIndex] === value;
        };
      }

      cols.push(column);
    }

    // Add actions column if there are actions
    if (config.actions && config.actions.length > 0) {
      cols.push({
        key: '_actions',
        title: 'Actions',
        fixed: 'right',
        width: config.actions.length * 80,
        render: (_: any, record: T, index: number) => {
          const buttons = config.actions!.map((action) => {
            const isDisabled = typeof action.disabled === 'function'
              ? action.disabled(record)
              : action.disabled;

            // Handle confirm dialog
            if (action.confirm) {
              return React.createElement(
                Popconfirm,
                {
                  key: action.key,
                  title: action.confirm,
                  onConfirm: () => action.onClick(record, index),
                  okText: 'Yes',
                  cancelText: 'No',
                },
                React.createElement(
                  Button,
                  {
                    type: 'link',
                    size: 'small',
                    danger: action.danger,
                    disabled: isDisabled,
                    icon: action.icon,
                  },
                  action.label
                )
              );
            }

            const button = React.createElement(
              Button,
              {
                key: action.key,
                type: 'link',
                size: 'small',
                danger: action.danger,
                disabled: isDisabled,
                icon: action.icon,
                onClick: () => action.onClick(record, index),
              },
              action.label
            );

            if (action.tooltip) {
              return React.createElement(Tooltip, { key: action.key, title: action.tooltip }, button);
            }

            return button;
          });

          return React.createElement(Space, { size: 'small' }, ...buttons);
        },
      });
    }

    return cols;
  }, [config.columns, config.actions]);

  // Memoize row selection onChange handler
  const handleRowSelectionChange = React.useCallback((keys: React.Key[], rows: T[]) => {
    setSelectedRowKeys(keys);
    setSelectedRows(rows);
    config.rowSelection?.onChange?.(keys, rows);
  }, [config.rowSelection]);

  // Handle row selection
  const rowSelection = config.rowSelection ? {
    ...config.rowSelection,
    selectedRowKeys,
    onChange: handleRowSelectionChange,
  } : undefined;

  // Memoize header rendering
  const headerElement = React.useMemo(() => {
    const header = config.header;
    if (!header) return null;

    const hasSelection = selectedRowKeys.length > 0;
    const bulkActions = config.bulkActions || [];

    return React.createElement(
      Row,
      { 
        justify: 'space-between', 
        align: 'middle',
        style: { marginBottom: 16 },
      },
      // Left side: title and bulk actions
      React.createElement(
        Col,
        {},
        React.createElement(
          Space,
          {},
          header.title && React.createElement('span', { 
            style: { fontSize: 16, fontWeight: 600 } 
          }, header.title),
          hasSelection && React.createElement(
            Tag,
            { color: 'blue' },
            `${selectedRowKeys.length} selected`
          ),
          hasSelection && bulkActions.map(action => {
            if (action.confirm) {
              return React.createElement(
                Popconfirm,
                {
                  key: action.key,
                  title: action.confirm,
                  onConfirm: () => action.onClick(selectedRows, selectedRowKeys),
                  okText: 'Yes',
                  cancelText: 'No',
                },
                React.createElement(
                  Button,
                  {
                    size: 'small',
                    danger: action.danger,
                    icon: action.icon,
                  },
                  action.label
                )
              );
            }
            return React.createElement(
              Button,
              {
                key: action.key,
                size: 'small',
                danger: action.danger,
                icon: action.icon,
                onClick: () => action.onClick(selectedRows, selectedRowKeys),
              },
              action.label
            );
          }),
        ),
      ),
      // Right side: search, create, refresh
      React.createElement(
        Col,
        {},
        React.createElement(
          Space,
          {},
          header.showSearch && React.createElement(
            Input,
            {
              placeholder: header.searchPlaceholder || 'Search...',
              prefix: React.createElement(SearchOutlined),
              value: searchValue,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchValue(e.target.value);
                header.onSearch?.(e.target.value);
              },
              allowClear: true,
              style: { width: 200 },
              'aria-label': 'Search',
            }
          ),
          header.showCreate && React.createElement(
            Button,
            {
              type: 'primary',
              icon: React.createElement(PlusOutlined),
              onClick: header.onCreate,
              'aria-label': header.createLabel ? undefined : 'Create new item',
            },
            header.createLabel || 'Create'
          ),
          header.showRefresh && React.createElement(
            Button,
            {
              icon: React.createElement(ReloadOutlined),
              onClick: header.onRefresh,
              'aria-label': 'Refresh list',
            }
          ),
          header.extra,
        ),
      ),
    );
  }, [config.header, config.bulkActions, selectedRowKeys, selectedRows, searchValue]);

  // Build table props
  const tableProps: TableProps<T> = {
    dataSource: config.dataSource,
    columns,
    rowKey: config.rowKey || 'id',
    loading: config.loading,
    pagination: config.pagination,
    size: config.size,
    bordered: config.bordered,
    showHeader: config.showHeader,
    sticky: config.sticky,
    scroll: config.virtual 
      ? { x: config.virtualScrollX || 'max-content', y: config.virtualHeight || 400, ...config.scroll }
      : config.scroll,
    rowSelection,
    expandable: config.expandable,
    onRow: config.onRow,
    locale: config.emptyText ? { emptyText: config.emptyText } : undefined,
    virtual: config.virtual,
  };

  return React.createElement(
    React.Fragment,
    {},
    headerElement,
    React.createElement(Table, tableProps as any),
  );
}) as <T extends object>(props: ListComponentProps<T>) => React.ReactElement | null;
