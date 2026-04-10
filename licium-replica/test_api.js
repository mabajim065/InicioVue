import axios from 'axios';

async function test() {
  try {
    const res = await axios.get('https://arcadium.cluster24.libnamic.eu/api/glam/media?limit=5');
    console.log("Success! Returned " + res.data.length + " items.");
    if (res.data.length > 0) {
      console.log(res.data[0]);
    }
  } catch (err) {
    console.error("Failed:", err.response ? err.response.status : err.message);
  }
}

test();
