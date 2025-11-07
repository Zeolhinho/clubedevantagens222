-- AlterTable
ALTER TABLE "favorites" DROP CONSTRAINT IF EXISTS "favorites_user_id_company_id_key";

-- AlterTable
ALTER TABLE "favorites" DROP COLUMN IF EXISTS "company_id";

-- AlterTable
ALTER TABLE "favorites" ADD COLUMN IF NOT EXISTS "coupon_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "favorites_user_id_coupon_id_key" ON "favorites"("user_id", "coupon_id");

