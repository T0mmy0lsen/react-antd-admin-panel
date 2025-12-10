import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Loader } from './Loader';
import { Get } from './Get';
import { Post } from './Post';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      request: vi.fn(),
      defaults: { headers: { common: {} } }
    }))
  }
}));

describe('Loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create an instance', () => {
    const loader = new Loader();
    expect(loader).toBeInstanceOf(Loader);
  });

  it('should add requests', () => {
    const loader = new Loader()
      .add('users', new Get().target('/api/users'))
      .add('posts', new Get().target('/api/posts'));
    
    expect((loader as any)._requests).toHaveLength(2);
  });

  it('should execute requests in parallel by default', async () => {
    const get1 = new Get().target('/api/users');
    const get2 = new Get().target('/api/posts');
    
    vi.spyOn(get1, 'execute').mockResolvedValue([{ id: 1 }]);
    vi.spyOn(get2, 'execute').mockResolvedValue([{ id: 2 }]);

    const loader = new Loader()
      .add('users', get1)
      .add('posts', get2);

    const data = await loader.execute();
    
    expect(data.users).toEqual([{ id: 1 }]);
    expect(data.posts).toEqual([{ id: 2 }]);
  });

  it('should execute requests sequentially when parallel(false)', async () => {
    const get1 = new Get().target('/api/users');
    const get2 = new Get().target('/api/posts');
    
    vi.spyOn(get1, 'execute').mockResolvedValue([{ id: 1 }]);
    vi.spyOn(get2, 'execute').mockResolvedValue([{ id: 2 }]);

    const loader = new Loader()
      .parallel(false)
      .add('users', get1)
      .add('posts', get2);

    const data = await loader.execute();
    
    expect(data.users).toEqual([{ id: 1 }]);
    expect(data.posts).toEqual([{ id: 2 }]);
  });

  it('should skip requests with failing conditions', async () => {
    const get1 = new Get().target('/api/users');
    const get2 = new Get().target('/api/admin');
    
    vi.spyOn(get1, 'execute').mockResolvedValue({ role: 'user' });
    const spy2 = vi.spyOn(get2, 'execute');

    const loader = new Loader()
      .parallel(false)
      .add('user', get1)
      .add('admin', get2, {
        condition: (data) => data.user?.role === 'admin'
      });

    const data = await loader.execute();
    
    expect(data.user.role).toBe('user');
    expect(data.admin).toBeUndefined();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('should execute conditional requests when condition passes', async () => {
    const get1 = new Get().target('/api/users');
    const get2 = new Get().target('/api/admin');
    
    vi.spyOn(get1, 'execute').mockResolvedValue({ role: 'admin' });
    vi.spyOn(get2, 'execute').mockResolvedValue({ permissions: ['all'] });

    const loader = new Loader()
      .parallel(false)
      .add('user', get1)
      .add('admin', get2, {
        condition: (data) => data.user?.role === 'admin'
      });

    const data = await loader.execute();
    
    expect(data.user.role).toBe('admin');
    expect(data.admin.permissions).toEqual(['all']);
  });

  it('should call onBeforeLoad hook', async () => {
    const beforeLoad = vi.fn();
    const loader = new Loader().onBeforeLoad(beforeLoad);
    
    await loader.execute();
    expect(beforeLoad).toHaveBeenCalledOnce();
  });

  it('should call onLoad hook with data', async () => {
    const onLoad = vi.fn();
    const get = new Get().target('/api/users');
    vi.spyOn(get, 'execute').mockResolvedValue([{ id: 1 }]);

    const loader = new Loader()
      .add('users', get)
      .onLoad(onLoad);
    
    await loader.execute();
    expect(onLoad).toHaveBeenCalledWith({ users: [{ id: 1 }] });
  });

  it('should call onAfterLoad hook', async () => {
    const afterLoad = vi.fn();
    const loader = new Loader().onAfterLoad(afterLoad);
    
    await loader.execute();
    expect(afterLoad).toHaveBeenCalledOnce();
  });

  it('should call onError hook on failure', async () => {
    const onError = vi.fn();
    const get = new Get().target('/api/users');
    vi.spyOn(get, 'execute').mockRejectedValue(new Error('Network error'));

    const loader = new Loader()
      .add('users', get, { required: true })
      .onError(onError);
    
    await expect(loader.execute()).rejects.toThrow('Network error');
    expect(onError).toHaveBeenCalled();
  });

  it('should continue on non-required request failure', async () => {
    const get1 = new Get().target('/api/users');
    const get2 = new Get().target('/api/posts');
    
    vi.spyOn(get1, 'execute').mockRejectedValue(new Error('Failed'));
    vi.spyOn(get2, 'execute').mockResolvedValue([{ id: 2 }]);

    const loader = new Loader()
      .add('users', get1, { required: false })
      .add('posts', get2);

    const data = await loader.execute();
    
    expect(data.users).toBeNull();
    expect(data.posts).toEqual([{ id: 2 }]);
  });

  it('should abort on error when abortOnError(true)', async () => {
    const get1 = new Get().target('/api/users');
    const get2 = new Get().target('/api/posts');
    
    vi.spyOn(get1, 'execute').mockRejectedValue(new Error('Failed'));
    const spy2 = vi.spyOn(get2, 'execute');

    const loader = new Loader()
      .abortOnError(true)
      .add('users', get1)
      .add('posts', get2);

    await expect(loader.execute()).rejects.toThrow('Failed');
  });

  it('should create loader from config', () => {
    const loader = Loader.from({
      requests: [
        { key: 'users', request: new Get().target('/api/users') }
      ],
      parallel: false,
      abortOnError: true
    });

    expect((loader as any)._requests).toHaveLength(1);
    expect((loader as any)._parallel).toBe(false);
    expect((loader as any)._abortOnError).toBe(true);
  });
});
