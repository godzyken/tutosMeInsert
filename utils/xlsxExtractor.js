const XLSX = require('xlsx');
const _ = require("underscore");
const S = require("string");

const columns = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const ColumnsGenerator = function* (start) {
    const columnsNum = columns.length;
    yield start;

    const incCharAt = (i) => {
        let char = start[i];
        let j = columns.indexOf(char);

        if (j < columnsNum - 1) {
            return start.substring(0, i) + columns[j + 1] + start.substring(i + 1);
        } else if (i === 0) {
            return S("A").repeat(start.length + 1).s;
        } else {
            start = incCharAt(i - 1);
            return start.substring(0, i) + S("A").repeat(start.length - i).s;
        }
    };

    while (true) {
        start = incCharAt(start.length - 1);
        yield start;
    }
};

module.exports = (filePath) => {
    const results = [];
    const headers = [];

    const workBook = new XLSX.readFile(filePath, {sheetStubs: true});
    for (let sheet of _.values(workBook.Sheets)) {
        let range = (sheet["!ref"] || "").match(/((\D+)(\d+)):((\D+)(\d+))/);
        if (!range) break;

        for (let row = parseInt(range[3]); row <= parseInt(range[6]); row++) {
            let columnIndex = 0;
            let columns = ColumnsGenerator(range[2]);
            let item = {};

            while (true) {
                let column = columns.next().value;
                let cel = sheet[column + row] || {};
                let value = cel.v || null;

                if (row == 1) {
                    headers.push(value || column);
                } else if (value) {
                    item[headers[columnIndex]] = value;
                }

                if (column == range[5]) break;
                columnIndex++;
            }
            if (!_.isEmpty(item)) {
                results.push(item);
            }
        }
    }

    return {
        headers: headers,
        rows: results
    };
};
