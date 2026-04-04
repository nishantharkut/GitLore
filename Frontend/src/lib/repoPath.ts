/**
 * Normalize repo-relative file paths for comparison (GitHub vs UI).
 */
export function normalizeRepoPath(p: string): string {
  return p.replace(/\\/g, "/").replace(/^\/+/, "").trim().toLowerCase();
}

/**
 * True if a PR review comment path refers to the same file as the open editor path.
 * Handles casing, slashes, and prefix mismatches (e.g. "a/b/c.html" vs "b/c.html").
 */
export function pathsMatchPrCommentFile(
  commentPath: string | null | undefined,
  editorFilePath: string | null | undefined
): boolean {
  if (!commentPath?.trim() || !editorFilePath?.trim()) return false;
  const a = normalizeRepoPath(commentPath);
  const b = normalizeRepoPath(editorFilePath);
  if (a === b) return true;
  return a.endsWith("/" + b) || b.endsWith("/" + a);
}
