import { Hono } from "hono";
import { getPrisma } from "../lib/prisma";

const app = new Hono<{
  Bindings: { DATABASE_URL: string };
  // Variables: { userId: string };
}>();

app.get("/", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const user = await prisma.user.create({
    data: { email: String(Date.now()), name: "1", password: "1" },
  });
  return c.json(user);
});

app.get("/users", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const users = await prisma.user.findMany();
  return c.json(users);
});

app.post("/users", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const body = await c.req.json();
  const user = await prisma.user.create({ data: body });
  return c.json(user);
});

export default app;
