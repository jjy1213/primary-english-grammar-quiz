import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const questionBankJsonDir = path.join(rootDir, "question-bank", "json");
const dataDir = path.join(rootDir, "data");

const questionBankQuestionsPath = path.join(questionBankJsonDir, "import-ready-questions.json");
const questionBankKnowledgePath = path.join(questionBankJsonDir, "import-ready-knowledge-points.json");
const dataQuestionsPath = path.join(dataDir, "questions.json");
const dataKnowledgePath = path.join(dataDir, "knowledge-points.json");

const seedKnowledgePoints = [
  kp("kp-be-verb", "be动词用法", "动词", "根据主语选择 am、is、are 的正确形式。", ["am", "is", "are", "be动词"], ["kp-pronoun", "kp-subject-verb-agreement"]),
  kp("kp-preposition-time", "时间介词", "介词", "区分 in、on、at 在时间表达中的基本用法。", ["in", "on", "at", "时间介词"], ["kp-preposition"]),
  kp("kp-pronoun", "人称代词", "代词", "区分主格、宾格、物主代词和反身代词。", ["he", "she", "they", "him", "her"], ["kp-be-verb"]),
  kp("kp-like-v-ing", "like后接动词形式", "动词", "掌握 like 后常接动名词的基本用法。", ["like", "doing", "动名词"], ["kp-nonfinite"])
];

const knowledgePoints = [
  kp("kp-article", "冠词", "限定词", "区分 a、an、the 和零冠词的常见用法。", ["a", "an", "the", "冠词"], ["kp-countable-noun"]),
  kp("kp-preposition", "介词", "介词", "根据固定搭配或句意选择合适的介词。", ["in", "on", "at", "for", "with", "by"], ["kp-phrasal-verb"]),
  kp("kp-pronoun", "人称代词", "代词", "区分人称代词、物主代词和反身代词。", ["he", "she", "they", "himself", "herself"], ["kp-be-verb"]),
  kp("kp-noun", "名词", "名词", "判断名词的单复数、可数不可数和固定搭配。", ["名词", "复数", "可数", "不可数"], ["kp-countable-noun"]),
  kp("kp-adjective-adverb", "形容词和副词", "词性", "根据句子成分判断该用形容词还是副词。", ["形容词", "副词", "词性"], ["kp-comparative"]),
  kp("kp-comparative", "比较级和最高级", "形容词", "根据比较关系选择原级、比较级或最高级。", ["than", "as ... as", "最高级"], ["kp-adjective-adverb"]),
  kp("kp-conjunction", "连词", "句法", "根据句意判断并列、转折、因果或让步关系。", ["and", "but", "or", "so", "although"], ["kp-clause"]),
  kp("kp-tense", "时态", "动词", "根据时间标志和句意判断动词时态。", ["时态", "一般现在时", "过去时", "完成时"], ["kp-passive-voice", "kp-subject-verb-agreement"]),
  kp("kp-nonfinite", "非谓语动词", "动词", "判断动词后接 to do、doing 或动词原形。", ["to do", "doing", "非谓语"], ["kp-verb-pattern"]),
  kp("kp-passive-voice", "被动语态", "动词", "判断句子是否需要 be done 结构。", ["被动语态", "be done"], ["kp-tense"]),
  kp("kp-modal", "情态动词", "动词", "根据语气选择 can、must、may、should 等。", ["can", "must", "may", "should"], ["kp-tense"]),
  kp("kp-question", "特殊疑问句", "句型", "根据提问对象选择 how、what、which、why 等。", ["how", "what", "which", "why"], ["kp-sentence-transformation"]),
  kp("kp-exclamation", "感叹句", "句型", "掌握 What 和 How 引导的感叹句。", ["what", "how", "感叹句"], ["kp-sentence-transformation"]),
  kp("kp-object-clause", "宾语从句", "从句", "注意语序、时态和连接词 whether / if / wh-。", ["宾语从句", "whether", "if"], ["kp-clause"]),
  kp("kp-sentence-transformation", "句型转换", "综合", "把否定句、同义句、被动句、简单句等按要求改写。", ["改写", "同义句", "句型转换"], ["kp-question", "kp-passive-voice", "kp-object-clause"]),
  kp("kp-word-formation", "词形变化", "构词", "根据括号中的提示词变成正确形式。", ["词形变化", "proper forms"], ["kp-noun", "kp-adjective-adverb"]),
  kp("kp-vocabulary", "词义和固定搭配", "词汇", "根据词义辨析或固定搭配选择正确答案。", ["固定搭配", "词义辨析"], ["kp-preposition", "kp-phrasal-verb"]),
  kp("kp-phrasal-verb", "动词短语", "词汇", "掌握 look for、get off、take off 等常见短语。", ["动词短语", "固定短语"], ["kp-vocabulary", "kp-preposition"]),
  kp("kp-mixed", "综合语法", "综合", "题目同时涉及多个知识点，先按综合语法归类。", ["综合", "语法"], [])
];

