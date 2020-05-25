const appRootPath = require('app-root-path');

const { spawn } = require("child_process");


exports.execCommand = (cmd, options) => {
    const command = spawn(cmd, options)

    command.stdout.on("data", data => {
        log().verbose({ message: `stdout: ${data}` });
    });

    command.stderr.on("data", data => {
        log().verbose({ message: `stderr: ${data}` });
    });

    command.on('error', (error) => {
        log().error({ message: `error: ${error.message}` });
    });

    return command.on("close", code => {
        log().verbose({ message: `shell command ${cmd} ${options} terminated with code=${code}` });
        return code
    });

}