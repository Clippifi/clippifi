import { describe, expect, it } from "vitest";
import { checkClipLinks, clipLinkPlatform } from "./clip-links";

describe("clipLinkPlatform", () => {
  it("recognises clip links on each platform", () => {
    expect(clipLinkPlatform("https://www.tiktok.com/@ada/video/7301234567890")).toBe("tiktok");
    expect(clipLinkPlatform("https://vm.tiktok.com/ZMabc123/")).toBe("tiktok");
    expect(clipLinkPlatform("https://www.instagram.com/reel/Cabc123/")).toBe("instagram");
    expect(clipLinkPlatform("https://youtube.com/shorts/abc123")).toBe("youtube");
    expect(clipLinkPlatform("https://youtu.be/abc123")).toBe("youtube");
    expect(clipLinkPlatform("https://www.youtube.com/watch?v=abc123")).toBe("youtube");
  });

  it("refuses profiles, lookalike hosts and other schemes", () => {
    expect(clipLinkPlatform("https://www.tiktok.com/@ada")).toBeNull();
    expect(clipLinkPlatform("https://tiktok.com.evil.example/@ada/video/123")).toBeNull();
    expect(clipLinkPlatform("https://eviltiktok.com/@ada/video/123")).toBeNull();
    expect(clipLinkPlatform("javascript:alert(1)")).toBeNull();
    expect(clipLinkPlatform("not a link")).toBeNull();
  });
});

describe("checkClipLinks", () => {
  it("answers each link on its own", () => {
    const results = checkClipLinks(
      `https://vm.tiktok.com/ZMabc/
       https://www.instagram.com/reel/Cabc/ https://vm.tiktok.com/ZMabc/ hello`,
      ["tiktok"],
    );
    expect(results.map((r) => r.ok)).toEqual([true, false, false, false]);
    expect(results[1]).toMatchObject({ ok: false, reason: expect.stringContaining("platform") });
    expect(results[2]).toMatchObject({ ok: false, reason: expect.stringContaining("already submitted") });
  });

  it("returns nothing for an empty box", () => {
    expect(checkClipLinks("   \n ", ["tiktok"])).toEqual([]);
  });
});
