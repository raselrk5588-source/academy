const mongoose = require('mongoose');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const MONGODB_URI = envFile.split('\n').find(line => line.startsWith('MONGODB_URI=')).substring(12).trim();

const flashcardSchema = new mongoose.Schema({
  q: String,
  a: String
});

const Flashcard = mongoose.models.Flashcard || mongoose.model('Flashcard', flashcardSchema);

const baseFlashcards = [
  { q: 'নিউটনের গতির ১ম সূত্র কী?', a: 'বাহ্যিক বল প্রয়োগ না করলে স্থির বস্তু স্থির থাকে এবং গতিশীল বস্তু সুষম বেগে সরলপথে চলতে থাকে।' },
  { q: 'কোষের শক্তিঘর কাকে বলা হয়?', a: 'মাইটোকন্ড্রিয়া' },
  { q: 'পানির রাসায়নিক সংকেত কী?', a: 'H2O' },
  { q: 'বাংলাদেশের জাতীয় পাখির নাম কী?', a: 'দোয়েল' },
  { q: 'আলোর বেগ কত?', a: '৩ লক্ষ কিলোমিটার প্রতি সেকেন্ড' },
  { q: 'মানবদেহে হাড়ের সংখ্যা কতটি?', a: '২০৬ টি' },
  { q: 'DNA-এর পূর্ণরূপ কী?', a: 'Deoxyribonucleic Acid' },
  { q: 'পৃথিবীর সবচেয়ে বড় মহাসাগর কোনটি?', a: 'প্রশান্ত মহাসাগর' },
  { q: 'কম্পিউটারের ব্রেইন কাকে বলা হয়?', a: 'CPU (Central Processing Unit)' },
  { q: 'মহাকর্ষ সূত্র কে আবিষ্কার করেন?', a: 'স্যার আইজ্যাক নিউটন' },
  { q: 'সবচেয়ে ভারী তরল ধাতু কোনটি?', a: 'পারদ' },
  { q: 'রক্তের রং লাল হয় কেন?', a: 'হিমোগ্লোবিনের কারণে' },
  { q: 'শালোকসংশ্লেষণ প্রক্রিয়ায় উদ্ভিদ কোন গ্যাস গ্রহণ করে?', a: 'কার্বন ডাই-অক্সাইড' },
  { q: 'সবচেয়ে হালকা গ্যাস কোনটি?', a: 'হাইড্রোজেন' },
  { q: 'শব্দের বেগ সবচেয়ে বেশি কোন মাধ্যমে?', a: 'কঠিন মাধ্যমে' }
];

async function seed() {
  try {
    const dns = require('dns');
    dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS to bypass Node SRV issues

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing flashcards
    await Flashcard.deleteMany({});
    console.log("Cleared existing flashcards");

    let allFlashcards = [...baseFlashcards];
    
    // Generate up to 100 flashcards
    while (allFlashcards.length < 100) {
      const copy = { ...baseFlashcards[Math.floor(Math.random() * baseFlashcards.length)] };
      copy.q = copy.q.replace('?', ` (Copy ${Math.floor(Math.random() * 1000)})?`);
      allFlashcards.push(copy);
    }

    await Flashcard.insertMany(allFlashcards);
    console.log(`Seeded ${allFlashcards.length} flashcards successfully!`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
