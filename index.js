import {WebContainer} from '@webcontainer/api'
import {files} from "./files"

import {Terminal} from 'xterm'
import 'xterm/css/xterm.css'

const iframe = document.querySelector('iframe')
const aiTextArea = document.querySelector("#aiTextArea")
const submitButton = document.querySelector('#submitButton');
const editorTextArea = document.querySelector("#editorTextArea")
const terminalElement = document.querySelector('.terminal')

let WebContainersInstance

async function installDependencies(terminal) {
    const installProcess = await WebContainersInstance.spawn('npm', ['install'])
 
    installProcess.output.pipeTo(new WritableStream({
        write(data) {
            terminal.write(data)
        }
    }))
 
    return installProcess.exit
 }


async function startDevServer(terminal) {
   const serverProcess = await WebContainersInstance.spawn('npm', ['run', 'start'])

   serverProcess.output.pipeTo(new WritableStream({
       write(data) {
           terminal.write(data)
       }
   }))

   WebContainersInstance.on('server-ready', (port, url) => {
       iframe.src = url
   })
}


 async function writeIndexJS(file, content) {
    await WebContainersInstance.fs.writeFile(`/${file}`, content)
 }
 

 async function sendCommand(terminal, commandToSend) {

    const commandParts = commandToSend.split(' ');

    const command = commandParts[0]; // "npm"
    const args = commandParts.slice(1); // ["version"]

    const commandProcess = await WebContainersInstance.spawn(command, args);

    //const commandProcess = await WebContainersInstance.spawn(commandToSend)
    //const commandProcess = await WebContainersInstance.spawn('npm', ['version'])

    commandProcess.output.pipeTo(new WritableStream({
        write(data) {
            terminal.write(data)
        }
    }))
 
    return commandProcess.exit
 }



window.addEventListener('load', async () => {

    const terminal = new Terminal({
        convertEol: true,
    })
    terminal.open(terminalElement)
    
    aiTextArea.value = ""
    editorTextArea.value = ""

    editorTextArea.value = files['index.js'].file.contents
    editorTextArea.addEventListener('input', (e) => {
        writeIndexJS('index.js', e.currentTarget.value)
    })

    submitButton.addEventListener('click', () => {
        const textValue = aiTextArea.value;
        sendCommand(terminal, textValue);    
    });


    WebContainersInstance = await WebContainer.boot()
    await WebContainersInstance.mount(files)

    await installDependencies(terminal)

    await startDevServer(terminal)

    console.log('Window is loaded')
 })

