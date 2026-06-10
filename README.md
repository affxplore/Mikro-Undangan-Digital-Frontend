# 🎨 Mikro Undangan - Frontend Application

## 🎯 Tujuan

Frontend aplikasi **Mikro Undangan** yang menyediakan interface pengguna yang modern, responsif, dan intuitif untuk platform undangan digital. Dibangun dengan React.js dan teknologi frontend modern untuk memberikan pengalaman pengguna yang optimal.

## 📋 Dokumentasi

Aplikasi frontend ini adalah bagian dari ekosistem Mikro Undangan yang berfungsi sebagai:
- User interface untuk manajemen undangan digital
- Dashboard untuk pengguna dan administrator  
- Template gallery dan editor undangan
- Sistem autentikasi dan manajemen profil
- Interface untuk tracking RSVP dan analytics

## 🖥️ Preview Singkat

### 🏠 **Landing Page**
- Hero section dengan call-to-action yang menarik
- Showcase template undangan terpopuler
- Pricing plans dan fitur unggulan
- Testimoni pelanggan

### 📊 **User Dashboard**
- Overview statistik undangan (total views, RSVP, dll)
- Quick actions untuk membuat undangan baru
- Riwayat undangan dan aktivitas terbaru
- Notifikasi dan alerts penting

### 🎨 **Template Gallery**
- Grid layout template yang responsive
- Filter berdasarkan kategori (Wedding, Birthday, Corporate, etc.)
- Search functionality dengan autocomplete
- Preview modal dengan zoom dan navigation

### ✏️ **Invitation Editor**
- Drag-and-drop content editor
- Real-time preview dengan responsive design
- Media uploader dengan image optimization
- Text editor dengan rich formatting
- Color picker dan font customization

### 👥 **Guest Management**
- Data table dengan sorting dan filtering
- Bulk import dari Excel/CSV files
- Individual guest card dengan contact info
- RSVP status tracking dan analytics
- WhatsApp quick share integration

## 🚀 Cara Install

### Prerequisites
```bash
Node.js 18.0+ 
npm 8.0+ atau yarn 1.22+
Git
```

### 1. Clone & Setup
```bash
# Clone repository
git clone https://github.com/zakkutsu/mikro-undangan.git
cd mikro-undangan/mikro-undangan

# Install dependencies
npm install
```

### 2. Environment Configuration
```bash
# Buat file .env.local
touch .env.local

# Tambahkan konfigurasi berikut:
VITE_API_URL=http://localhost:2222/api/v1
VITE_SERVER_URL=http://localhost:2222
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_APP_NAME=Mikro Undangan
```

### 3. Start Development Server
```bash
# Mode development dengan hot reload
npm run dev

# Aplikasi akan berjalan di http://localhost:5173
```

### 4. Build Production
```bash
# Build untuk production
npm run build

# Preview build production
npm run preview
```

## 🌐 Isi Website

### 📄 **Public Pages**
- **/** - Landing page utama
- **/login** - Halaman login pengguna
- **/regis** - Registrasi akun baru
- **/forgot-password** - Reset password
- **/tema** - Gallery template publik
- **/price** - Halaman pricing dan paket
- **/about** - Tentang platform
- **/partner** - Program kemitraan

### 🔒 **Protected User Pages**
- **/dashboard** - Dashboard utama pengguna
- **/dashboard/templates** - Pilih template undangan
- **/dashboard/invitations** - Kelola undangan
- **/dashboard/receiver** - Manajemen tamu
- **/dashboard/ucapan** - Ucapan dan doa tamu
- **/dashboard/affiliate** - Program afiliasi
- **/dashboard/upgrade** - Upgrade subscription
- **/dashboard/profile** - Pengaturan profil

### ⚡ **Dynamic Pages**
- **/invitations/edit/:id** - Editor undangan
- **/invitations/:id/share** - Halaman share undangan
- **/preview/:projectId** - Preview undangan
- **/share/:invitationId** - Public invitation view

### 👑 **Admin Pages**
- **/dashboardadmin** - Admin dashboard
- **/dashboardadmin/manageuser** - Kelola pengguna
- **/dashboardadmin/managetemplate** - Kelola template
- **/dashboardadmin/manageinvit** - Monitor undangan
- **/dashboardadmin/datamaster** - Master data
- **/dashboardadmin/webreport** - Laporan website

## 🏷️ Tech Tags

### Core Framework
- ⚛️ **React 19.1** - UI Library dengan latest features
- 🚀 **Vite 7.0** - Ultra-fast build tool dan dev server
- 🎨 **Tailwind CSS 4.1** - Utility-first CSS framework
- 🔧 **React Router DOM 7.7** - Client-side routing

