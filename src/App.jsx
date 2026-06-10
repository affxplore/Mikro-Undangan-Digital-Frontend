import "./App.css";
import { Routes, Route } from "react-router-dom";
// import LandingPage from './pages/landing_page/Landing'
import RegisterPage from "./pages/registration_page/register";
import LoginPage from "./pages/login_page/login";
import AuthCallbackPage from "./pages/login_page/Callback";
import ForgotPasswordPage from "./pages/login_page/ForgotPassword";
import ResetPasswordPage from "./pages/login_page/ResetPassword";
import MikroUndangan from "./pages/landing_page/Land";

// Menu User
import DashboardUser from "./pages/user/dashboard/user";
import UcapanPage from "./pages/user/ucapan-doa/Ucapan";
import UpgradePage from "./pages/user/payment/Upgrade";
import AccountSetting from "./pages/user/profile/Account_setting";
import ProfilePage from "./pages/user/profile/Profile";
import TemplatesPage from "./pages/user/templates/Templates";
// import PreviewTemplate from './pages/user/templates/Preview'
import DashboardLayout from "./layout/dashboard";
import ExamplePage from "./pages/user/example/Example";
import InvitationsPage from "./pages/user/invitations/Invitations";
import InvitationStudio from "./pages/user/invitations/studio/EditInvitation";
import SharePage from "./pages/user/invitations/Share";
import SharePreview from "./pages/user/invitations/SharePreview"; // <-- Nama komponen diperbarui di sini
import ReceiverPage from "./pages/user/receiver/Receiver";
import AffiliateManagePage from "./pages/user/affiliate/Affiliate";
import WithdrawPage from "./pages/user/affiliate/Withdraw";
import AffiliatorForm from "./pages/user/affiliate/Registrasi";
import TemaPage from "./pages/landing_page/TempUndangan copy";
import LayoutLand from "./layout/Landing";
import PartnerPage from "./pages/landing_page/Partner";
import AboutPage from "./pages/landing_page/About";
import PricingPage from "./pages/landing_page/Price";
import BlueJavaInvitation from "./pages/landing_page/preview/Temp1";
import Checkout from "./pages/landing_page/checkout/Checkout";

// Menu Admin
// Dashboard Admin
import DashboardAdmin from "./pages/admin/dashboard_admin/Admin";
// Manage Invite
import ManageInvite from "./pages/admin/manage_invitation/Manage_invite";
// Manage User
import ManageUser from "./pages/admin/manage_user/Manage_user";
// Manage Template
import ManageTemplate from "./pages/admin/manage_template/ManageTemplateAdmin";
import AdminEditTemplate from "./pages/admin/manage_template/studio/AdminEditTemplatePage";
// import AddTemplate from "./pages/admin/manage_template/Addtemplate";
import AddCategory from "./pages/admin/management/CategoryAdd";
// Manage Affiliate
import ManageAffiliate from "./pages/admin/manage_affiliate/Manage_affiliate";
// DataMaster
import DataMasterPage from "./pages/admin/management/Management";
import KategoriPage from "./pages/admin/management/CategoryMaster";
import SystemContentPage from "./pages/admin/management/SystemContentMaster";
import SystemMessage from "./pages/admin/management/SystemMessage";

import PaymentPage from "./pages/admin/management/Payment";
import SubscriptionPage from "./pages/admin/management/SubscriptionMaster";

import PackageCostPage from "./pages/admin/management/PackageCostMaster";

import Role from "./pages/admin/management/Role";
import Staff from "./pages/admin/management/Staff";
// Website Report
import WebsiteReport from "./pages/admin/website_report/Webs_report";

// System Setting
import SystemSetting from "./pages/admin/system_setting.jsx/System_setting";
import { PublicOnly, RequireRole } from "./middleware/RouteMiddleware";

import OtpPage from "./pages/registration_page/OTP";
import PreviewPage from "./pages/user/invitations/preview/PreviewPage";

