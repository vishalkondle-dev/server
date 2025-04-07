import { z } from "zod";

export const PlayerTeamSchema = z.object({
  id: z.string(),
  playerId: z.optional(z.string()),
  teamId: z.optional(z.string()),
  joinedAt: z.string(),
});

export const PlayerTeamSchemaPlain = PlayerTeamSchema.omit({ id: true });

export const PlayerTeamSchemaPartial = PlayerTeamSchemaPlain.partial();

export type PlayerTeamType = z.infer<typeof PlayerTeamSchema>;
export type PlayerTeamTypePlain = z.infer<typeof PlayerTeamSchemaPlain>;
export type PlayerTeamTypePartial = z.infer<typeof PlayerTeamSchemaPartial>;
