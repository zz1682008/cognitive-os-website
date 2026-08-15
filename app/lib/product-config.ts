export type DesktopPlatform = "macos" | "windows";
export type DesktopReleaseState = "preparing" | "available";

export type DesktopRelease = {
  platform: DesktopPlatform;
  label: string;
  state: DesktopReleaseState;
  url: string | null;
};

export type DesktopReleaseConfig = Record<DesktopPlatform, DesktopRelease>;

export const desktopReleaseConfig: DesktopReleaseConfig = {
  macos: {
    platform: "macos",
    label: "macOS",
    state: "preparing",
    url: null,
  },
  windows: {
    platform: "windows",
    label: "Windows",
    state: "preparing",
    url: null,
  },
};

export const enterpriseAccessConfig = {
  showOnlineEntry: false,
  showLoginEntry: false,
  onlineUrl: null,
  loginUrl: null,
} as const;
