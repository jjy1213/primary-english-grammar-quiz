import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const questionBankDir = path.join(rootDir, "question-bank");
const parsedDir = path.join(questionBankDir, "parsed");
const questionsTextDir = path.join(questionBankDir, "questions-text");
const answersTextDir = path.join(questionBankDir, "answers-text");
const jsonDir = path.join(questionBankDir, "json");
const manualDir = path.join(questionBankDir, "manual");

const genericKnowledgePointId = "kp-pending-shanghai-auto";

await ensureDir(questionsTextDir);
await ensureDir(answersTextDir);
await ensureDir(jsonDir);
await ensureDir(manualDir);

const parsedFiles = (await fs.readdir(parsedDir))
  .filter((fileName) => fileName.endsWith(".txt"))
  .sort((left, right) => left.localeCompare(right, "zh-CN"));

const allQuestions = [];
const answerMap = [];
const extractionReport = [];
const manualOverrides = await loadManualOverrides(manualDir);
const handledManualYears = new Set();

for (const fileName of parsedFiles) {
  const year = extractYear(fileName);
  const filePath = path.join(parsedDir, fileName);
  const rawText = await fs.readFile(filePath, "utf8");
  const text = normalizeText(rawText);
  const manualOverride = manualOverrides.get(year);

  if (manualOverride) {
    await fs.writeFile(
      path.join(questionsTextDir, `${year || "unknown"}-questions.txt`),
      manualOverride.questionText,
      "utf8"
    );
    await fs.writeFile(
      path.join(answersTextDir, `${year || "unknown"}-answers.txt`),
      manualOverride.answerText,
      "utf8"
    );

    allQuestions.push(...manualOverride.questions);
    answerMap.push(...manualOverride.answers);
    extractionReport.push(manualOverride.report);
    handledManualYears.add(String(year));
    continue;
  }

  const { questionText, answerText, answerHeadingFound } = splitQuestionAndAnswer(text);

  await fs.writeFile(
    path.join(questionsTextDir, `${year || "unknown"}-questions.txt`),
    questionText,
    "utf8"
  );
  await fs.writeFile(
    path.join(answersTextDir, `${year || "unknown"}-answers.txt`),
    answerText,
    "utf8"
  );

  const part2ChoiceSection = getSection(questionText, ["Ⅱ.", "II."], ["Ⅲ.", "III."]);
  const part2FillSection = getSection(questionText, ["Ⅳ.", "IV."], ["Ⅴ", "V."]);
  const answerPart2ChoiceSection = getSection(answerText, ["Ⅱ.", "II."], ["Ⅲ.", "III."]);
  const answerPart2FillSection = getSection(answerText, ["Ⅳ.", "IV."], ["Ⅴ", "V."]);

  const choiceQuestions = extractChoiceQuestions(part2ChoiceSection, year, fileName);
  const choiceAnswers = extractChoiceAnswers(answerPart2ChoiceSection);
  const fillQuestions = extractFillQuestions(part2FillSection, year, fileName);
  const fillAnswers = extractFillAnswers(answerPart2FillSection, fillQuestions.length);

  const pairedChoice = pairQuestionsWithAnswers(choiceQuestions, choiceAnswers, {
    year,
    fileName,
    sourceLabel: "part2-choice",
    sourceType: "choice"
  });

  const pairedFill = pairQuestionsWithAnswers(fillQuestions, fillAnswers, {
    year,
    fileName,
    sourceLabel: "part2-cloze",
    sourceType: "cloze"
  });

  allQuestions.push(...pairedChoice.questions, ...pairedFill.questions);
  answerMap.push(...pairedChoice.answers, ...pairedFill.answers);

  extractionReport.push({
    year,
    fileName,
    answerHeadingFound,
    questionTextLength: questionText.length,
    answerTextLength: answerText.length,
    extracted: {
      choiceQuestions: choiceQuestions.length,
      choiceAnswers: choiceAnswers.length,
      fillQuestions: fillQuestions.length,
      fillAnswers: fillAnswers.length,
      importedChoice: pairedChoice.questions.length,
      importedFill: pairedFill.questions.length
    },
    issues: buildIssues({
      answerHeadingFound,
      choiceQuestions,
      choiceAnswers,
      fillQuestions,
      fillAnswers,
      fullTextLength: text.length
    })
  });
}

for (const [year, manualOverride] of manualOverrides.entries()) {
  if (handledManualYears.has(String(year))) {
    continue;
  }

  await fs.writeFile(
    path.join(questionsTextDir, `${year || "unknown"}-questions.txt`),
    manualOverride.questionText,
    "utf8"
  );
  await fs.writeFile(
    path.join(answersTextDir, `${year || "unknown"}-answers.txt`),
    manualOverride.answerText,
    "utf8"
  );

  allQuestions.push(...manualOverride.questions);
  answerMap.push(...manualOverride.answers);
  extractionReport.push({
    ...manualOverride.report,
    issues: [
      ...(manualOverride.report?.issues ?? []),
      "该年份未在自动遍历阶段命中手工覆盖，已在后置兜底阶段强制并入。"
    ]
  });
}

