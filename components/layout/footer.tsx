// import Link from "next/link";

// export default function Footer() {
//   return (
//     // Outer container with the large background text cut off at the bottom
//     <footer className="relative w-full overflow-hidden bg-[#f5f5f5] py-24 flex justify-center">
//       {/* Massive Background Text */}
//       <div className="absolute -bottom-8 left-0 right-0 z-0 flex justify-center text-center">
//         <span className="text-[12rem] font-bold leading-none text-gray-200/50 tracking-tighter select-none">
//           Bania lab
//         </span>
//       </div>

//       {/* "Sunken" Floating Card Container (Frame 33) */}
//       <div className="relative z-10 w-full max-w-[1000px] rounded-[2.5rem] bg-white backdrop-blur-xl px-12 py-14 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02),0_4px_24px_rgba(0,0,0,0.02)]">
//         {/* Top Section: Grid Layout */}
//         <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
//           {/* Logo & Description */}
//           <div className="md:col-span-5 flex flex-col gap-4">
//             <Link href="/" className="flex items-center gap-2 text-black">
//               <span className="text-xl font-bold tracking-tight">
//                 Bania.lab
//               </span>
//               <span className="text-xl font-semibold text-gray-700">
//                 Bania Lab
//               </span>
//             </Link>
//             <p className="text-sm text-gray-500 leading-relaxed max-w-sm pr-4">
//               Bania Lab helps teams transform complex data into clear, engaging
//               stories — everything you need in one place.
//             </p>
//           </div>

//           {/* Product Links */}
//           <div className="md:col-span-2">
//             <h3 className="mb-5 text-sm font-semibold text-gray-900">
//               Product
//             </h3>
//             <ul className="flex flex-col gap-3 text-sm text-gray-500">
//               <li>
//                 <Link
//                   href="/features"
//                   className="hover:text-black transition-colors"
//                 >
//                   Features
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/pricing"
//                   className="hover:text-black transition-colors"
//                 >
//                   Pricing
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/integrations"
//                   className="hover:text-black transition-colors"
//                 >
//                   Integrations
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/changelog"
//                   className="hover:text-black transition-colors"
//                 >
//                   Changelog
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Resources Links */}
//           <div className="md:col-span-2">
//             <h3 className="mb-5 text-sm font-semibold text-gray-900">
//               Resources
//             </h3>
//             <ul className="flex flex-col gap-3 text-sm text-gray-500">
//               <li>
//                 <Link
//                   href="/docs"
//                   className="hover:text-black transition-colors"
//                 >
//                   Documentation
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/api"
//                   className="hover:text-black transition-colors"
//                 >
//                   API
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/help"
//                   className="hover:text-black transition-colors"
//                 >
//                   Help Center
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/community"
//                   className="hover:text-black transition-colors"
//                 >
//                   Community
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Company Links */}
//           <div className="md:col-span-3 lg:col-span-2">
//             <h3 className="mb-5 text-sm font-semibold text-gray-900">
//               Company
//             </h3>
//             <ul className="flex flex-col gap-3 text-sm text-gray-500">
//               <li>
//                 <Link
//                   href="/about"
//                   className="hover:text-black transition-colors"
//                 >
//                   About
//                 </Link>
//               </li>

//               <li>
//                 <Link
//                   href="/blog"
//                   className="hover:text-black transition-colors"
//                 >
//                   Blog
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/contact"
//                   className="hover:text-black transition-colors"
//                 >
//                   Contact
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Separator Line */}
//         <hr className="mt-16 border-t border-gray-200/60" />

//         {/* Blurred Bottom Display */}
//         <div className="mt-6 flex flex-col items-center justify-between gap-4 text-xs text-gray-400 md:flex-row blur-[3px] opacity-70 transition-all duration-300 hover:blur-none hover:opacity-100 select-none">
//           <p>&copy; 2024 Bania Lab. All rights reserved.</p>
//           <div className="flex gap-6">
//             <Link href="/privacy">Privacy Policy</Link>
//             <Link href="/terms">Terms of Service</Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }


function footer() {
  return <div>footer</div>;
}

export default footer;
