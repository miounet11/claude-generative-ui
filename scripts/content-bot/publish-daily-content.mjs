#!/usr/bin/env node

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const API_URL = process.env.STREAMCANVAS_BOT_API_URL;
const API_KEY = process.env.STREAMCANVAS_BOT_API_KEY;
const MODEL = process.env.STREAMCANVAS_BOT_MODEL ?? "auto";
const BOT_STATE_DIR =
  process.env.STREAMCANVAS_BOT_STATE_DIR ??
  path.join(process.cwd(), "scripts/content-bot/runtime");
const CONTENT_DIR =
  process.env.STREAMCANVAS_CONTENT_DIR ??
  path.join(process.cwd(), "apps/web/content/generated");
const REQUEST_TIMEOUT_MS = Number.parseInt(
  process.env.STREAMCANVAS_BOT_TIMEOUT_MS ?? "90000",
  10,
);

const ALLOWED_INTERNAL_LINKS = [
  "/",
  "/demo",
  "/docs",
  "/platform",
  "/solutions",
  "/security",
  "/resources",
  "/claude-generative-ui",
];

const DISALLOWED_PATTERNS = [
  "casino",
  "betting",
  "adult",
  "porn",
  "gun",
  "weapon",
  "hate",
  "terror",
  "medical advice",
  "legal advice",
  "financial advice",
  "celebrity scandal",
  "pirated",
  "copyrighted excerpt",
];

const KEYWORD_FAMILIES = [
  {
    id: "ai-copilot-ui",
    keyword: "AI copilot interface",
    chineseKeyword: "AI Copilot 界面",
    cluster: "Product strategy",
    narrative: "Turn chat into an interface users can operate.",
  },
  {
    id: "open-source-generative-ui",
    keyword: "open-source generative UI",
    chineseKeyword: "开源生成式 UI",
    cluster: "Discovery",
    narrative: "Help teams evaluate OSS choices without hype.",
  },
  {
    id: "claude-style-ui",
    keyword: "Claude-style generative UI",
    chineseKeyword: "Claude 风格生成式 UI",
    cluster: "Discovery",
    narrative: "Explain the useful pattern without copying proprietary systems.",
  },
  {
    id: "streamed-widget-rendering",
    keyword: "streamed widget rendering",
    chineseKeyword: "流式组件渲染",
    cluster: "Frontend architecture",
    narrative: "Cover render boundaries, incremental frames, and operator trust.",
  },
  {
    id: "ai-dashboard-ui",
    keyword: "AI dashboard interface",
    chineseKeyword: "AI 仪表盘界面",
    cluster: "Use cases",
    narrative: "Connect data-heavy workflows to structured AI surfaces.",
  },
  {
    id: "self-hosted-ai-ui",
    keyword: "self-hosted AI interface",
    chineseKeyword: "自托管 AI 界面",
    cluster: "Operations",
    narrative: "Emphasize ownership, deployment, and safe reverse proxy patterns.",
  },
  {
    id: "sandboxed-ai-components",
    keyword: "sandboxed AI component rendering",
    chineseKeyword: "沙箱 AI 组件渲染",
    cluster: "Security",
    narrative: "Show how UI isolation protects host applications.",
  },
  {
    id: "ai-workflow-ui",
    keyword: "AI workflow interface",
    chineseKeyword: "AI 工作流界面",
    cluster: "Operations",
    narrative: "Focus on approvals, handoffs, and execution visibility.",
  },
  {
    id: "prompt-to-ui",
    keyword: "prompt-to-UI architecture",
    chineseKeyword: "Prompt 到 UI 的架构",
    cluster: "Architecture",
    narrative: "Explain how prompts become real interfaces instead of plain text.",
  },
  {
    id: "ai-agent-frontend",
    keyword: "AI agent frontend",
    chineseKeyword: "AI Agent 前端",
    cluster: "Frontend architecture",
    narrative: "Describe the frontend responsibilities around agents and tool output.",
  },
  {
    id: "approval-driven-ai-ui",
    keyword: "approval-driven AI interface",
    chineseKeyword: "审批驱动的 AI 界面",
    cluster: "Security",
    narrative: "Show how explicit approval points change product design.",
  },
  {
    id: "operational-ai-workspace",
    keyword: "operational AI workspace",
    chineseKeyword: "运营型 AI 工作台",
    cluster: "Use cases",
    narrative: "Focus on daily operator workflows, not novelty demos.",
  },
];

