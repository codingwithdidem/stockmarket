require('dotenv').config();
const fs = require('fs-extra');
const readline = require('readline');
const axios = require('axios');
const json2xls = require('json2xls');

const BASE_URL = 'https://api.finage.co.uk/agg/stock';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// o = Open price
// h = High price
// l = Low price
// c = Close price
// v = Volume
// t = Timestamp [ms]
const fetchStockData = async (symbol, multiply, time, from , to) => {
    const FINAL_URL = `${BASE_URL}/${symbol}/${multiply}/${time}/${from}/${to}?apikey=${process.env.API_KEY}`;
    console.log(FINAL_URL)
    const { data: { results }} = await axios.get(FINAL_URL);
    
    const format = results.map(item => ({
        open: item.o,
        high: item.h,
        low: item.l,
        close: item.c,
        volume: item.v,
        timestamp: item.t
    }))

    const xls = json2xls(format);
    fs.writeFileSync('marketdata.xlsx', xls, 'binary')
}

rl.question("What is the ticker symbol ? (Ex: AMZN) ", function(symbol) {
    rl.question("Multiply ? ", function(multiply) { 
      rl.question("Time ? ", function(time) {
        rl.question("Start Date ? ", function(from) {
          rl.question("End Date ? ", function(to) {
            rl.close();
            fetchStockData(symbol, multiply, time, from, to)
          });
        });
       });
    });
  });
