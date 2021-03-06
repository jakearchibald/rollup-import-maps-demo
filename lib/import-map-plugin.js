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
  const importMap = { imports: {} };

  return {
    name: 'import-map-plugin',
    renderChunk(code, chunk) {
      const hash = createHash('md5');
      hash.update(code);
      const hashedFilename = chunk.fileName.replace(
        /\.js$/,
        `-${hash.digest('hex').slice(0, 8)}.js`,
      );
      importMap.imports['./' + chunk.fileName] = './' + hashedFilename;

      this.emitFile({
        type: 'asset',
        source: code,
        fileName: hashedFilename,
      });
    },
    generateBundle(outputOpts, bundle) {
      this.emitFile({
        type: 'asset',
        source: JSON.stringify(importMap),
        fileName: 'import-map.json',
      });
    },
  };
}
