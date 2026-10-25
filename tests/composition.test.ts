import { describe, it, expect } from 'vitest';
import { DivElement, SpanElement, ButtonElement, HBox, VBox } from '../src';
import { render } from './utils';

describe('TypeComposer component composition and nesting', () => {
  describe('DivElement with child SpanElement', () => {
    it('should nest a SpanElement inside a DivElement', () => {
      const span = new SpanElement({ text: 'inner' });
      const div = render(new DivElement({ children: [span] }));

      expect(div).toBeInstanceOf(window.HTMLDivElement);
      expect(div.contains(span)).toBe(true);
      expect(span.textContent).toBe('inner');
    });

    it('should allow multiple children in a DivElement', () => {
      const span1 = new SpanElement({ text: 'first' });
      const span2 = new SpanElement({ text: 'second' });
      const div = render(new DivElement({ children: [span1, span2] }));

      expect(div.childElementCount).toBe(2);
      expect(div.children[0].textContent).toBe('first');
      expect(div.children[1].textContent).toBe('second');
    });
  });

  describe('HBox layout composition', () => {
    it('should render HBox and contain appended children', () => {
      const spanA = new SpanElement({ text: 'A' });
      const spanB = new SpanElement({ text: 'B' });
      const hbox = render(new HBox({ children: [spanA, spanB] }));

      expect(hbox).toBeInstanceOf(window.HTMLElement);
      expect(hbox.contains(spanA)).toBe(true);
      expect(hbox.contains(spanB)).toBe(true);
    });

    it('should be present in document body after render', () => {
      const hbox = render(new HBox({ children: [new SpanElement({ text: 'Hi' })] }));
      expect(document.body.contains(hbox)).toBe(true);
    });
  });

  describe('VBox layout composition', () => {
    it('should render VBox with stacked children', () => {
      const item1 = new DivElement({ text: 'Row 1' });
      const item2 = new DivElement({ text: 'Row 2' });
      const vbox = render(new VBox({ children: [item1, item2] }));

      expect(vbox).toBeInstanceOf(window.HTMLElement);
      expect(vbox.contains(item1)).toBe(true);
      expect(vbox.contains(item2)).toBe(true);
      expect(item1.textContent).toBe('Row 1');
      expect(item2.textContent).toBe('Row 2');
    });
  });

  describe('HBox nested inside VBox', () => {
    it('should support HBox inside VBox (two-level nesting)', () => {
      const label = new SpanElement({ text: 'label' });
      const hbox = new HBox({ children: [label] });
      const vbox = render(new VBox({ children: [hbox] }));

      expect(vbox.contains(hbox)).toBe(true);
      expect(hbox.contains(label)).toBe(true);
      expect(label.textContent).toBe('label');
    });
  });

  describe('ButtonElement inside a container', () => {
    it('should render a ButtonElement inside a DivElement', () => {
      const btn = new ButtonElement({ text: 'Click me' });
      const container = render(new DivElement({ children: [btn] }));

      expect(container.contains(btn)).toBe(true);
      expect(btn).toBeInstanceOf(window.HTMLButtonElement);
      expect(btn.textContent).toBe('Click me');
    });
  });

  describe('style propagation on nested elements', () => {
    it('should apply style to a SpanElement nested in DivElement', () => {
      const span = new SpanElement({
        text: 'styled child',
        style: { color: 'rgb(0, 128, 0)', fontSize: '14px' },
      });
      const div = render(new DivElement({ children: [span] }));

      expect(div.contains(span)).toBe(true);
      expect(span.style.color).toBe('rgb(0, 128, 0)');
      expect(span.style.fontSize).toBe('14px');
    });
  });
});