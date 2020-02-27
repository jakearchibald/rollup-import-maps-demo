/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { createHash } from 'crypto';

export default function importMapPlugin() {
  return {
    name: 'import-map-plugin',
    generateBundle(outputOpts, bundle) {
      const chunkToHash = new Map();
      const chunks = Object.values(bundle).filter(c => c.type === 'chunk');

      // Create hashes for all chunks
      for (const chunk of chunks) {
        const hash = createHash('md5');
        hash.update(chunk.code);
        chunkToHash.set(chunk, hash.digest('hex').slice(0, 8));
      }

      // Create the map
      const importMap = { imports: {} };

      for (const chunk of chunks) {
        importMap.imports['./' + chunk.fileName] =
          './' +
          chunk.fileName.replace(/\.js$/, `-${chunkToHash.get(chunk)}.js`);
      }

      this.emitFile({
        type: 'asset',
        source: JSON.stringify(importMap),
        fileName: 'import-map.json',
      });

      // Output files
      for (const chunk of chunks) {
        this.emitFile({
          type: 'asset',
          source: chunk.code,
          fileName: importMap.imports['./' + chunk.fileName].slice(2),
        });
      }
    },
  };
}
