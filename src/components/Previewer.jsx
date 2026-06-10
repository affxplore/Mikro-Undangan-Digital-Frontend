import React, { useState } from 'react';

const Previewer = ({ url }) => {
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' atau 'mobile'

  if (!url) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-100 rounded-lg">
        <p className="text-slate-500">URL preview tidak tersedia.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full items-center gap-4">
      {/* Tombol Toggle */}
      <div className="flex-shrink-0 bg-slate-200 p-1 rounded-lg w-fit">
        <button
          onClick={() => setPreviewMode('desktop')}
          className={`px-4 py-1 rounded-md text-sm font-medium transition ${
            previewMode === 'desktop' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Desktop
        </button>
        <button
          onClick={() => setPreviewMode('mobile')}
          className={`px-4 py-1 rounded-md text-sm font-medium transition ${
            previewMode === 'mobile' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Mobile
        </button>
      </div>

      {/* Kontainer Preview Dinamis */}
      <div className="w-full flex-1 flex items-center justify-center">
        {previewMode === 'mobile' ? (
          // Frame untuk Mobile
          <div className="w-[320px] h-[640px] bg-white rounded-[2rem] shadow-xl overflow-hidden border-8 border-slate-800 transition-all duration-300 flex-shrink-0">
            <iframe
              src={url || null}
              title="Mobile Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        ) : (
          // Frame untuk Desktop (paksa landscape 16:9)
          <div className="w-full h-full bg-slate-800 rounded-xl shadow-2xl p-2 transition-all duration-300">
            <div className="h-7 bg-slate-700 rounded-t-lg flex items-center px-3 gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            {/* Body konten, dipusatkan dan dibatasi rasio 16:9 */}
            <div className="w-full h-[calc(100%-1.75rem)] flex items-center justify-center">
              <div className="w-full max-w-5xl aspect-video bg-white overflow-hidden rounded-b-lg">
                <iframe
                  src={url || null}
                  title="Desktop Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Previewer;
