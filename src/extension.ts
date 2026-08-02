import * as vscode from 'vscode';
import { kindForPath, selectTargetUri } from './lib/office';
import { OfficeEditorProvider } from './officeEditor';
import type { DocumentKind } from './types';

function openWith(kind: DocumentKind, explicitUri: vscode.Uri | undefined): void {
  const activeTabInput = vscode.window.tabGroups.activeTabGroup.activeTab?.input as
    { uri?: vscode.Uri } | undefined;

  const uri = selectTargetUri(
    explicitUri,
    vscode.window.activeTextEditor?.document.uri,
    activeTabInput
  );

  if (!uri || kindForPath(uri.path) !== kind) return;
  void vscode.commands.executeCommand('vscode.openWith', uri, `office-preview.${kind}Editor`);
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    OfficeEditorProvider.register(context.extensionUri, 'docx'),
    OfficeEditorProvider.register(context.extensionUri, 'pptx'),
    vscode.commands.registerCommand('officePreview.openDocx', (uri?: vscode.Uri) =>
      openWith('docx', uri)
    ),
    vscode.commands.registerCommand('officePreview.openPptx', (uri?: vscode.Uri) =>
      openWith('pptx', uri)
    )
  );
}

export function deactivate(): void {}
