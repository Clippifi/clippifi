// Shared by the "Connect" popup, its return page and the Connections page.

export const LINK_MESSAGE = "clippifi:link-result";
export const LINK_RETURN_PATH = "/connect/done";

// Error codes Better Auth adds to the return URL when linking fails.
const LINK_ERRORS: Record<string, string> = {
  account_already_linked_to_different_user: "That TikTok account is already connected to another Clippifi account.",
  access_denied: "TikTok connection was cancelled.",
  unable_to_link_account: "TikTok couldn't be connected to your account. Try again.",
  signup_disabled: "Sign in to Clippifi first, then connect TikTok here.",
};

export function linkErrorMessage(code: string) {
  return LINK_ERRORS[code] ?? "We couldn't connect TikTok. Try again.";
}
