import React, { useState, useRef } from "react";
import { useTemplateEditor } from "../hooks/useAdminTemplateEditor";
import SaveTemplateModal from "./components/AdminSaveTemplateModal";
import CloseConfirmationModal from "./components/CloseConfirmationModal";
import AdminEditorTopbar from "./components/AdminEditorTopbar";
import AdminEditorCanvas from "./components/AdminEditorCanvas";
import AdminEditorSidebar from "./components/AdminEditorSidebar";
import { buildHTML, CANVAS } from "../../../../utils/InvitationBuilder";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import AdminPreviewPage from "../preview/AdminPreviewPage";

import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

export default function AdminEditTemplate() {
  const navigate = useNavigate();
  const editor = useTemplateEditor();
  const [isUiHidden, setIsUiHidden] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const cardRef = useRef(null);
  const audioRef = useRef(null);

  const handleSave = async (metadata) => {
    try {
      // Log input metadata dari modal
      console.log('🔵 [Save Template] Input from Modal:', metadata);

      // Log template data dari editor
      console.log('🔵 [Save Template] Current Template Data:', {
        activeView: editor.activeView,
        pageCount: editor.templateData?.pages?.length,
        hasCover: editor.templateData?.cover ? true : false,
        templateData: editor.templateData
      });

      // Buat payload
      const payload = {
        ...metadata, // title, description, category_id
        template_data: editor.templateData,
        label: metadata.label ? metadata.label.toLowerCase() : '', // Normalisasi label ke huruf kecil
      };

      // Log final payload
      console.log('🟢 [Save Template] Final Payload:', {
        mode: editor.isCreatingNew ? 'CREATE' : 'UPDATE',
        templateId: editor.templateId,
        metadata: {
          title: payload.title,
          category_id: payload.category_id,
          label: payload.label,
          description: payload.description
        },
        templateDataStructure: {
          hasCover: !!payload.template_data?.cover,
          pageCount: payload.template_data?.pages?.length,
          elementCount: payload.template_data?.pages?.reduce((sum, page) => sum + (page.elements?.length || 0), 0)
        }
      });

      // Save ke backend
      if (editor.isCreatingNew) {
        console.log('🟡 [Save Template] Creating new template...');
        await editor.createTemplate(payload);
        console.log('🟢 [Save Template] Template created successfully!');
        toast.success("Template baru berhasil dibuat!");
      } else {
        console.log('🟡 [Save Template] Updating template...', editor.templateId);
        await editor.updateTemplate(editor.templateId, payload);
        console.log('🟢 [Save Template] Template updated successfully!');
        toast.success("Template berhasil diperbarui!");
      }

      setIsSaveModalOpen(false);
    } catch (err) {
      console.error('🔴 [Save Template] Error:', {
        message: err.message,
        error: err
      });
      toast.error("Gagal menyimpan template.");
    }
  };

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
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleExportPNG = async () => {
    const node = cardRef.current;
    if (!node) return;
    const dataUrl = await toPng(node, { pixelRatio: 2, filter: (n) => !n?.getAttribute?.('data-export-exclude') });
    downloadDataUrl(dataUrl, `template-h${editor.pageIndex + 1}.png`);
  };

  const handleExportPDF = async () => {
    const node = cardRef.current;
    if (!node) return;
    const png = await toPng(node, { pixelRatio: 2, filter: (n) => !n?.getAttribute?.('data-export-exclude') });
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [CANVAS.width, CANVAS.height] });
    pdf.addImage(png, 'PNG', 0, 0, CANVAS.width, CANVAS.height);
    pdf.save(`template-h${editor.pageIndex + 1}.pdf`);
  };

  const handleExportPDFAll = async () => {
    if (!editor.templateData?.pages?.length) return;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [CANVAS.width, CANVAS.height] });
    const prevView = editor.activeView;
    const prevIndex = editor.pageIndex;

    for (let i = 0; i < editor.templateData.pages.length; i++) {
      editor.setActiveView(i);
      await wait(80);
      const node = cardRef.current;
      if (!node) continue;
      const png = await toPng(node, { pixelRatio: 2, filter: (n) => !n?.getAttribute?.('data-export-exclude') });
      if (i > 0) pdf.addPage([CANVAS.width, CANVAS.height], 'portrait');
      pdf.addImage(png, 'PNG', 0, 0, CANVAS.width, CANVAS.height);
    }

    pdf.save('template-semua.pdf');

    if (prevView === 'cover') {
      editor.setActiveView('cover');
    } else {
      editor.setActiveView(prevIndex);
    }
  };

  const handleExportHTML = () => {
    if (!editor.page) return;
    const html = buildHTML([editor.page]);
    downloadBlob(new Blob([html], { type: 'text/html;charset=utf-8' }), `template-h${editor.pageIndex + 1}.html`);
  };

  const handleExportHTMLAll = () => {
    if (!editor.templateData?.pages) return;
    const html = buildHTML(editor.templateData.pages);
    downloadBlob(new Blob([html], { type: 'text/html;charset=utf-8' }), 'template-semua.html');
  };

  const handleExportJSON = () => {
    downloadBlob(new Blob([JSON.stringify(editor.templateData, null, 2)], { type: 'application/json' }), 'template.json');
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        editor.commitChange(parsed);
      } catch {
        alert('JSON tidak valid');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };



  const [showPreview, setShowPreview] = useState(false);

  if (editor.loading || !editor.templateData) {
    return <div className="flex items-center justify-center h-screen text-xl font-semibold">Loading Editor...</div>;
  }
  if (editor.error) return <div>Error: {editor.error.message}</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {!isUiHidden && (
        <AdminEditorTopbar
          editor={editor}
          onSave={() => setIsSaveModalOpen(true)}
          onPreview={() => setShowPreview(true)}
          onToggleUi={() => setIsUiHidden((v) => !v)}
          onExportPNG={handleExportPNG}
          onExportPDF={handleExportPDF}
          onExportPDFAll={handleExportPDFAll}
          onExportHTML={handleExportHTML}
          onExportHTMLAll={handleExportHTMLAll}
          onExportJSON={handleExportJSON}
          onImportJSON={handleImportJSON}
          onClose={() => setIsCloseModalOpen(true)}
        />
      )}
      
      {showPreview && (
        <AdminPreviewPage
          templateData={editor.templateData}
          onClose={() => setShowPreview(false)}
        />
      )}

      <div className={`mx-auto grid max-w-7xl gap-6 px-4 py-6 ${isUiHidden ? 'grid-cols-1 justify-items-center' : 'grid-cols-1 lg:grid-cols-[1fr_360px]'}`}>
        <AdminEditorCanvas
          page={editor.page}
          selectedId={editor.selectedElement?.id}
          setSelectedId={editor.setSelectedId}
          selectedIds={editor.selectedIds}
          toggleSelection={editor.toggleSelection}
          addToSelection={editor.addToSelection}
          clearSelection={editor.clearSelection}
          updatePage={editor.updatePage}
          cardRef={cardRef}
          audioRef={audioRef}
          onUndo={editor.undo}
          onRedo={editor.redo}
          onSave={() => setIsSaveModalOpen(true)}
          updateLiveElement={editor.updateLiveElement}
          clearLiveElement={editor.clearLiveElement}
          liveElement={editor.liveElement}
        />
        {!isUiHidden && (
          <AdminEditorSidebar
            editor={editor}
          />
        )}
      </div>

      {/* Floating Show UI Button */}
      {isUiHidden && (
        <button
          onClick={() => setIsUiHidden(false)}
          className="fixed left-4 top-4 z-50 rounded-full bg-white p-3 text-gray-600 shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      )}

      <SaveTemplateModal
        open={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSave}
        initialData={editor.templateMetadata}
        isCreatingNew={editor.isCreatingNew}
      />

      <CloseConfirmationModal
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        onSave={() => {
          setIsCloseModalOpen(false);
          setIsSaveModalOpen(true);
        }}
        onCloseWithoutSaving={() => {
          setIsCloseModalOpen(false);
          navigate('/dashboardadmin/managetemplate');
        }}
      />
    </div>
  );
}