-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "postId" INTEGER;

-- AlterTable
ALTER TABLE "Subscriber" ADD COLUMN     "name" TEXT;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
