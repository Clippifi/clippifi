import { createCn } from "cn/config";

// Class merging that knows our radius and type tokens, so `rounded-inner` replaces `rounded-lg`
// and `text-caption` replaces `text-sm` (instead of being mistaken for a colour).
export const cn = createCn({
  extend: { theme: { radius: ["card", "inner", "thumb"], text: ["fine", "caption", "small", "body", "subhead"] } },
});
