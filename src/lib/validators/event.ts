import { z } from "zod";

export const registerSchema = z.object({
  userId: z.string().uuid(),
});