await fs.writeFile(
  path.join(jsonDir, "import-ready-questions.json"),
  JSON.stringify(allQuestions, null, 2),
  "utf8"
);

await fs.writeFile(
  path.join(jsonDir, "answer-map.json"),
  JSON.stringify(answerMap, null, 2),
  "utf8"
);

await fs.writeFile(
  path.join(jsonDir, "import-ready-knowledge-points.json"),
  JSON.stringify(
    [
      {
        id: genericKnowledgePointId,
        name: "待人工标注考点",
        category: "待整理",
        description: "从上海中考真题自动整理出的题目，后续建议补充具体语法考点。",
        keywords: ["上海中考", "自动整理", "待标注"],
        relatedPoints: []
      }
    ],
    null,
    2
  ),
  "utf8"
);

await fs.writeFile(
  path.join(jsonDir, "extraction-report.json"),
  JSON.stringify(extractionReport, null, 2),
  "utf8"
);

function normalizeText(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\f/g, "\n")
    .replace(/[\u0000-\u0008\u000B-\u001F]/g, "")
    .replace(/\uFFFD/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitQuestionAndAnswer(text) {
  const answerHeadingRegex =
    /(?:^|\n)(\d{4}年.*?英语试卷(?:笔试)?答案(?:要点)?|英语试卷答案(?:要点)?|参考答案(?:：)?)/;
  const match = text.match(answerHeadingRegex);
  if (!match || match.index === undefined) {
    return {
      questionText: text,
      answerText: "",
      answerHeadingFound: false
    };
  }

  return {
    questionText: text.slice(0, match.index).trim(),
    answerText: text.slice(match.index).trim(),
    answerHeadingFound: true
  };
}

function getSection(text, startTokens, endTokens) {
  if (!text) {
    return "";
  }

  const startIndex = indexOfAny(text, startTokens);
  if (startIndex === -1) {
    return "";
  }

  const sectionStart = startIndex;
  const remaining = text.slice(sectionStart + 1);
  let endIndex = text.length;

  for (const token of endTokens) {
    const tokenIndex = text.indexOf(token, sectionStart + 1);
    if (tokenIndex !== -1 && tokenIndex < endIndex) {
      endIndex = tokenIndex;
    }
  }

  return text.slice(sectionStart, endIndex).trim();
}

function indexOfAny(text, tokens) {
  let found = -1;
  for (const token of tokens) {
    const index = text.indexOf(token);
    if (index !== -1 && (found === -1 || index < found)) {
      found = index;
    }
  }
  return found;
}

function extractChoiceQuestions(sectionText, year, fileName) {
  if (!sectionText) {
    return [];
  }

  const starts = [...sectionText.matchAll(/^\s*(\d{1,3})[\.．、]\s+/gm)];
  if (starts.length === 0) {
    return [];
  }

  const questions = [];
  for (let index = 0; index < starts.length; index += 1) {
    const current = starts[index];
    const next = starts[index + 1];
    const block = sectionText
      .slice(current.index, next ? next.index : sectionText.length)
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const optionMarkers = [...block.matchAll(/([ABCD])[\.）\)]/g)];
    if (optionMarkers.length < 4) {
      continue;
    }

    const firstMarker = optionMarkers[0];
    const originalQuestionNumber = Number(current[1]);
    const stem = block
      .slice(0, firstMarker.index)
      .replace(/^\d{1,3}[\.．、]\s*/, "")
      .trim();

    const options = [];
    for (let optionIndex = 0; optionIndex < optionMarkers.length; optionIndex += 1) {
      const marker = optionMarkers[optionIndex];
      const nextMarker = optionMarkers[optionIndex + 1];
      const optionText = block
        .slice(marker.index + marker[0].length, nextMarker ? nextMarker.index : block.length)
        .trim();

      options.push(optionText);
    }

    if (stem && options.length >= 4) {
      questions.push({
        year,
        fileName,
        section: "part2-choice",
        originalQuestionNumber,
        stem,
        options: options.slice(0, 4)
      });
    }
  }

  return questions;
}

function extractChoiceAnswers(sectionText) {
  if (!sectionText) {
    return [];
  }

  const answers = [];

  for (const match of sectionText.matchAll(/\d+\s*[\.\-~、]?\s*(?:【答案】\s*)?([ABCD])\b/g)) {
    answers.push(match[1]);
  }

  const lines = sectionText.split("\n");
  for (const line of lines) {
    const compact = line.replace(/[^ABCD]/g, "");
    if (compact.length >= 4) {
      for (const letter of compact.split("")) {
        answers.push(letter);
      }
    }
  }

  return dedupeSequentialNoise(answers);
}

