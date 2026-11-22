import { createCn } from "cn/config";

// Class merging that knows our radius tokens, so `rounded-inner` properly replaces `rounded-lg`.
export const cn = createCn({ extend: { theme: { radius: ["card", "inner", "thumb"] } } });
