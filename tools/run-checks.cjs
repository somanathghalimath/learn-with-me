/* One self-contained test command. Start a Pages-style subpath server if needed. */
const { spawn, spawnSync } = require("node:child_process");
const { resolve } = require("node:path");
(async () => {
  let server;
  const url = process.env.SITE_URL || "http://127.0.0.1:8877/learn-with-me";
  try {
    if (!process.env.SITE_URL) {
      const root = resolve(__dirname, "..");
      // Mount under /learn-with-me regardless of the local checkout's directory name.
      server = spawn(
        "python3",
        [
          "-u",
          "-c",
          `from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer\nimport os\nos.chdir(${JSON.stringify(root)})\nclass Handler(SimpleHTTPRequestHandler):\n def do_GET(self):\n  if self.path.startswith('/learn-with-me/'):\n   self.path=self.path[len('/learn-with-me'):]\n  return super().do_GET()\nThreadingHTTPServer(('127.0.0.1',8877),Handler).serve_forever()`,
        ],
        { stdio: "ignore" },
      );
      let ready = false;
      for (let n = 0; n < 40; n++) {
        try {
          if ((await fetch(url + "/")).ok) {
            ready = true;
            break;
          }
        } catch {}
        await new Promise((r) => setTimeout(r, 100));
      }
      if (!ready) throw Error("Test server did not start");
    }
    for (const file of [
      "check-notebook.cjs",
      "check-kannada.cjs",
      "check-kannada-notebook.cjs",
      "check-letter-speech.cjs",
      "check-curriculum.cjs",
    ]) {
      console.log("\n" + file);
      const result = spawnSync(process.execPath, [resolve(__dirname, file)], {
        env: { ...process.env, SITE_URL: url },
        stdio: "inherit",
      });
      if (result.status !== 0) throw Error(file + " failed");
    }
  } finally {
    if (server) server.kill();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
