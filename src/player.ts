import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getPrisma } from "../lib/prisma";
import { PlayerSchemaPartial, PlayerSchemaPlain } from "../types/player";

const playerApp = new Hono<{ Bindings: { DATABASE_URL: string } }>();

const validatePlayer = zValidator("json", PlayerSchemaPlain);
const validatePlayerPartial = zValidator("json", PlayerSchemaPartial);

playerApp
  .get("/player", async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const players = await prisma.player.findMany({
      include: { teams: true },
    });
    return c.json(players);
  })
  .post(validatePlayer, async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const data = await c.req.json();
    const players = await prisma.player.create({ data });
    return c.json(players);
  })
  .put("/player/:id", validatePlayerPartial, async (c) => {
    const id = c.req.param("id");
    const data = await c.req.json();
    const prisma = getPrisma(c.env.DATABASE_URL);
    const players = await prisma.player.update({ where: { id }, data });
    return c.json(players);
  })
  .delete(async (c) => {
    const id = c.req.param("id");
    const prisma = getPrisma(c.env.DATABASE_URL);
    const players = await prisma.player.delete({ where: { id } });
    return c.json(players);
  })
  .get(async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const id = c.req.param("id");
    const players = await prisma.player.findUnique({ where: { id } });
    return c.json(players);
  });

export default playerApp;
