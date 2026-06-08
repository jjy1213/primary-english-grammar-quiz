import { z } from "zod";

export const knowledgePointSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  keywords: z.array(z.string()),
  relatedPoints: z.array(z.string())
});

export const userAccountSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  displayName: z.string().min(1)
});

export const questionSchema = z
  .object({
    id: z.string().min(1),
    sourceType: z.enum(["choice", "cloze"]),
    stem: z.string().min(1),
    options: z.array(z.string().min(1)).optional(),
    answer: z.string().min(1),
    gradeBand: z.string().min(1),
    examSource: z.string().min(1),
    knowledgePointId: z.string().min(1),
    explanation: z.string().min(1),
    difficulty: z.string().min(1)
  })
  .superRefine((question, ctx) => {
    if (question.sourceType === "choice" && (!question.options || question.options.length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Choice questions must have at least two options."
      });
    }

    if (question.sourceType === "cloze" && question.options && question.options.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cloze questions should not provide options."
      });
    }
  });

export const questionListSchema = z.array(questionSchema);
export const knowledgePointListSchema = z.array(knowledgePointSchema);
export const userAccountListSchema = z.array(userAccountSchema);

export const startQuizSchema = z.object({
  mode: z.enum(["random", "knowledgePoint"]),
  knowledgePointId: z.string().optional(),
  questionType: z.enum(["all", "choice", "cloze"]).optional(),
  questionCount: z.number().int().min(1).optional()
});

export const submitQuizSchema = z.object({
  sessionId: z.string().min(1),
  questionId: z.string().min(1),
  userAnswer: z.string()
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});