const AUDIENCES = [
  "frontend teams",
  "AI product teams",
  "platform engineers",
  "startup founders",
  "operations leaders",
];

const ANGLES = [
  {
    id: "evaluation-checklist",
    intent: "commercial investigation",
    titlePattern: "How %AUDIENCE% should evaluate %KEYWORD%",
    chineseTitlePattern: "%AUDIENCE% 应该如何评估 %KEYWORD%",
  },
  {
    id: "implementation-guide",
    intent: "informational",
    titlePattern: "A practical implementation guide to %KEYWORD%",
    chineseTitlePattern: "%KEYWORD% 的实用实现指南",
  },
  {
    id: "mistakes-to-avoid",
    intent: "informational",
    titlePattern: "The mistakes teams make when shipping %KEYWORD%",
    chineseTitlePattern: "团队在交付 %KEYWORD% 时最容易犯的错误",
  },
  {
    id: "production-readiness",
    intent: "informational",
    titlePattern: "What production readiness looks like for %KEYWORD%",
    chineseTitlePattern: "%KEYWORD% 的生产级准备度应该是什么样",
  },
  {
    id: "use-case-patterns",
    intent: "use case discovery",
    titlePattern: "The strongest use cases for %KEYWORD%",
    chineseTitlePattern: "%KEYWORD% 最值得关注的应用场景",
  },
  {
    id: "build-vs-buy",
    intent: "commercial investigation",
    titlePattern: "When to build versus buy %KEYWORD%",
    chineseTitlePattern: "什么时候应该自建，什么时候应该采购 %KEYWORD%",
  },
  {
    id: "security-patterns",
    intent: "security education",
    titlePattern: "Security patterns every team needs for %KEYWORD%",
    chineseTitlePattern: "%KEYWORD% 必须具备的安全模式",
  },
  {
    id: "architecture-brief",
    intent: "architecture education",
    titlePattern: "The architecture brief behind %KEYWORD%",
    chineseTitlePattern: "%KEYWORD% 背后的架构简报",
  },
];

function parseArgument(name, fallback) {
  const argument = process.argv.find((value) => value.startsWith(`${name}=`));
  return argument ? argument.slice(name.length + 1) : fallback;
}