const seedQuestions = [
  {
    id: "q-001",
    sourceType: "choice",
    stem: "My sister ____ a teacher in the school.",
    options: ["am", "is", "are", "be"],
    answer: "is",
    gradeBand: "primary-upper",
    examSource: "项目内置示例题",
    knowledgePointId: "kp-be-verb",
    explanation: "主语 My sister 是第三人称单数，所以要用 is。",
    difficulty: "easy"
  },
  {
    id: "q-002",
    sourceType: "choice",
    stem: "We have an English class ____ Monday morning.",
    options: ["in", "on", "at", "for"],
    answer: "on",
    gradeBand: "primary-upper",
    examSource: "项目内置示例题",
    knowledgePointId: "kp-preposition-time",
    explanation: "Monday morning 是具体某一天的上午，所以要用 on。",
    difficulty: "easy"
  },
  {
    id: "q-003",
    sourceType: "choice",
    stem: "Tom and I are good friends. ____ often play football after school.",
    options: ["He", "She", "We", "They"],
    answer: "We",
    gradeBand: "primary-upper",
    examSource: "项目内置示例题",
    knowledgePointId: "kp-pronoun",
    explanation: "Tom and I 包含说话人自己，所以要用 We。",
    difficulty: "easy"
  },
  {
    id: "q-004",
    sourceType: "cloze",
    stem: "Lucy likes ____ (read) storybooks after dinner.",
    answer: "reading",
    gradeBand: "primary-upper",
    examSource: "项目内置示例题",
    knowledgePointId: "kp-like-v-ing",
    explanation: "like 后常接动名词，所以这里填 reading。",
    difficulty: "easy"
  },
  {
    id: "q-005",
    sourceType: "cloze",
    stem: "I ____ twelve years old.",
    answer: "am",
    gradeBand: "primary-upper",
    examSource: "项目内置示例题",
    knowledgePointId: "kp-be-verb",
    explanation: "主语是 I，所以 be 动词用 am。",
    difficulty: "easy"
  },
  {
    id: "q-006",
    sourceType: "choice",
    stem: "This is my new classmate. ____ name is Anna.",
    options: ["He", "She", "Her", "His"],
    answer: "Her",
    gradeBand: "primary-upper",
    examSource: "项目内置示例题",
    knowledgePointId: "kp-pronoun",
    explanation: "空格后有 name，所以这里要用形容词性物主代词 Her。",
    difficulty: "easy"
  }
];

const questions = JSON.parse(await fs.readFile(questionBankQuestionsPath, "utf8"));
const enrichedQuestions = questions.map((question) => classifyQuestion(question));
const mergedKnowledgePoints = dedupeKnowledgePoints([...seedKnowledgePoints, ...knowledgePoints]);
const dataQuestions = [...seedQuestions, ...enrichedQuestions];

await fs.writeFile(questionBankKnowledgePath, `${JSON.stringify(mergedKnowledgePoints, null, 2)}\n`, "utf8");
await fs.writeFile(questionBankQuestionsPath, `${JSON.stringify(enrichedQuestions, null, 2)}\n`, "utf8");
await fs.writeFile(dataKnowledgePath, `${JSON.stringify(mergedKnowledgePoints, null, 2)}\n`, "utf8");
await fs.writeFile(dataQuestionsPath, `${JSON.stringify(dataQuestions, null, 2)}\n`, "utf8");

function kp(id, name, category, description, keywords, relatedPoints) {
  return { id, name, category, description, keywords, relatedPoints };
}

