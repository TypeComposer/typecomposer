import { describe, it, expect } from 'vitest';
import { DivElement, SpanElement } from '../src';

describe('TypeComposer Component Rendering', () => {
  it('should render a DivElement and set its text content', () => {
    // Create an instance of DivElement
    const div = new DivElement({ text: 'Hello, TypeComposer!' });

    // Verify it is a Div element and text is set correctly
    expect(div).toBeInstanceOf(window.HTMLDivElement);
    expect(div.textContent).toBe('Hello, TypeComposer!');
  });

  it('should render a SpanElement with styles', () => {
    // Create an instance of SpanElement with text and styles
    const span = new SpanElement({
      text: 'Styled Span',
      style: { color: 'rgb(255, 0, 0)', fontWeight: 'bold' }
    });

    expect(span).toBeInstanceOf(window.HTMLSpanElement);
    expect(span.textContent).toBe('Styled Span');
    expect(span.style.color).toBe('rgb(255, 0, 0)');
    expect(span.style.fontWeight).toBe('bold');
  });
});