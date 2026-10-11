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

function parseHex(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

function asCssRgb([red, green, blue]: [number, number, number]) {
  return `${red} ${green} ${blue}`;
}

function tint(color: [number, number, number], amount: number): [number, number, number] {
  return color.map((channel) => Math.round(channel + (255 - channel) * amount)) as [number, number, number];
}

function shade(color: [number, number, number], amount: number): [number, number, number] {
  return color.map((channel) => Math.round(channel * (1 - amount))) as [number, number, number];
}

export function applyTheme(id?: string) {
  if (typeof document === "undefined") return;

  const theme = getTheme(id);
  const from = parseHex(theme.from);
  const to = parseHex(theme.to);
  const root = document.documentElement;
  document.documentElement.style.setProperty("--accent-from", theme.from);
  document.documentElement.style.setProperty("--accent-to", theme.to);
  root.style.setProperty("--accent-rgb", asCssRgb(from));

  const lavenderShades: Record<number, [number, number, number]> = {
    50: tint(from, 0.95),
    100: tint(from, 0.9),
    200: tint(from, 0.78),
    300: from,
    400: shade(from, 0.1),
    500: shade(from, 0.25),
    600: shade(from, 0.4),
  };
  const blushShades: Record<number, [number, number, number]> = {
    50: tint(to, 0.95),
    100: tint(to, 0.87),
    200: tint(to, 0.68),
    300: to,
    400: shade(to, 0.12),
    500: shade(to, 0.24),
  };

  Object.entries(lavenderShades).forEach(([level, color]) => {
    root.style.setProperty(`--lavender-${level}`, asCssRgb(color));
  });
  Object.entries(blushShades).forEach(([level, color]) => {
    root.style.setProperty(`--blush-${level}`, asCssRgb(color));
  });
}