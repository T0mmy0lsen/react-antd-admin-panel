import { describe, it, expect } from 'vitest';
import { createMockHttp, MockHttp } from './createMockHttp';

describe('createMockHttp', () => {
  it('should create a MockHttp instance', () => {
    const mockHttp = createMockHttp();
    expect(mockHttp).toBeInstanceOf(MockHttp);
  });

  it('should handle GET requests with mocked responses', async () => {
    const mockHttp = createMockHttp()
      .onGet('/api/users', { data: [{ id: 1, name: 'John' }] });

    const response = await mockHttp.get('/api/users');
    expect(response.data).toEqual([{ id: 1, name: 'John' }]);
    expect(response.status).toBe(200);
  });

  it('should handle POST requests with mocked responses', async () => {
    const mockHttp = createMockHttp()
      .onPost('/api/users', { data: { id: 2, name: 'Jane' }, status: 201 });

    const response = await mockHttp.post('/api/users', { name: 'Jane' });
    expect(response.data).toEqual({ id: 2, name: 'Jane' });
    expect(response.status).toBe(201);
  });

  it('should throw error for unregistered endpoints', async () => {
    const mockHttp = createMockHttp();
    
    await expect(mockHttp.get('/api/unknown')).rejects.toThrow(
      'No mock handler registered for /api/unknown'
    );
  });

  it('should throw configured errors', async () => {
    const mockHttp = createMockHttp()
      .onGet('/api/error', { error: new Error('Server error') });

    await expect(mockHttp.get('/api/error')).rejects.toThrow('Server error');
  });

  it('should support delay simulation', async () => {
    const mockHttp = createMockHttp()
      .onGet('/api/slow', { data: 'done', delay: 50 });

    const start = Date.now();
    await mockHttp.get('/api/slow');
    const elapsed = Date.now() - start;
    
    expect(elapsed).toBeGreaterThanOrEqual(45); // Allow small variance
  });

  it('should support default delay via config', async () => {
    const mockHttp = createMockHttp({ defaultDelay: 30 })
      .onGet('/api/test', { data: 'ok' });

    const start = Date.now();
    await mockHttp.get('/api/test');
    const elapsed = Date.now() - start;
    
    expect(elapsed).toBeGreaterThanOrEqual(25);
  });

  it('should clear all handlers', () => {
    const mockHttp = createMockHttp()
      .onGet('/api/a', { data: 'a' })
      .onPost('/api/b', { data: 'b' })
      .clear();

    expect(mockHttp.getRegisteredGetHandlers()).toHaveLength(0);
    expect(mockHttp.getRegisteredPostHandlers()).toHaveLength(0);
  });

  it('should list registered handlers', () => {
    const mockHttp = createMockHttp()
      .onGet('/api/users', { data: [] })
      .onGet('/api/posts', { data: [] })
      .onPost('/api/users', { data: {} });

    expect(mockHttp.getRegisteredGetHandlers()).toEqual(['/api/users', '/api/posts']);
    expect(mockHttp.getRegisteredPostHandlers()).toEqual(['/api/users']);
  });
});
