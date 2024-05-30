const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');
module.exports = {
  booking: async (req, res, next) => {
    try {
      const userId = req.body.userId || 1;

      const { flightId, adult, child, baby, seatClass, passenger } = req.body;

      if (!userId) {
        return res.status(400).json({
          status: false,
          message: "Can't find user with id " + userId,
          data: null,
        });
      }

      const totalPassengers = adult + child + baby;
      if (passenger.length !== totalPassengers) {
        return res.status(400).json({
          status: false,
          message: `Total passenger is ${totalPassengers} but total passenger data is ${passenger.length}`,
          data: null,
        });
      }

      const result = await prisma.$transaction(async (prisma) => {
        const flight = await prisma.flight.findUnique({
          where: { id: flightId },
          include: {
            ticket: {
              where: { airplaneSeatClassId: seatClass },
            },
          },
        });

        if (!flight || flight.ticket.length === 0) {
          throw new Error('Flight or ticket not found');
        }

        const booking_code = crypto
          .randomBytes(5)
          .toString('hex')
          .toUpperCase();

        const total_price = flight.ticket[0].price * (totalPassengers - baby);
        const tax = Math.round(total_price * 0.1);
        const expiredPaid = new Date(Date.now() + 60 * 60 * 1000);

        const newBooking = await prisma.booking.create({
          data: {
            userId: userId,
            flightId: flightId,
            bookingCode: booking_code,
            status: 'UNPAID',
            expiredPaid: expiredPaid,
            totalPrice: total_price + tax,
            passenger: {
              create: passenger.map((p) => ({
                title: p.title,
                fullName: p.fullName,
                familyName: p.familyName,
                birthDate: p.birthDate,
                nationality: p.nationality,
                identityType: p.identityType,
                issuingCountry: p.issuingCountry,
                identityNumber: p.identityNumber,
                expiredDate: p.expiredDate,
                ageGroup: p.ageGroup,
              })),
            },
          },
          include: { passenger: true },
        });

        return {
          id: newBooking.id,
          flight_id: newBooking.flightId,
          booking_code: newBooking.bookingCode,
          seat_class: seatClass,
          total_passengers: totalPassengers,
          total_price: total_price + tax,
          tax: tax,
          status: newBooking.status,
          paid_before: newBooking.expiredPaid,
        };
      });

      return res.status(200).json({
        status: true,
        message: 'Success creating new Booking',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  getAll: async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  },
  getDetail: async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  }
};
