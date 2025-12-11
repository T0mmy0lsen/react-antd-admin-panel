import { List } from '../list';

/**
 * createMockList - Create a mock List builder for testing
 * 
 * @example
 * import { createMockList } from 'react-antd-admin-panel/testing';
 * 
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 * 
 * const mockList = createMockList<User>({
 *   data: [
 *     { id: '1', name: 'John Doe', email: 'john@example.com' },
 *     { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
 *   ],
 *   loading: false,
 *   pagination: { pageSize: 10, current: 1, total: 2 },
 * });
 * 
 * // The list is ready to use with pre-configured data
 * mockList.column('name', 'Name').column('email', 'Email');
 */

export interface MockListOptions<T = any> {
  /** Test data to populate the list */
  data?: T[];
  /** Row key field (default: 'id') */
  rowKey?: string | ((record: T) => string);
  /** Loading state */
  loading?: boolean;
  /** Pagination configuration */
  pagination?: false | {
    pageSize?: number;
    current?: number;
    total?: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
  };
  /** Simulate empty state */
  empty?: boolean;
  /** Custom empty text */
  emptyText?: string;
}

/**
 * Create a mock List with test configuration
 */
export function createMockList<T extends object = any>(options: MockListOptions<T> = {}): List<T> {
  const list = new List<T>();

  // Set row key
  if (options.rowKey) {
    list.rowKey(options.rowKey);
  } else {
    list.rowKey('id');
  }

  // Set data source
  if (options.empty) {
    list.dataSource([]);
  } else if (options.data) {
    list.dataSource(options.data);
  }

  // Set loading state
  if (options.loading !== undefined) {
    list.loading(options.loading);
  }

  // Set pagination
  if (options.pagination !== undefined) {
    list.pagination(options.pagination);
  }

  // Set empty text
  if (options.emptyText) {
    list.emptyText(options.emptyText);
  }

  return list;
}
