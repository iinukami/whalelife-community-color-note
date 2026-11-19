/*! Copyright (c) 2026 Color Note contributors.
 * SPDX-License-Identifier: AGPL-3.0-only
 * Additional terms under AGPLv3 Section 7: see LICENSE-ADDITIONAL.
 */
import { readFile } from "node:fs/promises";
import type { ServerResponse } from "node:http";
import type { Context } from "whalelife";

const colors = new Set(["mint", "apricot", "lilac"]);
const base = "/plugins/color-note/";

function reply(res: ServerResponse, status: number, value: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(value));
}

export async function apply(ctx: Context) {
  const html = await readFile(new URL("./board.html", import.meta.url), "utf8");
  const script = await readFile(new URL("./board.js", import.meta.url), "utf8");
  ctx.web.page(base + "board", (_, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(html);
  }, { title: "颜色便签", settings: true, navigation: true });
  ctx.web.page(base + "board.js", (_, res) => {
    res.setHeader("Content-Type", "text/javascript; charset=utf-8");
    res.end(script);
  });
  ctx.web.page(base + "note", async (_, res) => {
    reply(res, 200, await ctx.config.read("note.json"));
  });
  ctx.web.api(base + "note", async (req, res, { signal }) => {
    if (req.headers["content-type"]?.split(";")[0].trim() !== "application/json") {
      return reply(res, 415, { error: "请使用 JSON 保存便签。" });
    }
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 4096) return reply(res, 413, { error: "便签过长。" });
      chunks.push(Buffer.from(chunk));
    }
    let input;
    try { input = JSON.parse(Buffer.concat(chunks).toString("utf8")); }
    catch { return reply(res, 400, { error: "保存内容格式有误。" }); }
    const text = typeof input?.text === "string" ? input.text.trim() : "";
    if (!text || text.length > 180 || !colors.has(input?.color)) {
      return reply(res, 400, { error: "请输入 1 至 180 个字符，并选择一种颜色。" });
    }
    signal.throwIfAborted();
    const note = { text, color: input.color };
    await ctx.config.save("note.json", note);
    reply(res, 200, note);
  });
}
