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

const years = [
  buildYearData({
    year: "2008",
    fileName: "2008年上海市初中毕业生统一学业考试英语试卷及答案.txt",
    choiceStart: 31,
    choice: [
      q("Some girls get sick after they try so hard to lose ______ weight.", ["a", "the", "/", "an"], "C"),
      q("The plane will take off ______ an hour. Please check in right now.", ["at", "in", "on", "to"], "B"),
      q("Did Mary visit that old town by ______ last week?", ["her", "she", "hers", "herself"], "D"),
      q("After moving to their new house, the Lees bought some ______ in the mall nearby.", ["furniture", "chair", "table", "shelf"], "A"),
      q("______ her great joy, her daughter was finally saved by the doctors.", ["In", "To", "At", "For"], "B"),
      q("\"Have ______ try, you are so close to the answer,\" the teacher said to Eric.", ["the other", "one another", "other", "another"], "D"),
      q("Everyone likes Kevin because he talks to others ______.", ["friendly", "lovely", "politely", "luckily"], "C"),
      q("Jenny goes to school ______ than any other student in her class.", ["early", "earlier", "earliest", "the earliest"], "B"),
      q("Which one is heavier, the wooden ball ______ the iron ball?", ["or", "and", "but", "so"], "A"),
      q("Tim didn't have dinner ______ he finished watching the cartoon.", ["while", "unless", "until", "since"], "C"),
      q("Landing on the moon sounds ______. I hope I can go there one day.", ["wonderful", "wonderfully", "terrible", "terribly"], "A"),
      q("Soon you ______ a senior high school student. Isn't it exciting!", ["become", "will become", "became", "have become"], "B"),
      q("I ______ a copy of Yi Zhongtian's book yet. I might buy one tomorrow.", ["hadn't bought", "don't buy", "won't buy", "haven't bought"], "D"),
      q("You ______ write the poem down. Our teacher will give us a copy.", ["can't", "shouldn't", "needn't", "mustn't"], "C"),
      q("-- Would you like to play table tennis with me?\n-- I don't feel like it. I would rather ______ at home and watch TV.", ["stay", "to stay", "staying", "stayed"], "A"),
      q("After Donghai Bridge ______, it became a new tourist attraction.", ["completed", "complete", "is completed", "was completed"], "D"),
      q("How long can I ______ this magazine?", ["borrow", "return", "buy", "keep"], "D"),
      q("As soon as he ______ the bus, the poor man realized he had left his wallet on it.", ["got on", "got off", "got to", "got in"], "B"),
      q("The Oriental Pearl TV Tower is ______ all Shanghai citizens.", ["famous for", "familiar to", "pleased with", "interested in"], "B"),
      q("-- I won the 100-meter race on our sports day.\n-- ______ We are proud of you!", ["That's all right.", "Sorry to hear that.", "Congratulations.", "I'd love to."], "C")
    ],
    clozeStart: 51,
    cloze: [
      c("She said sorry to Mike for taking his paper home by mistake. (closest meaning)", "apologized"),
      c("The English party will be held three days before Christmas. (closest meaning)", "take place"),
      c("Her friend always gives her a hand whenever she is in trouble. (closest meaning)", "does ... a favour"),
      c("Nancy has made up her mind to work in the mountain area. (closest meaning)", "decided"),
      c("\"Mm... the soup tastes very nice!\" (closest meaning)", "is delicious"),
      c("\"Could you say it once more?\" (closest meaning)", "again"),
      c("\"Do you feel it dull to take a walk for an hour every morning?\" (closest meaning)", "boring"),
      c("\"I have no idea.\" (closest meaning)", "don't know"),
      c("Billy looks upset. What happened to ______? (he)", "him"),
      c("It is said that eight ______ of water a day can help you keep fit. (glass)", "glasses"),
      c("Linton is interested in Chinese history and this is his ______ visit to Beijing. (four)", "fourth"),
      c("Don't throw the old watch away. It is still ______. (use)", "useful"),
      c("Fishing is one of my ______ outdoor activities. (favour)", "favourite"),
      c("Grandpa is going to ______ his house and live with us. (sale)", "sell"),
      c("Nowadays too many boys want to become ______. (act)", "actors"),
      c("Mary is good at writing. She will ______ be a reporter in the future. (possible)", "possibly"),
      c("______ Susan ______ her piano lesson on Saturday afternoon? (general question)", "Does, have"),
      c("______ ______ is your father's? (question)", "Which car"),
      c("______ ______ the new housing estate in the city center is! (exclamation)", "How expensive"),
      c("Why do the twins look ______ ______ each other? (same meaning)", "different from"),
      c("Bob hasn't told his friends ______ ______ would like to be in the future. (object clause)", "what he")
    ],
    issues: ["2008 年第二部分已按题面与答案页人工重建。"]
  }),
  buildYearData({
    year: "2009",
    fileName: "2009年上海中考英语试题及答案.txt",
    choiceStart: 31,
    choice: [
      q("Can I have ______ look at the photo of your pen friend?", ["a", "an", "/", "the"], "A"),
      q("The teacher often takes his students to visit the Science Museum ______ Saturdays.", ["in", "by", "at", "on"], "D"),
      q("The foreign visitors asked ______ lots of questions about Chinese culture during the tour.", ["I", "my", "me", "mine"], "C"),
      q("______ of these two hats looks good on my daughter. Do you have another one?", ["Both", "All", "Neither", "None"], "C"),
      q("The little boy saved his classmates in the earthquake. ______ brave he was!", ["What", "How", "What a", "What an"], "B"),
      q("The American student could speak only ______ Chinese, but he managed to communicate with us.", ["few", "little", "a few", "a little"], "D"),
      q("Thanks to the new inventions, our lives are much ______ than before.", ["convenient", "more convenient", "most convenient", "the most convenient"], "B"),
      q("The home-made ice-cream in this restaurant tastes ______. Would you like some?", ["softly", "greatly", "nice", "well"], "C"),
      q("When summer ______, some children will go to the seaside for fun.", ["comes", "came", "will come", "would come"], "A"),
      q("I ______ you already that washing hands often will help prevent the A-H1N1 Flu.", ["tell", "told", "have told", "am telling"], "C"),
      q("He was still working on his project while other people ______ a rest.", ["were having", "are having", "will have", "have"], "A"),
      q("Many houses ______ in the big fire a few days ago. What a shame!", ["were damaged", "damage", "were damaging", "damaged"], "A"),
      q("To everyone's surprise, Alex ______ play chess very well when he was only four.", ["might", "should", "would", "could"], "D"),
      q("The woman feels that she should let her son ______ his own decision this time.", ["makes", "make", "to make", "making"], "B"),
      q("Susan finally became a popular singer after she practised ______ for years.", ["sing", "to sing", "singing", "sang"], "C"),
      q("______ John failed to climb to the top of the mountain several times, he didn't give up.", ["Although", "Because", "Whether", "Unless"], "A"),
      q("Keep an English diary, ______ your English will improve.", ["or", "since", "when", "and"], "D"),
      q("Could you please tell us ______ in Shanghai?", ["when will you visit the World Expo", "when you will visit the World Expo", "when the World Expo will you visit", "when the World Expo you will visit"], "B"),
      q("The room is very dark. I can't ______ anything clearly without a light.", ["watch", "look", "see", "notice"], "C"),
      q("It's ______ to read the map before you travel to a new place.", ["helpful", "harmful", "powerful", "awful"], "A"),
      q("Once a year, people take part in \"______ Lights\" activity to help save energy.", ["Show off", "Turn off", "Take off", "Put off"], "B"),
      q("Our headmaster invited Christine to ______ the English Festival last term.", ["be late for", "be angry with", "be familiar with", "be responsible for"], "D"),
      q("Many sports players became well-known after they joined in the Beijing Olympic Games. (closest meaning)", ["rich", "strong", "lucky", "famous"], "D"),
      q("Be careful! There's some broken glass on the ground. (closest meaning)", ["Look out", "Go ahead", "Get ready", "Keep quiet"], "A"),
      q("-- How about raising some money for the charity?\n-- ______", ["Enjoy yourself.", "Good idea.", "You're welcome.", "Never mind."], "B"),
      q("-- You've done a great job, Grace.\n-- ______", ["I'm afraid not.", "Thanks a lot.", "I agree with you.", "It's hard to say."], "B")
    ],
    clozeStart: 57,
    cloze: [
      c("Many historical ______ will be shown on National Day. (movie)", "movies"),
      c("With the help of Yellow Pages, we found the address of the theatre ______. (easy)", "easily"),
      c("Eric, the ______ son of the family, has a special interest in physics. (three)", "third"),
      c("It's ______ for him to be so active today as he is always a man of few words. (usual)", "unusual"),
      c("Who is the ______ of the book War and Peace? (write)", "writer"),
      c("The short play was very ______. I laughed from beginning to end. (fun)", "funny"),
      c("It's raining heavily. I'd ______ you call a taxi home now. (suggestion)", "suggest"),
      c("I think the girl is old enough to tie up her shoes by ______. (her)", "herself"),
      c("______ they ______ on the farm with their parents every weekend? (general question)", "Do, work"),
      c("Let's take a picture in front of the fountain, ______ ______? (tag question)", "shall we"),
      c("______ ______ is the Shanghai International Arts Festival held? (question)", "How often"),
      c("He was ______ nervous ______ go on with the job interview. (combine)", "too, to"),
      c("I have no idea ______ ______ operate the new machine. (simple sentence)", "how to"),
      c("I'm going to make an early start ______ ______ I won't miss the train. (same meaning)", "so that")
    ],
    issues: ["2009 年第二部分已按题面与答案解析人工重建。"]
  }),
  buildYearData({
    year: "2010",
    fileName: "2010年上海市初中毕业统一学业考试英语试卷及答案.txt",
    choiceStart: 31,
    choice: [
      q("The famous actor often plays ______ his children in the park.", ["about", "in", "at", "with"], "D"),
      q("The volunteers love ______ students in that small village in the west of China.", ["they", "them", "their", "themselves"], "C"),
      q("You can get much ______ about the World Expo on the Internet.", ["map", "picture", "ticket", "information"], "D"),
      q("New Zealand has two islands. One is North Island and ______ is South Island.", ["another", "the other", "other", "the others"], "B"),
      q("Listening is just as ______ as speaking in language learning.", ["important", "more important", "most important", "the most important"], "A"),
      q("Is this a photo of your daughter? She looks ______ in the pink dress!", ["lovely", "quietly", "politely", "happily"], "A"),
      q("We will have no water to drink ______ we don't protect the earth.", ["until", "before", "though", "if"], "D"),
      q("Money is important, ______ it can't buy everything.", ["for", "but", "or", "so"], "B"),
      q("Today is Father's Day. My mother ______ a special dinner for my grandpa now.", ["prepare", "prepared", "is preparing", "will prepare"], "C"),
      q("Tina and her parents ______ to England for sightseeing last summer.", ["go", "went", "will go", "have gone"], "B"),
      q("The Harry Potter books ______ pretty popular since they were published.", ["become", "will become", "have become", "are becoming"], "C"),
      q("A Disneyland Park ______ in Shanghai Pudong New Area in the near future.", ["builds", "has built", "will build", "will be built"], "D"),
      q("Richard turned off the computer after he had finished ______ the email.", ["write", "to write", "writing", "wrote"], "C"),
      q("Before going to the History Museum, our teacher told us ______ the public rules.", ["obey", "to obey", "obeying", "obeyed"], "B"),
      q("Everyone ______ go through the security check when entering the World Expo Park.", ["can", "may", "must", "ought"], "C"),
      q("-- ______ is it from here to the railway station?\n-- About ten kilometres.", ["How far", "How fast", "How soon", "How often"], "A"),
      q("______ exciting sport it is to climb the mountains!", ["How", "What", "What a", "What an"], "D"),
      q("I want to know ______.", ["when we should arrive at the airport", "when should we arrive at the airport", "when the airport we should arrive at", "when the airport should we arrive at"], "A"),
      q("My dog is gentle and never bites, so you needn't be ______.", ["excited", "frightened", "satisfied", "interested"], "B"),
      q("Your homework is well done. Just ______ some small mistakes in it.", ["create", "connect", "correct", "control"], "C"),
      q("The customers are pleased with the ______ of the restaurant.", ["balance", "experience", "surface", "service"], "D"),
      q("The bus is coming. Be careful when you ______ the bus.", ["get on", "get off", "get up", "get to"], "A"),
      q("Angel is keen on all kinds of pop music. (closest meaning)", ["is surprised at", "is famous for", "is fond of", "is worried about"], "C"),
      q("The bridge enables people to get to the island in less than an hour. (closest meaning)", ["makes it safe for", "makes it possible for", "makes it necessary for", "makes it enjoyable for"], "B"),
      q("-- I'm really sorry to have broken your coffee cup.\n-- ______", ["Good idea.", "That's all right.", "I don't think so.", "You are welcome."], "B"),
      q("-- Sharon, remember to lock the door before leaving the house.\n-- ______", ["OK. I will.", "Yes, please.", "It's hard to say.", "It doesn't matter."], "A")
    ],
    clozeStart: 57,
    cloze: [
      c("Joanna received many ______ when graduating from middle school. (gift)", "gifts"),
      c("Alex is ______ years old and is taken good care of in the kindergarten. (fourth)", "four"),
      c("Whose school uniform is that on the chair, yours or ______? (my)", "mine"),
      c("It was ______ for human beings to predict weather in the past. (difficulty)", "difficult"),
      c("There is a beautiful ______ on the wall in each room of my house. (paint)", "painting"),
      c("You need to explain your opinions quite ______ when having a debate. (clear)", "clearly"),
      c("Let's hope that all our troubles will ______ soon. (appear)", "disappear"),
      c("The local people are ______ that the whole nation is helping them rebuild the town. (thank)", "thankful"),
      c("______ Peter often ______ in the house at the weekend? (general question)", "Does, help"),
      c("______ ______ you use to stay on family holidays? (question)", "Where, did"),
      c("Your mother has never tried shopping on the Internet, ______ ______? (tag question)", "has, she"),
      c("______ ______ James ten years to make this amazing film. (same meaning)", "It, took"),
      c("______ Chris ______ Karen have gone to South Africa to enjoy the 2010 World Cup. (combine)", "Both, and"),
      c("Visitors love this city ______ ______ its historical sights and delicious food. (simple form)", "because of/due to")
    ],
    issues: ["2010 年第二部分已按题面与文末答案键人工重建。"]
  }),
  buildYearData({
    year: "2011",
    fileName: "2011年上海市初中毕业生统一学业考试英语试卷及答案.txt",
    choiceStart: 31,
    choice: [
      q("This novel can make you laugh and cry at ______ same time.", ["a", "an", "the", "/"], "C"),
      q("The university student borrowed some money ______ his friends to start his own business.", ["from", "onto", "at", "in"], "A"),
      q("I have two children, and ______ of them are working in the west of China.", ["all", "both", "neither", "either"], "B"),
      q("The old man used to raise many ______ to make a living on the farm.", ["duck", "horse", "bird", "sheep"], "D"),
      q("The students from Xinjiang enjoy staying in our school because everyone is ______ to them.", ["friendly", "gently", "happily", "politely"], "A"),
      q("We hope that with the help of the new skill, Liu Xiang can run ______ than before.", ["fast", "faster", "fastest", "the fastest"], "B"),
      q("Take the exam carefully, ______ you won't get full marks.", ["but", "and", "or", "so"], "C"),
      q("We didn't start our discussion ______ everybody arrived.", ["since", "if", "while", "until"], "D"),
      q("You ______ lose your way if you walk alone in the mountains at night.", ["may", "need", "should", "ought to"], "A"),
      q("By the end of the last month, I ______ all the CDs of Justin Bieber.", ["collect", "collected", "have collected", "had collected"], "D"),
      q("Now my father ______ his bike to work every day instead of driving.", ["ride", "rode", "rides", "will ride"], "C"),
      q("We are glad to hear that the Greens ______ to a new flat next week.", ["moved", "moved", "will move", "have moved"], "C"),
      q("An official ______ by some reporters on food problems in Shanghai yesterday.", ["is interviewing", "is interviewed", "was interviewing", "was interviewed"], "D"),
      q("As we all know, it's not polite to keep others ______ for a long time.", ["wait", "waited", "to wait", "waiting"], "D"),
      q("You had better ______ because you have to drive back home.", ["not drinking", "not drink", "don't drink", "not to drink"], "B"),
      q("Your English teacher has never lost his temper, ______ he?", ["has", "hasn't", "did", "didn't"], "A"),
      q("-- ______ T-shirt do you like better, the red one or the blue one?\n-- I prefer the red one.", ["How much", "How many", "Whose", "Which"], "D"),
      q("There ______ still some milk in the fridge. It's not necessary to go to the store today.", ["am", "is", "are", "be"], "B"),
      q("These natural disasters have warned us that everyone should start to protect the ______ immediately.", ["amusement", "development", "environment", "government"], "C"),
      q("Edward, you have grown up. You should learn to make your own room ______.", ["empty", "noisy", "dirty", "tidy"], "D"),
      q("Though I ______ the phone number many times, the foreigner couldn't write it down.", ["repeated", "refused", "researched", "recognized"], "A"),
      q("The lady ______ dancing as a hobby in her sixties, and she is really good at it now.", ["dressed up", "looked up", "took up", "put up"], "C"),
      q("I have no idea what life would be like without water. (closest meaning)", ["don't remember", "don't know", "don't believe", "don't expect"], "B"),
      q("When you have western food, you should use knife and fork properly. (closest meaning)", ["in a quick way", "in the right way", "in a different way", "in the usual way"], "B"),
      q("-- I think honesty is the most important thing in doing everything.\n-- ______", ["All right", "Never mind", "I think so, too", "Yes, please"], "C"),
      q("-- I'm leaving for Canada on a study trip next week.\n-- ______", ["Enjoy your time", "That's all right", "You're welcome", "It's a pleasure"], "A")
    ],
    clozeStart: 57,
    cloze: [
      c("Climb up to the ______ floor, and you can enjoy a better view. (eleven)", "eleventh"),
      c("______, Grace made up her mind to live abroad with her daughter. (final)", "finally"),
      c("It is a very ______ book for language learners to improve writing skills. (use)", "useful"),
      c("Don't worry about your son. He is old enough to be independent and live by ______. (he)", "himself"),
      c("The movie Kungfu Panda II is sure to ______ a large number of teenagers. (attractive)", "attract"),
      c("If you don't go on a diet, it is ______ for you to lose weight. (possible)", "impossible"),
      c("The local people had to move away because of the serious ______. (pollute)", "pollution"),
      c("The great ______ gave his first show in Shanghai and the tickets sold out in minutes. (art)", "artist"),
      c("We ______ ______ in touch with each other by email. (negative form)", "don't keep"),
      c("______ ______ does your school organize an English speech contest? (question)", "How often"),
      c("______ ______ nice place the beach is for tourists! (exclamation)", "What a"),
      c("The sales manager wants to know ______ there ______ any new markets in Asia. (object clause)", "whether/if, are"),
      c("Many graduates will ______ ______ by the university to celebrate its 100th birthday. (passive voice)", "be invited"),
      c("We should ______ talk loudly ______ smoke in the theatre. (same meaning)", "neither, nor")
    ],
    issues: ["2011 年第二部分已按题面与文末答案键人工重建。"]
  }),
  buildYearData({
    year: "2012",
    fileName: "2012年上海市初中毕业统一学业考试英语试卷及答案.txt",
    choiceStart: 31,
    choice: [
      q("Could I have an early morning call ______ six o'clock tomorrow?", ["on", "to", "at", "in"], "C"),
      q("We have decided to try ______ best to raise more money for the local charity.", ["us", "our", "we", "ours"], "B"),
      q("You really don't have to worry ______ your weight. You look just right.", ["for", "from", "with", "about"], "D"),
      q("I can't connect my computer to the Internet. There must be ______ wrong with it.", ["something", "everything", "anything", "nothing"], "A"),
      q("The baby feels ______ while his mother holds him in her arms.", ["save", "safe", "safely", "safety"], "B"),
      q("Pudong International Airport is one of ______ airports in the world.", ["big", "bigger", "biggest", "the biggest"], "D"),
      q("Martin and his friends didn't eat up all the food they ordered, ______ they took the rest away.", ["for", "or", "so", "as"], "C"),
      q("Peter will cook for his parents ______ the International Day of Families comes.", ["unless", "when", "until", "though"], "B"),
      q("With the help of the new technology, you ______ e-mail your friends by mobile phone.", ["can", "must", "need", "should"], "A"),
      q("______ Tony ______ Frank likes the CD. They think the music is too noisy.", ["Neither...nor", "Either...or", "Both...and", "Not only...but also"], "A"),
      q("Stop ______ about the traffic. Just think about what we can do to improve it.", ["complain", "to complain", "complaining", "complained"], "C"),
      q("Don't jump to a conclusion! Let's ______ the problem first.", ["to discuss", "discuss", "discussed", "discussing"], "B"),
      q("-- ______ do millions of online users visit the home page of the government?\n-- To read the news and search for the information they need.", ["When", "Where", "Why", "What"], "C"),
      q("The volunteers ______ a lot of help to the community for nearly ten years.", ["offered", "will offer", "are offering", "have offered"], "D"),
      q("The students ______ the Art Festival when I passed by their school.", ["celebrate", "were celebrating", "will celebrate", "have celebrated"], "B"),
      q("Jenny told me that she ______ an English Speech Contest the next month.", ["takes part in", "is taking part in", "took part in", "would take part in"], "D"),
      q("______ wonderful concert they are putting on in the city square!", ["How", "What", "What a", "What an"], "C"),
      q("I'm sure that stricter rules to control cigarette smoking ______ very soon.", ["made", "will make", "were made", "will be made"], "D"),
      q("-- Shall we join in the Green World Summer Camp?\n-- ______", ["Good idea.", "You're welcome.", "Not at all.", "Never mind."], "A"),
      q("-- Congratulations! You've got a chance to be an exchange student!\n-- ______", ["Thank you.", "I agree.", "Of course.", "Good luck."], "A")
    ],
    clozeStart: 51,
    cloze: [
      c("Then you will ______ understand your questions better and get right answers on the day of the interview. (from the box)", "possibly"),
      c("Then think about yourself - your strong points and ______ ones. (from the box)", "weak"),
      c("You might want to speak about your interests and ______ outside school. (from the box)", "hobbies"),
      c("When you first meet the interviewer, greet him or her ______. (from the box)", "politely"),
      c("You want the interviewer to think you are ______ and friendly. (from the box)", "confident"),
      c("If you get nervous, take a deep ______ to calm yourself down. (from the box)", "breath"),
      c("Last but not least, ______ the interview, don't forget to thank the interviewer and say goodbye. (from the box)", "at the end of"),
      c("I'm sure that you will ______ your interviews. (from the box)", "do well in"),
      c("The students took the PISA test in ______ subjects - reading, maths and science. (third)", "three"),
      c("Board games are more and more popular among ______. (teenager)", "teenagers"),
      c("I liked to walk in fields on ______ days and to see my footprints left behind. (snow)", "snowy"),
      c("______ people often begin their conversations by talking about the weather. (Britain)", "British"),
      c("The news about education has attracted the public attention ______. (recent)", "recently"),
      c("The World Chocolate Park showed a ______ of many kinds of chocolates. (collect)", "collection"),
      c("To improve your writing skills, you'd better ______ a habit of reading. (development)", "develop"),
      c("Don't tell lies. Nobody likes those ______ people. (honest)", "dishonest"),
      c("______ the new product ______ of four main parts inside? (general question)", "Does, consist"),
      c("Jessica ______ ______ the physics problems without any help. (same meaning)", "worked out"),
      c("______ advice ______ Susan follow to design smart shoes? (question)", "Whose, did"),
      c("Lin Dan played badminton well ______ ______ win the Thomas Cup again. (combine)", "enough to"),
      c("Ideas ______ always ______ by my students in class. (passive voice)", "are, shared"),
      c("You ______ be able to make the best wine ______ you choose the perfect grapes only. (same meaning)", "won't, unless"),
      c("A parent asked ______ it ______ the first boys-only school in the city. (object clause)", "whether/if, was")
    ],
    issues: ["2012 年第二部分已按题面与文末答案键人工重建。"]
  }),
  buildYearData({
    year: "2014",
    fileName: "2014年上海市初中毕业统一考试英语试卷及答案.txt",
    choiceStart: 26,
    choice: [
      q("Garden School is very famous and it's Mary's first choice. Which of the following is correct for the underlined word?", ["/fɜːst/", "/fi:st/", "/fri:st/", "/frist/"], "A"),
      q("Do you see that good-looking young man? ______ is a famous Korean film star.", ["He", "His", "Him", "Himself"], "A"),
      q("More and more people in Shanghai choose to go to work ______ underground.", ["in", "with", "by", "for"], "C"),
      q("Students are encouraged to share their learning experience ______ their classmates.", ["to", "in", "at", "with"], "D"),
      q("The traffic is moving very slowly as so many cars ______ on their way back to Shanghai.", ["am", "is", "are", "be"], "C"),
      q("-- ______ can you finish the report on food safety?\n-- In two days.", ["How far", "How much", "How often", "How soon"], "D"),
      q("Old Mr. Black lives happily with his three dogs. ______ of them are part of his family.", ["Both", "All", "None", "Neither"], "B"),
      q("Air pollution has become ______ than ever before. We must do something to stop it.", ["serious", "more serious", "most serious", "the most serious"], "B"),
      q("______ carefully, Michael! There's a school ahead.", ["Drive", "To drive", "Drove", "Driving"], "A"),
      q("All passengers ______ go through safety check before they take a plane.", ["can", "may", "must", "ought"], "C"),
      q("-- Would you like to go to the cartoon show with me?\n-- It sounds like fun, ______ I'm too busy.", ["so", "for", "or", "but"], "D"),
      q("John didn't give up looking for a job ______ he got an offer from a German company.", ["until", "since", "because", "if"], "A"),
      q("Aunt Lucy will tell us something about her trip to Australia when she ______ back.", ["came", "comes", "would come", "will come"], "B"),
      q("The robot can help me sweep the floor. ______ smart invention it is!", ["What", "What a", "What an", "How"], "B"),
      q("Susan and Lily ______ tomatoes and other vegetables on the farm this time yesterday.", ["pick", "are picking", "will pick", "were picking"], "D"),
      q("By the end of last week, she ______ in the west of China for two months helping the homeless children.", ["will stay", "has stayed", "would stay", "had stayed"], "D"),
      q("Harry has decided ______ an online shop after graduating from school.", ["open", "to open", "opened", "opening"], "B"),
      q("I wouldn't mind ______ a roommate. We can help each other and save money as well.", ["having", "to have", "have", "had"], "A"),
      q("-- Remember to print on both sides of the paper.\n-- ______", ["Me, too", "Well done.", "Sure. I will", "That's all right."], "C"),
      q("-- I was just in time to get there for the meeting. Thank you for lending me the bike.\n-- ______", ["That's right.", "Of course not.", "You're welcome.", "The same to you."], "C")
    ],
    clozeStart: 46,
    cloze: [
      c("When I was at home, we ______ about many things. (from the box)", "argued"),
      c("One time, before a big party, she ______ to let me leave the house. (from the box)", "refused"),
      c("I was the only girl without makeup, and I was so ______. (from the box)", "mad"),
      c("Her ______ always made me upset. (from the box)", "behaviours"),
      c("But after a few months at college, I changed myself ______. (from the box)", "completely"),
      c("My new way of thinking brought me ______ my mother. (from the box)", "closer to"),
      c("We go to movies ______ and read the same books. (from the box)", "together"),
      c("I tell her about my problems and she gives me good ______. (from the box)", "advice"),
      c("Don't be afraid of making ______. They help you learn. (mistake)", "mistakes"),
      c("The medicine should be taken ______ a day after meals, George. (two)", "twice"),
      c("I plan to enter for a summer camp with a friend of ______. (me)", "mine"),
      c("I am not satisfied with the service here. I want to speak to the ______. (manage)", "manager"),
      c("The boy moved ______ into the hall as the concert had already begun. (quiet)", "quietly"),
      c("The soldier saved the boy from the flood with a piece of ______. (wooden)", "wood"),
      c("Shops are not allowed to ______ cigarettes to anyone under the age of 18. (sale)", "sell"),
      c("Many people enjoy reading e-books, but I ______ it as it's bad for the eyes. (like)", "dislike"),
      c("Ben ______ ______ the project on reusing natural resources. (negative form)", "hasn't finished"),
      c("______ ______ will Amy study in an international language school? (question)", "How long"),
      c("______ my ______, I saw my sister's photograph on a magazine cover. (same meaning)", "To, surprise"),
      c("The girl wondered ______ ______ meet her friends the next morning. (simple sentence)", "where to"),
      c("Sometimes smart phones ______ ______ to take pictures instead of cameras. (passive voice)", "are used"),
      c("John asked ______ I ______ look after his pet dog while he was away. (object clause)", "if/whether, could"),
      c("Arrange the words into a sentence: the students / are doing / an experiment / in the lab.", "The students are doing an experiment in the lab.")
    ],
    issues: ["2014 年第二部分已按题面与答案页人工重建。"]
  })
];

for (const item of years) {
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

function buildYearData({ year, fileName, choiceStart, choice, clozeStart, cloze, issues }) {
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
