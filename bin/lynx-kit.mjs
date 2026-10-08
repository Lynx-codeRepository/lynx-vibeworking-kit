#!/usr/bin/env node
import { run } from '../lib/kit.mjs';

try {
  process.exitCode = await run(process.argv.slice(2));
} catch (error) {
  console.error(`未执行：${error.message}`);
  process.exitCode = 1;
}
