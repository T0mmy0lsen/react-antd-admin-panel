import { describe, it, expect, vi } from 'vitest';
import { GlobalStore } from './Store';

describe('GlobalStore', () => {
  it('should create an instance', () => {
    const store = new GlobalStore();
    expect(store).toBeDefined();
  });

  describe('get/set', () => {
    it('should set and get a value', () => {
      const store = new GlobalStore();
      store.set('key1', 'value1');
      expect(store.get('key1')).toBe('value1');
    });

    it('should return undefined for non-existent key', () => {
      const store = new GlobalStore();
      expect(store.get('nonexistent')).toBeUndefined();
    });

    it('should support updater function', () => {
      const store = new GlobalStore();
      store.set('count', 0);
      store.set('count', (prev: number) => prev + 1);
      expect(store.get('count')).toBe(1);
    });

    it('should handle complex objects', () => {
      const store = new GlobalStore();
      const obj = { name: 'Test', items: [1, 2, 3] };
      store.set('data', obj);
      expect(store.get('data')).toEqual(obj);
    });
  });

  describe('remove', () => {
    it('should remove a value', () => {
      const store = new GlobalStore();
      store.set('key1', 'value1');
      store.remove('key1');
      expect(store.get('key1')).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('should clear all values', () => {
      const store = new GlobalStore();
      store.set('key1', 'value1');
      store.set('key2', 'value2');
      store.clear();
      expect(store.get('key1')).toBeUndefined();
      expect(store.get('key2')).toBeUndefined();
    });
  });

  describe('has', () => {
    it('should return true for existing key', () => {
      const store = new GlobalStore();
      store.set('key1', 'value1');
      expect(store.has('key1')).toBe(true);
    });

    it('should return false for non-existent key', () => {
      const store = new GlobalStore();
      expect(store.has('nonexistent')).toBe(false);
    });
  });

  describe('keys', () => {
    it('should return all keys', () => {
      const store = new GlobalStore();
      store.set('a', 1);
      store.set('b', 2);
      store.set('c', 3);
      expect(store.keys()).toEqual(['a', 'b', 'c']);
    });
  });

  describe('subscribe', () => {
    it('should notify subscriber on set', () => {
      const store = new GlobalStore();
      const callback = vi.fn();
      store.subscribe('key1', callback);
      store.set('key1', 'value1');
      expect(callback).toHaveBeenCalledWith('value1');
    });

    it('should notify subscriber on remove', () => {
      const store = new GlobalStore();
      const callback = vi.fn();
      store.set('key1', 'value1');
      store.subscribe('key1', callback);
      store.remove('key1');
      expect(callback).toHaveBeenCalledWith(undefined);
    });

    it('should unsubscribe correctly', () => {
      const store = new GlobalStore();
      const callback = vi.fn();
      const unsubscribe = store.subscribe('key1', callback);
      unsubscribe();
      store.set('key1', 'value1');
      expect(callback).not.toHaveBeenCalled();
    });

    it('should support multiple subscribers', () => {
      const store = new GlobalStore();
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      store.subscribe('key1', callback1);
      store.subscribe('key1', callback2);
      store.set('key1', 'value1');
      expect(callback1).toHaveBeenCalledWith('value1');
      expect(callback2).toHaveBeenCalledWith('value1');
    });
  });

  describe('toObject', () => {
    it('should return store as plain object', () => {
      const store = new GlobalStore();
      store.set('a', 1);
      store.set('b', 'test');
      expect(store.toObject()).toEqual({ a: 1, b: 'test' });
    });
  });
});
