import { describe, it, expect } from 'vitest';
import { Condition, ConditionGroup } from './Condition';

describe('Condition', () => {
  it('should create an instance', () => {
    const condition = new Condition();
    expect(condition).toBeInstanceOf(Condition);
  });

  it('should add conditional items', () => {
    const condition = new Condition()
      .add('admin', () => true, 'Admin content')
      .add('user', () => false, 'User content');
    
    expect(condition.count()).toBe(2);
  });

  it('should render first matching condition', () => {
    const condition = new Condition()
      .data({ role: 'admin' })
      .when((data) => data.role === 'admin', 'Admin Panel')
      .when((data) => data.role === 'user', 'User Panel');
    
    const result = condition.render();
    expect(result).toBe('Admin Panel');
  });

  it('should render default when no conditions match', () => {
    const condition = new Condition()
      .data({ role: 'guest' })
      .when((data) => data.role === 'admin', 'Admin Panel')
      .default('Guest Panel');
    
    const result = condition.render();
    expect(result).toBe('Guest Panel');
  });

  it('should support otherwise() alias for default()', () => {
    const condition = new Condition()
      .data({ role: 'guest' })
      .when((data) => data.role === 'admin', 'Admin Panel')
      .otherwise('Guest Panel');
    
    const result = condition.render();
    expect(result).toBe('Guest Panel');
  });

  it('should render null when no conditions match and no default', () => {
    const condition = new Condition()
      .data({ role: 'guest' })
      .when((data) => data.role === 'admin', 'Admin Panel');
    
    const result = condition.render();
    expect(result).toBeNull();
  });

  it('should support function content', () => {
    const condition = new Condition()
      .data({ name: 'John' })
      .when(() => true, () => 'Generated content');
    
    const result = condition.render();
    expect(result).toBe('Generated content');
  });

  it('should clear conditions', () => {
    const condition = new Condition()
      .when(() => true, 'Content')
      .default('Default');
    
    condition.clear();
    expect(condition.count()).toBe(0);
  });

  it('should render null when hidden', () => {
    const condition = new Condition()
      .hidden(true)
      .when(() => true, 'Content');
    
    const result = condition.render();
    expect(result).toBeNull();
  });
});

describe('ConditionGroup', () => {
  it('should create an instance', () => {
    const group = new ConditionGroup();
    expect(group).toBeInstanceOf(ConditionGroup);
  });

  it('should add conditions', () => {
    const group = new ConditionGroup()
      .add('admin', () => true, 'Admin content')
      .add('user', () => false, 'User content');
    
    expect((group as any)._conditions.size).toBe(2);
  });

  it('should check conditions and update active keys', () => {
    const group = new ConditionGroup()
      .add('admin', (data) => data.role === 'admin', 'Admin')
      .add('user', (data) => data.role === 'user', 'User')
      .checkCondition({ role: 'admin' });
    
    const activeKeys = group.getActiveKeys();
    expect(activeKeys).toEqual(['admin']);
  });

  it('should render multiple matching conditions', () => {
    const group = new ConditionGroup()
      .add('a', () => true, 'Content A')
      .add('b', () => true, 'Content B')
      .checkCondition();
    
    expect(group.getActiveKeys()).toHaveLength(2);
  });

  it('should clear conditions', () => {
    const group = new ConditionGroup()
      .add('admin', () => true, 'Admin')
      .clear();
    
    expect((group as any)._conditions.size).toBe(0);
    expect(group.getActiveKeys()).toHaveLength(0);
  });

  it('should update active keys when checkCondition called with new data', () => {
    const group = new ConditionGroup()
      .add('admin', (data) => data?.role === 'admin', 'Admin')
      .add('user', (data) => data?.role === 'user', 'User');
    
    group.checkCondition({ role: 'admin' });
    expect(group.getActiveKeys()).toEqual(['admin']);
    
    group.checkCondition({ role: 'user' });
    expect(group.getActiveKeys()).toEqual(['user']);
  });
});
