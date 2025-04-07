import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getPrisma } from "../lib/prisma";
import { BallSchemaPartial, BallSchemaPlain } from "../types/ball";

const ballApp = new Hono<{ Bindings: { DATABASE_URL: string } }>();

const validateBall = zValidator("json", BallSchemaPlain);
const validateBallPartial = zValidator("json", BallSchemaPartial);

ballApp
  .get("/ball", async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const balls = await prisma.ball.findMany({
      include: {
        assistFielder: true,
        bowler: true,
        fielder: true,
        nonStriker: true,
        striker: true,
        outBatsman: true,
        over: true,
      },
    });
    return c.json(balls);
  })
  .post(validateBall, async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const data = await c.req.json();
    const balls = await prisma.ball.create({ data });
    return c.json(balls);
  })
  .put("/ball/:id", validateBallPartial, async (c) => {
    const id = c.req.param("id");
    const data = await c.req.json();
    const prisma = getPrisma(c.env.DATABASE_URL);
    const balls = await prisma.ball.update({ where: { id }, data });
    return c.json(balls);
  })
  .delete(async (c) => {
    const id = c.req.param("id");
    const prisma = getPrisma(c.env.DATABASE_URL);
    const balls = await prisma.ball.delete({ where: { id } });
    return c.json(balls);
  })
  .get(async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const id = c.req.param("id");
    const balls = await prisma.ball.findUnique({ where: { id } });
    return c.json(balls);
  });

export default ballApp;
