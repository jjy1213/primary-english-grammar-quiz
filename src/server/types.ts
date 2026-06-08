export type QuestionSourceType = "choice" | "cloze";
export type QuizMode = "random" | "knowledgePoint";
export type QuestionTypeFilter = "all" | QuestionSourceType;

export interface KnowledgePoint {
  id: string;
  name: string;
  category: string;
  description: string;
  keywords: string[];
  relatedPoints: string[];
}

export interface Question {
  id: string;
  sourceType: QuestionSourceType;
  stem: string;
  options?: string[];
  answer: string;
  gradeBand: string;
  examSource: string;
  knowledgePointId: string;
  explanation: string;
  difficulty: string;
}

export interface AttemptRecord {
  id: string;
  submittedAt: string;
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
  knowledgePointId: string;
}

export interface UserAccount {
  id: string;
  username: string;
  password: string;
  displayName: string;
}

export interface QuizSession {
  id: string;
  mode: QuizMode;
  knowledgePointId?: string;
  questionType?: QuestionTypeFilter;
  questionIds: string[];
  currentIndex: number;
  correctCount: number;
  createdAt: string;
  completedAt?: string;
  answers: Array<{
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }>;
}

export interface PublicQuestion {
  id: string;
  sourceType: QuestionSourceType;
  stem: string;
  options?: string[];
  gradeBand: string;
  examSource: string;
  knowledgePointId: string;
  difficulty: string;
}

export interface QuizQuestionPayload extends PublicQuestion {
  knowledgePointName: string;
}

export interface QuizStartResponse {
  sessionId: string;
  mode: QuizMode;
  questionType: QuestionTypeFilter;
  totalQuestions: number;
  currentQuestion: QuizQuestionPayload | null;
}

export interface QuizSubmitResponse {
  sessionId: string;
  isCorrect: boolean;
  correctAnswer: string;
  correctAnswerLabel?: string;
  explanation: string;
  knowledgePoint: KnowledgePoint;
  userAnswer: string;
  question: QuizQuestionPayload;
  progress: {
    answered: number;
    total: number;
    correct: number;
  };
  nextQuestion: QuizQuestionPayload | null;
  isFinished: boolean;
  summary?: {
    totalQuestions: number;
    correctCount: number;
    accuracy: number;
    items: Array<{
      questionId: string;
      stem: string;
      sourceType: QuestionSourceType;
      options?: string[];
      examSource: string;
      userAnswer: string;
      isCorrect: boolean;
      correctAnswer: string;
      correctAnswerLabel?: string;
      knowledgePointName: string;
      explanation: string;
    }>;
  };
}

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    displayName: string;
  };
}
