const fs = require('fs');
const path = require('path');

const directoryPath = '/Users/elma777boubi/Downloads/Roxanne';

const replacements = {
  'Package': 'Box',
  'Sparkles': 'Zap',
  'Tag': 'Ticket',
  'Heart': 'Flame',
  'CheckCircle2': 'CheckCircle',
  'ArrowRight': 'ArrowUpRight',
  'ArrowLeft': 'ArrowLeftCircle',
  'Palette': 'PenTool'
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.next')) {
        processDirectory(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const [oldIcon, newIcon] of Object.entries(replacements)) {
        // Replace in imports (e.g., import { Package } from 'lucide-react')
        const importRegex = new RegExp(`\\b${oldIcon}\\b`, 'g');
        content = content.replace(importRegex, newIcon);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  });
}

processDirectory(directoryPath);
