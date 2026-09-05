"use client";

import { useRef, useSyncExternalStore } from "react";
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
  const dialog = useRef<HTMLDialogElement>(null);
  const platform = useSyncExternalStore(
    () => () => undefined,
    detectDesktopPlatform,
    () => null,
  );

  const releases = Object.values(desktopReleaseConfig);
  const anyAvailable = releases.some(release => release.state === "available" && release.url);
  return (
    <div className="download-control">
      <button className="button button-primary" type="button" onClick={() => dialog.current?.showModal()} aria-haspopup="dialog">下载桌面版 <span aria-hidden="true">↓</span></button>
      <dialog ref={dialog} className="download-dialog" aria-labelledby="download-title" aria-describedby="download-description">
        <button className="dialog-close" type="button" onClick={() => dialog.current?.close()} aria-label="关闭下载窗口">×</button>
        <p className="download-brand">XELITI Business</p>
        <h2 id="download-title">选择桌面版本</h2>
        <p id="download-description">{anyAvailable ? "选择与你的电脑匹配的版本。" : "当前预览还未配置安装包地址。"}</p>
        <div className="download-platforms">{releases.map(release => <div key={release.platform}>
          <div><strong>{release.label}</strong>{platform === release.platform && <small>当前设备</small>}</div>
          {release.state === "available" && release.url
            ? <a className="download-package" href={release.url}>下载 {release.label} 版</a>
            : <button className="download-package" disabled type="button">暂未开放下载</button>}
        </div>)}</div>
      </dialog>
    </div>
  );
}