function getBatchSize() {
  const value = parseArgument("--count", "");

  if (value) {
    const parsed = Number.parseInt(value, 10);

    if (Number.isInteger(parsed) && parsed >= 1 && parsed <= 10) {
      return parsed;
    }
  }

  const now = new Date();
  return 3 + (now.getUTCDate() % 3);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function localizeHref(locale, href) {
  if (locale === "en") {
    return href;
  }

  return href === "/" ? "/zh-CN" : `/zh-CN${href}`;
}

function buildTopicCatalog() {
  const topics = [];

  for (const family of KEYWORD_FAMILIES) {
    for (const angle of ANGLES) {
      for (const audience of AUDIENCES) {
        const topicId = `${family.id}__${angle.id}__${slugify(audience)}`;
        topics.push({
          id: topicId,
          slug: slugify(`${family.id}-${angle.id}-${audience}`),
          cluster: family.cluster,
          intent: angle.intent,
          keyword: family.keyword,
          chineseKeyword: family.chineseKeyword,
          narrative: family.narrative,
          audience,
          englishTitleHint: angle.titlePattern
            .replace("%AUDIENCE%", audience)
            .replace("%KEYWORD%", family.keyword),
          chineseTitleHint: angle.chineseTitlePattern
            .replace("%AUDIENCE%", audience)
            .replace("%KEYWORD%", family.chineseKeyword),
        });
      }
    }
  }

  return topics;
}

async function readState() {
  try {
    const file = await readFile(path.join(BOT_STATE_DIR, "state.json"), "utf8");
    return JSON.parse(file);
  } catch {
    return {
      lastRunOn: null,
      publishedTopicIds: [],
    };
  }
}

async function writeState(state) {
  await mkdir(BOT_STATE_DIR, { recursive: true });
  await writeFile(
    path.join(BOT_STATE_DIR, "state.json"),
    JSON.stringify(state, null, 2),
  );
}

async function listExistingSlugs() {
  try {
    const entries = await readdir(CONTENT_DIR, { withFileTypes: true });
    return new Set(
      entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
        .map((entry) => entry.name.replace(/\.json$/, "")),
    );
  } catch {
    return new Set();
  }
}

function selectTopics(count, state, existingSlugs) {
  const topics = buildTopicCatalog();
  const selected = [];

  for (const topic of topics) {
    // The on-disk content library is the source of truth for what is live.
    // If a deploy accidentally wipes generated JSON files, the bot must be
    // able to recreate them even if their topic IDs remain in state.json.
    if (existingSlugs.has(topic.slug)) {
      continue;
    }

    selected.push(topic);

    if (selected.length >= count) {
      break;
    }
  }

  return selected;
}

function buildSystemPrompt() {
  return [
    "You are the StreamCanvas editorial generator.",
    "Generate original website articles for production generative UI.",
    "Output JSON only.",
    "Do not fabricate news, statistics, legal claims, medical claims, or financial advice.",
    "Do not copy copyrighted text or imitate proprietary marketing copy.",
    "Stay focused on AI interface architecture, generative UI, secure rendering, deployment, product design, and operations.",
    "Avoid clickbait, slander, competitor attacks, celebrity references, politics, adult content, gambling, and any illegal topic.",
    "The writing should be useful, professional, and SEO-aware without becoming spam.",
  ].join(" ");
}

function buildEnglishUserPrompt(topic) {
  return [
    "Generate one publishable English article as valid JSON only.",
    `Topic keyword: ${topic.keyword}`,
    `Audience: ${topic.audience}`,
    `Angle: ${topic.englishTitleHint}`,
    `Cluster: ${topic.cluster}`,
    `Narrative focus: ${topic.narrative}`,
    `Search intent: ${topic.intent}`,
    `Allowed CTA links: ${ALLOWED_INTERNAL_LINKS.join(", ")}`,
    "Requirements:",
    "- Original website copy, no markdown, no code fences unless necessary.",
    "- 2 sections only.",
    "- 2 FAQ items only.",
    "- Each section body should be 80-110 words.",
    "- Return exactly this shape:",
    '{"title":"","description":"","excerpt":"","category":"","heroKicker":"","readTime":"","keywords":[""],"sections":[{"title":"","body":""},{"title":"","body":""}],"faq":[{"question":"","answer":""},{"question":"","answer":""}],"cta":{"label":"","href":""}}',
  ].join("\n");
}

function buildChineseUserPrompt(topic, englishArticle) {
  return [
    "Translate the following English website text into Simplified Chinese.",
    "Return plain text only, with no quotes and no markdown.",
    `Topic keyword: ${topic.chineseKeyword}`,
    `English text: ${englishArticle}`,
  ].join("\n");
}

async function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function callModel(messages, maxTokens = 2200) {
  if (!API_URL || !API_KEY) {
    throw new Error(
      "Missing STREAMCANVAS_BOT_API_URL or STREAMCANVAS_BOT_API_KEY environment variables.",
    );
  }

  let lastError = null;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    let response;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: MODEL,
            temperature: 0.7,
            max_tokens: maxTokens,
            messages,
          }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timer);
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < 3) {
        await delay(1500 * attempt);
        continue;
      }

      throw lastError;
    }

    if (!response.ok) {
      const errorText = await response.text();
      lastError = new Error(
        `Content model request failed: ${response.status} ${errorText}`,
      );

      if (response.status >= 500 && attempt < 3) {
        await delay(1500 * attempt);
        continue;
      }

      throw lastError;
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;

    if (typeof content !== "string") {
      throw new Error("Content model response did not include a text payload.");
    }

    return JSON.parse(extractJson(content));
  }

  throw lastError ?? new Error("Content model request failed.");
}

