import { afterEach } from 'vitest';

const mountedComponents = new Set<HTMLElement>();

/**
 * Renders a component by appending it to document.body.
 * Keeps track of mounted elements to clean them up after each test.
 */
export function render<T extends HTMLElement>(component: T): T {
  document.body.appendChild(component);
  mountedComponents.add(component);
  return component;
}

afterEach(() => {
  for (const component of mountedComponents) {
    if (component.parentNode) {
      component.remove();
    }
  }
  mountedComponents.clear();
  document.body.innerHTML = '';
});