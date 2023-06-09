// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { accessSync, constants, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { json } from 'stream/consumers';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('allanguagelinuxpatcher.patchAlLanguageExtension', async () => {
		let alExtensionBasePath = vscode.extensions.getExtension('ms-dynamics-smb.al')?.extensionPath;
		
		if(!alExtensionBasePath) {
			return;
		}

		var uri = GetCurrentFileURI();
		const allanguagelinuxpatcherConfig = vscode.workspace.getConfiguration('allanguagelinuxpatcher');
		const dotnetPath = allanguagelinuxpatcherConfig.get('dotnet-path');
		
		let extensionsJSPath = join(alExtensionBasePath, '/dist/extension.js');
		let fileContent = readFileSync(extensionsJSPath, 'utf8');
		//"/startDebugging"
		//"/home/stefan/.vscode/extensions/ms-dynamics-smb.al-11.0.787898/bin/win32/Microsoft.Dynamics.Nav.EditorServices.Host.dll","/startDebugging"
		let newfileContent = fileContent.replace(
			/"\/startDebugging"/g,
			`"${join(alExtensionBasePath,'/bin/win32/Microsoft.Dynamics.Nav.EditorServices.Host.dll')}","/startDebugging"`
		);
		//this.getServerPath()
		//"/bin/dotnet"
		newfileContent = newfileContent.replace(
			/this\.getServerPath\(\)/g,
			`"${dotnetPath}"`
		);
		//const e=[];for(const t of y.getLanguageServerOptions())
		//const e=["/home/stefan/.vscode/extensions/ms-dynamics-smb.al-11.0.787898/bin/win32/Microsoft.Dynamics.Nav.EditorServices.Host.dll"];for(const t of y.getLanguageServerOptions())
		newfileContent = newfileContent.replace(
			'const e=[];for(const t of y.getLanguageServerOptions())',
			`const e=["${join(alExtensionBasePath,'/bin/win32/Microsoft.Dynamics.Nav.EditorServices.Host.dll')}"];for(const t of y.getLanguageServerOptions())`
		);
		writeFileSync(extensionsJSPath, newfileContent, 'utf8');

		let alcRuntimeConfigJsonPath = join(alExtensionBasePath, '/bin/win32/alc.runtimeconfig.json');
		fileContent = readFileSync(alcRuntimeConfigJsonPath, 'utf8');
		let alcRuntimeConfig = JSON.parse(fileContent);
		alcRuntimeConfig.runtimeOptions.framework = alcRuntimeConfig.runtimeOptions.includedFrameworks[0];
		alcRuntimeConfig.runtimeOptions.includedFrameworks = undefined;
		fileContent = JSON.stringify(alcRuntimeConfig);
		writeFileSync(alcRuntimeConfigJsonPath, fileContent, 'utf8');

		let editorServicesHostConfigJsonPath = join(alExtensionBasePath, '/bin/win32/Microsoft.Dynamics.Nav.EditorServices.Host.runtimeconfig.json');
		fileContent = readFileSync(editorServicesHostConfigJsonPath, 'utf8');
		let editorServicesHostConfig = JSON.parse(fileContent);
		editorServicesHostConfig.runtimeOptions.framework = editorServicesHostConfig.runtimeOptions.includedFrameworks[0];
		editorServicesHostConfig.runtimeOptions.includedFrameworks = undefined;
		fileContent = JSON.stringify(editorServicesHostConfig);
		writeFileSync(editorServicesHostConfigJsonPath, fileContent, 'utf8');

		await vscode.commands.executeCommand('workbench.action.reloadWindow');

		vscode.window.showInformationMessage('AL Language files patched. VS code should have been restarted. If you are in a AL Workspace, you should see the AL Language extension loading the Workspace.');
	});

	context.subscriptions.push(disposable);
}


function GetCurrentFileURI() {
	var uri = null;
	if (vscode.window.activeTextEditor)
		uri = vscode.window.activeTextEditor.document.uri;
	return uri;
}

// This method is called when your extension is deactivated
export function deactivate() {}
