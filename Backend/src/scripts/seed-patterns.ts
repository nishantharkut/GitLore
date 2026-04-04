/**
 * Seed comment_patterns and demo explanations_cache entries.
 * Run: npm run seed (from Backend/)
 */
import "dotenv/config";
import { connectDB, getDB } from "../lib/mongo";

const PATTERNS = [
  {
    _id: "memory-leak-react-useeffect",
    trigger_keywords: [
      "memory leak",
      "cleanup",
      "unmount",
      "useeffect",
    ],
    pattern_name: "React useEffect Missing Cleanup",
    docs_links: ["https://react.dev/learn/synchronizing-with-effects"],
  },
  {
    _id: "n-plus-one-query",
    trigger_keywords: ["n+1", "n plus one", "query in loop"],
    pattern_name: "N+1 Query Problem",
    docs_links: [] as string[],
  },
  {
    _id: "xss-innerhtml",
    trigger_keywords: ["xss", "innerhtml", "cross-site"],
    pattern_name: "XSS via innerHTML",
    docs_links: [
      "https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML#security_considerations",
    ],
  },
  {
    _id: "event-listener-leak",
    trigger_keywords: [
      "missing cleanup",
      "event listener",
      "removeeventlistener",
    ],
    pattern_name: "Event Listener Memory Leak",
    docs_links: [] as string[],
  },
  {
    _id: "race-condition-async",
    trigger_keywords: ["race condition", "race", "concurrent"],
    pattern_name: "Async Race Condition",
    docs_links: [] as string[],
  },
];

function demoResponseMemoryLeak() {
  return {
    pattern_name: "React useEffect Missing Cleanup",
    whats_wrong:
      "The useEffect fetches `/api/users/${userId}` and updates state but never aborts the request or cleans up on unmount, so a slow response can call setState after unmount.",
    why_it_matters:
      "In production, tab switches and navigations trigger unmounts; updating state on unmounted components causes React warnings and can mask real bugs.",
    fix: `useEffect(() => {
  const ac = new AbortController();
  fetch(\`/api/users/\${userId}\`, { signal: ac.signal })
    .then((res) => res.json())
    .then((data) => setData(data))
    .catch(() => {});
  return () => ac.abort();
}, [userId]);`,
    principle: "Synchronize with external systems and cancel or ignore stale async work when dependencies change or the component unmounts.",
    confidence: "high" as const,
    confidence_reason: "Matches useEffect + fetch without cleanup; comment keywords align with React effect cleanup guidance.",
    source: {
      comment_by: "demo",
      comment_url:
        "https://github.com/demo/repo/pull/42#discussion_r1",
      pattern_matched: "memory-leak-react-useeffect",
    },
    docs_links: ["https://react.dev/learn/synchronizing-with-effects"],
  };
}

function demoResponseNPlusOne() {
  return {
    pattern_name: "N+1 Query Problem",
    whats_wrong:
      "Loading related orders inside a loop issues one database query per order instead of one batched query, scaling linearly with collection size.",
    why_it_matters:
      "Under load, N+1 queries increase latency and database connection usage, often dominating response time in APIs.",
    fix: `orders = Order.objects.filter(user_id=user_id).prefetch_related("items")`,
    principle: "Batch or join related data fetches; avoid queries inside loops over collections.",
    confidence: "high" as const,
    confidence_reason: "Comment 'N+1' matches ORM loop-query anti-pattern.",
    source: {
      comment_by: "demo",
      comment_url:
        "https://github.com/demo/repo/pull/42#discussion_r2",
      pattern_matched: "n-plus-one-query",
    },
    docs_links: [] as string[],
  };
}

async function main() {
  await connectDB();
  const db = getDB();

  for (const p of PATTERNS) {
    await db.collection("comment_patterns").updateOne(
      { _id: p._id } as any,
      { $set: { ...p } },
      { upsert: true }
    );
    console.log("Upserted pattern:", p._id);
  }

  const demo1Key =
    "pr:42:comment:memory leak:file:src/components/UserProfile.tsx:line:47";
  const demo2Key = "pr:42:comment:N+1:file:OrderController.py:line:23";

  const ttl = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  await db.collection("explanations_cache").updateOne(
    { _id: demo1Key } as any,
    {
      $set: {
        repo: "demo/repo",
        response: demoResponseMemoryLeak(),
        pattern_matched: "memory-leak-react-useeffect",
        created_at: new Date(),
        ttl,
      },
    },
    { upsert: true }
  );
  console.log("Seeded demo cache:", demo1Key);

  await db.collection("explanations_cache").updateOne(
    { _id: demo2Key } as any,
    {
      $set: {
        repo: "demo/repo",
        response: demoResponseNPlusOne(),
        pattern_matched: "n-plus-one-query",
        created_at: new Date(),
        ttl,
      },
    },
    { upsert: true }
  );
  console.log("Seeded demo cache:", demo2Key);

  console.log("Done.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
