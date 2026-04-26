const { default: mongoose } = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const schema = new mongoose.Schema({ fileUrl: String, title: String });
const recordModel = mongoose.model('healthrecord', schema);

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const records = await recordModel.find({});
  for (let r of records) {
    if(!r.fileUrl) continue;
    console.log("Record:", r.title, r.fileUrl);
    const fetch = await import('node-fetch').then(m=>m.default);
    try {
      const res = await fetch(r.fileUrl);
      console.log("Status:", res.status);
      if(res.status !== 200) {
        const text = await res.text();
        console.log("Body:", text);
      }
    } catch(e) { console.log(e.message); }
  }
  process.exit();
}).catch(console.error);
