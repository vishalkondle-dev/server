import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getPrisma } from "../lib/prisma";
import { InningSchemaPartial, InningSchemaPlain } from "../types/inning";

const inningApp = new Hono<{ Bindings: { DATABASE_URL: string } }>();

const validateInning = zValidator("json", InningSchemaPlain);
const validateInningPartial = zValidator("json", InningSchemaPartial);

inningApp
  .get("/inning", async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const innings = await prisma.inning.findMany({
      include: {
        battingTeam: true,
        bowlingTeam: true,
        match: true,
        overs: true,
      },
    });
    return c.json(innings);
  })
  .post(validateInning, async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const data = await c.req.json();
    const innings = await prisma.inning.create({ data });
    return c.json(innings);
  })
  .put("/inning/:id", validateInningPartial, async (c) => {
    const id = c.req.param("id");
    const data = await c.req.json();
    const prisma = getPrisma(c.env.DATABASE_URL);
    const innings = await prisma.inning.update({ where: { id }, data });
    return c.json(innings);
  })
  .delete(async (c) => {
    const id = c.req.param("id");
    const prisma = getPrisma(c.env.DATABASE_URL);
    const innings = await prisma.inning.delete({ where: { id } });
    return c.json(innings);
  })
  .get(async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const id = c.req.param("id");
    const innings = await prisma.inning.findUnique({ where: { id } });
    return c.json(innings);
  });

export default inningApp;
