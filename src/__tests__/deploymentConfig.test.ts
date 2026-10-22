import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const readJson = (relativePath: string) =>
  JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf-8'));

describe('Firebase deployment configuration', () => {
  it('serves the SPA from dist and routes API paths to the api function', () => {
    const firebase = readJson('firebase.json');
    expect(firebase.hosting.public).toBe('dist');

    const rewrites = firebase.hosting.rewrites;
    const functionFor = (source: string) =>
      rewrites.find((rewrite: { source: string }) => rewrite.source === source)?.function;

    expect(functionFor('/api/**')).toBe('api');
    expect(functionFor('/healthz')).toBe('api');
    expect(functionFor('/health')).toBe('api');
    expect(functionFor('/.well-known/**')).toBe('api');

    // The SPA fallback must be last, otherwise it swallows the API routes above.
    expect(rewrites[rewrites.length - 1]).toEqual({ source: '**', destination: '/index.html' });
  });

  it('exports a function for every function referenced by hosting rewrites', async () => {
    const firebase = readJson('firebase.json');
    const referenced = new Set(
      firebase.hosting.rewrites
        .filter((rewrite: { function?: string }) => Boolean(rewrite.function))
        .map((rewrite: { function: string }) => rewrite.function)
    );

    // The first import pulls in the firebase-admin module tree, which can exceed
    // Vitest's default 5s test timeout on a cold cache.
    const exported = await import('../../functions/src/index');
    for (const name of referenced) {
      expect(Object.keys(exported)).toContain(name);
    }
  }, 60_000);

  it('only runs predeploy steps that exist as scripts', () => {
    const firebase = readJson('firebase.json');
    const rootPkg = readJson('package.json');
    const functionsPkg = readJson('functions/package.json');

    for (const command of firebase.functions.predeploy) {
      const match = /^npm(?: --prefix (\S+))? run (\S+)$/.exec(command);
      expect(match, `unsupported predeploy command: ${command}`).not.toBeNull();
      const [, prefix, script] = match as RegExpExecArray;
      const pkg = prefix ? functionsPkg : rootPkg;
      expect(Object.keys(pkg.scripts ?? {}), `missing script for: ${command}`).toContain(script);
    }
  });

  it('points at the production Firebase project', () => {
    expect(readJson('.firebaserc').projects.default).toBe('nice-unity-1mbw7');
  });

  it('builds the functions bundle for Node 22', () => {
    const functionsPkg = readJson('functions/package.json');
    expect(functionsPkg.engines.node).toBe('22');
    expect(functionsPkg.scripts.build).toContain('lib/index.js');
  });

  it('keeps the built functions bundle and its dependencies out of the root typecheck', () => {
    const tsconfig = readJson('tsconfig.json');
    expect(tsconfig.exclude).toContain('functions/lib');
    expect(tsconfig.exclude).toContain('functions/node_modules');
  });
});
