import { z } from "zod";

export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  dateOfBirth: z.string(),
  role: z.string(),
  battingHand: z.string(),
  bowlingHand: z.string(),
  bowlingStyle: z.string(),
  teams: z.any(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  captainOf: z.any(),
  strikerBalls: z.any(),
  nonStrikerBalls: z.any(),
  bowledBalls: z.any(),
  dismissedBalls: z.any(),
  fieldedBalls: z.any(),
  assistFieldedBalls: z.any(),
});

export const PlayerSchemaPlain = PlayerSchema.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

export const PlayerSchemaPartial = PlayerSchemaPlain.partial();

export type PlayerType = z.infer<typeof PlayerSchema>;
export type PlayerTypePlain = z.infer<typeof PlayerSchemaPlain>;
export type PlayerTypePartial = z.infer<typeof PlayerSchemaPartial>;
