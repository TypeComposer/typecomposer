import { describe, it, expect, vi } from 'vitest';
import { ButtonElement, DivElement, SpanElement } from '../src';
import { EventComponent } from '../src/core/event';
import { render } from './utils';

describe('TypeComposer event binding', () => {
  describe('native DOM events via addEventListener', () => {
    it('should fire a click listener attached to ButtonElement', () => {
      const btn = render(new ButtonElement({ text: 'Press' }));
      const handler = vi.fn();

      btn.addEventListener('click', handler);
      btn.click();

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should fire a click listener multiple times on multiple clicks', () => {
      const btn = render(new ButtonElement({ text: 'Multi' }));
      const handler = vi.fn();

      btn.addEventListener('click', handler);
      btn.click();
      btn.click();
      btn.click();

      expect(handler).toHaveBeenCalledTimes(3);
    });

    it('should stop firing after removeEventListener', () => {
      const btn = render(new ButtonElement({ text: 'Remove' }));
      const handler = vi.fn();

      btn.addEventListener('click', handler);
      btn.click();
      expect(handler).toHaveBeenCalledTimes(1);

      btn.removeEventListener('click', handler);
      btn.click();
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('native click on DivElement', () => {
    it('should fire a click event on a DivElement', () => {
      const div = render(new DivElement({ text: 'Clickable Div' }));
      const handler = vi.fn();

      div.addEventListener('click', handler);
      div.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('event bubbling from child to parent', () => {
    it('should bubble a click from SpanElement up to a containing DivElement', () => {
      const span = new SpanElement({ text: 'inner' });
      const div = render(new DivElement({ children: [span] }));
      const handler = vi.fn();

      div.addEventListener('click', handler);
      span.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should not bubble when bubbles is false', () => {
      const span = new SpanElement({ text: 'no-bubble' });
      const div = render(new DivElement({ children: [span] }));
      const handler = vi.fn();

      div.addEventListener('click', handler);
      span.dispatchEvent(new MouseEvent('click', { bubbles: false }));

      expect(handler).toHaveBeenCalledTimes(0);
    });
  });

  describe('EventComponent pub/sub system', () => {
    it('should emit and receive a custom event', () => {
      const listener = vi.fn();
      const container = render(new DivElement());

      // Create the event channel first with initial data, then subscribe;
      // because isInit is true, the listener fires immediately on addEventListener
      EventComponent.createEvent('test:greet', 'world');
      EventComponent.addEventListener(container as any, 'test:greet', listener);

      expect(listener).toHaveBeenCalledWith('world');

      // Emit again with new data
      EventComponent.emitEvent('test:greet', 'again');
      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener).toHaveBeenLastCalledWith('again');

      // Clean up global event channel to avoid cross-test pollution
      EventComponent.deleteEvent('test:greet');
    });

    it('should create an event channel without initial data and receive emits', () => {
      const listener = vi.fn();
      const container = render(new DivElement());

      // No data passed → isInit stays false → listener must NOT fire immediately
      EventComponent.createEvent('test:ping');
      EventComponent.addEventListener(container as any, 'test:ping', listener);

      expect(listener).not.toHaveBeenCalled();

      EventComponent.emitEvent('test:ping', 42);
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(42);

      EventComponent.deleteEvent('test:ping');
    });

    it('should stop receiving events after removeEventListener', () => {
      const listener = vi.fn();
      const container = render(new DivElement());

      EventComponent.createEvent('test:bye');
      EventComponent.addEventListener(container as any, 'test:bye', listener);

      EventComponent.emitEvent('test:bye', 'hello');
      expect(listener).toHaveBeenCalledTimes(1);

      EventComponent.removeEventListener(container as any, 'test:bye');
      EventComponent.emitEvent('test:bye', 'ignored');

      // Count must stay at 1 after removal
      expect(listener).toHaveBeenCalledTimes(1);

      EventComponent.deleteEvent('test:bye');
    });

    it('should support multiple subscribers on the same event channel', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const el1 = render(new DivElement());
      const el2 = render(new DivElement());

      EventComponent.createEvent('test:broadcast');
      EventComponent.addEventListener(el1 as any, 'test:broadcast', listener1);
      EventComponent.addEventListener(el2 as any, 'test:broadcast', listener2);

      EventComponent.emitEvent('test:broadcast', 'ping');

      expect(listener1).toHaveBeenCalledWith('ping');
      expect(listener2).toHaveBeenCalledWith('ping');

      EventComponent.deleteEvent('test:broadcast');
    });
  });
});