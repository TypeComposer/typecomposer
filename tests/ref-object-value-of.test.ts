import { describe, expect, it } from "vitest";
import { ref } from "../src";

describe("RefObject valueOf", () => {
  it("returns native values instead of the internal proxy", () => {
    const state = ref({
      name: "Ada",
      nested: { count: 2 },
      items: ["a", "b"],
    });

    const value = state.valueOf();

    expect(value).not.toBe(state.value);
    expect(Object.getPrototypeOf(value)).toBe(Object.prototype);
    expect(value).toEqual({
      name: "Ada",
      nested: { count: 2 },
      items: ["a", "b"],
    });
    expect(Object.getPrototypeOf(value.nested)).toBe(Object.prototype);
    expect(Array.isArray(value.items)).toBe(true);
  });

  it("unwraps nested refs, maps, and sets", () => {
    const nested = ref("value");
    const state = ref({
      nested,
      map: new Map([["key", nested]]),
      set: new Set([nested]),
    });

    const value = state.valueOf();

    expect(value.nested).toBe("value");
    expect(value.map).toEqual(new Map([["key", "value"]]));
    expect(value.set).toEqual(new Set(["value"]));
  });

  it("keeps reactivity on the proxy after valueOf", () => {
    const state = ref({ count: 1 });

    state.value.count = 2;

    expect(state.valueOf()).toEqual({ count: 2 });
  });
});
