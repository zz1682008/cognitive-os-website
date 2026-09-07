/**
 * 把官网的出厂文案导出成 JSON，给管理端当初始稿。
 * 管理端第一次打开「官网管理」时读的就是这一份，所以两边默认值不会分叉。
 *
 *   node scripts/export-site-content.mjs ../admin/admin-bff/src/main/resources/website/default-site-content.json
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const { defaultSiteContent } = await import('../app/lib/site-content.ts');

const target = resolve(process.argv[2] ?? 'dist/site-content.json');
await mkdir(dirname(target), { recursive: true });
await writeFile(target, `${JSON.stringify(defaultSiteContent, null, 2)}\n`, 'utf8');
console.log(`wrote ${target}`);
