import postcss from 'postcss';
import tw from '@tailwindcss/postcss';
import fs from 'fs';
const css = fs.readFileSync('src/app/globals.css','utf8');
const res = await postcss([tw({base: process.cwd()})]).process(css, {from: 'src/app/globals.css'});
fs.writeFileSync('/private/tmp/claude-501/-Users-ali-Desktop-Project-poll-project/4c4f32eb-e3c7-4146-8c2f-a5af6a6463dd/scratchpad/out.css', res.css);
console.log('bytes', res.css.length);
