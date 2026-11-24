import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("lets radius tokens replace other radii, in both directions", () => {
    expect(cn("rounded-lg", "rounded-inner")).toBe("rounded-inner");
    expect(cn("rounded-md", "rounded-card")).toBe("rounded-card");
    expect(cn("rounded-card", "rounded-none")).toBe("rounded-none");
    expect(cn("rounded-thumb", "rounded-full")).toBe("rounded-full");
  });

  it("treats type tokens as font sizes: they replace sizes but keep colours", () => {
    expect(cn("text-sm", "text-caption")).toBe("text-caption");
    expect(cn("text-body", "text-[20px]")).toBe("text-[20px]");
    expect(cn("text-caption text-muted-foreground")).toBe("text-caption text-muted-foreground");
    expect(cn("text-fine", "text-destructive")).toBe("text-fine text-destructive");
  });

  it("keeps merging ordinary classes", () => {
    expect(cn("px-2 text-sm", "px-4")).toBe("text-sm px-4");
  });
});
