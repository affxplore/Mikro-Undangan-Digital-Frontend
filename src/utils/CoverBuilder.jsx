// src/utils/CoverBuilder.jsx
import React from "react";

export const CANVAS = { width: 900, height: 1600 };

const Fonts = {
  primary:
    "Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif",
  secondary: "ui-serif,Georgia,Cambria,Times New Roman,Times,serif",
  decorative: "'Great Vibes', cursive",
  modern: "'Montserrat', sans-serif",
};

// Schema untuk berbagai jenis cover
const COVER_TYPES = {
  wedding: {
    label: "Cover Pernikahan",
    schema: [
      {
        type: "select",
        path: "bgType",
        label: "Tipe Latar",
        options: [
          { value: "solid", label: "Solid" },
          { value: "gradient", label: "Gradient" },
          { value: "image", label: "Image" },
          { value: "transparent", label: "Transparent" }
        ],
        default: "gradient",
      },
      {
        type: "color",
        path: "backgroundColor",
        label: "Warna Latar",
        default: "#ffffff",
      },
      {
        type: "text",
        path: "preTitle",
        label: "Pre-Title Text",
        default: "The Wedding Of",
      },
      { type: "text", path: "brideName", label: "Bride Name", default: "" },
      { type: "text", path: "groomName", label: "Groom Name", default: "" },
      { type: "text", path: "date", label: "Wedding Date", default: "" },
      {
        type: "text",
        path: "salutation",
        label: "Guest Salutation",
        default: "Kepada Yth.",
      },
      {
        type: "text",
        path: "guestPlaceholder",
        label: "Guest Name Placeholder",
        default: "Nama Tamu",
      },
      {
        type: "color",
        path: "primaryColor",
        label: "Primary Color",
        default: "#4F46E5",
      },
      {
        type: "color",
        path: "secondaryColor",
        label: "Secondary Color",
        default: "#818CF8",
      },
      {
        type: "color",
        path: "textColor",
        label: "Text Color",
        default: "#1F2937",
      },
      {
        type: "select",
        path: "fontFamily",
        label: "Font Style",
        options: [
          { value: Fonts.decorative, label: "Decorative" },
          { value: Fonts.secondary, label: "Elegant" },
          { value: Fonts.primary, label: "Modern" },
        ],
        default: Fonts.decorative,
      },
      {
        type: "image",
        path: "backgroundImage",
        label: "Background Image",
        default: null,
      },
      {
        type: "image",
        path: "decorationImage",
        label: "Decoration Image",
        default: null,
      },
    ],
  },
  birthday: {
    label: "Cover Ulang Tahun",
    schema: [
      {
        type: "text",
        path: "preTitle",
        label: "Pre-Title Text",
        default: "Birthday Party",
      },
      {
        type: "text",
        path: "celebrantName",
        label: "Celebrant Name",
        default: "",
      },
      { type: "text", path: "age", label: "Age", default: "" },
      { type: "text", path: "date", label: "Party Date", default: "" },
      {
        type: "text",
        path: "salutation",
        label: "Guest Salutation",
        default: "Kepada Yth.",
      },
      {
        type: "text",
        path: "guestPlaceholder",
        label: "Guest Name Placeholder",
        default: "Nama Tamu",
      },
      {
        type: "color",
        path: "primaryColor",
        label: "Primary Color",
        default: "#F59E0B",
      },
      {
        type: "color",
        path: "secondaryColor",
        label: "Secondary Color",
        default: "#FCD34D",
      },
      {
        type: "color",
        path: "textColor",
        label: "Text Color",
        default: "#1F2937",
      },
      {
        type: "select",
        path: "fontFamily",
        label: "Font Style",
        options: [
          { value: Fonts.modern, label: "Fun Modern" },
          { value: Fonts.primary, label: "Simple" },
          { value: Fonts.decorative, label: "Playful" },
        ],
        default: Fonts.modern,
      },
      {
        type: "image",
        path: "backgroundImage",
        label: "Background Image",
        default: null,
      },
      {
        type: "image",
        path: "decorationImage",
        label: "Decoration Image",
        default: null,
      },
    ],
  },
  graduation: {
    label: "Cover Wisuda",
    schema: [
      {
        type: "text",
        path: "preTitle",
        label: "Pre-Title Text",
        default: "Graduation Ceremony",
      },
      {
        type: "text",
        path: "graduateName",
        label: "Graduate Name",
        default: "",
      },
      {
        type: "text",
        path: "degree",
        label: "Degree/Achievement",
        default: "",
      },
      { type: "text", path: "institution", label: "Institution", default: "" },
      { type: "text", path: "date", label: "Ceremony Date", default: "" },
      {
        type: "text",
        path: "salutation",
        label: "Guest Salutation",
        default: "Kepada Yth.",
      },
      {
        type: "text",
        path: "guestPlaceholder",
        label: "Guest Name Placeholder",
        default: "Nama Tamu",
      },
      {
        type: "color",
        path: "primaryColor",
        label: "Primary Color",
        default: "#1D4ED8",
      },
      {
        type: "color",
        path: "secondaryColor",
        label: "Secondary Color",
        default: "#60A5FA",
      },
      {
        type: "color",
        path: "textColor",
        label: "Text Color",
        default: "#1F2937",
      },
      {
        type: "select",
        path: "fontFamily",
        label: "Font Style",
        options: [
          { value: Fonts.secondary, label: "Traditional" },
          { value: Fonts.primary, label: "Modern" },
          { value: Fonts.modern, label: "Contemporary" },
        ],
        default: Fonts.secondary,
      },
      {
        type: "image",
        path: "backgroundImage",
        label: "Background Image",
        default: null,
      },
      {
        type: "image",
        path: "decorationImage",
        label: "Decoration Image",
        default: null,
      },
    ],
  },
  christmas: {
    label: "Cover Natal",
    schema: [
      {
        type: "text",
        path: "preTitle",
        label: "Pre-Title Text",
        default: "Christmas Celebration",
      },
      { type: "text", path: "hostName", label: "Host Name", default: "" },
      { type: "text", path: "eventTitle", label: "Event Title", default: "" },
      { type: "text", path: "date", label: "Event Date", default: "" },
      {
        type: "text",
        path: "salutation",
        label: "Guest Salutation",
        default: "Kepada Yth.",
      },
      {
        type: "text",
        path: "guestPlaceholder",
        label: "Guest Name Placeholder",
        default: "Nama Tamu",
      },
      {
        type: "color",
        path: "primaryColor",
        label: "Primary Color",
        default: "#DC2626",
      },
      {
        type: "color",
        path: "secondaryColor",
        label: "Secondary Color",
        default: "#059669",
      },
      {
        type: "color",
        path: "textColor",
        label: "Text Color",
        default: "#1F2937",
      },
      {
        type: "select",
        path: "fontFamily",
        label: "Font Style",
        options: [
          { value: Fonts.decorative, label: "Festive" },
          { value: Fonts.primary, label: "Simple" },
          { value: Fonts.modern, label: "Modern" },
        ],
        default: Fonts.decorative,
      },
      {
        type: "image",
        path: "backgroundImage",
        label: "Background Image",
        default: null,
      },
      {
        type: "image",
        path: "decorationImage",
        label: "Decoration Image",
        default: null,
      },
    ],
  },
  aqiqah: {
    label: "Cover Aqiqah",
    schema: [
      {
        type: "text",
        path: "preTitle",
        label: "Pre-Title",
        default: "Tasyakuran Aqiqah",
      },
      {
        type: "text",
        path: "childName",
        label: "Nama Anak",
        default: "Nama Anak",
      },
      {
        type: "text",
        path: "parentNames",
        label: "Nama Orang Tua",
        default: "Bpk. Fulan & Ibu Fulanah",
      },
      {
        type: "image",
        path: "backgroundImage",
        label: "Gambar Latar",
        default: null,
      },
    ],
  },
  syukuran: {
    label: "Cover Syukuran",
    schema: [
      {
        type: "text",
        path: "title",
        label: "Judul Acara",
        default: "Acara Syukuran",
      },
      {
        type: "text",
        path: "hostName",
        label: "Nama Tuan Rumah",
        default: "Keluarga Bpk. Fulan",
      },
      {
        type: "text",
        path: "reason",
        label: "Atas Rahmat",
        default: "Atas berkat rahmat Tuhan YME",
      },
      {
        type: "image",
        path: "backgroundImage",
        label: "Gambar Latar",
        default: null,
      },
    ],
  },
  meeting: {
    label: "Cover Meeting",
    schema: [
      {
        type: "text",
        path: "title",
        label: "Judul Meeting",
        default: "Rapat Koordinasi",
      },
      {
        type: "text",
        path: "companyName",
        label: "Nama Perusahaan",
        default: "PT. Sejahtera Abadi",
      },
      { type: "text", path: "date", label: "Tanggal & Waktu", default: "" },
      { type: "image", path: "logo", label: "Logo Perusahaan", default: null },
    ],
  },
  seminar: {
    label: "Cover Seminar",
    schema: [
      {
        type: "text",
        path: "title",
        label: "Judul Seminar",
        default: "Seminar Digital Marketing 2025",
      },
      {
        type: "text",
        path: "organizer",
        label: "Penyelenggara",
        default: "Universitas Teknologi",
      },
      {
        type: "text",
        path: "speaker",
        label: "Pembicara Utama",
        default: "Dr. Budi Hartono",
      },
      {
        type: "image",
        path: "backgroundImage",
        label: "Gambar Latar",
        default: null,
      },
    ],
  },
  grand_opening: {
    label: "Cover Grand Opening",
    schema: [
      { type: "text", path: "title", label: "Title", default: "Grand Opening" },
      {
        type: "text",
        path: "storeName",
        label: "Nama Toko/Usaha",
        default: "Toko Sejahtera",
      },
      {
        type: "text",
        path: "tagline",
        label: "Tagline",
        default: "Kini Hadir di Kota Anda!",
      },
      {
        type: "image",
        path: "backgroundImage",
        label: "Gambar Latar",
        default: null,
      },
    ],
  },
  arisan: {
    label: "Cover Arisan",
    schema: [
      {
        type: "text",
        path: "title",
        label: "Judul",
        default: "Arisan Bulanan",
      },
      {
        type: "text",
        path: "groupName",
        label: "Nama Grup Arisan",
        default: "Arisan Keluarga Ceria",
      },
      {
        type: "text",
        path: "hostName",
        label: "Tuan Rumah",
        default: "Keluarga Bpk. Fulan",
      },
      {
        type: "image",
        path: "backgroundImage",
        label: "Gambar Latar",
        default: null,
      },
    ],
  },
  khitanan: {
    label: "Cover Khitanan",
    schema: [
      {
        type: "text",
        path: "preTitle",
        label: "Pre-Title",
        default: "Walimatul Khitan",
      },
      {
        type: "text",
        path: "childName",
        label: "Nama Anak",
        default: "Nama Anak",
      },
      {
        type: "text",
        path: "parentNames",
        label: "Nama Orang Tua",
        default: "Bpk. Fulan & Ibu Fulanah",
      },
      {
        type: "image",
        path: "backgroundImage",
        label: "Gambar Latar",
        default: null,
      },
    ],
  },
  party: {
    label: "Cover Pesta",
    schema: [
      {
        type: "text",
        path: "title",
        label: "Judul Pesta",
        default: "You're Invited!",
      },
      {
        type: "text",
        path: "eventName",
        label: "Nama Acara",
        default: "Let's Party!",
      },
      { type: "text", path: "date", label: "Tanggal & Waktu", default: "" },
      {
        type: "image",
        path: "backgroundImage",
        label: "Gambar Latar",
        default: null,
      },
    ],
  },
};

