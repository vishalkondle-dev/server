import { z } from "zod";
import { TeamSchema } from "./team";

const MatchSchema = z.object({
  id: z.string(),
  homeTeamId: z.string(),
  awayTeamId: z.string(),
  venue: z.string(),
  matchDate: z.date().or(z.string()),
  tossWinnerTeamId: z.string(),
  choose: z.enum(["BAT", "BOWL"]),
  isCompleted: z.boolean(),
  winnerTeamId: z.string(),
  actions: z.array(z.any()).or(
    z.object({
      connect: z.array(z.any()),
    })
  ),
  home: z.object(TeamSchema.shape).optional(),
  away: z.object(TeamSchema.shape).optional(),
  tossWinnerTeam: z.object(TeamSchema.shape).optional(),
  innings: z.array(z.any()).or(
    z.object({
      connect: z.array(z.any()),
    })
  ),
  winnerTeam: z.object(TeamSchema.shape).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export default MatchSchema;

export const MatchSchemaPlain = MatchSchema.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

export const MatchSchemaPartial = MatchSchemaPlain.partial();

export type MatchType = z.infer<typeof MatchSchema>;
export type MatchTypePlain = z.infer<typeof MatchSchemaPlain>;
export type MatchTypePartial = z.infer<typeof MatchSchemaPartial>;
