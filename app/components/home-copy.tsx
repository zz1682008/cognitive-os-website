"use client";

import Link from "next/link";
import { Fragment } from "react";

import { useSiteContent } from "./site-content-provider";

function lines(text: string[]) {
  return text.map((line, index) => (
    <Fragment key={index}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
}

export function HeroCopy() {
  const { home } = useSiteContent();
  return (
    <div className="hero-copy">
      <p className="eyebrow" data-rv>{home.hero.eyebrow}</p>
      <h1 data-rv>{lines(home.hero.title)}</h1>
      <p className="sub" data-rv>{home.hero.sub}</p>
      <div className="hero-act" data-rv>
        <Link className="btn btn-dark btn-lg" href="/trial">{home.hero.primary}</Link>
        <a className="btn btn-line btn-lg" href="#brain">{home.hero.secondary}</a>
      </div>
    </div>
  );
}

/** 各版块的小标题。block 是文案的键，顺序与配套动画由代码定，后台只改字。 */
export function BlockHead({ block, ...rest }: { block: string } & Record<string, unknown>) {
  const { home } = useSiteContent();
  const copy = home.blocks.find(item => item.id === block);
  if (!copy) return null;
  return (
    <div className="head" {...rest}>
      <p className="eyebrow" data-rv>{copy.eyebrow}</p>
      <h2 data-rv>{lines(copy.title)}</h2>
    </div>
  );
}

export function FinaleActions() {
  const { home } = useSiteContent();
  return (
    <div className="top" data-rv>
      <Link className="btn btn-dark btn-lg" href="/trial">{home.finale.primary}</Link>
      <Link className="btn btn-line btn-lg" href="/download">{home.finale.secondary}</Link>
    </div>
  );
}
