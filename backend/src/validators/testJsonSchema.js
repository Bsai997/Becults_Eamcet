import { z } from "zod";

// Lenient URL validation that accepts Cloudinary URLs with various formats
const lenientUrl = z.string().refine(
  (val) => /^https?:\/\/.+/.test(val.trim()),
  { message: "Must be a valid URL starting with http:// or https://" }
).transform(v => v.trim().replace(/\?$/, "")); // Remove trailing ?

// Option can be text, image, or both (at least one required)
const optionSchema = z.object({
  text: z.string().optional().transform(v => v?.trim() || undefined),
  image_url: lenientUrl.optional(),
  is_correct: z.boolean(),
}).refine(
  (data) => data.text || data.image_url,
  { message: "Option must have either text or image_url (or both)" }
);

// Question can have text, image, or both (at least one required)
const questionSchema = z.object({
  question_text: z.string().optional().transform(v => v?.trim() || undefined),
  question_image_url: lenientUrl.optional(),
  explanation: z.string().min(1),
  options: z.array(optionSchema).length(4),
}).refine(
  (data) => data.question_text || data.question_image_url,
  { message: "Question must have either question_text or question_image_url (or both)" }
);

const subjectSchema = z.object({
  name: z.enum(["Maths", "Physics", "Chemistry"]),
  questions: z.array(questionSchema).min(1),
});

export const publishTestSchema = z.object({
  test_name: z.string().min(1),
  duration: z.number().int().positive(),
  subjects: z.array(subjectSchema).min(1),
});

export const validateSingleCorrectOption = (payload) => {
  for (const subject of payload.subjects) {
    for (const question of subject.questions) {
      const correctCount = question.options.filter((option) => option.is_correct).length;
      if (correctCount !== 1) {
        return false;
      }
    }
  }
  return true;
};
