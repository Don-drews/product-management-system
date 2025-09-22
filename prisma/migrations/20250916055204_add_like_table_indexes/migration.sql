-- CreateTable
CREATE TABLE "public"."likes" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "likes_productId_createdAt_idx" ON "public"."likes"("productId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_productId_key" ON "public"."likes"("userId", "productId");

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
