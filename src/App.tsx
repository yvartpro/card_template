/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CardTemplateEditor } from './components/CardTemplateEditor';
import { CardTemplate } from './types';

export default function App() {
  const handleSave = (templateJson: CardTemplate) => {
    console.log('[macarte] Card Template Saved JSON:', templateJson);
  };

  return <CardTemplateEditor onSave={handleSave} />;
}

