#!/usr/bin/env node
// The checker now lives in content-kit/tools/check.mjs (format 1.1, all tracks).
// This wrapper keeps the old command working for the C package.
import { main } from '../../tools/check.mjs';
process.exitCode = main(process.argv.slice(2));