function App() {
  return (
    <>
      <Routes>
        {/* <Route element={<PublicOnly />}> */}
        {/* Rute Publik */}
        <Route path="login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="regis" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="otp" element={<OtpPage />} />
        <Route path="temp1" element={<BlueJavaInvitation />} />
        <Route path="registrasi" element={<AffiliatorForm />} />
        <Route path="/preview/:projectId" element={<PreviewPage />} />
        <Route path="/share/:invitationId" element={<SharePreview />} />
        <Route element={<LayoutLand />}>
          <Route path="/" element={<MikroUndangan />} />
          <Route path="partner" element={<PartnerPage />} />
          <Route path="tema" element={<TemaPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="price" element={<PricingPage />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
        {/* </Route> */}

        {/* Route All Role */}
        <Route
          element={
            <RequireRole
              allowedRoles={["User", "Admin", "Owner", "Super Admin"]}
            />
          }
        >
          <Route path="invitations/edit/:id" element={<InvitationStudio />} />
          <Route
            path="invitations/:invitationId/share"
            element={<SharePage />}
          />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="accountset" element={<AccountSetting />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          {/* <Route path="managetemplate/edit/new" element={<AdminEditTemplate />} /> */}
        </Route>

        {/* Route User */}
        <Route element={<RequireRole allowedRoles={["User"]} />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardUser />} />
            <Route path="dashboard" element={<DashboardUser />} />
            <Route path="templates" element={<TemplatesPage />} />
            {/* <Route path="/preview" element={<PreviewTemplate />} /> */}
            <Route path="ucapan" element={<UcapanPage />} />
            <Route path="example" element={<ExamplePage />} />
            <Route path="invitations" element={<InvitationsPage />} />
            <Route path="invitations/tambah" element={<InvitationsPage />} />
            {/* Add other routes here */}
            <Route path="receiver" element={<ReceiverPage />} />
            <Route path="affiliate" element={<AffiliateManagePage />} />
            <Route path="withdraw" element={<WithdrawPage />} />
            <Route path="upgrade" element={<UpgradePage />} />
          </Route>
        </Route>

        {/* Route Admin */}
        <Route
          element={
            <RequireRole allowedRoles={["Admin", "Owner", "Super Admin"]} />
          }
        >
          <Route path="/dashboardadmin" element={<DashboardLayout />}>
            <Route index element={<DashboardAdmin />} />
            <Route path="dashboardadmin" element={<DashboardAdmin />} />
            <Route path="accountset" element={<AccountSetting />} />
            <Route path="profile" element={<ProfilePage />} />
    
            <Route path="manageinvit" element={<ManageInvite />} />
            <Route path="manageuser" element={<ManageUser />} />
            <Route path="managetemplate" element={<ManageTemplate />} />
            <Route path="manageaffiliate" element={<ManageAffiliate />} />
            <Route path="datamaster" element={<DataMasterPage />} />
            <Route path="datamaster/kategori" element={<KategoriPage />} />
            <Route
              path="datamaster/kategori/addcategory"
              element={<AddCategory />}
            />
            <Route
              path="datamaster/systemcontent"
              element={<SystemContentPage />}
            />

            <Route path="datamaster/payment" element={<PaymentPage />} />
            <Route
              path="datamaster/subscription"
              element={<SubscriptionPage />}
            />

            <Route
              path="datamaster/packagecost"
              element={<PackageCostPage />}
            />

            <Route path="datamaster/role" element={<Role />} />
            <Route path="datamaster/staff" element={<Staff />} />
            <Route path="datamaster/systemmessage" element={<SystemMessage />} />
            <Route path="webreport" element={<WebsiteReport />} />
            <Route path="systemsetting" element={<SystemSetting />} />
          </Route>
          <Route
            path="/admin/templates/edit/:id"
            element={<AdminEditTemplate />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
