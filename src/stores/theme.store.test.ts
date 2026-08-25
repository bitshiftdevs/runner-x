import { describe, it, expect, beforeEach, vi } from "vitest";
import { useThemeStore } from "./theme.store";

describe("useThemeStore", () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: "dark" });
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  it("defaults to dark theme", () => {
    expect(useThemeStore.getState().theme).toBe("dark");
  });

  it("toggleTheme switches dark → light", () => {
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe("light");
  });

  it("toggleTheme switches light → dark", () => {
    useThemeStore.setState({ theme: "light" });
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe("dark");
  });

  it("toggleTheme persists to localStorage", () => {
    useThemeStore.getState().toggleTheme();
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "light");
  });

  it("setTheme sets theme directly", () => {
    useThemeStore.getState().setTheme("light");
    expect(useThemeStore.getState().theme).toBe("light");
  });

  it("setTheme persists to localStorage", () => {
    useThemeStore.getState().setTheme("light");
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "light");
  });
});
