import { z } from "zod";
import { TeamSchema } from "./team";

export const InningSchema = z.object({
  id: z.string(),
  matchId: z.string(),
  battingTeamId: z.string(),
  bowlingTeamId: z.string(),
  overs: z.array(z.any()).or(
    z.object({
      connect: z.array(z.any()),
    })
  ),
  battingTeam: z.array(TeamSchema).optional(),
  bowlingTeam: z.array(TeamSchema).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const InningSchemaPlain = InningSchema.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

export const InningSchemaPartial = InningSchemaPlain.partial();

export type InningType = z.infer<typeof InningSchema>;
export type InningTypePlain = z.infer<typeof InningSchemaPlain>;
export type InningTypePartial = z.infer<typeof InningSchemaPartial>;
