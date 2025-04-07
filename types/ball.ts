import { z } from "zod";
import { OverSchema } from "./over";
import { PlayerSchema } from "./player";

export const BallSchema = z.object({
  id: z.string(),
  overId: z.string(),
  ballNumber: z.number(),
  strikerId: z.string(),
  nonStrikerId: z.string().optional(),
  bowlerId: z.string(),
  outBatsmanId: z.string().optional(),
  runs: z.number(),
  extras: z.string().optional(),
  extraRuns: z.number().optional(),
  isWicket: z.boolean(),
  wicketType: z.string().optional(),
  fielderId: z.string().optional(),
  assistFielderId: z.string().optional(),
  comment: z.string().optional(),
  actionId: z.string().optional(),
  over: z.object(OverSchema.shape).optional(),
  stiker: z.object(PlayerSchema.shape).optional(),
  nonStriker: z.object(PlayerSchema.shape).optional(),
  bowler: z.object(PlayerSchema.shape).optional(),
  outBatsman: z.object(PlayerSchema.shape).optional(),
  fielder: z.object(PlayerSchema.shape).optional(),
  assistFielder: z.object(PlayerSchema.shape).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const BallSchemaPlain = BallSchema.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

export const BallSchemaPartial = BallSchemaPlain.partial();

export type BallType = z.infer<typeof BallSchema>;
export type BallTypePlain = z.infer<typeof BallSchemaPlain>;
export type BallTypePartial = z.infer<typeof BallSchemaPartial>;
