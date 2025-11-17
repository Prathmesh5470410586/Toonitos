require('dotenv').config();
const mongoose = require('mongoose');
const Show = require('./models/Show');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function main(){
  await mongoose.connect(process.env.MONGO_URI);
  await Show.deleteMany({});
  await User.deleteMany({});

  const shows = [
    {
      title: "Sparkly Adventures",
      description: "A cute cartoon for kids.",
      genres: ["Comedy","Adventure"],
      poster: "/media/posters/sparkly.jpg",
      heroVideo: "/media/hero/sparkly.mp4",
      episodes: [
        { title: "Episode 1", description: "Pilot", duration: 900, videoUrl: "/media/eps/s1e1.mp4", thumb: "/media/thumbs/s1e1.jpg" }
      ]
    },
    {
      title: "Tiny Tails",
      description: "Animal friends learn to share.",
      genres: ["Educational"],
      poster: "/media/posters/tiny.jpg",
      heroVideo: "/media/hero/tiny.mp4",
      episodes: []
    }
  ];
  await Show.insertMany(shows);

  const admin = new User({ name: 'Admin', email: 'admin@toonitos.test', passwordHash: await bcrypt.hash('password', 10), role: 'admin' });
  await admin.save();
  console.log('Seeded');
  process.exit(0);
}

main().catch(e=>{console.error(e); process.exit(1);});
