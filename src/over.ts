import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getPrisma } from "../lib/prisma";
import { OverSchemaPartial, OverSchemaPlain } from "../types/over";

const overApp = new Hono<{ Bindings: { DATABASE_URL: string } }>();

const validateBall = zValidator("json", OverSchemaPlain);
const validateBallPartial = zValidator("json", OverSchemaPartial);

overApp
  .get("/over", async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const overs = await prisma.over.findMany({
      include: { balls: true, inning: true },
    });
    return c.json(overs);
  })
  .post(validateBall, async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const data = await c.req.json();
    const overs = await prisma.over.create({ data });
    return c.json(overs);
  })
  .put("/over/:id", validateBallPartial, async (c) => {
    const id = c.req.param("id");
    const data = await c.req.json();
    const prisma = getPrisma(c.env.DATABASE_URL);
    const overs = await prisma.over.update({ where: { id }, data });
    return c.json(overs);
  })
  .delete(async (c) => {
    const id = c.req.param("id");
    const prisma = getPrisma(c.env.DATABASE_URL);
    const overs = await prisma.over.delete({ where: { id } });
    return c.json(overs);
  })
  .get(async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const id = c.req.param("id");
    const overs = await prisma.over.findUnique({ where: { id } });
    return c.json(overs);
  });

export default overApp;