// Render components untuk setiap jenis cover
const CoverComponents = {
  wedding: ({ data, guestName }) => (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8">
      <div className="relative z-10 space-y-6">
        {data.decorationImage && (
          <img
            src={data.decorationImage}
            alt="decoration"
            className="w-32 h-32 mx-auto mb-4 object-contain"
          />
        )}
        <p
          className="text-lg tracking-wide"
          style={{ color: data.textColor || '#1E293B' }}
        >
          {data.preTitle}
        </p>
        <h1
          className="text-5xl md:text-7xl"
          style={{
            fontFamily: data.fontFamily || "'Great Vibes', cursive",
            color: data.textColor || '#1E293B',
          }}
        >
          {data.brideName || "Mempelai Wanita"}{" "}
          <span style={{ color: data.primaryColor || '#6366F1' }}>&</span>{" "}
          {data.groomName || "Mempelai Pria"}
        </h1>
        <p className="text-xl" style={{ color: data.textColor || '#1E293B' }}>
          {data.date || "Sabtu, 25 Oktober 2025"}
        </p>
        <div className="mt-16">
          <p className="text-sm" style={{ color: data.textColor || '#1E293B' }}>
            {data.salutation || "Kepada Yth."}
          </p>
          <p
            className="text-2xl mt-2"
            style={{
              color: data.primaryColor || '#6366F1',
              fontFamily: data.fontFamily || "'Great Vibes', cursive",
            }}
          >
            {guestName || data.guestPlaceholder || "Nama Tamu"}
          </p>
        </div>
      </div>
    </div>
  ),

  birthday: ({ data, guestName }) => (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8">
      <div className="relative z-10 space-y-6">
        {data.decorationImage && (
          <img
            src={data.decorationImage}
            alt="decoration"
            className="w-32 h-32 mx-auto mb-4 object-contain"
          />
        )}
        <p
          className="text-xl tracking-wide"
          style={{ color: data.secondaryColor }}
        >
          {data.preTitle}
        </p>
        <h1
          className="text-6xl md:text-8xl"
          style={{
            fontFamily: data.fontFamily,
            color: data.primaryColor,
          }}
        >
          {data.celebrantName}
        </h1>
        <p className="text-3xl" style={{ color: data.textColor }}>
          <span style={{ color: data.primaryColor }}>{data.age}</span> Years Old
        </p>
        <p className="text-xl" style={{ color: data.textColor }}>
          {data.date}
        </p>
        <div className="mt-16">
          <p className="text-sm" style={{ color: data.secondaryColor }}>
            {data.salutation}
          </p>
          <p className="text-2xl mt-2" style={{ color: data.textColor }}>
            {guestName || data.guestPlaceholder}
          </p>
        </div>
      </div>
    </div>
  ),

  graduation: ({ data, guestName }) => (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8">
      <div className="relative z-10 space-y-6">
        {data.decorationImage && (
          <img
            src={data.decorationImage}
            alt="decoration"
            className="w-32 h-32 mx-auto mb-4 object-contain"
          />
        )}
        <p
          className="text-xl tracking-wide"
          style={{ color: data.secondaryColor }}
        >
          {data.preTitle}
        </p>
        <h1
          className="text-5xl md:text-7xl"
          style={{
            fontFamily: data.fontFamily,
            color: data.primaryColor,
          }}
        >
          {data.graduateName}
        </h1>
        <div className="space-y-2">
          <p className="text-2xl" style={{ color: data.textColor }}>
            {data.degree}
          </p>
          <p className="text-xl" style={{ color: data.secondaryColor }}>
            {data.institution}
          </p>
        </div>
        <p className="text-xl" style={{ color: data.textColor }}>
          {data.date}
        </p>
        <div className="mt-16">
          <p className="text-sm" style={{ color: data.secondaryColor }}>
            {data.salutation}
          </p>
          <p className="text-2xl mt-2" style={{ color: data.textColor }}>
            {guestName || data.guestPlaceholder}
          </p>
        </div>
      </div>
    </div>
  ),

  christmas: ({ data, guestName }) => (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8">
      <div className="relative z-10 space-y-6">
        {data.decorationImage && (
          <img
            src={data.decorationImage}
            alt="decoration"
            className="w-32 h-32 mx-auto mb-4 object-contain"
          />
        )}
        <p
          className="text-xl tracking-wide"
          style={{ color: data.secondaryColor }}
        >
          {data.preTitle}
        </p>
        <h1
          className="text-5xl md:text-7xl"
          style={{
            fontFamily: data.fontFamily,
            color: data.primaryColor,
          }}
        >
          {data.eventTitle}
        </h1>
        <p className="text-2xl" style={{ color: data.textColor }}>
          Hosted by {data.hostName}
        </p>
        <p className="text-xl" style={{ color: data.textColor }}>
          {data.date}
        </p>
        <div className="mt-16">
          <p className="text-sm" style={{ color: data.secondaryColor }}>
            {data.salutation}
          </p>
          <p className="text-2xl mt-2" style={{ color: data.textColor }}>
            {guestName || data.guestPlaceholder}
          </p>
        </div>
      </div>
    </div>
  ),

  aqiqah: ({ data, guestName: _guestName }) => (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8">
      <h2 className="text-2xl">{data.preTitle}</h2>
      <h1 className="text-6xl font-serif my-4">{data.childName}</h1>
      <p>Putra/Putri dari {data.parentNames}</p>
    </div>
  ),

  syukuran: ({ data, guestName: _guestName }) => (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8">
      <h2 className="text-2xl">{data.title}</h2>
      <p className="mt-4">{data.reason}</p>
      <h1 className="text-4xl font-semibold my-4">{data.hostName}</h1>
    </div>
  ),

  meeting: ({ data, guestName: _guestName }) => (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8">
      {data.logo && (
        <img
          src={data.logo}
          alt="logo"
          className="w-24 h-24 mb-4 object-contain"
        />
      )}
      <p>{data.companyName}</p>
      <h1 className="text-4xl font-bold my-2">{data.title}</h1>
      <p className="text-lg">{data.date}</p>
    </div>
  ),

  seminar: ({ data, guestName: _guestName }) => (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8">
      <p>{data.organizer}</p>
      <h1 className="text-5xl font-bold my-4">{data.title}</h1>
      <p>
        Pembicara: <strong>{data.speaker}</strong>
      </p>
    </div>
  ),

  grand_opening: ({ data, guestName: _guestName }) => (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8">
      <h2 className="text-2xl">{data.title}</h2>
      <h1 className="text-6xl font-bold my-4">{data.storeName}</h1>
      <p className="text-lg">{data.tagline}</p>
    </div>
  ),

  arisan: ({ data, guestName: _guestName }) => (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8">
      <h2 className="text-2xl">{data.title}</h2>
      <h1 className="text-4xl font-semibold my-2">{data.groupName}</h1>
      <p>Di kediaman: {data.hostName}</p>
    </div>
  ),

  khitanan: ({ data, guestName: _guestName }) => (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8">
      <h2 className="text-2xl">{data.preTitle}</h2>
      <h1 className="text-6xl font-serif my-4">{data.childName}</h1>
      <p>Putra dari {data.parentNames}</p>
    </div>
  ),

  party: ({ data, guestName: _guestName }) => (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8">
      <h2 className="text-2xl font-bold">{data.title}</h2>
      <h1 className="text-7xl font-serif my-4">{data.eventName}</h1>
      <p className="text-lg">{data.date}</p>
    </div>
  ),
};

