const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://tuhinshekh27r_db_user:YjzNI2stxegxS0aP@ac-oeb5uwo-shard-00-00.fgvnnni.mongodb.net:27017,ac-oeb5uwo-shard-00-01.fgvnnni.mongodb.net:27017,ac-oeb5uwo-shard-00-02.fgvnnni.mongodb.net:27017/academy?ssl=true&replicaSet=atlas-3x0bqo-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

const questionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true }
});

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

const questions = [
  // GENERAL KNOWLEDGE
  { category: 'general', question: "বাংলাদেশের জাতীয় পশু কোনটি?", options: ["হরিণ", "রয়েল বেঙ্গল টাইগার", "সিংহ", "হাতি"], correctAnswer: 1 },
  { category: 'general', question: "বিশ্বের দীর্ঘতম সমুদ্র সৈকত কোথায়?", options: ["মিয়ামি", "কক্সবাজার", "বালি", "পাতায়া"], correctAnswer: 1 },
  { category: 'general', question: "বাংলাদেশের স্বাধীনতা দিবস কবে?", options: ["১৬ ডিসেম্বর", "২১ ফেব্রুয়ারি", "২৬ মার্চ", "১ বৈশাখ"], correctAnswer: 2 },
  { category: 'general', question: "বাংলাদেশের প্রথম রাষ্ট্রপতি কে ছিলেন?", options: ["তাজউদ্দীন আহমদ", "বঙ্গবন্ধু শেখ মুজিবুর রহমান", "সৈয়দ নজরুল ইসলাম", "জিয়াউর রহমান"], correctAnswer: 1 },
  { category: 'general', question: "জাতিসংঘের সদর দপ্তর কোথায় অবস্থিত?", options: ["লন্ডন", "প্যারিস", "নিউ ইয়র্ক", "জেনেভা"], correctAnswer: 2 },
  { category: 'general', question: "বাংলাদেশের সবচেয়ে বড় জেলা কোনটি?", options: ["রাঙ্গামাটি", "খুলনা", "রাজশাহী", "ঢাকা"], correctAnswer: 0 },
  { category: 'general', question: "বিশ্বের সর্বোচ্চ পর্বতশৃঙ্গ কোনটি?", options: ["কাঞ্চনজঙ্ঘা", "মাউন্ট এভারেস্ট", "কে-টু", "মাকালু"], correctAnswer: 1 },
  { category: 'general', question: "বাংলাদেশের জাতীয় কবির নাম কী?", options: ["রবীন্দ্রনাথ ঠাকুর", "কাজী নজরুল ইসলাম", "জসীমউদ্দীন", "মাইকেল মধুসূদন দত্ত"], correctAnswer: 1 },
  { category: 'general', question: "সবচেয়ে ছোট মহাদেশ কোনটি?", options: ["ওশেনিয়া", "ইউরোপ", "অ্যান্টার্কটিকা", "আফ্রিকা"], correctAnswer: 0 },
  { category: 'general', question: "বাংলাদেশের জাতীয় ফল কী?", options: ["আম", "লিচু", "কাঁঠাল", "জাম"], correctAnswer: 2 },
  { category: 'general', question: "বাংলাদেশের দীর্ঘতম নদী কোনটি?", options: ["পদ্মা", "মেঘনা", "যমুনা", "ব্রহ্মপুত্র"], correctAnswer: 1 },
  { category: 'general', question: "জনসংখ্যায় বিশ্বের সবচেয়ে বড় দেশ কোনটি?", options: ["চীন", "ভারত", "যুক্তরাষ্ট্র", "রাশিয়া"], correctAnswer: 1 },
  { category: 'general', question: "জাপানের রাজধানীর নাম কী?", options: ["বেজিং", "টোকিও", "সিউল", "কিয়োটো"], correctAnswer: 1 },
  { category: 'general', question: "বাংলাদেশের একমাত্র প্রবাল দ্বীপ কোনটি?", options: ["মহেশখালী", "সেন্টমার্টিন", "হাতিয়া", "কুতুবদিয়া"], correctAnswer: 1 },
  { category: 'general', question: "বাংলাদেশের জাতীয় খেলা কী?", options: ["ফুটবল", "ক্রিকেট", "কাবাডি", "হকি"], correctAnswer: 2 },
  { category: 'general', question: "বিশ্বের বৃহত্তম মহাসাগর কোনটি?", options: ["আটলান্টিক", "ভারত", "প্রশান্ত", "আর্কটিক"], correctAnswer: 2 },
  { category: 'general', question: "বাংলাদেশের প্রথম মহিলা প্রধানমন্ত্রী কে?", options: ["বেগম রোকেয়া", "শেখ হাসিনা", "বেগম খালেদা জিয়া", "শিরিন শারমিন"], correctAnswer: 2 },
  { category: 'general', question: "প্যারিস কোন নদীর তীরে অবস্থিত?", options: ["টেমস", "সিন", "নীল", "ভলগা"], correctAnswer: 1 },
  { category: 'general', question: "বাংলাদেশের জাতীয় ফুল কী?", options: ["গোলাপ", "শাপলা", "জবা", "পদ্ম"], correctAnswer: 1 },
  { category: 'general', question: "বিশ্বের সবচেয়ে জনবহুল শহর কোনটি?", options: ["নিউ ইয়র্ক", "ঢাকা", "টোকিও", "সাংহাই"], correctAnswer: 2 },

  // SCIENCE
  { category: 'science', question: "পানির রাসায়নিক সংকেত কী?", options: ["CO2", "H2O", "O2", "NaCl"], correctAnswer: 1 },
  { category: 'science', question: "আলোর বেগ কত?", options: ["৩ লক্ষ কিমি/সে", "১ লক্ষ কিমি/সে", "২ লক্ষ কিমি/সে", "৪ লক্ষ কিমি/সে"], correctAnswer: 0 },
  { category: 'science', question: "কোন গ্রহকে লাল গ্রহ বলা হয়?", options: ["শুক্র", "মঙ্গল", "বৃহস্পতি", "শনি"], correctAnswer: 1 },
  { category: 'science', question: "কোষের শক্তিঘর কাকে বলা হয়?", options: ["নিউক্লিয়াস", "রাইবোজোম", "মাইটোকন্ড্রিয়া", "গলগি বডি"], correctAnswer: 2 },
  { category: 'science', question: "মানুষের শরীরে হাড়ের সংখ্যা কতটি?", options: ["২০০ টি", "২০৬ টি", "২১০ টি", "২১৫ টি"], correctAnswer: 1 },
  { category: 'science', question: "মহাকর্ষ সূত্র কে আবিষ্কার করেন?", options: ["অ্যালবার্ট আইনস্টাইন", "আইজ্যাক নিউটন", "গ্যালিলিও", "থমাস এডিসন"], correctAnswer: 1 },
  { category: 'science', question: "সবচেয়ে বড় গ্রহ কোনটি?", options: ["পৃথিবী", "মঙ্গল", "বৃহস্পতি", "নেপচুন"], correctAnswer: 2 },
  { category: 'science', question: "অক্সিজেনের পারমাণবিক সংখ্যা কত?", options: ["৬", "৭", "৮", "৯"], correctAnswer: 2 },
  { category: 'science', question: "রক্তের লাল রঙের জন্য দায়ী কোনটি?", options: ["প্লাজমা", "শ্বেতকণিকা", "অণুচক্রিকা", "হিমোগ্লোবিন"], correctAnswer: 3 },
  { category: 'science', question: "ভিটামিন সি এর অভাবে কোন রোগ হয়?", options: ["রাতকানা", "স্কার্ভি", "রিকেটস", "বেরিবেরি"], correctAnswer: 1 },
  { category: 'science', question: "সবুজ পাতায় কী থাকে যার কারণে গাছের পাতা সবুজ হয়?", options: ["ক্যারোটিন", "ক্লোরোফিল", "জ্যান্থোফিল", "ফাইকোসায়ানিন"], correctAnswer: 1 },
  { category: 'science', question: "সূর্য থেকে পৃথিবীতে আলো আসতে কত সময় লাগে?", options: ["প্রায় ৮ মিনিট", "প্রায় ১০ মিনিট", "প্রায় ১২ মিনিট", "প্রায় ৫ মিনিট"], correctAnswer: 0 },
  { category: 'science', question: "সবচেয়ে হালকা গ্যাস কোনটি?", options: ["হিলিয়াম", "অক্সিজেন", "নাইট্রোজেন", "হাইড্রোজেন"], correctAnswer: 3 },
  { category: 'science', question: "পেনিসিলিন কে আবিষ্কার করেন?", options: ["আলেকজান্ডার ফ্লেমিং", "লুই পাস্তুর", "রবার্ট কখ", "এডওয়ার্ড জেনার"], correctAnswer: 0 },
  { category: 'science', question: "মানবদেহের সবচেয়ে বড় হাড় কোনটি?", options: ["টিবিয়া", "ফিমার", "রেডিয়াস", "আলনা"], correctAnswer: 1 },
  { category: 'science', question: "টেলিফোন কে আবিষ্কার করেন?", options: ["মার্কোনি", "আলেকজান্ডার গ্রাহাম বেল", "জন লজি বেয়ার্ড", "টমাস এডিসন"], correctAnswer: 1 },
  { category: 'science', question: "বায়ুমণ্ডলে কোন গ্যাসের পরিমাণ সবচেয়ে বেশি?", options: ["অক্সিজেন", "কার্বন ডাই অক্সাইড", "নাইট্রোজেন", "আর্গন"], correctAnswer: 2 },
  { category: 'science', question: "ডিএনএ (DNA) এর পূর্ণরূপ কী?", options: ["Deoxyribonucleic Acid", "Deribonucleic Acid", "Deoxyribose Acid", "Deoxynic Acid"], correctAnswer: 0 },
  { category: 'science', question: "সবচেয়ে ভারী ধাতু কোনটি?", options: ["লোহা", "সোনা", "অসমিয়াম", "প্লাটিনাম"], correctAnswer: 2 },
  { category: 'science', question: "বিদ্যুৎ আবিষ্কার করেন কে?", options: ["নিকোলা টেসলা", "বেঞ্জামিন ফ্রাঙ্কলিন", "মাইকেল ফ্যারাডে", "অ্যালেসান্দ্রো ভোল্টা"], correctAnswer: 1 },

  // HISTORY
  { category: 'history', question: "প্রথম বিশ্বযুদ্ধ কবে শুরু হয়?", options: ["১৯১৪", "১৯১৮", "১৯৩৯", "১৯৪৫"], correctAnswer: 0 },
  { category: 'history', question: "বাংলাদেশের মুক্তিযুদ্ধ কবে শুরু হয়?", options: ["২৬ মার্চ ১৯৭১", "১৬ ডিসেম্বর ১৯৭১", "৭ মার্চ ১৯৭১", "১৭ এপ্রিল ১৯৭১"], correctAnswer: 0 },
  { category: 'history', question: "ঢাকা বিশ্ববিদ্যালয় কবে প্রতিষ্ঠিত হয়?", options: ["১৯০৫", "১৯১১", "১৯২১", "১৯৪৭"], correctAnswer: 2 },
  { category: 'history', question: "ছয় দফা দাবি কবে উত্থাপিত হয়?", options: ["১৯৫২", "১৯৬৬", "১৯৬৯", "১৯৭০"], correctAnswer: 1 },
  { category: 'history', question: "দ্বিতীয় বিশ্বযুদ্ধ কবে শেষ হয়?", options: ["১৯৪৫", "১৯৩৯", "১৯১৪", "১৯১৮"], correctAnswer: 0 },
  { category: 'history', question: "বাংলাদেশের মুক্তিযুদ্ধের সেক্টর কয়টি ছিল?", options: ["৭ টি", "৯ টি", "১০ টি", "১১ টি"], correctAnswer: 3 },
  { category: 'history', question: "বীরশ্রেষ্ঠ খেতাবপ্রাপ্ত কতজন?", options: ["৫ জন", "৭ জন", "৯ জন", "১১ জন"], correctAnswer: 1 },
  { category: 'history', question: "মুজিবনগর সরকারের রাজধানী কোথায় ছিল?", options: ["ঢাকা", "কলকাতা", "মেহেরপুর", "চুয়াডাঙ্গা"], correctAnswer: 2 },
  { category: 'history', question: "লালবাগ কেল্লা কে নির্মাণ শুরু করেন?", options: ["শায়েস্তা খান", "যুবরাজ মুহাম্মদ আজম", "মীর জুমলা", "ইসলাম খান"], correctAnswer: 1 },
  { category: 'history', question: "আহসান মঞ্জিল কোথায় অবস্থিত?", options: ["সিলেট", "রাজশাহী", "পুরনো ঢাকা", "চট্টগ্রাম"], correctAnswer: 2 },
  { category: 'history', question: "বাংলা একাডেমী কবে প্রতিষ্ঠিত হয়?", options: ["১৯৪৭", "১৯৫২", "১৯৫৫", "১৯৭১"], correctAnswer: 2 },
  { category: 'history', question: "বাংলাদেশের সংবিধান কবে কার্যকর হয়?", options: ["১৬ ডিসেম্বর ১৯৭২", "৪ নভেম্বর ১৯৭২", "২৬ মার্চ ১৯৭২", "১৭ এপ্রিল ১৯৭২"], correctAnswer: 0 },
  { category: 'history', question: "ভাষা আন্দোলন কবে হয়েছিল?", options: ["১৯৪৭", "১৯৫২", "১৯৬৬", "১৯৭১"], correctAnswer: 1 },
  { category: 'history', question: "যুক্তফ্রন্ট নির্বাচন কবে অনুষ্ঠিত হয়?", options: ["১৯৪৭", "১৯৫২", "১৯৫৪", "১৯৫৬"], correctAnswer: 2 },
  { category: 'history', question: "আগরতলা ষড়যন্ত্র মামলা কবে দায়ের করা হয়?", options: ["১৯৬৬", "১৯৬৮", "১৯৬৯", "১৯৭০"], correctAnswer: 1 },
  { category: 'history', question: "ভারত কবে স্বাধীন হয়?", options: ["১৯৪৭", "১৯৪৮", "১৯৫০", "১৯৭১"], correctAnswer: 0 },
  { category: 'history', question: "ফরাসি বিপ্লব কবে হয়েছিল?", options: ["১৭৭৬", "১৭৮৯", "১৮০৪", "১৮১৫"], correctAnswer: 1 },
  { category: 'history', question: "পলাশীর যুদ্ধ কবে সংঘটিত হয়?", options: ["১৭৫৭", "১৭৬৪", "১৮৫৭", "১৯০৫"], correctAnswer: 0 },
  { category: 'history', question: "মোনালিসা ছবিটি কে এঁকেছেন?", options: ["পাবলো পিকাসো", "ভিনসেন্ট ভ্যান গগ", "লিওনার্দো দা ভিঞ্চি", "মাইকেল এঞ্জেলো"], correctAnswer: 2 },
  { category: 'history', question: "চাঁদে প্রথম পা রাখেন কে?", options: ["ইউরি গ্যাগারিন", "নিল আর্মস্ট্রং", "বাজ অলড্রিন", "মাইকেল কলিন্স"], correctAnswer: 1 }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 20000,
    });
    console.log('Connected to MongoDB.');

    await Question.deleteMany({});
    console.log('Cleared existing questions.');

    await Question.insertMany(questions);
    console.log(`Successfully inserted ${questions.length} questions!`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seedDatabase();
