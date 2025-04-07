import { z } from "zod";
import { PlayerSchema } from "./player";

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  captainId: z.string().optional(),
  players: z.object({ connect: z.array(z.any()) }).or(z.array(PlayerSchema)),
  captain: z.object(PlayerSchema.shape).optional(),
  homeMatches: z.array(PlayerSchema).optional(),
  awayMatches: z.array(PlayerSchema).optional(),
  tossWins: z.array(PlayerSchema).optional(),
  battingInnings: z.array(z.any()).optional(),
  bowlingInnings: z.array(z.any()).optional(),
  wins: z.array(z.any()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const TeamSchemaPlain = TeamSchema.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

export const TeamSchemaPartial = TeamSchemaPlain.partial();

export type TeamType = z.infer<typeof TeamSchema>;
export type TeamTypePlain = z.infer<typeof TeamSchemaPlain>;
export type TeamTypePartial = z.infer<typeof TeamSchemaPartial>;
