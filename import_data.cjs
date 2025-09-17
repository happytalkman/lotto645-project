// 로또 데이터 임포트 스크립트
const fs = require('fs');
const path = require('path');

// CSV 파싱 함수
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    
    data.push(row);
  }
  
  return data;
}

// SQL INSERT 문 생성
function generateInsertSQL(data) {
  let sql = '';
  
  data.forEach(row => {
    sql += `INSERT OR IGNORE INTO lotto_draws (draw_number, draw_date, number1, number2, number3, number4, number5, number6, bonus_number) VALUES (${row.draw_number}, '${row.draw_date}', ${row.number1}, ${row.number2}, ${row.number3}, ${row.number4}, ${row.number5}, ${row.number6}, ${row.bonus_number});\n`;
  });
  
  return sql;
}

// 메인 실행
try {
  const csvPath = path.join(__dirname, 'lotto_data.csv');
  const csvText = fs.readFileSync(csvPath, 'utf8');
  const data = parseCSV(csvText);
  
  console.log(`Parsed ${data.length} lottery draw records`);
  
  const insertSQL = generateInsertSQL(data);
  const outputPath = path.join(__dirname, 'lotto_import.sql');
  
  fs.writeFileSync(outputPath, insertSQL);
  console.log(`Generated SQL file: ${outputPath}`);
  
  // seed.sql에 추가
  const existingSeed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
  const newSeed = existingSeed + '\n\n-- 로또 당첨 번호 데이터\n' + insertSQL;
  
  fs.writeFileSync(path.join(__dirname, 'seed.sql'), newSeed);
  console.log('Updated seed.sql with lottery data');
  
} catch (error) {
  console.error('Error:', error);
}