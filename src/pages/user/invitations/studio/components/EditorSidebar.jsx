import React from 'react';
import CoverSidebar from './CoverSidebar';
import PagesSidebar from './PagesSidebar';

const EditorSidebar = ({ editor, onPlayMusic, onMusicPause }) => {
  const isCover = editor.activeView === 'cover';

  return (
    <aside
      className="sticky top-16 h-[calc(100vh-6rem)] overflow-auto rounded-2xl border bg-white p-4 shadow"
      onKeyDownCapture={(e) => e.stopPropagation()}
      onKeyUpCapture={(e) => e.stopPropagation()}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="font-semibold">{isCover ? 'Cover Editor' : 'Page Editor'}</div>
      </div>

      {isCover ? (
        <CoverSidebar editor={editor} />
      ) : (
        <PagesSidebar editor={editor} onPlayMusic={onPlayMusic} onMusicPause={onMusicPause} />
      )}

      <div className="mt-6 rounded-xl bg-indigo-50 p-3 text-xs text-indigo-900">
        Tips: drag = seret, tahan Shift untuk snap 1px. Double-click teks untuk edit langsung. Resize via handle sudut. Panah untuk nudge.
      </div>
    </aside>
  );
};

export default EditorSidebar;