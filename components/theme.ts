// Switches (or toggles) the colour theme and remembers it
export function setTheme(next?: string) {
  const root = document.documentElement;
  const current =
    root.dataset.theme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const value = next === "light" || next === "dark" ? next : current === "dark" ? "light" : "dark";
  root.dataset.theme = value;
  try {
    localStorage.setItem("theme", value);
  } catch {}
  return value;
}
