// CommonJS entry for hosts that load the app with require(), such as Hostinger (LiteSpeed lsnode).
// src/server/index.ts is an ES module with top-level await, which require() cannot load, so import it instead.
import('./src/server/index.ts').catch((err) => {
  console.error(err);
  process.exit(1);
});
