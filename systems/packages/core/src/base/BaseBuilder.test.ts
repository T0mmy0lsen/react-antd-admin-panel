import { describe, it, expect } from 'vitest';
import { BaseBuilder } from './BaseBuilder';

class TestBuilder extends BaseBuilder {
  render() {
    return null;
  }
}

describe('BaseBuilder', () => {
  it('should create an instance', () => {
    const builder = new TestBuilder();
    expect(builder).toBeDefined();
  });

  it('should set key', () => {
    const builder = new TestBuilder();
    builder.key('testKey');
    expect(builder['_key']).toBe('testKey');
  });

  it('should set disabled', () => {
    const builder = new TestBuilder();
    builder.disabled(true);
    expect(builder['_config'].disabled).toBe(true);
  });

  it('should set hidden', () => {
    const builder = new TestBuilder();
    builder.hidden(true);
    expect(builder['_config'].hidden).toBe(true);
  });

  it('should support method chaining', () => {
    const builder = new TestBuilder();
    const result = builder.key('test').disabled(true).hidden(false);
    expect(result).toBe(builder);
  });
});
