import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import {
  EXPIRE_IN_5_MINS,
  EXPIRE_IN_15_MINS,
  EXPIRE_IN_7_DAYS,
} from "../lib/constants";
import { getPrisma } from "../lib/prisma";
import { generateRandomNumber } from "../lib/helpers";

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
    const { mobile, name } = await c.req.json();
    const prisma = getPrisma(c.env.DATABASE_URL);
    await prisma.user.create({
      data: { mobile, name },
    });
    // TODO - Send OTP to an mobile
    return c.json({ message: "Please enter an OTP sent to your Email" });
  } catch (error) {
    console.log(error);
    return c.json({ error: "Something went wrong!" }, 401);
  }
});

// Login Route
authApp.post("/login", async (c) => {
  const { mobile, otp } = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);
  const user = await prisma.user.findUnique({
    where: { mobile, otp },
  });
  console.log({ user, mobile, otp });
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
    return c.json({
      message: "Login successful",
      data: { ...user, accessToken },
    });
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

//
authApp.post("/isRegistered", async (c) => {
  try {
    const { mobile } = await c.req.json();
    const prisma = getPrisma(c.env.DATABASE_URL);
    const user = await prisma.user.findUnique({ where: { mobile } });
    if (user) {
      // TODO - Send OTP to an mobile
      const otp = generateRandomNumber(6);
      console.log({ otp });
      await prisma.user.update({
        where: { id: user.id },
        data: { otp, otpExpiresAt: new Date(Date.now() + EXPIRE_IN_5_MINS) },
      });
      return c.json({ message: "User already registered", data: !!user });
    }
    return c.json({ message: "User not registered", data: !!user });
  } catch (error) {
    console.log(error);
    return c.json({ error: "Something went wrong!" }, 401);
  }
});

export default authApp;
