import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("lets radius tokens replace other radii, in both directions", () => {
    expect(cn("rounded-lg", "rounded-inner")).toBe("rounded-inner");
    expect(cn("rounded-md", "rounded-card")).toBe("rounded-card");
    expect(cn("rounded-card", "rounded-none")).toBe("rounded-none");
    expect(cn("rounded-thumb", "rounded-full")).toBe("rounded-full");
  });

  it("keeps merging ordinary classes", () => {
    expect(cn("px-2 text-sm", "px-4")).toBe("text-sm px-4");
  });
});
