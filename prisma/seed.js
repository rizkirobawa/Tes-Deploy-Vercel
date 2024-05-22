const { PrismaClient } = require('@prisma/client');
const data = require('./data.json');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({ data: data.users });
  await prisma.city.createMany({ data: data.cities });
  await prisma.airport.createMany({ data: data.airports });
  await prisma.airline.createMany({ data: data.airlines });
  await prisma.airplane.createMany({ data: data.airplanes });
  await prisma.airplaneSeatClass.createMany({ data: data.airplaneSeatClass });
  await prisma.flight.createMany({ data: data.flights });
  await prisma.ticket.createMany({ data: data.tickets });

  console.log('Data seeding was successful');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
