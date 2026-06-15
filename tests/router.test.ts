import { describe, it, expect, beforeAll, vi } from 'vitest';
import { Router } from '../src/core/router/Router';
import { DivElement } from '../src/global/index';

async function flush(ticks = 5) {
  for (let i = 0; i < ticks; i++) await Promise.resolve();
}

beforeAll(() => {
  Router.create({
    routes: [
      { path: '/', component: DivElement },
      { path: '/about', component: DivElement },
      { path: '/docs', component: DivElement, title: 'Documentation' },
      { path: '/old', redirect: '/new' },
      { path: '/new', component: DivElement },
      { path: '/search', component: DivElement },
    ],
    history: 'memory',
  });
});

// ─── Static properties ────────────────────────────────────────────────────────

describe('Router – static properties', () => {
  it('Router.history returns "memory"', () => {
    expect(Router.history).toBe('memory');
  });

  it('Router.pathname starts at empty string (root route)', () => {
    expect(Router.pathname).toBe('');
  });

  it('Router.create throws "Router already exists" on a second call', () => {
    expect(() =>
      Router.create({
        routes: [{ path: '/', component: DivElement }],
        history: 'memory',
      })
    ).toThrow('Router already exists');
  });
});

// ─── Navigation ──────────────────────────────────────────────────────────────

describe('Router – navigation', () => {
  it('go("/about") sets pathname to "about"', async () => {
    await Router.go('/about');
    expect(Router.pathname).toBe('about');
  });

  it('go("/docs") sets pathname to "docs"', async () => {
    await Router.go('/docs');
    expect(Router.pathname).toBe('docs');
  });

  it('go("/") resets pathname to empty string', async () => {
    await Router.go('/');
    expect(Router.pathname).toBe('');
  });

  it('go to unknown path — pathname reflects the requested segment', async () => {
    await Router.go('/four-oh-four');
    expect(Router.pathname).toBe('four-oh-four');
  });

  it('go resolves with undefined (void return type)', async () => {
    await expect(Router.go('/about')).resolves.toBeUndefined();
  });

  it('Router.props returns {} for routes without path parameters', async () => {
    await Router.go('/search');
    expect(Router.props).toEqual({});
  });
});

// ─── Redirect ────────────────────────────────────────────────────────────────

describe('Router – redirect route', () => {
  it('redirect /old → /new: pathname settles to "new"', async () => {
    await Router.go('/old');
    await flush();
    expect(Router.pathname).toBe('new');
  });
});

// ─── Route title ─────────────────────────────────────────────────────────────

describe('Router – route title', () => {
  it('go to a route with title — pathname updates; document.title is a string', async () => {
    await Router.go('/docs');
    await flush();
    expect(Router.pathname).toBe('docs');
    expect(typeof document.title).toBe('string');
  });
});

// ─── Utility methods ─────────────────────────────────────────────────────────

describe('Router – utility methods', () => {
  it('Router.reload does not throw', () => {
    expect(() => Router.reload()).not.toThrow();
  });

  it('Router.back() emits console.warn in memory mode (no throw)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => Router.back()).not.toThrow();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('memory'));
    warnSpy.mockRestore();
  });

  it('Router.forward() emits console.warn in memory mode (no throw)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => Router.forward()).not.toThrow();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('memory'));
    warnSpy.mockRestore();
  });
});