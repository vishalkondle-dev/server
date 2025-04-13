import { Hono } from "hono";
import { getPrisma } from "../lib/prisma";
import { handle } from "hono/cloudflare-pages";

const scorerApp = new Hono<{ Bindings: { DATABASE_URL: string } }>();

scorerApp.get("scorer/:id", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const id = c.req.param("id");
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      home: { include: { players: { include: { player: true } } } },
      away: { include: { players: { include: { player: true } } } },
      innings: { include: { overs: { include: { balls: true } } } },
    },
  });
  return c.json(match);
});

export default scorerApp;
export type AppType = typeof scorerApp;
export const onRequest = handle(scorerApp);