async function callTextModel(messages, maxTokens = 500) {
  if (!API_URL || !API_KEY) {
    throw new Error(
      "Missing STREAMCANVAS_BOT_API_URL or STREAMCANVAS_BOT_API_KEY environment variables.",
    );
  }

  let lastError = null;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    let response;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: MODEL,
            temperature: 0.2,
            max_tokens: maxTokens,
            messages,
          }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timer);
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < 3) {
        await delay(1000 * attempt);
        continue;
      }

      throw lastError;
    }

    if (!response.ok) {
      const errorText = await response.text();
      lastError = new Error(
        `Content model request failed: ${response.status} ${errorText}`,
      );

      if (response.status >= 500 && attempt < 3) {
        await delay(1000 * attempt);
        continue;
      }

      throw lastError;
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;

    if (typeof content !== "string") {
      throw new Error("Content model response did not include a text payload.");
    }

    return content.trim().replace(/^["']|["']$/g, "");
  }

  throw lastError ?? new Error("Content model request failed.");
}

function extractJson(content) {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] ?? content;
  const trimmed = candidate.trim();
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Content model did not return parseable JSON.");
  }

  return trimmed.slice(firstBrace, lastBrace + 1);
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function validateLocalePayload(locale, payload) {
  const prefix = `Invalid ${locale} article payload`;

  if (!payload || typeof payload !== "object") {
    throw new Error(`${prefix}: expected object.`);
  }

  const stringRequirements = {
    title: 8,
    description: 12,
    excerpt: 12,
    category: 2,
    heroKicker: 2,
    readTime: 2,
  };

  for (const [key, minimumLength] of Object.entries(stringRequirements)) {
    if (
      typeof payload[key] !== "string" ||
      payload[key].trim().length < minimumLength
    ) {
      throw new Error(`${prefix}: ${key} is missing or too short.`);
    }
  }

  if (!ensureArray(payload.keywords).length) {
    throw new Error(`${prefix}: keywords are missing.`);
  }

  if (!ensureArray(payload.sections).length || payload.sections.length < 2) {
    throw new Error(`${prefix}: sections are missing.`);
  }

  if (!ensureArray(payload.faq).length || payload.faq.length < 2) {
    throw new Error(`${prefix}: faq items are missing.`);
  }

  if (typeof payload.cta?.label !== "string" || typeof payload.cta?.href !== "string") {
    throw new Error(`${prefix}: cta is missing.`);
  }
}

