-- CreateEnum
CREATE TYPE "Hand" AS ENUM ('Left', 'Right');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BATSMAN', 'BOWLER', 'ALL_ROUNDER', 'WICKET_KEEPER');

-- CreateEnum
CREATE TYPE "BowlingStyle" AS ENUM ('Fast', 'MEDIUM_FAST', 'SPIN');

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ALL_ROUNDER',
    "battingHand" "Hand" NOT NULL DEFAULT 'Right',
    "bowlingHand" "Hand" NOT NULL DEFAULT 'Right',
    "bowlingStyle" "BowlingStyle" NOT NULL DEFAULT 'Fast',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_teams" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_teams_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_captainOf" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_captainOf_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_teams_B_index" ON "_teams"("B");

-- CreateIndex
CREATE INDEX "_captainOf_B_index" ON "_captainOf"("B");

-- AddForeignKey
ALTER TABLE "_teams" ADD CONSTRAINT "_teams_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_teams" ADD CONSTRAINT "_teams_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_captainOf" ADD CONSTRAINT "_captainOf_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_captainOf" ADD CONSTRAINT "_captainOf_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
