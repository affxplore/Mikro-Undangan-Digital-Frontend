import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useInvitationEditor } from "../hooks/useInvitationEditor";
import useProjects from "../../../../api/projects/useProjects";

import EditorTopbar from "./components/EditorTopbar";
import EditorCanvas from "./components/EditorCanvas";
import EditorSidebar from "./components/EditorSidebar";
import { buildHTML, CANVAS } from "../../../../utils/InvitationBuilder";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

export default function EditInvitationPage() {
  const editor = useInvitationEditor();
  const navigate = useNavigate();
  const { isSavingAuto, saveError } = editor;
  const { update: updateProject } = useProjects();

  const [isUiHidden, setIsUiHidden] = useState(false);
  const [viewMode, setViewMode] = useState("desktop"); // Track current view mode for exports
  
  const cardRef = useRef(null);
  const audioRef = useRef(null);

  const openPreview = () => {
    if (!editor.projectId) {
        alert("Project ID tidak ditemukan. Simpan project terlebih dahulu.");
        return;
    }
    
    const url = `/preview/${editor.projectId}`;
    window.open(url, '_blank');
  };

  const handleShare = () => {
    if (!editor.projectId) {
      alert("Project ID tidak ditemukan. Simpan project terlebih dahulu.");
      return;
    }
    navigate(`/invitations/${editor.projectId}/share`);
  };

  const handleClose = () => {
    navigate('/dashboard/invitations');
  };

  // --- Export helpers ---
  const downloadDataUrl = (url, name) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
  };
  const downloadBlob = (blob, name) => {
    const url = URL.createObjectURL(blob);
    downloadDataUrl(url, name);
    URL.revokeObjectURL(url);
  };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const handleExportPNG = async () => {
    const node = cardRef.current;
    if (!node) return;
    const dataUrl = await toPng(node, { pixelRatio: 2, filter: (n) => !n?.getAttribute?.('data-export-exclude') });
    downloadDataUrl(dataUrl, `undangan-h${editor.pageIndex + 1}.png`);
  };
  const handleExportPDF = async () => {
    const node = cardRef.current;
    if (!node) return;
    const png = await toPng(node, { pixelRatio: 2, filter: (n) => !n?.getAttribute?.('data-export-exclude') });
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [CANVAS.width, CANVAS.height] });
    pdf.addImage(png, 'PNG', 0, 0, CANVAS.width, CANVAS.height);
    pdf.save(`undangan-h${editor.pageIndex + 1}.pdf`);
  };
  const handleExportPDFAll = async () => {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [CANVAS.width, CANVAS.height] });
    const prev = editor.pageIndex;
    for (let i = 0; i < editor.projectData.pages.length; i++) {
      editor.setPageIndex(i);
      await wait(80);
      const node = cardRef.current;
      if (!node) continue;
      const png = await toPng(node, { pixelRatio: 2, filter: (n) => !n?.getAttribute?.('data-export-exclude') });
      if (i > 0) pdf.addPage([CANVAS.width, CANVAS.height], 'portrait');
      pdf.addImage(png, 'PNG', 0, 0, CANVAS.width, CANVAS.height);
    }
    pdf.save('undangan-semua.pdf');
    editor.setPageIndex(prev);
  };
  const handleExportHTML = () => {
    if (!editor.page) return;
    const html = buildHTML([editor.page], viewMode);
    downloadBlob(new Blob([html], { type: 'text/html;charset=utf-8' }), `undangan-h${editor.pageIndex + 1}-${viewMode}.html`);
  };
  const handleExportHTMLAll = () => {
    const html = buildHTML(editor.projectData.pages, viewMode);
    downloadBlob(new Blob([html], { type: 'text/html;charset=utf-8' }), `undangan-semua-${viewMode}.html`);
  };
  const handleExportJSON = () => {
    downloadBlob(new Blob([JSON.stringify(editor.projectData, null, 2)], { type: 'application/json' }), 'project.json');
  };
  const handleImportJSON = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const parsed = JSON.parse(r.result);
        editor.commitChange(parsed);
      } catch {
        alert('JSON tidak valid');
      }
    };
    r.readAsText(f);
    e.target.value = '';
  };

  const handleMusicPlay = () => {
    audioRef.current?.play?.().catch(() => {});
  };
  const handleMusicPause = () => {
    audioRef.current?.pause?.();
  };

  if (editor.loading || !editor.projectData) {
    return <div className="flex items-center justify-center h-screen text-xl font-semibold">Loading Editor...</div>;
  }
  if (editor.error) return <div>Error: {editor.error.message}</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <EditorTopbar 
          editor={editor} 
          onPreview={openPreview} 
          onToggleUi={() => setIsUiHidden(v => !v)}
          onExportPNG={handleExportPNG}
          onExportPDF={handleExportPDF}
          onExportPDFAll={handleExportPDFAll}
          onExportHTML={handleExportHTML}
          onExportHTMLAll={handleExportHTMLAll}
          onExportJSON={handleExportJSON}
          onImportJSON={handleImportJSON}
          onMusicPlay={handleMusicPlay}
          onMusicPause={handleMusicPause}
          isUiHidden={isUiHidden}
          isSavingAuto={isSavingAuto}
          onShare={handleShare}
          onClose={handleClose}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      
      <div className={`mx-auto grid max-w-7xl gap-6 px-4 py-6 ${isUiHidden ? 'grid-cols-1 justify-items-center' : 'grid-cols-1 lg:grid-cols-[1fr_360px]'}`}>
        <EditorCanvas
          page={editor.page}
          selectedId={editor.selectedElement?.id}
          setSelectedId={editor.setSelectedId}
          updatePage={editor.updatePage}
          cardRef={cardRef}
          audioRef={audioRef}
          onUndo={editor.undo}
          onRedo={editor.redo}
        />
        {!isUiHidden && (
          <EditorSidebar
            editor={editor}
            onPlayMusic={handleMusicPlay}
            onMusicPause={handleMusicPause}
          />
        )}
      </div>
    </div>
  );
}


