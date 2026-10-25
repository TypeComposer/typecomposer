import { describe, it, expect, vi } from 'vitest';
import { render } from './utils';
import { TextField } from '../src/core/components/text-field/TextField';
import { CheckBox, CheckBoxGroup } from '../src/core/components/check-box/CheckBox';
import { SwitchPanel } from '../src/core/components/switch-panel/SwitchPanel';

// ─── TextField ────────────────────────────────────────────────────────────────

describe('TextField', () => {
  it('renders into the DOM as a TypeComposer custom element', () => {
    const tf = render(new TextField({ label: 'Name' }));
    expect(document.body.contains(tf)).toBe(true);
  });

  it('has a truthy inputElement property', () => {
    const tf = render(new TextField({}));
    expect(tf.inputElement).toBeTruthy();
  });

  it('inputElement is a tc-input-element (TypeComposer custom element)', () => {
    const tf = render(new TextField({}));
    expect(tf.inputElement.tagName.toLowerCase()).toBe('tc-input-element');
  });

  it('sets the placeholder on the inner input', () => {
    const tf = render(new TextField({ placeholder: 'Enter text…' }));
    expect(tf.placeholder).toBe('Enter text…');
    expect(tf.inputElement.placeholder).toBe('Enter text…');
  });

  it('sets the initial value on the inner input', () => {
    const tf = render(new TextField({ value: 'hello' }));
    expect(tf.value).toBe('hello');
  });

  it('sets name via the name setter', () => {
    const tf = render(new TextField({}));
    tf.name = 'username';
    expect(tf.name).toBe('username');
    expect(tf.inputElement.name).toBe('username');
  });

  it('disables the component when disabled is true', () => {
    const tf = render(new TextField({ disabled: true }));
    expect(tf.disabled).toBe(true);
    expect(tf.inputElement.disabled).toBe(true);
  });

  it('enables the component when disabled is set to false', () => {
    const tf = render(new TextField({ disabled: true }));
    tf.disabled = false;
    expect(tf.disabled).toBe(false);
    expect(tf.inputElement.disabled).toBe(false);
  });

  it('sets input type via the type setter', () => {
    const tf = render(new TextField({ type: 'password' }));
    expect(tf.type).toBe('password');
    expect(tf.inputElement.type).toBe('password');
  });

  it('appends a LabelElement child when label prop is provided', () => {
    const tf = render(new TextField({ label: 'Email' }));
    const label = tf.querySelector('tc-label-element');
    expect(label).toBeTruthy();
  });

  it('does not append a LabelElement when label prop is omitted', () => {
    const tf = render(new TextField({}));
    const label = tf.querySelector('tc-label-element');
    expect(label).toBeNull();
  });

  it('forwards "input" events from inner input to the host element', () => {
    const tf = render(new TextField({}));
    let fired = false;
    tf.addEventListener('input', () => { fired = true; });
    tf.inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    expect(fired).toBe(true);
  });

  it('forwards "change" events from inner input to the host element', () => {
    const tf = render(new TextField({}));
    let fired = false;
    tf.addEventListener('change', () => { fired = true; });
    tf.inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    expect(fired).toBe(true);
  });
});

// ─── CheckBox ─────────────────────────────────────────────────────────────────

describe('CheckBox', () => {
  it('renders into the DOM', () => {
    const cb = render(new CheckBox());
    expect(document.body.contains(cb)).toBe(true);
  });

  it('contains an inner InputElement with type="checkbox"', () => {
    const cb = render(new CheckBox());
    expect(cb.inputElement.type).toBe('checkbox');
  });

  it('is unchecked by default', () => {
    const cb = render(new CheckBox());
    expect(cb.checked).toBe(false);
  });

  it('is checked when checked:true is passed in constructor', () => {
    const cb = render(new CheckBox({ checked: true }));
    expect(cb.checked).toBe(true);
  });

  it('checked setter updates the component and inner input', () => {
    const cb = render(new CheckBox());
    cb.checked = true;
    expect(cb.checked).toBe(true);
    expect(cb.inputElement.checked).toBe(true);
  });

  it('sets value via the value prop', () => {
    const cb = render(new CheckBox({ value: 'agree' }));
    expect(cb.value).toBe('agree');
  });

  it('sets name via the name prop', () => {
    const cb = render(new CheckBox({ name: 'terms' }));
    expect(cb.name).toBe('terms');
  });

  it('appends a LabelElement when label prop is given', () => {
    const cb = render(new CheckBox({ label: 'Accept terms' }));
    expect(cb.labelElement).toBeTruthy();
  });

  it('does not append a LabelElement when label is omitted', () => {
    const cb = render(new CheckBox());
    expect(cb.labelElement).toBeUndefined();
  });

  it('Component-level disabled is true when disabled:true is passed', () => {
    const cb = render(new CheckBox({ disabled: true }));
    expect(cb.disabled).toBe(true);
  });

  it('variant "radio" changes inputElement type to radio', () => {
    const cb = render(new CheckBox({ variant: 'radio' }));
    expect(cb.inputElement.type).toBe('radio');
  });

  it('variant "checkbox" keeps inputElement type as checkbox', () => {
    const cb = render(new CheckBox({ variant: 'checkbox' }));
    expect(cb.inputElement.type).toBe('checkbox');
  });
});

// ─── CheckBoxGroup ────────────────────────────────────────────────────────────

