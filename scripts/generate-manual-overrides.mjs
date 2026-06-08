import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const questionBankDir = path.join(rootDir, "question-bank");
const manualDir = path.join(questionBankDir, "manual");
const questionsTextDir = path.join(questionBankDir, "questions-text");
const answersTextDir = path.join(questionBankDir, "answers-text");

const genericKnowledgePointId = "kp-pending-shanghai-auto";
const examSourceSuffix = "上海市中考英语真题（文本人工校准）";
const explanation = "待补充具体考点与讲解，当前为人工校准后的结构化题目。";

const manualData = [
  buildYearData({
    year: "2013",
    fileName: "2013年上海市中考英语试卷及答案.txt",
    choiceStart: 31,
    choice: [
      q("Perhaps the famous football star won't play ______ football any longer.", ["a", "an", "the", "/"], "D"),
      q("My parents showed ______ some old pictures that brought back sweet memories.", ["I", "me", "my", "mine"], "B"),
      q("Wow! Ten students in our class will celebrate their fourteenth birthdays ______ October!", ["in", "on", "at", "to"], "A"),
      q("The chemicals in the vegetables and fruit are bad ______ our health.", ["from", "with", "of", "for"], "D"),
      q("A lot of foreigners ______ familiar with the famous places of interest in China.", ["am", "is", "are", "be"], "C"),
      q("The student didn't find much ______ about the topic on that website.", ["report", "article", "information", "story"], "C"),
      q("______ is waiting for you at the gate. He wants to say thanks to you.", ["Somebody", "Anybody", "Everybody", "Nobody"], "A"),
      q("-- ______ have you been in the sports club?\n-- Since the first month I came to the school.", ["How old", "How long", "How much", "How soon"], "B"),
      q("My old neighbor Charles felt ______ after his children moved out.", ["lonely", "safely", "angrily", "happily"], "A"),
      q("-- Must I go to medical school and be a doctor like you, Dad?\n-- No, you ______, son. You're free to make your own decision.", ["can't", "mustn't", "shouldn't", "needn't"], "D"),
      q("The volunteer spoke as ______ as she could to make the visitors understand her.", ["clearly", "more clearly", "most clearly", "the most clearly"], "A"),
      q("Which do you prefer to use to keep in touch with your friends, QQ ______ MSN?", ["and", "but", "or", "so"], "C"),
      q("I hate travelling by air ______ you usually have to wait for hours before the plane takes off.", ["because", "though", "until", "unless"], "A"),
      q("Look, so many passengers ______ with their smart phones on the underground.", ["played", "will play", "are playing", "have played"], "C"),
      q("The schoolboy ______ to the blind man on his way home yesterday afternoon.", ["apologizes", "apologized", "will apologize", "has apologized"], "B"),
      q("The official said they ______ a new law to protect the tourists the next year.", ["makes", "would make", "made", "have made"], "B"),
      q("Even Tony's granddaughter, a five-year-old girl, asked him ______ smoking.", ["give up", "gave up", "to give up", "giving up"], "C"),
      q("The retired couple enjoy ______ photos. They always go out with their cameras.", ["take", "took", "to take", "taking"], "D"),
      q("-- Tim and I will visit the exhibition this weekend. Would you like to join us?\n-- ______", ["Well done.", "That's right.", "You're welcome.", "I'd love to."], "D"),
      q("-- We'll study in different schools next term. Enjoy your time in the new school!\n-- ______", ["I'll take your advice.", "The same to you.", "Congratulations!", "Me too."], "B")
    ],
    clozeStart: 51,
    cloze: [
      c("A newspaper ______ did a survey among a group of students. (from the box)", "recently"),
      c("The ______ of the survey show that not everybody wants to have many holidays. (from the box)", "results"),
      c("If you don't want to stay at home and get bored, go out and ______ some interesting activities. (from the box)", "take part in"),
      c("A lot of schools organize various trips during the holidays, so you have many ______ to make. (from the box)", "choices"),
      c("There, students can learn a lot from ______ activities. (from the box)", "outdoor"),
      c("They also learn more about ______ animals. (from the box)", "wild"),
      c("In most towns, some other centres ______ students different courses. (from the box)", "offer"),
      c("Students can also ______ for school trips. (from the box)", "go abroad"),
      c("The prices of many ______ usually go up during festivals. (flower)", "flowers"),
      c("This is the ______ time for our school to hold the robot-making contest. (six)", "sixth"),
      c("I could hardly believe she had made a video about water pollution by ______. (her)", "herself"),
      c("The company hopes its new product will be ______ on the European market. (success)", "successful"),
      c("Larry has put on too much weight because of his ______ diet. (healthy)", "unhealthy"),
      c("Jack finds it difficult to pronounce some English words ______. (correct)", "correctly"),
      c("Don't use the lift when you escape from a high ______ during a fire. (build)", "building"),
      c("It is not wise of young people to ______ their jobs from time to time. (changeable)", "change"),
      c("Fred ______ ______ to work in the charity hospital in the community. (negative form)", "doesn't plan"),
      c("______ ______ is Jim's office from the nearest underground station? (question)", "How far"),
      c("Though many houses ______ ______ by the earthquake, people didn't lose hope. (passive voice)", "were destroyed"),
      c("This year's car exhibition was ______ special ______ it attracted many visitors. (combine)", "so, that"),
      c("With the help of a local guide, they reached the mountain top ______ ______. (same meaning)", "at last"),
      c("______ ______ our journey to Britain last summer was! (exclamation)", "How amazing"),
      c("The reporter asked ______ ______ responsible for the food safety problem. (object clause)", "who was")
    ],
    issues: ["第二部分已按人工校准重建，覆盖自动抽取结果。"]
  }),
  buildYearData({
    year: "2015",
    fileName: "2015年上海市中考英语试卷及答案.txt",
    choiceStart: 26,
    choice: [
      q("Which of the following words is pronounced /ʃeɪp/?", ["shape", "sheep", "shop", "ship"], "A"),
      q("Nowadays I can choose online courses and study by ______.", ["I", "me", "my", "myself"], "D"),
      q("I love this picture ______ you beside the music fountain.", ["in", "of", "on", "at"], "B"),
      q("There was a big crowd waiting ______ the opening ceremony to start.", ["by", "from", "for", "with"], "C"),
      q("Rose received a letter full of love from her parents on her ______ birthday.", ["sixteen", "sixteen's", "sixteenth", "sixteenths"], "C"),
      q("Alex did the project on community service ______ better than his classmates.", ["so", "very", "too", "much"], "D"),
      q("Leave the reference books behind, ______ you won't be able to think independently.", ["or", "and", "so", "but"], "A"),
      q("______ Mike didn't win the race, he was still wearing a smile on his face.", ["If", "Since", "Although", "Because"], "C"),
      q("The little dancer from Australia looks ______ in the long skirt.", ["gently", "happily", "beautifully", "lovely"], "D"),
      q("Now Jerry ______ the exchange programme with his classmates in the meeting room.", ["discussed", "is discussing", "was discussing", "has discussed"], "B"),
      q("Tim told us that his company ______ robots to do some of the work.", ["uses", "will use", "has used", "would use"], "D"),
      q("Over $30,000 ______ for a children's hospital by a British girl several months ago.", ["is raised", "was raised", "will be raised", "has been raised"], "B"),
      q("My friend invited me ______ the art club, and I accepted it with pleasure.", ["join", "to join", "joined", "joining"], "B"),
      q("Martin was so busy ______ the old that he gave up his part-time job.", ["helping", "helped", "to help", "help"], "A"),
      q("-- Mum, ______ I visit the Movie Museum tomorrow?\n-- I'm afraid you can't. It is closed on Monday.", ["must", "may", "should", "need"], "B"),
      q("______ important it is for kids to imagine freely!", ["What", "What a", "What an", "How"], "D"),
      q("Please ______ your exam papers once again before handing them in.", ["going over", "went over", "go over", "to go over"], "C"),
      q("-- ______ father took part in the charity activity in the neighbourhood yesterday?\n-- Peter's.", ["Whose", "What", "Which", "Who"], "A"),
      q("-- Don't throw plastic bags towards the animals in the zoo.\n-- ______", ["All right.", "My pleasure.", "Not at all.", "Don't mention."], "A"),
      q("-- You look sad, Betty. What's the matter with you?\n-- ______", ["I've got the first prize.", "I'm sorry to hear that.", "I can't attend the summer camp.", "I don't quite agree with you."], "C")
    ],
    clozeStart: 46,
    cloze: [
      c("Are you ______ with rainforests? They're interesting and exciting places! (from the box)", "familiar"),
      c("However, rainforests are ______ now - they are disappearing very fast. (from the box)", "in trouble"),
      c("As a result, ______ animals and plants are dying out. (from the box)", "various"),
      c("Maybe you have never been to a rainforest, so why should you protect them ______? (from the box)", "with care"),
      c("Rainforests also help to ______ the weather. (from the box)", "control"),
      c("Besides, one quarter of our ______ come from plants. (from the box)", "medicines"),
      c("If we ______ them, we will never find out. (from the box)", "destroy"),
      c("In my opinion, our future ______ saving the rainforests. (from the box)", "depends on"),
      c("Some people like reading on Wechat, but ______ don't. (other)", "others"),
      c("Cut the strawberries into pieces and put ______ into the yogurt. (they)", "them"),
      c("The day was ______, but the sun was trying to come through. (cloud)", "cloudy"),
      c("I'm thankful to the teacher for her ______ on my interview. (suggest)", "suggestion(s)"),
      c("It's our responsibility to make the sky ______ than before. (clear)", "clearer"),
      c("Education is one of the most powerful ways to ______ one's mind. (rich)", "enrich"),
      c("I think it's ______ to judge a person before you really know him. (fair)", "unfair"),
      c("______, the famous temple was not damaged in the earthquake. (luck)", "Luckily"),
      c("______ ______ useful for us to understand new words. (plural form)", "Dictionaries are"),
      c("______ ______ did Mary pay for a trip to Europe with her mother? (question)", "How much"),
      c("Mark ______ ______ to his country after he finished university abroad. (same meaning)", "came/went back"),
      c("______ Gary ______ I am good at playing badminton. (combine)", "Neither, nor"),
      c("He wondered why ______ ______ flowers to Ms Grey every September. (object clause)", "Jim sent"),
      c("Two French storybooks ______ ______ into Chinese by Wesley every year. (passive voice)", "are translated"),
      c("Arrange the words into a sentence: they / are going to / the amusement park / after / the speech contest.", "They are going to the amusement park after the speech contest.")
    ],
    issues: ["第二部分已按人工校准重建，覆盖自动抽取结果。"]
  }),
  buildYearData({
    year: "2017",
    fileName: "2017年上海市中考英语试卷及答案.txt",
    choiceStart: 26,
    choice: [
      q("Which of the following underlined parts is different in pronunciation?", ["fly", "lazy", "already", "cloudy"], "A"),
      q("Christine is selling her house, but on ______ other hand she doesn't want to move.", ["a", "an", "the", "/"], "C"),
      q("We won! The honor belongs ______ all the members of our team.", ["by", "of", "at", "to"], "D"),
      q("Shirley is still waiting for her flight to New York City ______ the airport.", ["at", "under", "on", "with"], "A"),
      q("The headmaster introduced ______ to the German visitors before the welcome party.", ["we", "us", "our", "ours"], "B"),
      q("______ knowledge and experience are important to finish that task.", ["Either", "Neither", "None", "Both"], "D"),
      q("Did the policeman give much ______ on how to protect personal information?", ["note", "tip", "advice", "book"], "C"),
      q("Alex believes he will soon be able to play chess as ______ as the computer.", ["well", "better", "best", "the best"], "A"),
      q("Nowadays people wish to have ______ food than before as their life improves.", ["healthy", "healthier", "healthiest", "the healthiest"], "B"),
      q("Some exchange students ______ with their host families this time yesterday.", ["are chatting", "will chat", "were chatting", "have chatted"], "C"),
      q("-- Do you know ______ a 5-day trip to Hong Kong costs?\n-- I guess it's about ¥4,000.", ["how fast", "how long", "how soon", "how much"], "D"),
      q("Several journalists ______ the lawyer about the international case an hour ago.", ["interview", "interviewed", "will interview", "had interviewed"], "B"),
      q("The museum ______ next month to celebrate the Science & Technology Festival.", ["is decorated", "will decorate", "is decorating", "will be decorated"], "D"),
      q("Vivian refuses ______ her children to the weekend training centre for extra classes.", ["to send", "sending", "sent", "sends"], "A"),
      q("The workers are busy ______ windows to the new building these days.", ["fix", "fixed", "fixing", "to fix"], "C"),
      q("-- ______ I park my car here for a while?\n-- No, you mustn't. Do you see the sign 'NO PARKING'?", ["Would", "May", "Must", "Should"], "B"),
      q("The two companies decided to work together ______ they had common interest.", ["because", "unless", "but", "or"], "A"),
      q("Professor Tu Youyou never stops doing research on Chinese medicine, ______?", ["is she", "does she", "isn't she", "doesn't she"], "B"),
      q("-- Would you like to join me in making cakes tomorrow?\n-- ______", ["It doesn't matter.", "Don't worry.", "You're welcome.", "I'd love to."], "D"),
      q("-- ______\n-- Congratulations!", ["Sorry for breaking the glass.", "How are you feeling today?", "I was awarded first prize in the writing contest.", "Why not take the underground to the university?"], "C")
    ],
    clozeStart: 46,
    cloze: [
      c("Experiencing nature is ______, but when you're doing this, always keep yourself safe. (from the box)", "exciting"),
      c("It's important not to turn a pleasant outing into a ______. (from the box)", "disaster"),
      c("This is especially true in the ______ of travelling in the mountain areas. (from the box)", "situation"),
      c("The weather is really ______ in high mountains. (from the box)", "changeable"),
      c("Second, ______ a map, a compass, and a flashlight in your bag. (from the box)", "pack"),
      c("Many trips that start out in daylight will ______ become nighttime adventures. (from the box)", "probably"),
      c("Small cuts can be more serious when there is no doctor ______. (from the box)", "nearby"),
      c("Someone will go search for you if troubles ______. (from the box)", "appear"),
      c("A seat belt can help protect passengers in many car ______. (accident)", "accidents"),
      c("Last week the students went skating and enjoyed ______ very much. (them)", "themselves"),
      c("My school is going to have an open day on the ______ of next month. (ten)", "tenth"),
      c("Failure isn't always bad. It can teach you ______ lessons. (use)", "useful"),
      c("For your ______, smoking is not allowed during the whole flight. (safe)", "safety"),
      c("Our manager greeted the guest ______ with a smile at the entrance. (polite)", "politely"),
      c("Scientists often ______ that farmers use natural ways to grow fruits. (suggestion)", "suggest"),
      c("When they felt ______ after the flood, the charity offered them food and clothes. (help)", "helpless"),
      c("______ the invention of smart phones ______ the world in many ways? (general question)", "Did, change"),
      c("______ ______ does that amusement park have lots of tourists? (question)", "When does"),
      c("The film festival ______ ______ by the local government every autumn. (passive voice)", "is organized"),
      c("______ ______ shared-bikes are in some big cities! (exclamation)", "How popular"),
      c("Melissa asked her mom ______ she ______ ever been in a hot air balloon. (object clause)", "if/whether, had"),
      c("PM 2.5 is ______ ______ people's health and the environment. (same meaning)", "bad for/harmful to"),
      c("Arrange the words into a sentence: the Internet / enables / teenagers / to collect / various information.", "The Internet enables teenagers to collect various information.")
    ],
    issues: ["第二部分已按人工校准重建，覆盖自动抽取结果。"]
  }),
  buildYearData({
    year: "2019",
    fileName: "2019年上海市中考英语试卷和答案.txt",
    choiceStart: 26,
    choice: [
      q("Which of the following words is pronounced /pri'vent/?", ["present", "pretend", "prevent", "pleasant"], "C"),
      q("Emma, an actress, has become a superstar because of ______ hard work and talent.", ["she", "her", "hers", "herself"], "B"),
      q("We communicate ______ each other in many ways, such as by e-mail or by phone.", ["on", "through", "in", "with"], "D"),
      q("I couldn't get much ______ of the exhibition of clean-energy products from the website.", ["news", "photos", "posters", "advertisements"], "A"),
      q("______ beautifully little Simon dances in front of the camera!", ["What", "What a", "How", "How a"], "C"),
      q("David's responses were ______ than anyone else's and he won the competition.", ["quick", "quicker", "quickest", "the quickest"], "B"),
      q("Look! They ______ about the solution to the network problems again.", ["argue", "are arguing", "argued", "were arguing"], "B"),
      q("The host told a joke at the party and made the guests ______ a lot.", ["laugh", "laughing", "to laugh", "laughed"], "A"),
      q("Would you mind ______ care of my pet fish while I'm away on holiday?", ["take", "taken", "to take", "taking"], "D"),
      q("By the end of last month, Jane ______ enough money for the poor sick boy.", ["raised", "would raise", "had raised", "has raised"], "C"),
      q("Frank held his breath ______ the water to search for his ring in the swimming pool.", ["at", "by", "over", "under"], "D"),
      q("Worries in life ______ if you speak out to your close friend.", ["will reduce", "were reducing", "will be reduced", "were reduced"], "C"),
      q("According to the rule, used batteries ______ be dropped in the red bin for harmful wastes.", ["must", "need", "can", "may"], "A"),
      q("Benjamin has learned that it is not polite to make ______ fun of others.", ["a", "an", "the", "/"], "D"),
      q("The New Year Concert was so amazing that ______ left in the middle of it.", ["everybody", "anybody", "nobody", "somebody"], "C"),
      q("There was something wrong with my car, ______ I went to work by underground.", ["for", "so", "or", "but"], "B"),
      q("______ the journey was tiring, Jeff thought it was worth both the time and the money.", ["As", "Since", "Unless", "Although"], "D"),
      q("The climbers made a fire during the night in order to be ______ in the mountain.", ["safe", "safely", "save", "safe"], "A"),
      q("-- There is an oil painting show of the city development. Shall we go for it tomorrow?\n-- ______", ["It doesn't matter.", "Great idea.", "Not at all.", "My pleasure."], "B"),
      q("-- ______\n-- Come on! Just give it a try.", ["I'm afraid I can't ride the bike.", "I'm sorry for breaking the window.", "I'm glad to win first place.", "I'm sure it's bad for your eyes."], "A")
    ],
    clozeStart: 46,
    cloze: [
      c("Yet not many of us will realize how much we rely on technology until we ______ our lives to those in the past. (from the box)", "compare"),
      c("There was no ______ technology at that time, yet the items that people had were quite enough. (from the box)", "modern"),
      c("Without necessary cooking tools, the people could still ______ to make their food as nice as our food today. (from the box)", "manage"),
      c("Animal parts were thrown away if they were not ______. (from the box)", "eaten"),
      c("Without the television set, the radio and more importantly, the computer, we will ______ have any fun in our homes today. (from the box)", "hardly"),
      c("However, the people in the past had their own clever ______ of enjoying themselves. (from the box)", "ways"),
      c("They could make boats for travelling along the rivers and in the ______. (from the box)", "seas"),
      c("Some things are basic for us ______, but people in the past could live to the full even without them. (from the box)", "now"),
      c("Mr. Smith bought three ______ of local snacks for the exchange students. (box)", "boxes"),
      c("On the ______ page of the book, there is an encouraging story. (eight)", "eighth"),
      c("Don't easily follow a fashion. Being ______ is the best rule. (you)", "yourself"),
      c("Online libraries are ______ used for learning in the information age. (wide)", "widely"),
      c("Finally, Jack achieved his goal and became the ______ of a company. (own)", "owner"),
      c("The main purpose of the charity project is to offer help to ______ people. (home)", "homeless"),
      c("When Andy was ______ about his lost smart phone, his friend gave him a big hug. (happy)", "unhappy"),
      c("Hard work pays off. I believe you will ______ your dream school. (entrance)", "enter"),
      c("Lucy ______ ______ the violin in the club on Friday afternoons. (negative form)", "doesn't practise"),
      c("______ ______ will your sister take part in the Chinese poem contest? (question)", "How soon"),
      c("The government is taking action to ______ air quality ______. (same meaning)", "make, better"),
      c("I have no idea ______ ______ operate the new washing machine. (simple sentence)", "how to"),
      c("The picture of a black hole ______ ______ to the world by the scientists on April 10. (passive voice)", "was released"),
      c("Aaron asked me ______ I ______ free to go to his place that Saturday. (indirect speech)", "if/whether, was"),
      c("Arrange the words into a sentence: Teenagers / should / learn / to plan / their future / by themselves.", "Teenagers should learn to plan their future by themselves.")
    ],
    issues: ["第二部分已按人工校准重建，覆盖自动抽取结果。", "2019 年完形填空原始选项框在转文本时缺损，题干按上下文人工整理。"]
  })
];

