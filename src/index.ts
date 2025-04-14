import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { verify } from "hono/jwt";
import { getPrisma } from "../lib/prisma";
import authApp from "./auth";
import { prettyJSON } from "hono/pretty-json";
import playerApp from "./player";
import playerTeamApp from "./playerTeam";
import teamApp from "./team";
import matchApp from "./match";
import inningApp from "./inning";
import overApp from "./over";
import ballApp from "./ball";
import scorerApp from "./scorer";
import { cors } from "hono/cors";
import smsApp from "./sms";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_ACCESS_SECRET: string;
  };
}>();

app.use(prettyJSON());
app.use("/*", cors());

// Auth Routes
app.route("/auth", authApp);

// Routes
app.route("/", playerApp);
app.route("/", teamApp);
app.route("/", playerTeamApp);
app.route("/", matchApp);
app.route("/", inningApp);
app.route("/", overApp);
app.route("/", ballApp);
app.route("/", scorerApp);
app.route("/", smsApp);
// app.use('/send-otp', smsApp);

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
