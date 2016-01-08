'use strict';

import * as vsc from 'vscode';
import { TextEditorCommands } from './Commands';
import { XmlFormattingEditProvider } from './providers/Formatting';

export var GlobalState: vsc.Memento;
export var WorkspaceState: vsc.Memento;

const LANG_XML: string = 'xml';
const MEM_QUERY_HISTORY: string = 'xpathQueryHistory';

export function activate(ctx: vsc.ExtensionContext) {
    // expose global and workspace state to the entire extension
    GlobalState = ctx.globalState;
    WorkspaceState = ctx.workspaceState;
    
	// register palette commands
    ctx.subscriptions.push(
        vsc.commands.registerTextEditorCommand('xmlTools.minifyXml', TextEditorCommands.minifyXml),
        vsc.commands.registerTextEditorCommand('xmlTools.formatXml', TextEditorCommands.formatXml),
        vsc.commands.registerTextEditorCommand('xmlTools.evaluateXPath', TextEditorCommands.evaluateXPath)
    );
	
	// register language feature providers
    ctx.subscriptions.push(
        vsc.languages.registerDocumentFormattingEditProvider(LANG_XML, new XmlFormattingEditProvider()),
        vsc.languages.registerDocumentRangeFormattingEditProvider(LANG_XML, new XmlFormattingEditProvider())
    );
}

export function deactivate() {
    // clean up xpath history
    let memento: vsc.Memento = WorkspaceState || GlobalState;
    let history = memento.get<any[]>(MEM_QUERY_HISTORY, []);
    history.splice(0);
    memento.update(MEM_QUERY_HISTORY, history);
}