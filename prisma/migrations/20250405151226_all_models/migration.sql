/*
  Warnings:

  - The values [Fast] on the enum `BowlingStyle` will be removed. If these variants are still used in the database, this will fail.
  - The values [Left,Right] on the enum `Hand` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `_captainOf` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_teams` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `teamId` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `captainId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Choose" AS ENUM ('BAT', 'BOWL');

-- CreateEnum
CREATE TYPE "Toss" AS ENUM ('HOME', 'AWAY');

-- CreateEnum
CREATE TYPE "WicketType" AS ENUM ('BOWLED', 'CAUGHT', 'LBW', 'RUNOUT', 'STUMPED', 'HIT_WICKET', 'OBSTRUCTING_FIELD');

-- CreateEnum
CREATE TYPE "ExtraType" AS ENUM ('WIDE', 'NOBALL', 'BYE', 'LEG_BYE', 'PENALTY');

-- AlterEnum
BEGIN;
CREATE TYPE "BowlingStyle_new" AS ENUM ('FAST', 'MEDIUM_FAST', 'SPIN');
ALTER TABLE "Player" ALTER COLUMN "bowlingStyle" DROP DEFAULT;
ALTER TABLE "Player" ALTER COLUMN "bowlingStyle" TYPE "BowlingStyle_new" USING ("bowlingStyle"::text::"BowlingStyle_new");
ALTER TYPE "BowlingStyle" RENAME TO "BowlingStyle_old";
ALTER TYPE "BowlingStyle_new" RENAME TO "BowlingStyle";
DROP TYPE "BowlingStyle_old";
ALTER TABLE "Player" ALTER COLUMN "bowlingStyle" SET DEFAULT 'FAST';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Hand_new" AS ENUM ('LEFT', 'RIGHT');
ALTER TABLE "Player" ALTER COLUMN "battingHand" DROP DEFAULT;
ALTER TABLE "Player" ALTER COLUMN "bowlingHand" DROP DEFAULT;
ALTER TABLE "Player" ALTER COLUMN "battingHand" TYPE "Hand_new" USING ("battingHand"::text::"Hand_new");
ALTER TABLE "Player" ALTER COLUMN "bowlingHand" TYPE "Hand_new" USING ("bowlingHand"::text::"Hand_new");
ALTER TYPE "Hand" RENAME TO "Hand_old";
ALTER TYPE "Hand_new" RENAME TO "Hand";
DROP TYPE "Hand_old";
ALTER TABLE "Player" ALTER COLUMN "battingHand" SET DEFAULT 'RIGHT';
ALTER TABLE "Player" ALTER COLUMN "bowlingHand" SET DEFAULT 'RIGHT';
COMMIT;

-- DropForeignKey
ALTER TABLE "_captainOf" DROP CONSTRAINT "_captainOf_A_fkey";

-- DropForeignKey
ALTER TABLE "_captainOf" DROP CONSTRAINT "_captainOf_B_fkey";

-- DropForeignKey
ALTER TABLE "_teams" DROP CONSTRAINT "_teams_A_fkey";

-- DropForeignKey
ALTER TABLE "_teams" DROP CONSTRAINT "_teams_B_fkey";

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "teamId" TEXT NOT NULL,
ALTER COLUMN "battingHand" SET DEFAULT 'RIGHT',
ALTER COLUMN "bowlingHand" SET DEFAULT 'RIGHT',
ALTER COLUMN "bowlingStyle" SET DEFAULT 'FAST';

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "captainId" TEXT NOT NULL,
ADD COLUMN     "playersIds" TEXT[];

-- DropTable
DROP TABLE "_captainOf";

-- DropTable
DROP TABLE "_teams";

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "homeTeamId" TEXT NOT NULL,
    "awayTeamId" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "matchDate" TIMESTAMP(3) NOT NULL,
    "tossWinnerTeamId" TEXT NOT NULL,
    "choose" "Choose" NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "winnerTeamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inning" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "battingTeamId" TEXT NOT NULL,
    "bowlingTeamId" TEXT NOT NULL,

    CONSTRAINT "Inning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Over" (
    "id" TEXT NOT NULL,
    "overNumber" INTEGER NOT NULL,
    "inningId" TEXT NOT NULL,

    CONSTRAINT "Over_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ball" (
    "id" TEXT NOT NULL,
    "overId" TEXT NOT NULL,
    "ballNumber" INTEGER NOT NULL,
    "strikerId" TEXT NOT NULL,
    "nonStrikerId" TEXT,
    "bowlerId" TEXT NOT NULL,
    "outBatsmanId" TEXT,
    "runs" INTEGER NOT NULL DEFAULT 0,
    "extras" "ExtraType",
    "extraRuns" INTEGER,
    "isWicket" BOOLEAN NOT NULL DEFAULT false,
    "wicketType" "WicketType",
    "fielderId" TEXT,
    "assistFielderId" TEXT,
    "comment" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actionId" TEXT,

    CONSTRAINT "Ball_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_captainId_fkey" FOREIGN KEY ("captainId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_tossWinnerTeamId_fkey" FOREIGN KEY ("tossWinnerTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winnerTeamId_fkey" FOREIGN KEY ("winnerTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inning" ADD CONSTRAINT "Inning_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inning" ADD CONSTRAINT "Inning_battingTeamId_fkey" FOREIGN KEY ("battingTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inning" ADD CONSTRAINT "Inning_bowlingTeamId_fkey" FOREIGN KEY ("bowlingTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Over" ADD CONSTRAINT "Over_inningId_fkey" FOREIGN KEY ("inningId") REFERENCES "Inning"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ball" ADD CONSTRAINT "Ball_overId_fkey" FOREIGN KEY ("overId") REFERENCES "Over"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ball" ADD CONSTRAINT "Ball_strikerId_fkey" FOREIGN KEY ("strikerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ball" ADD CONSTRAINT "Ball_nonStrikerId_fkey" FOREIGN KEY ("nonStrikerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ball" ADD CONSTRAINT "Ball_bowlerId_fkey" FOREIGN KEY ("bowlerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ball" ADD CONSTRAINT "Ball_outBatsmanId_fkey" FOREIGN KEY ("outBatsmanId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ball" ADD CONSTRAINT "Ball_fielderId_fkey" FOREIGN KEY ("fielderId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ball" ADD CONSTRAINT "Ball_assistFielderId_fkey" FOREIGN KEY ("assistFielderId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
