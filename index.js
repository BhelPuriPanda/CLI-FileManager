import fs, { readFile, readFileSync } from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { stdin, stdout } from 'process';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout,
    prompt : '>>>'
})

let currentDir = __dirname

rl.prompt()

rl.on('line', (line) => {
    const[commands , ...args] = line.trim().split(' ')

    switch(commands){
        case 'list':
            console.log('Current Directory:', currentDir);
            console.log("Args: ",args)
            listFiles(args[0]);
            break;
        case 'exit':
            rl.close();
            break;
        case 'read':
            readFile(path.join(currentDir,args[0]),'utf-8',(err,data)=>{
                if(err){
                    console.error(err)
                    return
                }
                console.log(data)
            })
            break;
        case 'cd':
            changeDirectory(args[0])
            break;    
        case 'create':
            createFile(args[0])
            break; 
        case 'delete':
            deleteFile(args[0])
            break; 
        case 'mkdir':
            makeDirectory(args[0])
            break;  
        case 'rename':
            renamePath(args[0],args[1])
            break;
        default:
            console.log(`Unknown Command : ${commands}`)
    }
    rl.setPrompt(`fm (${currentDir})> `);
    rl.prompt()

}).on('close' , ()=>{
    console.log("Exitting File Manager")
    process.exit(0)
})

const listFiles = (target = '.') => {
    const targetPath = path.join(currentDir,target)

    fs.readdir(targetPath ,{withFileTypes : true}, (err,files) => {
        if(err){
            console.error("Error Reading Directory")
            return;
        }
        
        console.log("Listing Files of the Directory ",targetPath)
        files.forEach(file => {
            const type = file.isDirectory() ? '📁' : '📄'
            console.log(`${type} - ${file.name}`)
        });
    })
}

function changeDirectory(dir) {
    const newPath = path.resolve(currentDir, dir);
    if (fs.existsSync(newPath) && fs.statSync(newPath).isDirectory()) {
        currentDir = newPath;
        console.log('Changed directory to', currentDir);
        rl.setPrompt(`fm (${currentDir})> `);
    } else {
        console.log('Directory does not exist');
    }
}

function createFile(fileName) {
    const filePath = path.join(currentDir, fileName);
    fs.writeFile(filePath, '', (err) => {
        if (err) {
            console.error('Error creating file:', err.message);
            return;
        }
        console.log(`File created: ${fileName}`);
    });
}

function renamePath(oldName, newName) {
    const oldPath = path.join(currentDir, oldName);
    const newPath = path.join(currentDir, newName);
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            console.error('Error renaming:', err.message);
            return;
        }
        console.log(`Renamed ${oldName} to ${newName}`);
    });
}

function deleteFile(name){
    const targetPath = path.join(currentDir, name);

    fs.stat(targetPath, (err,stats,)=>{
        if (err) {
            console.error('Error reading path:', err.message);
            return;
        }

        if(stats.isDirectory()){
            fs.rm(targetPath , {recursive:true , force:true} , (err)=>{
                if (err) {
                    console.error('Error deleting directory:', err.message);
                    return;
                }
                console.log(`Directory deleted: ${name}`)
            })
        }else{
            fs.unlink(targetPath , (err)=>{
                if (err) {
                    console.error('Error deleting file:', err.message);
                    return;
                }
                console.log(`File deleted: ${name}`);
            })
        }
    })
}

function makeDirectory(dirName) {
    const dirPath = path.join(currentDir, dirName);
    fs.mkdir(dirPath, { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating directory:', err.message);
            return;
        }
        console.log(`Directory created: ${dirName}`);
    });
}