// import { Navigate, Route, Routes } from "react-router-dom";

// import ProtectedRoute from "./ProtectedRoute.jsx";
// import AdminRoute from "./AdminRoutes.jsx";

// import DashboardLayout from "../components/layout/DashboardLayout.jsx";

// import Login from "../pages/auth/Login.jsx";
// import Register from "../pages/auth/Register.jsx";
// import AcceptInvite from "../pages/auth/acceptInvite.jsx";

// import Dashboard from "../pages/dashboard/Dashboard.jsx";

// import Clients from "../pages/clients/Clients.jsx";
// import ClientDetails from "../pages/clients/ClientDetails.jsx";

// import Projects from "../pages/projects/Projects.jsx";
// import ProjectDetails from "../pages/projects/ProjectDetails.jsx";

// import Invoices from "../pages/invoices/Invoices.jsx";
// import CreateInvoice from "../pages/invoices/CreateInvoice.jsx";
// import InvoiceDetails from "../pages/invoices/InvoiceDetails.jsx";

// import Interactions from "../pages/interactions/Interactions.jsx";

// import ProposalGenerator from "../pages/ai/ProposalGenerator.jsx";
// import FollowUpGenerator from "../pages/ai/FollowUpGenerator.jsx";
// import Insights from "../pages/ai/Insights.jsx";
// import AIContent from "../pages/ai/AIContent.jsx";

// import RiskCenter from "../pages/risk/RiskCenter.jsx";
// import Settings from "../pages/settings/Settings.jsx";

// import Team from "../pages/Teams/team.jsx";

// import NotFound from "../pages/NotFound.jsx";
// import Tasks from "../pages/Task.jsx";

// export default function AppRoutes() {
//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route path="/" element={<Navigate to="/dashboard" replace />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/accept-invite" element={<AcceptInvite />} />

//       {/* Protected dashboard routes */}
//       <Route element={<ProtectedRoute />}>
//         <Route element={<DashboardLayout />}>
//           <Route path="/dashboard" element={<Dashboard />} />

//           {/* 
//             Admin can manage clients.
//             Freelancer/member can only see clients returned by backend,
//             usually clients connected to assigned projects.
//           */}
//           <Route path="/clients" element={<Clients />} />
//           <Route path="/clients/:id" element={<ClientDetails />} />
          
//           {/* 
//             Admin can manage projects.
//             Freelancer/member can only see assigned projects.
//           */}
//           <Route path="/projects" element={<Projects />} />
//           <Route path="/projects/:id" element={<ProjectDetails />} />

//           {/* 
//             Optional: keep invoices visible only if your backend supports role-based data.
//             If invoices are admin-only in your CRM, wrap them with AdminRoute.
//           */}
//           <Route path="/invoices" element={<Invoices />} />
//           <Route
//             path="/invoices/create"
//             element={
//               <AdminRoute>
//                 <CreateInvoice />
//               </AdminRoute>
//             }
//           />
//           <Route path="/invoices/:id" element={<InvoiceDetails />} />

//           <Route path="/interactions" element={<Interactions />} />

//           <Route path="/ai/proposal" element={<ProposalGenerator />} />
//           <Route path="/ai/follow-up" element={<FollowUpGenerator />} />
//           <Route path="/ai/insights" element={<Insights />} />
//           <Route path="/ai/content" element={<AIContent />} />
//             <Route path="/tasks" element={<Tasks />} />
//           <Route path="/risk" element={<RiskCenter />} />
//           <Route path="/settings" element={<Settings />} />
             
//           {/* Admin only */}
//           <Route
//             path="/team"
//             element={
//               <AdminRoute>
//                 <Team />
//               </AdminRoute>
//             }
//           />
//         </Route>
//       </Route>

//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }

import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminRoute from "./AdminRoutes.jsx";

import DashboardLayout from "../components/layout/DashboardLayout.jsx";

import LandingPage from "../pages/landingPage.jsx";

import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import AcceptInvite from "../pages/auth/acceptInvite.jsx";

import Dashboard from "../pages/dashboard/Dashboard.jsx";

import Clients from "../pages/clients/Clients.jsx";
import ClientDetails from "../pages/clients/ClientDetails.jsx";

import Projects from "../pages/projects/Projects.jsx";
import ProjectDetails from "../pages/projects/ProjectDetails.jsx";

import Invoices from "../pages/invoices/Invoices.jsx";
import CreateInvoice from "../pages/invoices/CreateInvoice.jsx";
import InvoiceDetails from "../pages/invoices/InvoiceDetails.jsx";

import Interactions from "../pages/interactions/Interactions.jsx";
import Tasks from "../pages/Task.jsx";

import ProposalGenerator from "../pages/ai/ProposalGenerator.jsx";
import FollowUpGenerator from "../pages/ai/FollowUpGenerator.jsx";
import Insights from "../pages/ai/Insights.jsx";
import AIContent from "../pages/ai/AIContent.jsx";

import RiskCenter from "../pages/risk/RiskCenter.jsx";
import Team from "../pages/Teams/team.jsx";
import Settings from "../pages/settings/Settings.jsx";

import NotFound from "../pages/NotFound.jsx";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ── Public ── */}
      <Route path="/"               element={<LandingPage />} />
      <Route path="/login"          element={<Login />} />
      <Route path="/register"       element={<Register />} />
      <Route path="/accept-invite"  element={<AcceptInvite />} />

      {/* ── Protected ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>

          <Route path="/dashboard" element={<Dashboard />} />

          {/* Clients — admin manages, freelancer sees assigned */}
          <Route path="/clients"     element={<Clients />} />
          <Route path="/clients/:id" element={<ClientDetails />} />

          {/* Projects — admin manages, freelancer sees assigned */}
          <Route path="/projects"     element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/tasks"        element={<Tasks />} />

          {/* Invoices — create is admin-only */}
          <Route path="/invoices"     element={<Invoices />} />
          <Route path="/invoices/:id" element={<InvoiceDetails />} />
          <Route
            path="/invoices/create"
            element={
              <AdminRoute>
                <CreateInvoice />
              </AdminRoute>
            }
          />

          {/* Work */}
          <Route path="/interactions" element={<Interactions />} />
      

          {/* AI tools */}
          <Route path="/ai/proposal"  element={<ProposalGenerator />} />
          <Route path="/ai/follow-up" element={<FollowUpGenerator />} />
          <Route path="/ai/insights"  element={<Insights />} />
          <Route path="/ai/content"   element={<AIContent />} />

          {/* Admin only */}
          <Route path="/risk"     element={<RiskCenter />} />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/team"
            element={
              <AdminRoute>
                <Team />
              </AdminRoute>
            }
          />

        </Route>
      </Route>

      {/* ── Fallback ── */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}