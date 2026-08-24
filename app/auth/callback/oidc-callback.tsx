"use client";

import { useEffect, useState } from "react";
import { safeWebsiteReturnTo, websiteOidcRuntime } from "../../lib/platform-oidc-client";

export function OidcCallback({ authority }: { authority: string }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const runtime = websiteOidcRuntime(authority, window.location.origin);
    runtime.settleCallback().then((user) => {
      if (user && window.self === window.top) {
        window.location.replace(safeWebsiteReturnTo(user.state, window.location.origin));
      }
    }).catch(() => {
      if (window.self === window.top) setFailed(true);
    });
  }, [authority]);

  return <main>{failed ? "登录未完成，请返回首页重试。" : "正在完成安全登录…"}</main>;
}
