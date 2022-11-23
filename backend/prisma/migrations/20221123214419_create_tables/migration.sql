-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "transationId" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(25) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transation" (
    "id" SERIAL NOT NULL,
    "debitedAccountId" INTEGER NOT NULL,
    "creditedAccountId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_transationId_key" ON "Account"("transationId");

-- CreateIndex
CREATE UNIQUE INDEX "User_accountId_key" ON "User"("accountId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_transationId_fkey" FOREIGN KEY ("transationId") REFERENCES "Transation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transation" ADD CONSTRAINT "Transation_debitedAccountId_fkey" FOREIGN KEY ("debitedAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transation" ADD CONSTRAINT "Transation_creditedAccountId_fkey" FOREIGN KEY ("creditedAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
