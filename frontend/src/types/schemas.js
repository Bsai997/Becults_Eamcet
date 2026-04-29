import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

// Lenient URL validation that accepts Cloudinary URLs with various formats
const lenientUrl = z.string().refine(
  (val) => /^https?:\/\/.+/.test(val.trim()),
  { message: "Must be a valid URL starting with http:// or https://" }
);

export const publishJsonSchema = z.object({
  test_name: z.string().min(1),
  duration: z.number().int().positive(),
  subjects: z.array(
    z.object({
      name: z.enum(["Maths", "Physics", "Chemistry"]),
      questions: z.array(
        z.object({
          question_text: z.string().optional().transform(v => v?.trim() || undefined),
          question_image_url: lenientUrl.optional(),
          explanation: z.string().min(1),
          options: z.array(
            z.object({
              text: z.string().optional().transform(v => v?.trim() || undefined),
              image_url: lenientUrl.optional(),
              is_correct: z.boolean(),
            }).refine(
              (data) => data.text || data.image_url,
              { message: "Option must have either text or image_url" }
            )
          ).length(4),
        }).refine(
          (data) => data.question_text || data.question_image_url,
          { message: "Question must have either question_text or question_image_url" }
        )
      ),
    })
  ),
});
