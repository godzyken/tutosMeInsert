var XLSX = require('xlsx');
var wb = new XLSX.readFile('./gold/BBD Gold insert.xlsx', {sheetStubs: true});
var rows = wb.SheetNames;

rows.forEach(function (y) {

    var worksheet = wb.Sheets[y];
    var headers = {};
    var data = [];

    for (cellule in worksheet) {
        if (cellule[0] === '!') continue;
        // parse la colonne, ligne, valeur

        var tt = 0;
        for (var i = 0; i < cellule.length; ++i) {
            if (!isNaN(cellule[i])) {
                tt = i;
                break;
            }
        }
        ;

        var col = cellule.substring(0, tt);
        var row = parseInt(cellule.substring(tt));
        var value = worksheet[cellule].w;


        // enregistre les tetes de colonne (titres: headers)
        if (row == 1 && value) {
            headers[col] = value;
            continue;
        }


        if (!data[row]) data[row] = {};
        data[row][headers[col]] = value;
    }
    //

    data.shift();
    data.shift();
    console.log(data);
});

module.exports = goldtoxlsx