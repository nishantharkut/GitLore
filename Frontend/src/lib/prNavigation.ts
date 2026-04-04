import type { ParsedDiffLine } from "@/lib/parseUnifiedDiff";
import { pathsMatchPrCommentFile } from "@/lib/repoPath";

export type CommentPathLine = {
  path: string;
  line: number | null;
};

/**
 * First line to scroll when opening a file from a PR: prefer review comment lines, else first diff line on head side.
 */
export function firstLineForPrFile(
  filePath: string,
  comments: CommentPathLine[],
  diffLines: ParsedDiffLine[]
): number {
  const fromComments = comments
    .filter((c) => pathsMatchPrCommentFile(c.path, filePath) && c.line != null)
    .map((c) => c.line!);
  if (fromComments.length) return Math.min(...fromComments);

  let min = Infinity;
  for (const l of diffLines) {
    if (l.lineNum == null || !l.path) continue;
    if (!pathsMatchPrCommentFile(l.path, filePath)) continue;
    if (l.type === "added" || l.type === "context") {
      min = Math.min(min, l.lineNum);
    }
  }
  if (Number.isFinite(min)) return min;
  return 1;
}
