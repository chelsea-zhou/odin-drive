/*
  Warnings:

  - You are about to drop the column `folderList` on the `Folder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "folderList",
ADD COLUMN     "parentFolderId" TEXT;
