/*
  Warnings:

  - A unique constraint covering the columns `[token,phone]` on the table `SMSToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SMSToken_token_phone_key" ON "SMSToken"("token", "phone");
