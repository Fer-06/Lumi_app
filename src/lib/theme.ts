export interface ThemeOption {
  id: string;
  label: string;
  from: string;
  to: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: "lavanda-rosa", label: "Lavanda y rosa", from: "#C2AEFF", to: "#FFA9CB" },
  { id: "menta-azul", label: "Menta y azul bebé", from: "#8FE3B8", to: "#8FCCFF" },
  { id: "durazno-amarillo", label: "Durazno y amarillo", from: "#FFC9A8", to: "#FFE585" },
  { id: "lila-menta", label: "Lila y menta", from: "#D9CCFF", to: "#B8EED2" },
  { id: "rosa-lila", label: "Rosa y lila", from: "#FFC9DE", to: "#D9CCFF" },
  { id: "cielo-lavanda", label: "Cielo y lavanda", from: "#B8DFFF", to: "#C2AEFF" },
];

export const DEFAULT_THEME_ID = "lavanda-rosa";

export function getTheme(id?: string): ThemeOption {
  return THEME_OPTIONS.find((t) => t.id === id) ?? THEME_OPTIONS[0];
}

export function applyTheme(id?: string) {
  if (typeof document === "undefined") return;

  const theme = getTheme(id);
  document.documentElement.style.setProperty("--accent-from", theme.from);
  document.documentElement.style.setProperty("--accent-to", theme.to);
}