function classifyQuestion(question) {
  const stem = question.stem.toLowerCase();

  let knowledgePointId = "kp-mixed";
  let explanation = "这道题要结合句意和语法规则来判断正确答案。";

  if (isSentenceTransformation(stem)) {
    knowledgePointId = pickTransformationPoint(stem);
    explanation = buildTransformationExplanation(stem, question.answer, knowledgePointId);
  } else if (isWordFormation(stem)) {
    knowledgePointId = "kp-word-formation";
    explanation = "这道题考查词形变化，要把括号里的词变成适合句子的正确形式。";
  } else if (isChoiceWithArticles(stem, question.options)) {
    knowledgePointId = "kp-article";
    explanation = "这道题考查冠词用法，要根据名词和固定搭配判断用 a、an、the 还是不用冠词。";
  } else if (isPronounQuestion(stem, question.options)) {
    knowledgePointId = "kp-pronoun";
    explanation = "这道题考查代词，要看句子里需要主格、宾格、物主代词还是反身代词。";
  } else if (isPrepositionQuestion(stem, question.options)) {
    knowledgePointId = "kp-preposition";
    explanation = "这道题考查介词或介词搭配，要根据固定用法和句意选择。";
  } else if (isModalQuestion(stem, question.options)) {
    knowledgePointId = "kp-modal";
    explanation = "这道题考查情态动词，要根据语气判断是能力、许可、义务还是建议。";
  } else if (isPassiveQuestion(stem, question.options, question.answer)) {
    knowledgePointId = "kp-passive-voice";
    explanation = "这道题考查被动语态，要看动作是“被做”还是“主动做”。";
  } else if (isObjectClauseQuestion(stem, question.answer)) {
    knowledgePointId = "kp-object-clause";
    explanation = "这道题考查宾语从句，要注意连接词、陈述语序和时态变化。";
  } else if (isExclamationQuestion(stem, question.options, question.answer)) {
    knowledgePointId = "kp-exclamation";
    explanation = "这道题考查感叹句，要根据中心词选择 What 还是 How。";
  } else if (isQuestionWordQuestion(stem, question.options)) {
    knowledgePointId = "kp-question";
    explanation = "这道题考查特殊疑问词，要先想清楚题目在问时间、地点、原因还是数量。";
  } else if (isConjunctionQuestion(stem, question.options)) {
    knowledgePointId = "kp-conjunction";
    explanation = "这道题考查连词，要根据前后句之间的关系判断是并列、转折、因果还是让步。";
  } else if (isComparisonQuestion(stem, question.options)) {
    knowledgePointId = "kp-comparative";
    explanation = "这道题考查比较级或最高级，要抓住 than、as ... as 等比较标志。";
  } else if (isNonfiniteQuestion(stem, question.options, question.answer)) {
    knowledgePointId = "kp-nonfinite";
    explanation = "这道题考查非谓语动词，要记住常见动词后面接 to do、doing 还是原形。";
  } else if (isTenseQuestion(stem, question.options, question.answer)) {
    knowledgePointId = "kp-tense";
    explanation = "这道题考查时态，要根据时间词和上下文判断动作发生的时间。";
  } else if (isAdjectiveAdverbQuestion(stem, question.options, question.answer)) {
    knowledgePointId = "kp-adjective-adverb";
    explanation = "这道题考查形容词和副词的区别，要看空格修饰的是名词、动词还是整个句子。";
  } else if (isPhrasalVerbQuestion(stem, question.options)) {
    knowledgePointId = "kp-phrasal-verb";
    explanation = "这道题考查常见动词短语，要把整个短语当成一个固定搭配来记。";
  } else if (isVocabularyQuestion(stem, question.options)) {
    knowledgePointId = "kp-vocabulary";
    explanation = "这道题更偏向词义辨析或固定搭配，要结合上下文理解词语意思。";
  } else if (isNounQuestion(stem, question.options, question.answer)) {
    knowledgePointId = "kp-noun";
    explanation = "这道题考查名词用法，要注意单复数、可数不可数和固定搭配。";
  }

  return {
    ...question,
    knowledgePointId,
    explanation
  };
}

function isSentenceTransformation(stem) {
  return /negative form|general question|tag question|same meaning|passive voice|object clause|simple sentence|combine|question\)|exclamation|arrange the words/i.test(stem);
}

function pickTransformationPoint(stem) {
  if (/passive voice/.test(stem)) return "kp-passive-voice";
  if (/object clause/.test(stem) || /indirect speech/.test(stem)) return "kp-object-clause";
  if (/exclamation/.test(stem)) return "kp-exclamation";
  if (/general question|tag question|question\)/.test(stem)) return "kp-question";
  return "kp-sentence-transformation";
}

function buildTransformationExplanation(stem, answer, knowledgePointId) {
  if (knowledgePointId === "kp-passive-voice") {
    return "这道题考查被动语态改写，先找到原句的动作和承受者，再改成 be done 结构。";
  }
  if (knowledgePointId === "kp-object-clause") {
    return "这道题考查宾语从句或间接引语，改写时要注意连接词、语序和时态。";
  }
  if (knowledgePointId === "kp-exclamation") {
    return "这道题考查感叹句改写，要先判断中心词是名词还是形容词。";
  }
  if (knowledgePointId === "kp-question") {
    return "这道题考查句型改写里的提问方式，要先看划线部分问的是什么。";
  }
  if (/arrange the words/i.test(stem)) {
    return "这道题考查连词成句，要先找主语和谓语，再把其余成分按正常语序排好。";
  }
  if (/negative form/.test(stem)) {
    return "这道题考查否定句改写，要根据主语和时态选择正确的否定形式。";
  }
  if (/same meaning/.test(stem)) {
    return "这道题考查同义改写，要在不改变原意的情况下换一种表达。";
  }
  return `这道题考查句型转换，正确答案是 ${answer}，关键是按要求完成改写。`;
}

