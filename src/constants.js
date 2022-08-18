// 2022-08-18
// This is a repurposed approach for comparing master
// to a preview, where base urls differ
export const BASE_URLS = {
  MASTER: "https://www.simplybusiness.co.uk",
  PREVIEW: "https://stagingreaktor-testgatsbypluginpreact.gtsb.io",
};

// This was used for the original implementation, which
// re-tested the same urls after change.
export const DOMAINS = {
  PPC: {
    PRODUCTION: "https://www.simplybusiness.com",
    PREVIEW: "https://stagingreaktor-testgatsbypluginpreact.gtsb.io",
    MODIFIER: "cs",
  },
  NON_PPC: {
    PRODUCTION: "https://www.simplybusiness.co.uk",
    PREVIEW: "https://stagingreaktor-testgatsbypluginpreact.gtsb.io",
    MODIFIER: {
      UK: "__csuk",
      US: "__csus",
    },
  },
};

export const FOLDERS = {
  GOLDEN: "screenshots-golden",
  SCREENSHOTS: "screenshots",
  DIFFS: "diffs",
};

export const VIEWPORTS = [
  { width: 1366, height: 768 },
  { width: 414, height: 896 },
];

export const BATCH_SIZE = 4; // Parallel page screenshots (x viewports) = 10

export const PAGE_DELAY = 5 * 1000; // Wait in milliseconds for password-protected pages to load
