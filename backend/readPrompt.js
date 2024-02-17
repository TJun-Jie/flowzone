const fs = require('fs');
const path = require('path');

function readPromptFile(filename) {
    try {
        const filePath = path.join(__dirname, 'prompts', filename);
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error('Error reading prompt file:', error);
        return '';
    }
}


module.exports = {readPromptFile};