function isWordFormation(stem) {
  return /\([a-z][a-z\s-]*\)\s*$/i.test(stem);
}

function isChoiceWithArticles(stem, options = []) {
  return includesAll(options, ["a", "an", "the"]) || /^which of the following words is pronounced|underlined word/i.test(stem) === false && /have .* good time|at .* same time/.test(stem);
}

function isPronounQuestion(stem, options = []) {
  const pronouns = ["he", "she", "him", "her", "his", "hers", "we", "us", "our", "ours", "they", "them", "their", "theirs", "my", "mine", "your", "yours", "myself", "yourself", "himself", "herself", "themselves"];
  return options.some((option) => pronouns.includes(String(option).toLowerCase()));
}

function isPrepositionQuestion(stem, options = []) {
  const prepositions = ["in", "on", "at", "for", "to", "with", "by", "from", "of", "after", "before", "under", "through", "during", "over"];
  return options.filter((option) => prepositions.includes(String(option).toLowerCase())).length >= 2;
}

function isModalQuestion(stem, options = []) {
  const modals = ["can", "could", "may", "must", "should", "need", "ought", "mustn't", "needn't", "can't", "would"];
  return options.some((option) => modals.includes(String(option).toLowerCase()));
}

function isPassiveQuestion(stem, options = [], answer = "") {
  const joined = [...options, answer].join(" ").toLowerCase();
  return /was|were|is|are|be invited|be shared|be organized|be translated|was released|were saved/.test(joined) || /passive voice/.test(stem);
}

function isObjectClauseQuestion(stem, answer = "") {
  return /object clause|indirect speech/.test(stem) || /whether|if/.test(String(answer).toLowerCase());
}

function isExclamationQuestion(stem, options = [], answer = "") {
  return options.includes("What") || options.includes("What a") || options.includes("How") || /what a|how /.test(String(answer).toLowerCase());
}

function isQuestionWordQuestion(stem, options = []) {
  const words = ["how many", "how much", "how long", "how often", "how soon", "how far", "which", "what", "why", "whose", "when", "where"];
  return options.some((option) => words.includes(String(option).toLowerCase()));
}

function isConjunctionQuestion(stem, options = []) {
  const conjunctions = ["and", "but", "or", "so", "because", "although", "though", "unless", "since", "if", "for"];
  return options.some((option) => conjunctions.includes(String(option).toLowerCase()));
}

function isComparisonQuestion(stem, options = []) {
  return / than | as .* as /i.test(stem) || options.some((option) => /(er$|est$|more |most )/i.test(String(option)));
}

function isNonfiniteQuestion(stem, options = [], answer = "") {
  const joined = [...options, answer].join(" ").toLowerCase();
  return /(to |ing\b|bare infinitive|would rather|mind|enjoy|finish|practise|practice|decided)/.test(joined) || /to do|doing/.test(stem);
}

function isTenseQuestion(stem, options = [], answer = "") {
  const joined = [...options, answer].join(" ").toLowerCase();
  return /yesterday|last |next |since|already|by the end|now|this time/.test(stem) || /(have|has|had|will|would|was|were|is preparing|are arguing|had raised)/.test(joined);
}

function isAdjectiveAdverbQuestion(stem, options = [], answer = "") {
  const joined = [...options, answer].join(" ").toLowerCase();
  return /(ly\b|friendly|lovely|safe|safely|wonderful|wonderfully|careful|carefully)/.test(joined);
}

function isPhrasalVerbQuestion(stem, options = []) {
  const phrases = ["look for", "get on", "get off", "take off", "turn off", "look up", "take part in", "make up", "care for"];
  return phrases.some((item) => stem.includes(item)) || options.some((option) => /\s/.test(String(option)) && /(off|up|for|down|part)/.test(String(option).toLowerCase()));
}

function isVocabularyQuestion(stem, options = []) {
  return /closest meaning|underlined part means|underlined word/i.test(stem) || options.some((option) => String(option).includes("..."));
}

function isNounQuestion(stem, options = [], answer = "") {
  return /(furniture|information|news|boxes|glasses|movies|actors|teenagers|collection|owner|homeless)/i.test(`${stem} ${options.join(" ")} ${answer}`);
}

function includesAll(values, targets) {
  const normalized = values.map((item) => String(item).toLowerCase());
  return targets.every((target) => normalized.includes(target));
}

function dedupeKnowledgePoints(items) {
  const map = new Map();
  for (const item of items) {
    map.set(item.id, item);
  }
  return [...map.values()];
}