for (const item of manualData) {
  const questionText = await fs.readFile(path.join(questionsTextDir, `${item.year}-questions.txt`), "utf8");
  const answerText = await fs.readFile(path.join(answersTextDir, `${item.year}-answers.txt`), "utf8");

  const payload = {
    year: item.year,
    fileName: item.fileName,
    questionText,
    answerText,
    questions: item.questions,
    answers: item.answers,
    report: {
      year: item.year,
      fileName: item.fileName,
      answerHeadingFound: true,
      questionTextLength: questionText.length,
      answerTextLength: answerText.length,
      extracted: {
        choiceQuestions: item.choiceCount,
        choiceAnswers: item.choiceCount,
        fillQuestions: item.clozeCount,
        fillAnswers: item.clozeCount,
        importedChoice: item.choiceCount,
        importedFill: item.clozeCount
      },
      issues: item.issues
    }
  };

  await fs.writeFile(
    path.join(manualDir, `${item.year}-part2.json`),
    `${JSON.stringify(payload, null, 2)}\n`,
    "utf8"
  );
}

function buildYearData({
  year,
  fileName,
  choiceStart,
  choice,
  clozeStart,
  cloze,
  issues
}) {
  const questions = [];
  const answers = [];

  for (let index = 0; index < choice.length; index += 1) {
    const number = choiceStart + index;
    const current = choice[index];
    const id = `sh-${year}-part2-choice-${number}`;
    questions.push({
      id,
      sourceType: "choice",
      stem: current.stem,
      options: current.options,
      answer: current.answer,
      gradeBand: "middle-school-source",
      examSource: `${year} ${examSourceSuffix}`,
      knowledgePointId: genericKnowledgePointId,
      explanation,
      difficulty: "pending"
    });
    answers.push({
      id,
      year,
      fileName,
      section: "part2-choice",
      originalQuestionNumber: number,
      answer: current.answer
    });
  }

  for (let index = 0; index < cloze.length; index += 1) {
    const number = clozeStart + index;
    const current = cloze[index];
    const id = `sh-${year}-part2-cloze-${number}`;
    questions.push({
      id,
      sourceType: "cloze",
      stem: current.stem,
      answer: current.answer,
      gradeBand: "middle-school-source",
      examSource: `${year} ${examSourceSuffix}`,
      knowledgePointId: genericKnowledgePointId,
      explanation,
      difficulty: "pending"
    });
    answers.push({
      id,
      year,
      fileName,
      section: "part2-cloze",
      originalQuestionNumber: number,
      answer: current.answer
    });
  }

  return {
    year,
    fileName,
    questions,
    answers,
    choiceCount: choice.length,
    clozeCount: cloze.length,
    issues
  };
}

function q(stem, options, answer) {
  return { stem, options, answer };
}

function c(stem, answer) {
  return { stem, answer };
}