describe('CheckBoxGroup', () => {
  it('renders into the DOM', () => {
    const grp = render(new CheckBoxGroup(new CheckBox(), new CheckBox()));
    expect(document.body.contains(grp)).toBe(true);
  });

  it('contains the supplied CheckBox children', () => {
    const cb1 = new CheckBox({ label: 'Option A' });
    const cb2 = new CheckBox({ label: 'Option B' });
    const grp = render(new CheckBoxGroup(cb1, cb2));
    expect(grp.contains(cb1)).toBe(true);
    expect(grp.contains(cb2)).toBe(true);
  });

  it('selected is null initially', () => {
    const grp = render(new CheckBoxGroup(new CheckBox(), new CheckBox()));
    expect(grp.selected).toBeNull();
  });

  it('onChange callback fires when a child CheckBox receives a change event', () => {
    const cb1 = new CheckBox({ label: 'A' });
    const grp = render(new CheckBoxGroup(cb1));
    const received: CheckBox[] = [];
    grp.onChange = (cb) => received.push(cb);
    cb1.checked = true;
    cb1.dispatchEvent(new Event('change', { bubbles: false }));
    expect(received.length).toBeGreaterThanOrEqual(1);
    expect(received[0]).toBe(cb1);
  });
});

// ─── SwitchPanel ─────────────────────────────────────────────────────────────

describe('SwitchPanel', () => {
  it('renders into the DOM', () => {
    const sw = render(new SwitchPanel());
    expect(document.body.contains(sw)).toBe(true);
  });

  it('contains an inner InputElement with type="checkbox"', () => {
    const sw = render(new SwitchPanel());
    expect(sw.inputElement.type).toBe('checkbox');
  });

  it('is unchecked by default', () => {
    const sw = render(new SwitchPanel());
    expect(sw.checked).toBe(false);
  });

  it('is checked when checked:true is passed in constructor', () => {
    const sw = render(new SwitchPanel({ checked: true }));
    expect(sw.checked).toBe(true);
  });

  it('checked setter updates the component and inner input', () => {
    const sw = render(new SwitchPanel());
    sw.checked = true;
    expect(sw.checked).toBe(true);
    expect(sw.inputElement.checked).toBe(true);
  });

  it('sets name via name setter', () => {
    const sw = render(new SwitchPanel());
    sw.name = 'theme-toggle';
    expect(sw.name).toBe('theme-toggle');
    expect(sw.inputElement.name).toBe('theme-toggle');
  });

  it('appends a LabelElement when label prop is given', () => {
    const sw = render(new SwitchPanel({ label: 'Notifications' }));
    expect(sw.labelElement).toBeTruthy();
  });

  it('does not append a LabelElement when label is omitted', () => {
    const sw = render(new SwitchPanel());
    expect(sw.labelElement).toBeUndefined();
  });

  it('forwards "change" events from inner input to the host element', () => {
    const sw = render(new SwitchPanel());
    let fired = false;
    sw.addEventListener('change', () => { fired = true; });
    sw.inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    expect(fired).toBe(true);
  });

  it('toggle cycle: false → true → false', () => {
    const sw = render(new SwitchPanel());
    expect(sw.checked).toBe(false);
    sw.checked = true;
    expect(sw.checked).toBe(true);
    sw.checked = false;
    expect(sw.checked).toBe(false);
  });
});
// ─── CheckBoxGroup sibling deselection regression (audit item 2) ─────────────

describe('CheckBoxGroup – sibling deselection', () => {
  it('checking one sibling deselects the previously checked sibling', () => {
    const cb1 = new CheckBox({ label: 'Option 1' });
    const cb2 = new CheckBox({ label: 'Option 2' });
    const grp = render(new CheckBoxGroup(cb1, cb2));

    // Check cb1 first
    cb1.checked = true;
    cb1.dispatchEvent(new Event('change', { bubbles: false }));

    // Now check cb2 — cb1 should become unchecked
    cb2.checked = true;
    cb2.dispatchEvent(new Event('change', { bubbles: false }));

    expect(cb2.checked).toBe(true);
    expect(cb1.checked).toBe(false);
    expect(grp.selected).toBe(cb2);
  });

  it('checking three siblings leaves only the last checked as selected', () => {
    const cb1 = new CheckBox({ label: 'A' });
    const cb2 = new CheckBox({ label: 'B' });
    const cb3 = new CheckBox({ label: 'C' });
    const grp = render(new CheckBoxGroup(cb1, cb2, cb3));

    cb1.checked = true;
    cb1.dispatchEvent(new Event('change', { bubbles: false }));
    cb2.checked = true;
    cb2.dispatchEvent(new Event('change', { bubbles: false }));
    cb3.checked = true;
    cb3.dispatchEvent(new Event('change', { bubbles: false }));

    expect(cb3.checked).toBe(true);
    expect(cb2.checked).toBe(false);
    expect(cb1.checked).toBe(false);
    expect(grp.selected).toBe(cb3);
  });

  it('unchecking the selected item clears grp.selected', () => {
    const cb1 = new CheckBox({ label: 'X' });
    const grp = render(new CheckBoxGroup(cb1));

    cb1.checked = true;
    cb1.dispatchEvent(new Event('change', { bubbles: false }));
    expect(grp.selected).toBe(cb1);

    cb1.checked = false;
    cb1.dispatchEvent(new Event('change', { bubbles: false }));
    expect(grp.selected).toBeNull();
  });

  it('onChange fires with the correct CheckBox reference when sibling deselects', () => {
    const cb1 = new CheckBox({ label: 'P' });
    const cb2 = new CheckBox({ label: 'Q' });
    const grp = render(new CheckBoxGroup(cb1, cb2));
    const received: CheckBox[] = [];
    grp.onChange = (cb) => received.push(cb);

    cb1.checked = true;
    cb1.dispatchEvent(new Event('change', { bubbles: false }));
    cb2.checked = true;
    cb2.dispatchEvent(new Event('change', { bubbles: false }));

    // onChange should have fired for both checkboxes that were checked
    expect(received.length).toBeGreaterThanOrEqual(2);
    expect(received[received.length - 1]).toBe(cb2);
  });
});
