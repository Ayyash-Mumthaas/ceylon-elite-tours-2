const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function replaceInFile(filePath) {
  if (!filePath.endsWith('.tsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Single line replacements
  content = content.replace(/<button className="text-red-600 hover:text-red-900" onClick={\(e\) => { if \(!confirm\("([^"]+)"\)\) e\.preventDefault\(\); }}>Delete<\/button>/g, '<DeleteButton message="$1" />');
  content = content.replace(/<button type="submit" className="text-red-600 hover:text-red-800" onClick={e => { if \(!confirm\('([^']+)'\)\) e\.preventDefault\(\); }}>/g, '<DeleteButton message="$1" className="text-red-600 hover:text-red-800" />');
  
  // Multi-line replacement for tours and destinations
  const multiLineRegex = /<button[\s\S]*?className="text-red-600 hover:text-red-900"[\s\S]*?onClick={\(e\) => {[\s\S]*?if \(!confirm\("([^"]+)"\)\) {[\s\S]*?e\.preventDefault\(\);[\s\S]*?}[\s\S]*?}}[\s\S]*?>[\s\S]*?Delete[\s\S]*?<\/button>/g;
  content = content.replace(multiLineRegex, '<DeleteButton message="$1" />');

  // If content changed, add import
  if (content !== originalContent) {
    if (!content.includes("import { DeleteButton }")) {
      // add import at top
      content = 'import { DeleteButton } from "@/components/delete-button";\n' + content;
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

walkDir('c:\\Users\\Asus tuf\\Desktop\\ceylon-elite-tours\\src\\app\\(admin)', replaceInFile);
console.log("Done.");
