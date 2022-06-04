-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "other_app_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "likes" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_key" ON "Product"("id");
