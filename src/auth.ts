import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import { EXPIRE_IN_15_MINS, EXPIRE_IN_7_DAYS } from "../lib/constants";
import { getPrisma } from "../lib/prisma";

const authApp = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
  };
}>();

// Login Route
authApp.post("/register", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    const prisma = getPrisma(c.env.DATABASE_URL);
    await prisma.user.create({
      data: { email, name, password },
    });
    // TODO - Send OTP to an email
    return c.json({ message: "Please enter an OTP sent to your Email" });
  } catch (error) {
    return c.json({ error: "Something went wrong!" }, 401);
  }
});

// Login Route
authApp.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);
  const user = await prisma.user.findUnique({
    where: { email, password },
  });
  if (user) {
    const accessToken = await sign(
      { userId: user.id, exp: EXPIRE_IN_15_MINS, now: Date.now() },
      c.env.JWT_ACCESS_SECRET
    );
    const refreshToken = await sign(
      { userId: user.id, exp: EXPIRE_IN_7_DAYS, now: Date.now() },
      c.env.JWT_REFRESH_SECRET
    );
    await prisma.refreshToken.create({
      data: { userId: user.id, token: refreshToken },
    });

    c.header("Authorization", `Bearer ${accessToken}`);
    c.header(
      "Set-Cookie",
      `refresh_token=${refreshToken}; HttpOnly; Secure; Path=/; Max-Age=604800`
    );
    return c.json({ message: "Login successful" });
  }
  return c.json({ error: "Invalid credentials" }, 401);
});

// Refresh Token
authApp.get("/refresh", async (c) => {
  const refreshToken = getCookie(c, "refresh_token");

  if (!refreshToken) {
    return c.json({ error: "No refresh token provided" }, 401);
  }

  try {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const payload = await verify(refreshToken, c.env.JWT_REFRESH_SECRET);

    // Check if refresh token exists in DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      return c.json({ error: "Invalid refresh token" }, 403);
    }

    // Generate new tokens
    const accessToken = await sign(
      { userId: payload.userId, exp: EXPIRE_IN_15_MINS, now: Date.now() },
      c.env.JWT_ACCESS_SECRET
    );
    const newRefreshToken = await sign(
      { userId: payload.userId, exp: EXPIRE_IN_7_DAYS, now: Date.now() },
      c.env.JWT_REFRESH_SECRET
    );

    // Remove old token and store new one
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    await prisma.refreshToken.create({
      data: { userId: `${payload.userId}`, token: newRefreshToken },
    });

    c.header("Authorization", `Bearer ${accessToken}`);
    c.header(
      "Set-Cookie",
      `refresh_token=${refreshToken}; HttpOnly; Secure; Path=/; Max-Age=604800`
    );

    return c.json({ message: "Token refreshed" });
  } catch (error) {
    return c.json({ error: "Invalid refresh token" }, 403);
  }
});

// Logout Route
authApp.get("/logout", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const refreshToken = getCookie(c, "refresh_token");

  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }

  c.header("Set-Cookie", `refresh_token=; HttpOnly; Secure; Path=/; Max-Age=0`);
  return c.json({ message: "Logged out" });
});

export default authApp;
