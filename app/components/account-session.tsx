"use client";

import { useEffect, useState } from "react";
import {
  beginWebsiteLogin,
  currentWebsiteIdentity,
  logoutWebsite,
  type WebsiteIdentity,
} from "../lib/platform-oidc-client";

export function AccountSession({ authority }: { authority: string }) {
  const [identity, setIdentity] = useState<WebsiteIdentity | null>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    let active = true;
    currentWebsiteIdentity(authority, window.location.origin)
      .then((value) => { if (active) setIdentity(value); })
      .catch(() => { if (active) setIdentity(null); })
      .finally(() => { if (active) setPending(false); });
    return () => { active = false; };
  }, [authority]);

  async function login() {
    setPending(true);
    await beginWebsiteLogin(authority, window.location.origin, window.location.href);
  }

  async function logout() {
    setIdentity(null);
    setPending(true);
    await logoutWebsite(authority, window.location.origin);
  }

  return (
    <button
      className="nav-action"
      type="button"
      disabled={pending}
      onClick={identity ? logout : login}
      aria-label={pending ? "账号检查中" : identity ? "退出账号 — XELITI" : "登录账号 — XELITI"}
    >
      {pending ? "账号检查中" : identity ? "退出账号" : "登录账号"}
    </button>
  );
}
