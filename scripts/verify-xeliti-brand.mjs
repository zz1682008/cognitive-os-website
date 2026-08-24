import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const activeBrandFiles = [
  "README.md",
  "app/layout.tsx",
  "app/page.tsx",
  "app/components/decision-chain-demo.tsx",
  "app/components/xeliti-motion.tsx",
  "app/components/xeliti-platform-story.tsx",
  "public/personal/index.html",
];

const failures = [];

const readRequired = (relativePath) => {
  const absolutePath = resolve(root, relativePath);
  if (!existsSync(absolutePath)) {
    failures.push(`${relativePath}: required file is missing`);
    return "";
  }
  return readFileSync(absolutePath, "utf8");
};

for (const relativePath of activeBrandFiles) {
  const content = readRequired(relativePath);
  content.split("\n").forEach((line, index) => {
    if (/massos/i.test(line)) {
      failures.push(`${relativePath}:${index + 1}: legacy public brand remains`);
    }
  });
}

const requiredBrandFiles = ["app/layout.tsx", "app/page.tsx", "public/personal/index.html"];
for (const relativePath of requiredBrandFiles) {
  const content = readRequired(relativePath);
  if (!/XELITI/.test(content)) {
    failures.push(`${relativePath}: XELITI brand is missing`);
  }
}

const productShotSource = readRequired("app/components/decision-chain-demo.tsx");
for (const requiredToken of ["XELITI Business", "产品界面截图", "主要问题识别", "建议下一步"]) {
  if (!productShotSource.includes(requiredToken)) {
    failures.push(`app/components/decision-chain-demo.tsx: missing product proof ${requiredToken}`);
  }
}

const appSources = [
  "app/page.tsx",
  "app/components/decision-chain-demo.tsx",
  "app/components/xeliti-motion.tsx",
  "app/components/xeliti-platform-story.tsx",
  "public/personal/index.html",
]
  .map(readRequired)
  .join("\n");

if (/window\.addEventListener\(\s*["']scroll["']/.test(appSources)) {
  failures.push("app: direct window scroll listener is forbidden");
}

if (/requestAnimationFrame/.test(appSources)) {
  failures.push("app: unbounded requestAnimationFrame loop is forbidden");
}

const motionSource = readRequired("app/components/xeliti-motion.tsx");
for (const requiredToken of [
  "gsap.context",
  "ScrollTrigger",
  "prefers-reduced-motion",
  "ctx.revert()",
  "max-width: 767px",
]) {
  if (!motionSource.includes(requiredToken)) {
    failures.push(`app/components/xeliti-motion.tsx: missing ${requiredToken}`);
  }
}

const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
if (!packageJson.dependencies?.gsap) {
  failures.push("package.json: gsap dependency is missing");
}
for (const competingEngine of ["motion", "framer-motion", "animejs"]) {
  if (packageJson.dependencies?.[competingEngine] || packageJson.devDependencies?.[competingEngine]) {
    failures.push(`package.json: competing animation engine ${competingEngine} is not allowed`);
  }
}

if (failures.length > 0) {
  console.error(`XELITI_BRAND_MOTION_FAIL count=${failures.length}`);
  failures.forEach((failure) => console.error(failure));
  process.exit(1);
}

console.log("XELITI_BRAND_MOTION_PASS");
