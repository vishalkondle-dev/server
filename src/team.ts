import { zValidator } from "@hono/zod-validator";
import { Context, Hono } from "hono";
import { getPrisma } from "../lib/prisma";
import { TeamSchemaPlain, TeamSchemaPartial } from "../types/team";

const teamApp = new Hono<{ Bindings: { DATABASE_URL: string } }>();

const validateTeam = zValidator("json", TeamSchemaPlain);
const validateTeamPartial = zValidator("json", TeamSchemaPartial);

teamApp
  .get("/team", async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const teams = await prisma.team.findMany({
      include: { players: true },
    });
    return c.json(teams);
  })
  .post(validateTeam, async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const data = await c.req.json();
    const teams = await prisma.team.create({ data });
    return c.json(teams);
  })
  .put("/team/:id", validateTeamPartial, async (c) => {
    const id = c.req.param("id");
    const data = await c.req.json();
    const prisma = getPrisma(c.env.DATABASE_URL);
    const teams = await prisma.team.update({ where: { id }, data });
    return c.json(teams);
  })
  .delete(async (c) => {
    const id = c.req.param("id");
    const prisma = getPrisma(c.env.DATABASE_URL);
    const teams = await prisma.team.delete({ where: { id } });
    return c.json(teams);
  })
  .get(async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const id = c.req.param("id");
    const teams = await prisma.team.findUnique({ where: { id } });
    return c.json(teams);
  });

export default teamApp;
