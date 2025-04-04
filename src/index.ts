import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { verify } from "hono/jwt";
import { getPrisma } from "../lib/prisma";
import authApp from "./auth";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_ACCESS_SECRET: string;
  };
}>();

// Auth Routes
app.route("/auth", authApp);

//! Auth MiddleWare
app.use(
  "/protected/*",
  bearerAuth({
    verifyToken: async (token, c) => {
      try {
        const payload = await verify(token, c.env.JWT_ACCESS_SECRET);
        c.set("user", payload);
        console.log(payload);
        return !!payload;
      } catch (error) {
        return false;
      }
    },
  })
);

//* Protected Routes
app.get("/", async (c) => {
  return c.json("Home Page");
});

app.get("/protected/users", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const users = await prisma.user.findMany();
  return c.json(users);
});

//* Public Routes
app.get("/users", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const users = await prisma.user.findMany();
  return c.json(users);
});

export default app;
