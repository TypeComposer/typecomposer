import { describe, it, expect } from 'vitest';
import { DivElement, SpanElement } from '../src';
import { render } from './utils';

describe('TypeComposer Component Rendering', () => {
  it('should render a DivElement and set its text content', () => {
    // Create and mount the DivElement using our rendering utility
    const div = render(new DivElement({ text: 'Hello, TypeComposer!' }));

    // Verify it is a Div element and text is set correctly
    expect(div).toBeInstanceOf(window.HTMLDivElement);
    expect(div.textContent).toBe('Hello, TypeComposer!');
    expect(document.body.contains(div)).toBe(true);
  });

  it('should render a SpanElement with styles', () => {
    // Create and mount the SpanElement with text and styles
    const span = render(new SpanElement({
      text: 'Styled Span',
      style: { color: 'rgb(255, 0, 0)', fontWeight: 'bold' }
    }));

    expect(span).toBeInstanceOf(window.HTMLSpanElement);
    expect(span.textContent).toBe('Styled Span');
    expect(span.style.color).toBe('rgb(255, 0, 0)');
    expect(span.style.fontWeight).toBe('bold');
    expect(document.body.contains(span)).toBe(true);
  });
});