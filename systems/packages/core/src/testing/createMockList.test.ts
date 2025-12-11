import { describe, it, expect } from 'vitest';
import { createMockList } from './createMockList';

interface TestUser {
  id: string;
  name: string;
  email: string;
}

describe('createMockList', () => {
  it('should create a List with default rowKey', () => {
    const list = createMockList<TestUser>();
    const config = list.getConfig();
    expect(config.rowKey).toBe('id');
  });

  it('should accept custom rowKey', () => {
    const list = createMockList<TestUser>({ rowKey: 'email' });
    const config = list.getConfig();
    expect(config.rowKey).toBe('email');
  });

  it('should set data source from options', () => {
    const testData: TestUser[] = [
      { id: '1', name: 'John', email: 'john@test.com' },
      { id: '2', name: 'Jane', email: 'jane@test.com' },
    ];
    
    const list = createMockList<TestUser>({ data: testData });
    const config = list.getConfig();
    expect(config.dataSource).toEqual(testData);
  });

  it('should set loading state', () => {
    const list = createMockList<TestUser>({ loading: true });
    const config = list.getConfig();
    expect(config.loading).toBe(true);
  });

  it('should set pagination config', () => {
    const pagination = { pageSize: 20, current: 2, total: 100 };
    const list = createMockList<TestUser>({ pagination });
    const config = list.getConfig();
    expect(config.pagination).toEqual(pagination);
  });

  it('should support disabled pagination', () => {
    const list = createMockList<TestUser>({ pagination: false });
    const config = list.getConfig();
    expect(config.pagination).toBe(false);
  });

  it('should set empty state', () => {
    const list = createMockList<TestUser>({ empty: true });
    const config = list.getConfig();
    expect(config.dataSource).toEqual([]);
  });

  it('should set custom empty text', () => {
    const list = createMockList<TestUser>({ emptyText: 'No users found' });
    const config = list.getConfig();
    expect(config.emptyText).toBe('No users found');
  });

  it('should allow chaining additional methods', () => {
    const list = createMockList<TestUser>({
      data: [{ id: '1', name: 'Test', email: 'test@test.com' }],
    })
      .column('name', 'Name')
      .column('email', 'Email');
    
    const config = list.getConfig();
    expect(config.columns).toHaveLength(2);
    expect(config.columns?.[0].key).toBe('name');
    expect(config.columns?.[1].key).toBe('email');
  });

  it('should work with function rowKey', () => {
    const list = createMockList<TestUser>({
      rowKey: (record) => record.email,
    });
    const config = list.getConfig();
    expect(typeof config.rowKey).toBe('function');
  });
});
