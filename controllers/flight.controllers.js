const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  index: async (req, res, next) => {
    try {
      const flights = await prisma.flight.findMany({
        include: {
          departureAirport: true,
          arrivalAirport: true,
          ticket: {
            include: {
              airplaneSeatClass: {
                select: {
                  type: true, // Hanya memilih field 'type' dari 'airplaneSeatClass'
                },
              },
            },
          },
        },
      });
      res.status(200).json({
        status: true,
        message: 'Successfully retrieved flights',
        data: flights,
      });
    } catch (error) {
      console.error('Failed to retrieve flights:', error);
      res.status(500).json({
        status: false,
        message: 'Failed to retrieve flights',
        data: null,
      });
    }
  },
};
