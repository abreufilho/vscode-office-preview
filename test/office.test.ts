import assert from 'node:assert/strict';
import test from 'node:test';
import { baseName, bytesToBase64, kindForPath, selectTargetUri } from '../src/lib/office';

test('maps known extensions to a preview kind, case insensitively', () => {
  assert.equal(kindForPath('/tmp/report.docx'), 'docx');
  assert.equal(kindForPath('/tmp/DECK.PPTX'), 'pptx');
});

test('rejects paths it cannot preview', () => {
  assert.equal(kindForPath('/tmp/notes.txt'), null);
  assert.equal(kindForPath('/tmp/archive.docx.zip'), null);
  assert.equal(kindForPath('/tmp/no-extension'), null);
  assert.equal(kindForPath(undefined), null);
});

test('does not read a directory name as the extension', () => {
  assert.equal(kindForPath('/tmp/v1.docx/readme'), null);
});

test('takes the last segment of a URI path', () => {
  assert.equal(baseName('/home/user/report.docx'), 'report.docx');
  assert.equal(baseName('report.docx'), 'report.docx');
  assert.equal(baseName(''), '');
  assert.equal(baseName(null), '');
});

test('prefers the explicit uri, then the editor, then the active tab', () => {
  assert.equal(selectTargetUri('explicit', 'editor', { uri: 'tab' }), 'explicit');
  assert.equal(selectTargetUri(undefined, 'editor', { uri: 'tab' }), 'editor');
  assert.equal(selectTargetUri(undefined, undefined, { uri: 'tab' }), 'tab');
  assert.equal(selectTargetUri(undefined, undefined, undefined), undefined);
});

test('encodes bytes for the message channel', () => {
  assert.equal(bytesToBase64(new Uint8Array([80, 75, 3, 4])), 'UEsDBA==');
  assert.equal(bytesToBase64(new Uint8Array()), '');
});