function extractFillQuestions(sectionText, year, fileName) {
  if (!sectionText) {
    return [];
  }

  const lines = sectionText.split("\n").map((line) => line.trim()).filter(Boolean);
  const questions = [];
  let inferredNumber = 1;

  for (const line of lines) {
    if (!/\([A-Za-z][A-Za-z\s-]*\)\s*$/.test(line)) {
      continue;
    }

    let originalQuestionNumber = null;
    let stem = line;
    const numbered = line.match(/^(\d{1,3})[\.．、]?\s*(.*)$/);
    if (numbered) {
      originalQuestionNumber = Number(numbered[1]);
      stem = numbered[2].trim();
    } else {
      originalQuestionNumber = inferredNumber;
    }

    inferredNumber += 1;
    stem = stem.replace(/\s{2,}/g, " ____ ").trim();
    questions.push({
      year,
      fileName,
      section: "part2-cloze",
      originalQuestionNumber,
      stem
    });
  }

  return questions;
}

function extractFillAnswers(sectionText, expectedCount) {
  if (!sectionText) {
    return [];
  }

  const answers = [];
  for (const match of sectionText.matchAll(/【答案】\s*([^\n]+)/g)) {
    answers.push(cleanAnswerText(match[1]));
  }

  if (answers.length > 0) {
    return answers;
  }

  for (const match of sectionText.matchAll(/\d+\.\s*([A-Za-z][A-Za-z()\/-]*)/g)) {
    answers.push(cleanAnswerText(match[1]));
  }

  if (answers.length > 0) {
    return answers;
  }

  const block = getSection(sectionText, ["Ⅳ.", "IV."], ["Ⅴ", "V."]) || sectionText;
  const compactTokens = block
    .replace(/^[\s\S]*?(?:Ⅳ\.|IV\.)/, "")
    .replace(/[\d.]/g, " ")
    .split(/\s+/)
    .map((token) => cleanAnswerText(token))
    .filter((token) => /^[A-Za-z][A-Za-z()\/-]*$/.test(token));

  return compactTokens.slice(0, expectedCount);
}

function cleanAnswerText(value) {
  return value
    .replace(/^[:：\s]+/, "")
    .replace(/[。．；;,\s]+$/, "")
    .replace(/^\/+\s*/, "")
    .trim();
}

function dedupeSequentialNoise(values) {
  const result = [];
  for (const value of values) {
    if (result.length === 0 || result[result.length - 1] !== value || result.length < 2) {
      result.push(value);
    }
  }
  return result;
}

function pairQuestionsWithAnswers(questions, answers, meta) {
  const total = Math.min(questions.length, answers.length);
  const importableQuestions = [];
  const mappedAnswers = [];

  for (let index = 0; index < total; index += 1) {
    const question = questions[index];
    const answer = answers[index];
    const id = `sh-${meta.year}-${meta.sourceLabel}-${question.originalQuestionNumber ?? index + 1}`;

    importableQuestions.push({
      id,
      sourceType: meta.sourceType,
      stem: question.stem,
      ...(meta.sourceType === "choice" ? { options: question.options } : {}),
      answer,
      gradeBand: "middle-school-source",
      examSource: `${meta.year} 上海市中考英语真题（自动整理）`,
      knowledgePointId: genericKnowledgePointId,
      explanation: "待补充考点与讲解（原始真题已自动整理，建议后续人工复核）",
      difficulty: "pending"
    });

    mappedAnswers.push({
      id,
      year: meta.year,
      fileName: meta.fileName,
      section: meta.sourceLabel,
      originalQuestionNumber: question.originalQuestionNumber,
      answer
    });
  }

  return {
    questions: importableQuestions,
    answers: mappedAnswers
  };
}

function buildIssues({
  answerHeadingFound,
  choiceQuestions,
  choiceAnswers,
  fillQuestions,
  fillAnswers,
  fullTextLength
}) {
  const issues = [];

  if (!answerHeadingFound) {
    issues.push("未识别到明确答案标题，题目与答案拆分可能不完整。");
  }

  if (choiceQuestions.length === 0) {
    issues.push("未稳定识别到第二部分选择题题干。");
  }

  if (choiceAnswers.length === 0) {
    issues.push("未稳定识别到第二部分选择题答案。");
  }

  if (fillQuestions.length === 0) {
    issues.push("未稳定识别到第二部分填空题题干。");
  }

  if (fillAnswers.length === 0) {
    issues.push("未稳定识别到第二部分填空题答案。");
  }

  if (fullTextLength < 200) {
    issues.push("原始文本过短，通常说明 Word 转文本失败或原文件主要是图片。");
  }

  if (choiceQuestions.length !== choiceAnswers.length) {
    issues.push(`第二部分选择题题目数(${choiceQuestions.length})与答案数(${choiceAnswers.length})不一致。`);
  }

  if (fillQuestions.length !== fillAnswers.length) {
    issues.push(`第二部分填空题题目数(${fillQuestions.length})与答案数(${fillAnswers.length})不一致。`);
  }

  return issues;
}

function extractYear(fileName) {
  const match = fileName.match(/(20\d{2})/);
  return match ? match[1] : "unknown";
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function loadManualOverrides(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const map = new Map();

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) {
      continue;
    }

    const filePath = path.join(dirPath, entry.name);
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed?.year) {
      map.set(String(parsed.year), parsed);
    }
  }

  return map;
}
