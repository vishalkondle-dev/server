import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getPrisma } from "../lib/prisma";
import { MatchSchemaPartial, MatchSchemaPlain } from "../types/match";

const matchApp = new Hono<{ Bindings: { DATABASE_URL: string } }>();

const validateMatch = zValidator("json", MatchSchemaPlain);
const validateMatchPartial = zValidator("json", MatchSchemaPartial);

matchApp
  .get("/match", async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const matchs = await prisma.match.findMany({
      include: { home: true, away: true },
    });
    return c.json(matchs);
  })
  .post(validateMatch, async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const data = await c.req.json();
    const matchs = await prisma.match.create({ data });
    return c.json(matchs);
  })
  .put("/match/:id", validateMatchPartial, async (c) => {
    const id = c.req.param("id");
    const data = await c.req.json();
    const prisma = getPrisma(c.env.DATABASE_URL);
    const matchs = await prisma.match.update({ where: { id }, data });
    return c.json(matchs);
  })
  .delete(async (c) => {
    const id = c.req.param("id");
    const prisma = getPrisma(c.env.DATABASE_URL);
    const matchs = await prisma.match.delete({ where: { id } });
    return c.json(matchs);
  })
  .get(async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const id = c.req.param("id");
    const matchs = await prisma.match.findUnique({ where: { id } });
    return c.json(matchs);
  });

export default matchApp;
