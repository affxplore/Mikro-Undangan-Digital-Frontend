import React from 'react';
import { COVER_REGISTRY } from '../../../../../utils/CoverBuilder';

const AdminCoverEditor = ({ page, updatePage }) => {
  const [coverType, setCoverType] = React.useState(page.type || 'wedding');

  // Sync coverType with page.type
  React.useEffect(() => {
    if (page.type && page.type !== coverType) {
      setCoverType(page.type);
    }
  }, [page.type]);

  // Get schema for selected cover type
  const schema = COVER_REGISTRY.types[coverType]?.schema || [];
  const coverData = page.data || {};

  const updateCoverData = (path, value) => {
    const updatedData = {
      ...coverData,
      [path]: value
    };
    
    console.log('Updating cover data:', {
      type: coverType,
      data: updatedData,
      path,
      value
    });

    updatePage(current => ({
      ...current,
      type: coverType,
      data: updatedData
    }));
  };

  // Fungsi helper untuk background type
  const handleBgTypeChange = (type) => {
    const updates = { bgType: type };
    
    // Reset relevant values based on type
    if (type === 'solid') {
      updates.backgroundColor = coverData.backgroundColor || '#ffffff';
      updates.backgroundImage = null;
    } else if (type === 'gradient') {
      updates.gradientFrom = coverData.gradientFrom || '#eef2ff';
      updates.gradientTo = coverData.gradientTo || '#ffffff';
      updates.backgroundImage = null;
    } else if (type === 'transparent') {
      updates.backgroundColor = 'transparent';
      updates.backgroundImage = null;
    }

    const updatedData = {
      ...coverData,
      ...updates
    };

    updatePage(current => ({
      ...current,
      type: coverType,
      data: updatedData
    }));
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jenis Cover
        </label>
        <select 
          className="w-full rounded border p-2"
          value={coverType}
          onChange={(e) => {
            const newType = e.target.value;
            setCoverType(newType);
            
            // Get default values from COVER_REGISTRY
            const defaultCover = COVER_REGISTRY.create(newType);
            console.log('Changing cover type:', {
              from: coverType,
              to: newType,
              defaults: defaultCover.data
            });
            
            // Update with default values
            updatePage(current => ({
              ...current,
              type: newType,
              data: defaultCover.data
            }));
          }}
        >
          {Object.entries(COVER_REGISTRY.types).map(([key, value]) => (
            <option key={key} value={key}>
              {value.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {schema.map((field) => (
          <div key={field.path} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            
            {field.type === 'text' && (
              <input
                type="text"
                className="w-full rounded border p-2"
                value={coverData[field.path] || ''}
                onChange={(e) => updateCoverData(field.path, e.target.value)}
                placeholder={field.default}
              />
            )}

            {field.type === 'color' && (
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 rounded border p-2"
                  value={coverData[field.path] || field.default}
                  onChange={(e) => updateCoverData(field.path, e.target.value)}
                />
                <input
                  type="color"
                  className="w-12 rounded border p-1"
                  value={coverData[field.path] || field.default}
                  onChange={(e) => updateCoverData(field.path, e.target.value)}
                />
              </div>
            )}

            {field.type === 'select' && (
              <select
                className="w-full rounded border p-2"
                value={coverData[field.path] || field.default}
                onChange={(e) => updateCoverData(field.path, e.target.value)}
              >
                {field.options.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === 'image' && (
              <div className="space-y-2">
                {coverData[field.path] && (
                  <div className="relative h-32 w-full overflow-hidden rounded border">
                    <img 
                      src={coverData[field.path]} 
                      alt={field.label}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-gray-300 bg-white px-2.5 py-1.5 text-sm hover:border-indigo-400">
                  Upload {field.label}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        updateCoverData(field.path, reader.result);
                      };
                      reader.readAsDataURL(file);
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCoverEditor;