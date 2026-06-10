
import React from 'react';

const Button = ({ children, className = '', type = 'button', ...props }) => (
  <button type={type} {...props} className={`rounded border px-2.5 py-1.5 text-sm ${className}`}>
    {children}
  </button>
);

const PageNameEditor = ({ page, pageIndex, onNameChange, isActive }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempName, setTempName] = React.useState(page.name || `H${pageIndex + 1}`);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const newName = tempName.trim() || `H${pageIndex + 1}`;
    onNameChange(pageIndex, newName);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setTempName(page.name || `H${pageIndex + 1}`);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={tempName}
        onChange={(e) => setTempName(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-20 px-2 py-1 text-sm border border-indigo-500 rounded bg-white text-indigo-700 outline-none"
        maxLength={15}
      />
    );
  }

  return (
    <Button
      onDoubleClick={() => setIsEditing(true)}
      className={isActive ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 bg-white hover:border-indigo-400'}
      title="Double-click to edit name"
    >
      {page.name || `H${pageIndex + 1}`}
    </Button>
  );
};

const AdminEditorTopbar = ({
  editor,
  onSave,
  onPreview,
  onExportPNG,
  onExportPDF,
  onExportPDFAll,
  onExportHTML,
  onExportHTMLAll,
  onExportJSON,
  onImportJSON,
  onToggleUi,
  onClose,
}) => {
  const [exportOpen, setExportOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const menuRef = React.useRef(null);

  const isCover = editor.activeView === 'cover';
  const pages = editor.templateData?.pages ?? [];

  const updatePageName = (pageIndex, newName) => {
    if (!editor.templateData?.pages?.[pageIndex]) return;
    
    const nextData = { ...editor.templateData };
    nextData.pages = [...nextData.pages];
    nextData.pages[pageIndex] = {
      ...nextData.pages[pageIndex],
      name: newName
    };
    
    editor.commitChange(nextData);
  };

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setExportOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleSave() {
    try {
      setSaving(true);
      const res = onSave?.();
      if (res && typeof res.then === 'function') {
        await res;
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-indigo-600" />
          <div className="font-semibold">Template Studio</div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => editor.setActiveView('cover')}
            className={isCover ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 bg-white hover:border-indigo-400'}
          >
            Cover
          </Button>
          {pages.map((p, i) => (
            <div key={p.id} onClick={() => editor.setActiveView(i)}>
              <PageNameEditor
                page={p}
                pageIndex={i}
                onNameChange={updatePageName}
                isActive={editor.activeView === i}
              />
            </div>
          ))}
          <Button
            onClick={editor.addPage}
            disabled={isCover}
            className={`border-gray-300 bg-white hover:border-indigo-400 ${isCover ? 'opacity-50 cursor-not-allowed hover:border-gray-300' : ''}`}
          >
            + Halaman
          </Button>
          <Button
            onClick={editor.duplicatePage}
            disabled={isCover || pages.length === 0}
            className={`border-gray-300 bg-white hover:border-indigo-400 ${isCover || pages.length === 0 ? 'opacity-50 cursor-not-allowed hover:border-gray-300' : ''}`}
          >
            Duplikat
          </Button>
          <Button
            onClick={editor.deletePage}
            disabled={isCover || pages.length <= 1}
            className={`border-red-200 bg-red-50 text-red-700 hover:bg-red-100 ${isCover || pages.length <= 1 ? 'opacity-50 cursor-not-allowed hover:bg-red-50' : ''}`}
          >
            Hapus
          </Button>
        </div>

        <div className="relative flex flex-wrap items-center gap-2">
          <Button onClick={onPreview} className="border-gray-300 bg-white hover:border-indigo-400">Preview</Button>
          <Button onClick={() => setExportOpen(!exportOpen)} className="border-gray-300 bg-white hover:border-indigo-400">
            Export
          </Button>
          {onToggleUi && (
            <Button onClick={onToggleUi} className="border-gray-300 bg-white hover:border-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              Hide UI
            </Button>
          )}
          <Button onClick={handleSave} className="bg-blue-600 text-white hover:bg-blue-700">
            {saving ? 'Saving...' : 'Save'}
          </Button>
          
          {onClose && (
            <Button 
              onClick={onClose} 
              className="ml-2 border-red-300 bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-1"
              title="Tutup editor"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Close</span>
            </Button>
          )}

          {exportOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 rounded-lg border bg-white p-2 shadow-lg">
              <div className="grid grid-cols-2 gap-2">
                {onExportPNG && (
                  <Button onClick={onExportPNG} className="bg-indigo-600 text-white hover:bg-indigo-700">PNG</Button>
                )}
                {onExportPDF && (
                  <Button onClick={onExportPDF} className="bg-indigo-600 text-white hover:bg-indigo-700">PDF</Button>
                )}
                {onExportPDFAll && (
                  <Button onClick={onExportPDFAll} className="bg-indigo-600 text-white hover:bg-indigo-700">PDF (Semua)</Button>
                )}
                {onExportHTML && (
                  <Button onClick={onExportHTML} className="bg-indigo-600 text-white hover:bg-indigo-700">HTML</Button>
                )}
                {onExportHTMLAll && (
                  <Button onClick={onExportHTMLAll} className="bg-indigo-600 text-white hover:bg-indigo-700">HTML (Semua)</Button>
                )}
                {onExportJSON && (
                  <Button onClick={onExportJSON} className="border-gray-300 bg-white hover:border-indigo-400">Export JSON</Button>
                )}
                {onImportJSON && (
                  <label className="cursor-pointer rounded border border-gray-300 px-2.5 py-1.5 text-sm hover:border-indigo-400">
                    Import JSON
                    <input type="file" accept="application/json" className="hidden" onChange={(e) => { onImportJSON?.(e); setExportOpen(false); }} />
                  </label>
                )}
              </div>
              <div className="mt-2 flex justify-end">
                <Button onClick={() => setExportOpen(false)} className="border-gray-300 bg-white hover:border-indigo-400">Tutup</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEditorTopbar;