### UI & Styling
- 🎭 **Material-UI 7.3** - React component library
- 💅 **Styled Components 6.1** - CSS-in-JS styling
- 🎨 **Framer Motion 12.23** - Animation library
- 🎯 **Lucide React** - Beautiful icon library
- 🎪 **Ant Design 5.27** - Enterprise UI components

### Data & State Management
- 📡 **Axios 1.11** - HTTP client untuk API calls
- 🔄 **React Query** (built-in dengan Axios)
- 🎪 **Lodash 4.17** - Utility functions

### Features & Integrations
- 🔐 **@react-oauth/google** - Google OAuth integration
- 📊 **Chart.js + React Chart.js 2** - Data visualization
- 📱 **React QR Code** - QR code generation
- 🖼️ **HTML2Canvas** - Screenshot functionality
- 📄 **jsPDF** - PDF generation
- 📝 **XLSX** - Excel file processing
- 🔔 **React Toastify** - Toast notifications
- 🍯 **SweetAlert2** - Beautiful alerts
- 🎪 **Swiper** - Modern touch slider

### Development Tools
- 📏 **ESLint** - Code linting
- 🔍 **TypeScript support** - Type checking
- 🔄 **Hot Module Replacement** - Instant updates
- 📦 **Auto dependency optimization**

## 🎬 Demo

### 🌐 Live Demo
- **Production**: [https://mikroundangan.com](https://mikroundangan.com)
- **Staging**: [https://staging.mikroundangan.com](https://staging.mikroundangan.com)

### 🎥 Video Demo
[![Mikro Undangan Demo](https://img.youtube.com/vi/DEMO_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=DEMO_VIDEO_ID)

### 📱 Screenshot Gallery

#### Landing Page
![Landing Page](./public/screenshots/landing-page.png)

#### Dashboard User
![User Dashboard](./public/screenshots/user-dashboard.png)

#### Template Gallery
![Template Gallery](./public/screenshots/template-gallery.png)

#### Invitation Editor
![Invitation Editor](./public/screenshots/invitation-editor.png)

### 🧪 Test Accounts
```bash
# User Reguler
Email: user@example.com
Password: 123456

# Admin
Email: admin@example.com  
Password: admin123
```

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Fix linting issues
npm run lint --fix
```

## 📁 Project Structure

```
src/
├── 📂 api/                    # API services & hooks
│   ├── 📄 apiService.jsx      # Axios configuration
│   ├── 📂 auth/               # Authentication APIs
│   ├── 📂 users/              # User management APIs
│   ├── 📂 projects/           # Project APIs
│   ├── 📂 invitations/        # Invitation APIs
│   └── 📂 templates/          # Template APIs
│
├── 📂 components/             # Reusable components
│   ├── 📄 Navbar.jsx          # Navigation component
│   ├── 📄 Sidebar.jsx         # Dashboard sidebar
│   ├── 📄 Modal.jsx           # Modal component
│   └── 📄 LoadingSpinner.jsx  # Loading states
│
├── 📂 pages/                  # Page components
│   ├── 📂 landing_page/       # Public landing pages
│   ├── 📂 login_page/         # Authentication pages
│   ├── 📂 user/               # User dashboard pages
│   └── 📂 admin/              # Admin panel pages
│
├── 📂 layout/                 # Layout components
│   ├── 📄 DashboardLayout.jsx # Main dashboard layout
│   └── 📄 LandingLayout.jsx   # Public pages layout
│
├── 📂 routes/                 # Route configurations
├── 📂 utils/                  # Utility functions
├── 📂 middleware/             # Route middlewares
├── 📂 assets/                 # Static assets
│
├── 📄 App.jsx                 # Main App component
├── 📄 main.jsx                # Application entry point
└── 📄 index.css               # Global styles
```

## 🔧 Configuration Files

- **vite.config.js** - Vite configuration
- **tailwind.config.js** - Tailwind CSS configuration  
- **eslint.config.js** - ESLint rules
- **package.json** - Dependencies dan scripts
- **.env.local** - Environment variables (local)

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build project
npm run build

# Drag & drop dist/ folder ke Netlify
```

### Manual Hosting
```bash
# Build production
npm run build

# Upload dist/ folder ke web server
# Configure web server untuk SPA routing
```

## 🤝 Contributing

1. Fork repository
2. Buat branch: `git checkout -b feature/nama-fitur`
3. Commit: `git commit -m 'Add: fitur baru'`
4. Push: `git push origin feature/nama-fitur`
5. Buat Pull Request

## 📞 Support

- 📧 **Email**: frontend@mikroundangan.com
- 💬 **Discord**: [Developer Channel](https://discord.gg/mikroundangan-dev)
- 📚 **Docs**: [Frontend Documentation](https://docs.mikroundangan.com/frontend)

---

**Frontend Mikro Undangan** - Interface yang indah untuk pengalaman undangan digital yang luar biasa! ✨🎨
