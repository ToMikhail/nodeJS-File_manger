import fs from 'fs';
import { chdir, cwd } from 'node:process';
import { readdir } from 'node:fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
// import { stdout } from 'process';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const showDirectory = async (directory) => {
  try {
    const files = await readdir(directory);
    console.table(files);
  } catch (err) {
    console.error(err);
  }
}

await showDirectory(__dirname);

const getUserName = () => {
  const args = process.argv.slice(2);
  let userName = 'unknown_user';
  args.forEach(arg => {
    if (arg.startsWith('--username')) {
      userName = arg.split('=')[1];
    }
  });
  return userName;
}

const USER_NAME = getUserName();

const start = async () => {

  console.log(`Welcome to the File Manager, ${USER_NAME}!`);
  let currentDir = `/User/${USER_NAME}`;

  const rl = readline.createInterface({
    input,
    output,
    terminal: false
  });

  rl.on('line', (line) => {

    if (line === ".exit") {
      console.log(`Thank you for using File Manager, ${USER_NAME}, goodbye!`);
      rl.close();
    }

    if (line === 'up') {
      if (cwd() !== __dirname) {
        currentDir.split('/').pop();
        chdir('../');
      }
      else console.log('You are in root')

      showDirectory(cwd());
      console.log(`You are currently in ${currentDir}`)
    }

    if (line === 'ls') {
      showDirectory(cwd());
    }

    if (line.startsWith('cd ')) {
      const path = line.slice(3);
      pathMaker(path, currentDir);
    }

    if (line.startsWith('cat ')) {
      const filePath = `${line.split(' ')[1]}`;
      const readableStream = fs.createReadStream(filePath, 'utf8');

      readableStream.pipe(output);
    } 

    if (line.startsWith('add ')) {

    }

    if (line.startsWith('rn ')) {

    }
    if (line.startsWith('cp ')) {

    }
    if (line.startsWith('mv ')) {

    }
    if (line.startsWith('rm ')) {

    }

    else {
      console.log('Enter correct command');
    }
  });
}

await start();

const pathMaker = (path, currentDir) => {
  try {
    if (path === '../') {
      if (cwd() === __dirname) path = '';
      else currentDir.split('/').pop();
    }
    else currentDir = `${currentDir}/${path}`;
    chdir(path);
    showDirectory(cwd());
    console.log(`You are currently in ${currentDir}`)
  } catch (err) {
    console.error(`Enter correct path`);
  }
}