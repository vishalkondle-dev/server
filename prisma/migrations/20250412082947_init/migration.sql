/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mobile]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `actionType` on the `ActionLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `oversPerInning` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobile` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('UPCOMING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DRAWS');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('ADD_BALL', 'UNDO', 'REDO', 'ADD_MATCH', 'UPDATE_MATCH', 'ADD_PLAYER', 'UPDATE_PLAYER', 'ADD_TEAM', 'UPDATE_TEAM', 'ADD_OVER', 'END_OVER', 'START_INNING', 'END_INNING', 'SET_TOSS', 'SET_WINNER');

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "ActionLog" DROP COLUMN "actionType",
ADD COLUMN     "actionType" "ActionType" NOT NULL;

-- AlterTable
ALTER TABLE "Inning" ADD COLUMN     "isInningsEnd" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "inningsPerTeam" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "oversPerInning" INTEGER NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'UPCOMING',
ADD COLUMN     "tournamentId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
ADD COLUMN     "mobile" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "oversPerInning" INTEGER NOT NULL,
    "inningsPerTeam" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TournamentTeams" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TournamentTeams_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TournamentTeams_B_index" ON "_TournamentTeams"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TournamentTeams" ADD CONSTRAINT "_TournamentTeams_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TournamentTeams" ADD CONSTRAINT "_TournamentTeams_B_fkey" FOREIGN KEY ("B") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;
