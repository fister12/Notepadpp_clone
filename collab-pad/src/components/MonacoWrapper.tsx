'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import with no SSR to prevent CSS chunk loading issues
const MonacoEditor = dynamic(() => import('./MonacoEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-800 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p>Loading ColabPad Editor...</p>
      </div>
    </div>
  ),
});

export default MonacoEditor;