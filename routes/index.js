var express = require('express');
var router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');

// const exphbs = require('express-handlebars');
// const app = express();

// const hbs = exphbs.create({
//     helpers: {
//         customMessage: function(data) {
//             return `It's a VL of amount RS:${data.amount}`;
//         }
//     }
// });

// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');
var data;
var uniqueValues;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/excel');
  },
  filename: (req, file, cb) => {
      cb(null, 'product.xlsx');
  }
});
const upload = multer({ storage: storage });
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/upload', upload.single('excelFile'), (req, res) => {
  // Process the uploaded Excel file
  const workbook = xlsx.readFile(path.join(__dirname, '..', 'public', 'excel', 'product.xlsx'));
  // res.send('File uploaded successfully!');
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  // Convert the sheet to JSON format
  data = xlsx.utils.sheet_to_json(sheet);
  uniqueValues = {
    
    branch: [...new Set(data.map(row => row.branch))],
    product: [...new Set(data.map(row => row.product))]
};
 

  res.render('index', { title: 'Express',data,uniqueValues });
  // console.log(data)
});
router.post('/submit', (req, res) => {

  const selectedBranch = req.body.branch;
  const selectedProduct = req.body.product;

  // Filter data based on selected values
  const filteredData = data.filter(row => (
     
      (!selectedBranch || row.branch === selectedBranch) &&
      (!selectedProduct || row.product === selectedProduct)
  ));
 
// const customized_message={
//   vl:"its a vl{{this.amount}}",
//   pl:"its a pl {{this.emi}}"
// }
  // Render the table with filtered data
  
  res.render('index', { title: 'WhatsApp Messaging', uniqueValues, filteredData,selectedBranch,selectedProduct });
});


module.exports = router;