// Helper function untuk mendapatkan nilai default dari schema
const getDefaultValues = (schema) => {
  const defaults = {};
  schema.forEach((field) => {
    defaults[field.path] = field.default;
  });
  return defaults;
};

// Function untuk membuat cover baru berdasarkan type
export const createCover = (type) => {
  const coverType = COVER_TYPES[type];
  if (!coverType) throw new Error(`Cover type '${type}' not found`);

  return {
    type,
    data: getDefaultValues(coverType.schema),
    schema: coverType.schema,
  };
};

// Component untuk render cover
export const CoverRenderer = ({ type, data, guestName }) => {
  const Component = CoverComponents[type];
  if (!Component) return null;

  return <Component data={data} guestName={guestName} />;
};

// Function untuk generate HTML dari cover
export const generateCoverHTML = ({ type, data, guestName }) => {
  const coverType = COVER_TYPES[type];
  if (!coverType) return "";

  // Basic style untuk container
  const containerStyle = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    text-align: center;
    padding: 2rem;
    position: relative;
  `;

  // Generate background
  const backgroundHTML = data.backgroundImage
    ? `
    <div style="position: absolute; inset: 0; z-index: 0;">
      <img src="${data.backgroundImage}" alt="background" style="width: 100%; height: 100%; object-fit: cover;" />
      <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.2);"></div>
    </div>
  `
    : "";

  // Generate decoration
  const decorationHTML = data.decorationImage
    ? `
    <img src="${data.decorationImage}" alt="decoration" style="width: 8rem; height: 8rem; margin: 0 auto 1rem; object-fit: contain;" />
  `
    : "";

  // Generate content berdasarkan type
  let contentHTML = "";
  switch (type) {
    case "wedding":
      contentHTML = `
        <p style="color: ${data.secondaryColor}; font-size: 1.125rem; letter-spacing: 0.05em;">${data.preTitle}</p>
        <h1 style="font-family: ${data.fontFamily}; color: ${data.textColor}; font-size: 4rem; margin: 1.5rem 0;">
          ${data.brideName} <span style="color: ${data.primaryColor}">&</span> ${data.groomName}
        </h1>
        <p style="color: ${data.textColor}; font-size: 1.25rem;">${data.date}</p>
      `;
      break;
    // Add cases for other types...
  }

  // Generate guest section
  const guestHTML = `
    <div style="margin-top: 4rem;">
      <p style="color: ${data.secondaryColor}; font-size: 0.875rem;">${data.salutation}</p>
      <p style="color: ${data.textColor}; font-size: 1.5rem; margin-top: 0.5rem;">${guestName || data.guestPlaceholder}</p>
    </div>
  `;

  // Combine all sections
  return `
    <div style="${containerStyle}">
      ${backgroundHTML}
      <div style="position: relative; z-index: 10;">
        ${decorationHTML}
        ${contentHTML}
        ${guestHTML}
      </div>
    </div>
  `;
};

export const COVER_REGISTRY = {
  types: COVER_TYPES,
  components: CoverComponents,
  create: createCover,
  render: (typeOrProps, data, guestName) => {
    if (typeOrProps && typeof typeOrProps === 'object' && !Array.isArray(typeOrProps)) {
      const { type, data: coverData, guestName: coverGuestName } = typeOrProps;
      return <CoverRenderer type={type} data={coverData} guestName={coverGuestName} />;
    }

    return <CoverRenderer type={typeOrProps} data={data} guestName={guestName} />;
  },
  generateHTML: generateCoverHTML,
};
