"use client";

import { useEffect, useState } from "react";
import { websiteOidcRuntime, type WebsiteIdentity } from "../lib/platform-oidc-client";

export function AccountSession({ authority }: { authority: string }) {
  const [identity, setIdentity] = useState<WebsiteIdentity | null>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    let active = true;
    websiteOidcRuntime(authority, window.location.origin).currentIdentity()
      .then((value) => { if (active) setIdentity(value); })
      .catch(() => { if (active) setIdentity(null); })
      .finally(() => { if (active) setPending(false); });
    return () => { active = false; };
  }, [authority]);

  async function login() {
    setPending(true);
    await websiteOidcRuntime(authority, window.location.origin).signin(window.location.href);
  }

  async function logout() {
    setIdentity(null);
    setPending(true);
    await websiteOidcRuntime(authority, window.location.origin).logout(`${window.location.origin}/`);
  }

  return (
    <button
      className="nav-action"
      type="button"
      disabled={pending}
      onClick={identity ? logout : login}
      aria-label={identity ? "退出 XELITI 账号" : "登录 XELITI 账号"}
    >
      {pending ? "账号检查中" : identity ? "退出账号" : "登录账号"}
    </button>
  );
}
