-- CreateTable
CREATE TABLE "ChapterRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ChapterRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChapterRole_name_key" ON "ChapterRole"("name");
