import used from './used.json';
import fs from 'fs';
import { join } from 'path';

trim('GimkitIndex');
trim('Gimkit2dCode');

function trim(name: string) {
    let code = fs.readFileSync(join(__dirname, `../../src/lib/${name}Full.js`)).toString();
    
    const importRegex = /\n.\.register\(".....",/g;
    
    let matches: [string, number][] = []; // [text, index]
    let match;
    while ((match = importRegex.exec(code)) !== null) {
        matches.push([match[0], match.index]);
    }
    
    for(let i = matches.length - 1; i >= 0; i--) {
        let id = matches[i][0].slice(13, 18);
        let index = matches[i][1];
        if(used.includes(id)) continue;
    
        let next = matches[i + 1];
        if(next) {
            code = code.slice(0, index) + code.slice(next[1]);
        } else {
            // forget it
            // code = code.slice(0, index);
        }
    }
    
    fs.writeFileSync(join(__dirname, `../../src/lib/${name}.js`), code);
}