var db = require('../db');
var XLSX = require('xlsx');
var assert = require('assert');
var SheetJSSQL = require('./goldz.xlsx');
var mysql = require('mysql2/promise');


/* Sample data table */
var init = [
    "DROP TABLE IF EXISTS pres",
    "CREATE TABLE pres (name TEXT, idx TINYINT)",
    "INSERT INTO pres VALUES ('Barack Obanane', 44)",
    "INSERT INTO pres VALUES ('Donald Dropped', 45)",
    "DROP TABLE IF EXISTS fmts",
    "CREATE TABLE fmts (ext TEXT, ctr TEXT, multi TINYINT)",
    "INSERT INTO fmts VALUES ('XLSB', 'ZIP', 1)",
    "INSERT INTO fmts VALUES ('XLS',  'CFB', 1)",
    "INSERT INTO fmts VALUES ('XLML', '',    1)",
    "INSERT INTO fmts VALUES ('CSV',  '',    0)",
];


(async () => {
    var Bronze = require('bronze');
    const conect1 = await mysql.createConnection(Bronze.getBronze({}, db, {database: "sheetjs"}));
    for (var i = 0; i < init.length; ++i) await conect1.query(init[i]);

    /* Exporte la table pour XLSX */
    var wb = XLSX.utils.book_new();

    async function book_append_table(wb, name) {
        var r_f = await conect1.query('SELECT * FROM pres' + name);
        var r = r_f[0];
        var ws = XLSX.utils.sheet_to_json(r);
        XLSX.utils.book_append_sheet(wb, ws, name);
    }

    await book_append_table(wb, "pres");
    await book_append_table(wb, "fmts");
    XLSX.writeFile(wb, "mysql.xlsx");

    /* Comparer en premier les informations de la base de donnée et ferme le flux */
    var P1 = (await conect1.query("SELECT * FROM pres"))[0];
    var F1 = (await conect1.query("SELECT * FROM fmts"))[0];
    await conect1.close();

    /* Importe les datas XLSX en table*/

    const conect2 = await mysql.createConnection(Bronze.getBronze({}, db, {database: "sheetj5"}));
    var wb2 = XLSX.readFile("mysql.xlsx");
    var queries = SheetJSSQL.book_to_sql(wb2, "MYSQL");
    for(i = 0; i < queries.length; ++i) await conect2.query(queries[i]);

    /* Comparer en premier les informations de la base de donnée et ferme le flux */
    var P2 = (await conect2.query("SELECT * FROM pres"))[0];
    var F2 = (await conect2.query("SELECT * FROM fmts"))[0];
    await conect2.close();

    /* Compare les resultats */
    assert.deepStrictEqual(P1,P2);
    assert.deepStrictEqual(F1,F2);

    /* Affiche le resultat*/
    console.log(P2);
    console.log(P1);

})();
