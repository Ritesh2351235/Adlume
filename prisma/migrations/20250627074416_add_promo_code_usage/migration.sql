-- CreateTable
CREATE TABLE "promo_code_usages" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "promoCode" TEXT NOT NULL,
    "creditsAdded" INTEGER NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'promo_code',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promo_code_usages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "promo_code_usages_userId_promoCode_key" ON "promo_code_usages"("userId", "promoCode");

-- AddForeignKey
ALTER TABLE "promo_code_usages" ADD CONSTRAINT "promo_code_usages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
