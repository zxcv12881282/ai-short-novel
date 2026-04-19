const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('F:/as写作/pdf7.pdf');

pdf(dataBuffer).then(function(data) {
    console.log("NUM PAGES:", data.numpages);
    console.log("TEXT EXTRACTED:", data.text.trim() ? "YES (" + data.text.length + " chars)" : "NO TEXT");
    if(data.text.trim()) {
        fs.writeFileSync('pdf7-text.txt', data.text);
    }
}).catch(err => {
    console.error("ERROR:", err);
});