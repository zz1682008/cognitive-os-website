"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { normalizeSiteContent } from "../lib/site-content-schema";
import { defaultSiteContent, type SiteContent } from "../lib/site-content";

const SiteContentContext = createContext<SiteContent>(defaultSiteContent);

/** 官网文案的当前值：先是构建时的默认稿，管理端有新版本时在客户端换成新版本。 */
export function useSiteContent() {
  return useContext(SiteContentContext);
}

const endpoint = process.env.NEXT_PUBLIC_SITE_CONTENT_URL || "";

/**
 * 站点是静态导出的，文案随构建打进页面；这里再向管理端要一次当前版本。
 * 拿不到、超时、格式不对都当没发生——页面保持构建时那一份，不会白屏也不会缺字。
 */
export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    if (!endpoint) return;
    const abort = new AbortController();
    const timer = window.setTimeout(() => abort.abort(), 4000);
    fetch(endpoint, { signal: abort.signal, headers: { accept: "application/json" } })
      .then(response => (response.ok ? response.json() : null))
      .then(payload => {
        if (!payload || typeof payload !== "object") return;
        const raw = "content" in payload ? (payload as { content: unknown }).content : payload;
        if (!raw) return;
        setContent(normalizeSiteContent(raw));
      })
      .catch(() => {})
      .finally(() => window.clearTimeout(timer));
    return () => {
      window.clearTimeout(timer);
      abort.abort();
    };
  }, []);

  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}
