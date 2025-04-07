import { z } from "zod";
import { InningSchema } from "./inning";

export const OverSchema = z.object({
  id: z.string(),
  inningId: z.string(),
  overNumber: z.number(),
  balls: z.array(z.any()).or(z.object({ connect: z.array(z.any()) })),
  InningId: z.object(InningSchema.shape).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const OverSchemaPlain = OverSchema.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

export const OverSchemaPartial = OverSchemaPlain.partial();

export type OverType = z.infer<typeof OverSchema>;
export type OverTypePlain = z.infer<typeof OverSchemaPlain>;
export type OverTypePartial = z.infer<typeof OverSchemaPartial>;
