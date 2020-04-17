const vscode = require('vscode');
const scaffold = require('scaffold-serverless-service/core').Scaffold;

/**
 * Scaffold a service in place and open the editor for the JS component file
 * @param {string} path Path to create component
 */
const scaffoldAndOpen = async (path) => {

	const name = await askForInput('Enter the name of the service to create', 'e.g. my-service');
	if(!name) return;
	
	process.chdir(path);

	scaffold(name).then((file) => {
		vscode.workspace.openTextDocument(file).then(doc => {
			vscode.window.showTextDocument(doc).then(() => {
				vscode.window.showInformationMessage(`Service: ${name} was created succesfully.`);
			});
		});
	}).catch((err) => {
		vscode.window.showErrorMessage(`Service: ${name} could not be created.`);
		throw err;
	});	
	
};

/**
 * Display a VS Code input box with the given options
 * @param {string} [prompt] Text to show below input
 * @param {string} [placeholder] Placeholder text in input
 * @param {string} [value] Initial value
 */
const askForInput = async (prompt, placeholder, value) => {
	return await vscode.window.showInputBox({
		placeHolder: placeholder,
		prompt: prompt,
		value: value
	});
};

/** 
 * Sets up the commands to be used.
 * Invoked the first time the extension is used.
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let scaffold = vscode.commands.registerCommand('scaffold-serverless-service-vscode.scaffold', async (folderObject) => {
		await scaffoldAndOpen(folderObject.fsPath);		
	});

	context.subscriptions.push(scaffold);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
