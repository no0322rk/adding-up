'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });
const prefacutureDataMap = new Map();

rl.on('line', lineString => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[2]);
    if( year === 2010 || year === 2015 ){
        let value = prefacutureDataMap.get(prefecture);
        if(!value){
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if( year === 2010 ){
            value.popu10 = popu;
        }
        if( year === 2015 ){
            value.popu15 = popu;
        }
        prefacutureDataMap.set(prefecture, value);
    }
});

rl.on('close', () => {
    for(let[key, value] of prefacutureDataMap){
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefacutureDataMap).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });

    const rankingStrings = rankingArray.map(([key, value], i) => {
        let ranking = i + 1;
        return (
            ranking +
            ' ::: ' +
            key +
            ': ' +
            value.popu10 +
            '=>' +
            value.popu15 +
            ' 変化率:' +
            value.change
        );
    });

    console.log(rankingStrings);
});