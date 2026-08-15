"use client";

import { useSyncExternalStore } from "react";
import {
  desktopReleaseConfig,
  type DesktopPlatform,
} from "../lib/product-config";

function detectDesktopPlatform(): DesktopPlatform | null {
  const source = `${navigator.platform} ${navigator.userAgent}`.toLowerCase();
  if (source.includes("mac")) return "macos";
  if (source.includes("win")) return "windows";
  return null;
}

export function PlatformDownload() {
  const platform = useSyncExternalStore(
    () => () => undefined,
    detectDesktopPlatform,
    () => null,
  );

  const release = platform ? desktopReleaseConfig[platform] : null;
  const preparingLabel = release ? `${release.label} 版本准备中` : "桌面版本准备中";

  if (release?.state === "available" && release.url) {
    return (
      <div className="download-control">
        <a className="download-button" href={release.url}>下载 {release.label} 版</a>
        <p>已根据当前设备匹配版本。</p>
      </div>
    );
  }

  return (
    <div className="download-control" role="status" aria-live="polite">
      <button className="download-button is-preparing" disabled type="button">
        <span>{preparingLabel}</span>
        <small>安装包接入后开放</small>
      </button>
      <p>{release ? `已识别当前设备为 ${release.label}` : "暂未识别为 macOS 或 Windows 设备"}</p>
    </div>
  );
}
