import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getPrisma } from "../lib/prisma";
import {
  PlayerTeamSchemaPlain,
  PlayerTeamSchemaPartial,
} from "../types/playerTeam";

const playerTeamApp = new Hono<{ Bindings: { DATABASE_URL: string } }>();

const validatePlayerTeam = zValidator("json", PlayerTeamSchemaPlain);
const validatePlayerTeamPartial = zValidator("json", PlayerTeamSchemaPartial);

playerTeamApp
  .get("/playerTeam", async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const playerTeams = await prisma.playerTeam.findMany({
      include: { player: true, team: true },
    });
    return c.json(playerTeams);
  })
  .post(validatePlayerTeam, async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const data = await c.req.json();
    const playerTeams = await prisma.playerTeam.create({ data });
    return c.json(playerTeams);
  })
  .put("/playerTeam/:id", validatePlayerTeamPartial, async (c) => {
    const id = c.req.param("id");
    const data = await c.req.json();
    const prisma = getPrisma(c.env.DATABASE_URL);
    const playerTeams = await prisma.playerTeam.update({ where: { id }, data });
    return c.json(playerTeams);
  })
  .delete(async (c) => {
    const id = c.req.param("id");
    const prisma = getPrisma(c.env.DATABASE_URL);
    const playerTeams = await prisma.playerTeam.delete({ where: { id } });
    return c.json(playerTeams);
  })
  .get(async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const id = c.req.param("id");
    const playerTeams = await prisma.playerTeam.findUnique({ where: { id } });
    return c.json(playerTeams);
  });

export default playerTeamApp;
