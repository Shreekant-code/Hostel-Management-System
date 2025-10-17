import db_connect from "./Database/db_connect.js";
import Room from "./Schema/Roomschema.js";

const seedRooms = async () => {
  await db_connect();

  
  for (let i = 1; i <= 25; i++) {
    const roomNumber = `A${100 + i}`; 
    const exists = await Room.findOne({ roomNumber });
    if (!exists) {
      await Room.create({
        roomNumber,
        gender: "female",
        capacity: Math.random() < 0.5 ? 2 : 3, // random 2 or 3
        students: []
      });
    }
  }

 
  for (let i = 1; i <= 25; i++) {
    const roomNumber = `B${100 + i}`; // B101, B102...
    const exists = await Room.findOne({ roomNumber });
    if (!exists) {
      await Room.create({
        roomNumber,
        gender: "male",
        capacity: Math.random() < 0.5 ? 2 : 3, // random 2 or 3
        students: []
      });
    }
  }

  console.log("✅ 50 rooms seeded (Girls: A wing, Boys: B wing)");
  process.exit(0);
};

seedRooms();
