// import Sidebar from "@/components/Sidebar";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar stays fixed on the left */}
//       <Sidebar />
      
//       {/* Main Content Area (changes when you click links) */}
//       <main className="flex-1 ml-64 p-8">
//         {children}
//       </main>
//     </div>
//   );
// }



// import Sidebar from "@/components/Sidebar";
// import InternalChat from "@/components/InternalChat"; // 🚀 1. Imported the chat widget

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar stays fixed on the left */}
//       <Sidebar />
      
//       {/* Main Content Area (changes when you click links) */}
//       <main className="flex-1 ml-64 p-8 relative">
//         {children}
        
//         {/* 🚀 2. Added the Global Chat Widget */}
//         <InternalChat />
//       </main>
//     </div>
//   );
// }


import Sidebar from "@/components/Sidebar";
import InternalChat from "@/components/InternalChat";
import TrialGate from "@/components/TrialGate";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content - Responsive margins */}
      <main className="flex-1 md:ml-64 lg:ml-72 h-screen overflow-y-auto flex flex-col">
        <TrialGate>
          <div className="p-4 sm:p-6 md:p-8 pt-16 md:pt-8 flex-1">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </TrialGate>
      </main>

      {/* Chat Widget */}
      <InternalChat />
    </div>
  );
}