function validateArticle(article, topic) {
  if (!article || typeof article !== "object") {
    throw new Error("Generated article is not an object.");
  }

  if (typeof article.slug !== "string" || !/^[a-z0-9-]+$/.test(article.slug)) {
    throw new Error("Generated article slug is invalid.");
  }

  if (article.slug !== topic.slug) {
    article.slug = topic.slug;
  }

  if (typeof article.cluster !== "string") {
    article.cluster = topic.cluster;
  }

  if (typeof article.primaryKeyword !== "string") {
    article.primaryKeyword = topic.keyword;
  }

  if (!Array.isArray(article.tags) || article.tags.length < 3) {
    throw new Error("Generated article tags are missing.");
  }

  validateLocalePayload("en", article.locales?.en);
  validateLocalePayload("zh-CN", article.locales?.["zh-CN"]);

  for (const locale of ["en", "zh-CN"]) {
    const localized = article.locales[locale];
    const haystack = JSON.stringify(localized).toLowerCase();

    for (const pattern of DISALLOWED_PATTERNS) {
      if (haystack.includes(pattern)) {
        throw new Error(`Generated article tripped disallowed pattern: ${pattern}`);
      }
    }

    const href = localized.cta.href;
    const allowedLinks = locale === "en"
      ? ALLOWED_INTERNAL_LINKS
      : ALLOWED_INTERNAL_LINKS.map((link) => localizeHref("zh-CN", link));

    if (!allowedLinks.includes(href)) {
      throw new Error(`Generated article used an invalid CTA href: ${href}`);
    }
  }

  return {
    ...article,
    slug: topic.slug,
    cluster: topic.cluster,
    primaryKeyword: topic.keyword,
    publishedAt: article.publishedAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function localizeReadTime(value) {
  const match = value.match(/(\d+)/);

  if (!match) {
    return "4 分钟阅读";
  }

  return `${match[1]} 分钟阅读`;
}

function localizeCtaLabel(href) {
  const labels = {
    "/": "返回首页",
    "/claude-generative-ui": "查看实现说明",
    "/demo": "查看演示",
    "/docs": "阅读文档",
    "/platform": "了解平台",
    "/resources": "浏览资源",
    "/security": "查看安全模型",
    "/solutions": "查看解决方案",
  };

  return labels[href] ?? "继续阅读";
}

async function translateText(topic, text, kind, maxTokens = 500) {
  return callTextModel(
    [
      {
        role: "system",
        content:
          "Translate English website copy into concise, natural Simplified Chinese for technical readers. Return plain text only.",
      },
      {
        role: "user",
        content: [
          `Kind: ${kind}`,
          buildChineseUserPrompt(topic, text),
        ].join("\n"),
      },
    ],
    maxTokens,
  );
}

async function createChineseArticle(topic, englishArticle) {
  const [title, description, excerpt, category, heroKicker] = await Promise.all([
    translateText(topic, englishArticle.title, "title", 160),
    translateText(topic, englishArticle.description, "description", 220),
    translateText(topic, englishArticle.excerpt, "excerpt", 220),
    translateText(topic, englishArticle.category, "category", 80),
    translateText(topic, englishArticle.heroKicker, "hero kicker", 80),
  ]);

  const sections = [];

  for (const section of englishArticle.sections) {
    sections.push({
      title: await translateText(topic, section.title, "section title", 180),
      body: await translateText(topic, section.body, "section body", 380),
    });
  }

  const faq = [];

  for (const item of englishArticle.faq) {
    faq.push({
      question: await translateText(topic, item.question, "faq question", 220),
      answer: await translateText(topic, item.answer, "faq answer", 320),
    });
  }

  const keywordTranslations = [];

  for (const keyword of englishArticle.keywords.slice(0, 5)) {
    keywordTranslations.push(await translateText(topic, keyword, "keyword", 80));
  }

  return {
    title,
    description,
    excerpt,
    category,
    heroKicker,
    readTime: localizeReadTime(englishArticle.readTime),
    keywords: [topic.chineseKeyword, ...keywordTranslations],
    sections,
    faq,
    cta: {
      href: localizeHref("zh-CN", englishArticle.cta.href),
      label: localizeCtaLabel(englishArticle.cta.href),
    },
  };
}

async function generateArticle(topic) {
  console.log(`  generating English draft for ${topic.slug}...`);
  const englishArticle = await callModel(
    [
      {
        role: "system",
        content: buildSystemPrompt(),
      },
      {
        role: "user",
        content: buildEnglishUserPrompt(topic),
      },
    ],
    1100,
  );

  console.log(`  generating Chinese translation for ${topic.slug}...`);
  const chineseArticle = await createChineseArticle(topic, englishArticle);

  return validateArticle(
    {
      slug: topic.slug,
      cluster: topic.cluster,
      primaryKeyword: topic.keyword,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [
        topic.keyword,
        topic.cluster,
        topic.intent,
        "StreamCanvas",
      ],
      locales: {
        en: englishArticle,
        "zh-CN": chineseArticle,
      },
    },
    topic,
  );
}

async function publishArticle(article) {
  await mkdir(CONTENT_DIR, { recursive: true });
  await writeFile(
    path.join(CONTENT_DIR, `${article.slug}.json`),
    JSON.stringify(article, null, 2),
  );
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const force = process.argv.includes("--force");
  const batchSize = getBatchSize();
  const state = await readState();
  const today = new Date().toISOString().slice(0, 10);

  if (!force && state.lastRunOn === today) {
    console.log(`Daily content batch already ran on ${today}. Use --force to run again.`);
    return;
  }

  const existingSlugs = await listExistingSlugs();
  const topics = selectTopics(batchSize * 3, state, existingSlugs);

  if (topics.length === 0) {
    console.log("No remaining approved topics are available.");
    return;
  }

  const publishedTopicIds = [...state.publishedTopicIds];
  const failures = [];
  let publishedCount = 0;

  for (const topic of topics) {
    if (publishedCount >= batchSize) {
      break;
    }

    console.log(`Generating article for ${topic.slug}...`);
    try {
      const article = await generateArticle(topic);

      if (!dryRun) {
        await publishArticle(article);
      }

      publishedTopicIds.push(topic.id);
      publishedCount += 1;
      console.log(`${dryRun ? "Validated" : "Published"} ${article.slug}`);
    } catch (error) {
      failures.push({
        message: error instanceof Error ? error.message : String(error),
        topicId: topic.id,
      });
      console.error(
        `Failed ${topic.slug}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  if (!dryRun && publishedCount > 0) {
    await writeState({
      lastRunOn: today,
      publishedTopicIds,
    });
  }

  if (failures.length > 0) {
    console.error(
      `Content batch completed with ${failures.length} failed topic(s).`,
    );
  }

  if (publishedCount === 0) {
    throw new Error("Content batch finished without publishing any articles.");
  }

  if (publishedCount < batchSize) {
    console.log(
      `Published ${publishedCount} article(s), below the target batch size of ${batchSize}.`,
    );
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
