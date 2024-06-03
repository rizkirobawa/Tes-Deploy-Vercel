-- DropIndex
DROP INDEX "tickets_airplane_seat_class_id_key";

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'UNPAID';
