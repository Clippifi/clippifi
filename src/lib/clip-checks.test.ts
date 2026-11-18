import { describe, expect, it } from "vitest";
import { clipChecksPass, pastedLinkChecks, pickedVideoChecks } from "./clip-checks";

const stateOf = (checks: ReturnType<typeof pastedLinkChecks>) => Object.fromEntries(checks.map((c) => [c.id, c.state]));
const base = { tiktokConnected: true, campaignAcceptsTikTok: true };

describe("pickedVideoChecks", () => {
  it("waits until a video is picked", () => {
    const checks = pickedVideoChecks({ ...base, picked: null });
    expect(stateOf(checks)).toEqual({ account: "idle", platform: "idle", fresh: "idle", unique: "idle" });
    expect(clipChecksPass(checks)).toBe(false);
  });

  it("passes a fresh video and shows the time left", () => {
    const checks = pickedVideoChecks({ ...base, picked: { minutesLeft: 18 } });
    expect(clipChecksPass(checks)).toBe(true);
    expect(checks.find((c) => c.id === "fresh")?.detail).toBe("18 min left");
  });

  it("fails late, repeated or unlinked clips", () => {
    expect(clipChecksPass(pickedVideoChecks({ ...base, picked: { minutesLeft: 0 } }))).toBe(false);
    expect(clipChecksPass(pickedVideoChecks({ ...base, picked: { minutesLeft: 9, alreadySubmitted: true } }))).toBe(false);
    const unlinked = pickedVideoChecks({ ...base, tiktokConnected: false, picked: { minutesLeft: 9 } });
    expect(unlinked.find((c) => c.id === "account")).toMatchObject({ state: "fail", detail: "Connect TikTok first" });
  });

  it("fails when the campaign doesn't take TikTok clips", () => {
    expect(clipChecksPass(pickedVideoChecks({ ...base, campaignAcceptsTikTok: false, picked: { minutesLeft: 9 } }))).toBe(false);
  });
});

describe("pastedLinkChecks", () => {
  const good = { url: "https://vm.tiktok.com/a/", ok: true as const, platform: "tiktok" as const };
  const bad = { url: "hello", ok: false as const, reason: "No" };

  it("never claims a pass the browser can't confirm", () => {
    const checks = pastedLinkChecks([good]);
    expect(stateOf(checks)).toEqual({ account: "later", platform: "pass", fresh: "later", unique: "later" });
    expect(clipChecksPass(checks)).toBe(true);
  });

  it("fails when no pasted link is usable, and waits on an empty box", () => {
    expect(clipChecksPass(pastedLinkChecks([bad]))).toBe(false);
    expect(stateOf(pastedLinkChecks([])).platform).toBe("idle");
  });
});
