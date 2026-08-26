
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Droplets,
//   Coffee,
//   Users,
//   Package,
//   ClipboardList,
//   Plus,
//   Sparkles,
//   Loader2,
// } from "lucide-react";

// const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";

// function TaskTemplates() {
//   const navigate = useNavigate();

//   const [templates, setTemplates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // ------------------------------------------
//   // FETCH TASK TEMPLATES
//   // ------------------------------------------
//   useEffect(() => {
//     loadTemplates();
//   }, []);

//   const loadTemplates = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token = localStorage.getItem("token");

//       const response = await fetch(`${API_URL}/task-templates`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to fetch templates");
//       }

//       setTemplates(data);
//     } catch (error) {
//       console.log("Template fetch error:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ------------------------------------------
//   // GET ICON FOR TEMPLATE
//   // ------------------------------------------
//   const getTemplateIcon = (name) => {
//     const templateName = name.toLowerCase();

//     if (
//       templateName.includes("water") ||
//       templateName.includes("bottle")
//     ) {
//       return {
//         icon: Droplets,
//         bg: "bg-blue-50",
//         text: "text-blue-600",
//       };
//     }

//     if (
//       templateName.includes("tea") ||
//       templateName.includes("coffee")
//     ) {
//       return {
//         icon: Coffee,
//         bg: "bg-amber-50",
//         text: "text-amber-600",
//       };
//     }

//     if (
//       templateName.includes("guest") ||
//       templateName.includes("snack")
//     ) {
//       return {
//         icon: Users,
//         bg: "bg-emerald-50",
//         text: "text-emerald-600",
//       };
//     }

//     if (
//       templateName.includes("package") ||
//       templateName.includes("pickup")
//     ) {
//       return {
//         icon: Package,
//         bg: "bg-violet-50",
//         text: "text-violet-600",
//       };
//     }

//     if (
//       templateName.includes("clean") ||
//       templateName.includes("room")
//     ) {
//       return {
//         icon: Sparkles,
//         bg: "bg-pink-50",
//         text: "text-pink-600",
//       };
//     }

//     return {
//       icon: ClipboardList,
//       bg: "bg-slate-100",
//       text: "text-slate-600",
//     };
//   };

//   // ------------------------------------------
//   // ESTIMATED TIME
//   // ------------------------------------------
//   const getEstimatedTime = (name) => {
//     const templateName = name.toLowerCase();

//     if (
//       templateName.includes("water") ||
//       templateName.includes("bottle")
//     ) {
//       return "~3 min";
//     }

//     if (
//       templateName.includes("tea") ||
//       templateName.includes("coffee")
//     ) {
//       return "~8 min";
//     }

//     if (
//       templateName.includes("guest") ||
//       templateName.includes("snack")
//     ) {
//       return "~10 min";
//     }

//     if (
//       templateName.includes("package") ||
//       templateName.includes("pickup")
//     ) {
//       return "~5 min";
//     }

//     if (
//       templateName.includes("clean") ||
//       templateName.includes("room")
//     ) {
//       return "~15 min";
//     }

//     return "~10 min";
//   };

//   // ------------------------------------------
//   // OPEN TEMPLATE
//   // ------------------------------------------
//   const handleTemplateClick = (templateId) => {
//     navigate(`/tasks/create?templateId=${templateId}`);
//   };

//   // ------------------------------------------
//   // CREATE NEW TEMPLATE
//   // ------------------------------------------
//   const handleCreateTemplate = () => {
//     // We will create this page next.
//     navigate("/task-templates/create");
//   };

//   // ------------------------------------------
//   // LOADING
//   // ------------------------------------------
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="flex items-center gap-3 text-slate-500">
//           <Loader2 className="w-5 h-5 animate-spin" />
//           <span>Loading task templates...</span>
//         </div>
//       </div>
//     );
//   }

//   // ------------------------------------------
//   // PAGE
//   // ------------------------------------------
//   return (
//     <div className="space-y-8">

//       {/* PAGE HEADER */}
//       <div className="flex items-start justify-between gap-6">

//         <div>
//           <h1 className="text-4xl font-black text-ink tracking-tight">
//             Task Templates
//           </h1>

//           <p className="text-slate-400 text-lg mt-1">
//             Predefined services employees can request in one click.
//           </p>
//         </div>

//         <button
//           onClick={handleCreateTemplate}
//           className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold hover:opacity-90 transition-opacity"
//         >
//           <Plus className="w-5 h-5" />
//           Create Template
//         </button>

//       </div>

//       {/* ERROR */}
//       {error && (
//         <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3">
//           {error}
//         </div>
//       )}

//       {/* EMPTY STATE */}
//       {!error && templates.length === 0 && (
//         <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
//           <ClipboardList className="w-12 h-12 mx-auto text-slate-300 mb-4" />

//           <h2 className="text-xl font-bold text-slate-700">
//             No task templates found
//           </h2>

//           <p className="text-slate-400 mt-2">
//             Create your first task template to get started.
//           </p>
//         </div>
//       )}

//       {/* TEMPLATE CARDS */}
//       {templates.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

//           {templates.map((template) => {

//             const templateIcon = getTemplateIcon(template.name);
//             const Icon = templateIcon.icon;

//             return (
//               <div
//                 key={template.id}
//                 onClick={() => handleTemplateClick(template.id)}
//                 className="
//                   group
//                   bg-white
//                   rounded-3xl
//                   border border-slate-200
//                   shadow-card
//                   p-7
//                   min-h-[250px]
//                   cursor-pointer
//                   transition-all
//                   duration-200
//                   hover:-translate-y-1
//                   hover:shadow-xl
//                   hover:border-violet-200
//                 "
//               >

//                 {/* ICON */}
//                 <div
//                   className={`
//                     w-14
//                     h-14
//                     rounded-2xl
//                     ${templateIcon.bg}
//                     ${templateIcon.text}
//                     flex
//                     items-center
//                     justify-center
//                     mb-7
//                     transition-transform
//                     duration-200
//                     group-hover:scale-105
//                   `}
//                 >
//                   <Icon className="w-7 h-7" />
//                 </div>

//                 {/* NAME */}
//                 <h2 className="text-xl font-black text-ink mb-2">
//                   {template.name}
//                 </h2>

//                 {/* DESCRIPTION */}
//                 <p className="text-slate-400 text-sm leading-6 min-h-[48px]">
//                   {template.description || "No description available."}
//                 </p>

//                 {/* FOOTER */}
//                 <div className="flex items-center justify-between mt-7">

//                   <span
//                     className="
//                       inline-flex
//                       items-center
//                       px-3
//                       py-1.5
//                       rounded-full
//                       bg-emerald-50
//                       text-emerald-600
//                       text-xs
//                       font-bold
//                     "
//                   >
//                     Active
//                   </span>

//                   <span className="text-sm text-slate-400">
//                     {getEstimatedTime(template.name)}
//                   </span>

//                 </div>

//               </div>
//             );
//           })}

//           {/* CREATE TEMPLATE CARD */}
//           <div
//             onClick={handleCreateTemplate}
//             className="
//               group
//               min-h-[250px]
//               rounded-3xl
//               border-2
//               border-dashed
//               border-slate-200
//               flex
//               flex-col
//               items-center
//               justify-center
//               cursor-pointer
//               transition-all
//               duration-200
//               hover:border-violet-300
//               hover:bg-violet-50/30
//             "
//           >

//             <div
//               className="
//                 w-14
//                 h-14
//                 rounded-full
//                 bg-slate-100
//                 text-slate-300
//                 flex
//                 items-center
//                 justify-center
//                 mb-4
//                 group-hover:bg-violet-100
//                 group-hover:text-violet-500
//                 transition-colors
//               "
//             >
//               <Plus className="w-8 h-8" />
//             </div>

//             <h3 className="font-bold text-slate-500 group-hover:text-violet-600">
//               Create Template
//             </h3>

//             <p className="text-sm text-slate-400 mt-1">
//               Add a custom service
//             </p>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// }

// export default TaskTemplates;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Droplets,
//   Coffee,
//   Users,
//   Package,
//   ClipboardList,
//   Plus,
//   Sparkles,
//   Loader2,
//   Zap,
//   Pencil,
// } from "lucide-react";

// const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";

// function TaskTemplates() {
//   const navigate = useNavigate();

//   const [templates, setTemplates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [assigningId, setAssigningId] = useState(null);

//   // ------------------------------------------
//   // FETCH TASK TEMPLATES
//   // ------------------------------------------
//   useEffect(() => {
//     loadTemplates();
//   }, []);

//   const loadTemplates = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token = localStorage.getItem("token");

//       const response = await fetch(
//         `${API_URL}/task-templates`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Failed to fetch templates"
//         );
//       }

//       setTemplates(data);

//     } catch (error) {
//       console.log("Template fetch error:", error);
//       setError(error.message);

//     } finally {
//       setLoading(false);
//     }
//   };

//   // ------------------------------------------
//   // GET ICON
//   // ------------------------------------------
//   const getTemplateIcon = (name) => {
//     const templateName = name.toLowerCase();

//     if (
//       templateName.includes("water") ||
//       templateName.includes("bottle")
//     ) {
//       return {
//         icon: Droplets,
//         bg: "bg-blue-50",
//         text: "text-blue-600",
//       };
//     }

//     if (
//       templateName.includes("tea") ||
//       templateName.includes("coffee")
//     ) {
//       return {
//         icon: Coffee,
//         bg: "bg-amber-50",
//         text: "text-amber-600",
//       };
//     }

//     if (
//       templateName.includes("guest") ||
//       templateName.includes("snack")
//     ) {
//       return {
//         icon: Users,
//         bg: "bg-emerald-50",
//         text: "text-emerald-600",
//       };
//     }

//     if (
//       templateName.includes("package") ||
//       templateName.includes("pickup")
//     ) {
//       return {
//         icon: Package,
//         bg: "bg-violet-50",
//         text: "text-violet-600",
//       };
//     }

//     if (
//       templateName.includes("clean") ||
//       templateName.includes("room")
//     ) {
//       return {
//         icon: Sparkles,
//         bg: "bg-pink-50",
//         text: "text-pink-600",
//       };
//     }

//     return {
//       icon: ClipboardList,
//       bg: "bg-slate-100",
//       text: "text-slate-600",
//     };
//   };

//   // ------------------------------------------
//   // ESTIMATED TIME
//   // ------------------------------------------
//   const getEstimatedTime = (name) => {
//     const templateName = name.toLowerCase();

//     if (
//       templateName.includes("water") ||
//       templateName.includes("bottle")
//     ) {
//       return "~3 min";
//     }

//     if (
//       templateName.includes("tea") ||
//       templateName.includes("coffee")
//     ) {
//       return "~8 min";
//     }

//     if (
//       templateName.includes("guest") ||
//       templateName.includes("snack")
//     ) {
//       return "~10 min";
//     }

//     if (
//       templateName.includes("package") ||
//       templateName.includes("pickup")
//     ) {
//       return "~5 min";
//     }

//     if (
//       templateName.includes("clean") ||
//       templateName.includes("room")
//     ) {
//       return "~15 min";
//     }

//     return "~10 min";
//   };

//   // ------------------------------------------
//   // EDIT TEMPLATE
//   // ------------------------------------------
//   const handleEditTemplate = (templateId) => {
//     navigate(
//       `/tasks/create?templateId=${templateId}`
//     );
//   };

//   // ------------------------------------------
//   // DIRECT ASSIGN
//   // ------------------------------------------
//  const handleDirectAssign = async (template) => {

//     // const confirmed = window.confirm(
//     //     `Directly assign "${template.name}" to the Butler?`
//     // );

//     // if (!confirmed) {
//     //     return;
//     // }

//     try {

//         setAssigningId(template.id);

//         const token = localStorage.getItem("token");

//         const response = await fetch(
//             `${API_URL}/tasks`,
//             {
//                 method: "POST",

//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 },

//                 body: JSON.stringify({
//                     template_id: template.id,
//                     title: template.name,
//                     description: template.description || null,
//                     priority: template.priority || "Medium",
//                     due_date: template.due_date || null,
//                     location: template.location || null,
//                     custom_fields: template.custom_fields || null,
//                     assignment_mode: "direct"
//                 })
//             }
//         );

//         const data = await response.json();

//         if (!response.ok) {
//             throw new Error(
//                 data.message || "Failed to assign task"
//             );
//         }

//         console.log(
//             "Direct assignment successful:",
//             data
//         );

//         alert(
//   `"${template.name}" has been assigned to Bharat bhaiya successfully.`
// );

// navigate("/tasks");

//     } catch (error) {

//         console.error(
//             "Direct assignment error:",
//             error
//         );

//         alert(error.message);

//     } finally {

//         setAssigningId(null);

//     }
// };
//   // ------------------------------------------
//   // CREATE NEW TEMPLATE
//   // ------------------------------------------
//   const handleCreateTemplate = () => {
//     navigate("/task-templates/create");
//   };

//   // ------------------------------------------
//   // LOADING
//   // ------------------------------------------
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">

//         <div className="flex items-center gap-3 text-slate-500">

//           <Loader2 className="w-5 h-5 animate-spin" />

//           <span>
//             Loading task templates...
//           </span>

//         </div>

//       </div>
//     );
//   }

//   // ------------------------------------------
//   // PAGE
//   // ------------------------------------------
//   return (
//     <div className="space-y-8">

//       {/* HEADER */}

//       <div className="flex items-start justify-between gap-6">

//         <div>

//           <h1 className="text-4xl font-black text-ink tracking-tight">
//             Task Templates
//           </h1>

//           <p className="text-slate-400 text-lg mt-1">
//             Predefined services employees can request in one click.
//           </p>

//         </div>

//         <button
//           onClick={handleCreateTemplate}
//           className="
//             flex
//             items-center
//             gap-2
//             px-5
//             py-3
//             rounded-xl
//             bg-slate-900
//             text-white
//             font-bold
//             hover:opacity-90
//             transition-opacity
//           "
//         >
//           <Plus className="w-5 h-5" />
//           Create Template
//         </button>

//       </div>

//       {/* ERROR */}

//       {error && (
//         <div className="
//           bg-red-50
//           border
//           border-red-100
//           text-red-600
//           rounded-xl
//           px-4
//           py-3
//         ">
//           {error}
//         </div>
//       )}

//       {/* EMPTY */}

//       {!error && templates.length === 0 && (
//         <div className="
//           bg-white
//           border
//           border-slate-200
//           rounded-2xl
//           p-12
//           text-center
//         ">

//           <ClipboardList
//             className="
//               w-12
//               h-12
//               mx-auto
//               text-slate-300
//               mb-4
//             "
//           />

//           <h2 className="
//             text-xl
//             font-bold
//             text-slate-700
//           ">
//             No task templates found
//           </h2>

//           <p className="
//             text-slate-400
//             mt-2
//           ">
//             Create your first task template to get started.
//           </p>

//         </div>
//       )}

//       {/* TEMPLATE CARDS */}

//       {templates.length > 0 && (

//         <div className="
//           grid
//           grid-cols-1
//           md:grid-cols-2
//           xl:grid-cols-3
//           gap-6
//         ">

//           {templates.map((template) => {

//             const templateIcon =
//               getTemplateIcon(template.name);

//             const Icon =
//               templateIcon.icon;

//             const isAssigning =
//               assigningId === template.id;

//             return (

//               <div
//                 key={template.id}
//                 className="
//                   group
//                   bg-white
//                   rounded-3xl
//                   border
//                   border-slate-200
//                   shadow-card
//                   p-7
//                   min-h-[300px]
//                   transition-all
//                   duration-200
//                   hover:-translate-y-1
//                   hover:shadow-xl
//                   hover:border-violet-200
//                 "
//               >

//                 {/* ICON */}

//                 <div
//                   className={`
//                     w-14
//                     h-14
//                     rounded-2xl
//                     ${templateIcon.bg}
//                     ${templateIcon.text}
//                     flex
//                     items-center
//                     justify-center
//                     mb-6
//                   `}
//                 >
//                   <Icon className="w-7 h-7" />
//                 </div>

//                 {/* NAME */}

//                 <h2 className="
//                   text-xl
//                   font-black
//                   text-ink
//                   mb-2
//                 ">
//                   {template.name}
//                 </h2>

//                 {/* DESCRIPTION */}

//                 <p className="
//                   text-slate-400
//                   text-sm
//                   leading-6
//                   min-h-[48px]
//                 ">
//                   {template.description ||
//                     "No description available."}
//                 </p>

//                 {/* FOOTER */}

//                 <div className="
//                   flex
//                   items-center
//                   justify-between
//                   mt-6
//                 ">

//                   <span className="
//                     inline-flex
//                     items-center
//                     px-3
//                     py-1.5
//                     rounded-full
//                     bg-emerald-50
//                     text-emerald-600
//                     text-xs
//                     font-bold
//                   ">
//                     Active
//                   </span>

//                   <span className="
//                     text-sm
//                     text-slate-400
//                   ">
//                     {getEstimatedTime(
//                       template.name
//                     )}
//                   </span>

//                 </div>

//                 {/* ACTIONS */}

//                 <div className="
//                   flex
//                   gap-3
//                   mt-6
//                   pt-5
//                   border-t
//                   border-slate-100
//                 ">

//                   {/* DIRECT ASSIGN */}

//                   <button
//                     disabled={isAssigning}
//                     onClick={() =>
//                       handleDirectAssign(template)
//                     }
//                     className="
//                       flex-1
//                       flex
//                       items-center
//                       justify-center
//                       gap-2
//                       px-4
//                       py-3
//                       rounded-xl
//                       bg-violet-600
//                       text-white
//                       font-bold
//                       text-sm
//                       hover:bg-violet-700
//                       disabled:opacity-60
//                       disabled:cursor-not-allowed
//                       transition
//                     "
//                   >

//                     {isAssigning ? (
//                       <>
//                         <Loader2
//                           className="
//                             w-4
//                             h-4
//                             animate-spin
//                           "
//                         />

//                         Assigning...
//                       </>
//                     ) : (
//                       <>
//                         <Zap className="w-4 h-4" />

//                         Assign
//                       </>
//                     )}

//                   </button>

//                   {/* EDIT */}

//                   <button
//                     onClick={() =>
//                       handleEditTemplate(
//                         template.id
//                       )
//                     }
//                     className="
//                       flex-1
//                       flex
//                       items-center
//                       justify-center
//                       gap-2
//                       px-4
//                       py-3
//                       rounded-xl
//                       border
//                       border-slate-200
//                       bg-white
//                       text-slate-700
//                       font-bold
//                       text-sm
//                       hover:bg-slate-50
//                       transition
//                     "
//                   >

//                     <Pencil className="w-4 h-4" />

//                     Custom

//                   </button>

//                 </div>

//               </div>
//             );
//           })}

//           {/* CREATE TEMPLATE */}

//           <div
//             onClick={handleCreateTemplate}
//             className="
//               group
//               min-h-[300px]
//               rounded-3xl
//               border-2
//               border-dashed
//               border-slate-200
//               flex
//               flex-col
//               items-center
//               justify-center
//               cursor-pointer
//               transition-all
//               duration-200
//               hover:border-violet-300
//               hover:bg-violet-50/30
//             "
//           >

//             <div className="
//               w-14
//               h-14
//               rounded-full
//               bg-slate-100
//               text-slate-300
//               flex
//               items-center
//               justify-center
//               mb-4
//               group-hover:bg-violet-100
//               group-hover:text-violet-500
//               transition-colors
//             ">
//               <Plus className="w-8 h-8" />
//             </div>

//             <h3 className="
//               font-bold
//               text-slate-500
//               group-hover:text-violet-600
//             ">
//               Create Template
//             </h3>

//             <p className="
//               text-sm
//               text-slate-400
//               mt-1
//             ">
//               Add a custom service
//             </p>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// }

// export default TaskTemplates;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTranslatedText } from "../hooks/useTranslatedText";
import { Trash2 } from "lucide-react";
import {
  Droplets,
  Coffee,
  Users,
  Package,
  ClipboardList,
  Plus,
  Sparkles,
  Loader2,
  Zap,
  Pencil,
} from "lucide-react";

const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";


function TemplateCard({
  template,
  templateIcon,
  isAssigning,
  isDeleting,
  onAssign,
  onEdit,
  onDelete,
  getEstimatedTime,
  t,
}) {
  const Icon = templateIcon.icon;
  const translatedName = useTranslatedText(template.name);
  const translatedDescription = useTranslatedText(template.description || "");

  return (
    <div className="group bg-white rounded-3xl border border-slate-200 shadow-card p-7 min-h-[300px] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-violet-200 relative">

      {/* DELETE — top-right corner icon button */}
     <button
  onClick={(e) => {
    e.stopPropagation();
    onDelete(template);
  }}
  disabled={isDeleting}
  aria-label={t("taskTemplates.delete")}
  className="absolute top-5 right-5 w-9 h-9 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors disabled:opacity-40"
>
  <Trash2 className="w-5 h-5 stroke-[2.2]" />
</button>


      {/* ICON */}
      <div className={`w-14 h-14 rounded-2xl ${templateIcon.bg} ${templateIcon.text} flex items-center justify-center mb-6`}>
        <Icon className="w-7 h-7" />
      </div>

      {/* NAME */}
      <h2 className="text-xl font-black text-ink mb-2 pr-8">
        {translatedName}
      </h2>

      {/* DESCRIPTION */}
      <p className="text-slate-400 text-sm leading-6 min-h-[48px]">
        {translatedDescription || t("taskTemplates.noDescription")}
      </p>

      {/* FOOTER */}
      <div className="flex items-center justify-between mt-6">
        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
          {t("taskTemplates.active")}
        </span>
        <span className="text-sm text-slate-400">
          {getEstimatedTime(template.name)}
        </span>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 mt-6 pt-5 border-t border-slate-100">
        <button
          disabled={isAssigning}
          onClick={() => onAssign(template)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {isAssigning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("taskTemplates.assigning")}
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              {t("taskTemplates.assign")}
            </>
          )}
        </button>

        <button
          onClick={() => onEdit(template.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 transition"
        >
          <Pencil className="w-4 h-4" />
          {t("taskTemplates.custom")}
        </button>
      </div>

    </div>
  );
}

function DeleteConfirmModal({ template, isDeleting, errorMessage, onConfirm, onCancel, t }) {
  const translatedName = useTranslatedText(template.name);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl p-7 max-w-sm w-full"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 grid place-items-center mb-4">
          <Trash2 className="w-6 h-6" />
        </div>

        <h2 className="text-lg font-black text-ink mb-2">
          {t("taskTemplates.deleteConfirmTitle")}
        </h2>

        <p className="text-sm text-slate-500 mb-4">
          {t("taskTemplates.deleteConfirmBody", { name: translatedName })}
        </p>

        {errorMessage && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl px-4 py-3 mb-4">
            {errorMessage}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 transition disabled:opacity-50"
          >
            {t("common.cancel")}
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("taskTemplates.deleting")}
              </>
            ) : (
              t("taskTemplates.delete")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskTemplates() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assigningId, setAssigningId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  // ------------------------------------------
  // FETCH TASK TEMPLATES
  // ------------------------------------------
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/task-templates`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch templates"
        );
      }

      setTemplates(data);

    } catch (error) {
      console.log("Template fetch error:", error);
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------
  // GET ICON
  // ------------------------------------------
  const getTemplateIcon = (name) => {
    const templateName = name.toLowerCase();

    if (
      templateName.includes("water") ||
      templateName.includes("bottle")
    ) {
      return {
        icon: Droplets,
        bg: "bg-blue-50",
        text: "text-blue-600",
      };
    }

    if (
      templateName.includes("tea") ||
      templateName.includes("coffee")
    ) {
      return {
        icon: Coffee,
        bg: "bg-amber-50",
        text: "text-amber-600",
      };
    }

    if (
      templateName.includes("guest") ||
      templateName.includes("snack")
    ) {
      return {
        icon: Users,
        bg: "bg-emerald-50",
        text: "text-emerald-600",
      };
    }

    if (
      templateName.includes("package") ||
      templateName.includes("pickup")
    ) {
      return {
        icon: Package,
        bg: "bg-violet-50",
        text: "text-violet-600",
      };
    }

    if (
      templateName.includes("clean") ||
      templateName.includes("room")
    ) {
      return {
        icon: Sparkles,
        bg: "bg-pink-50",
        text: "text-pink-600",
      };
    }

    return {
      icon: ClipboardList,
      bg: "bg-slate-100",
      text: "text-slate-600",
    };
  };

  // ------------------------------------------
  // ESTIMATED TIME
  // Returns a translated string via taskTemplates.estimatedTime.*
  // keys instead of a hardcoded "~N min" literal, so the unit
  // ("min" vs "मिनट") switches with the active language.
  // ------------------------------------------
  const getEstimatedTime = (name) => {
    const templateName = name.toLowerCase();

    if (
      templateName.includes("water") ||
      templateName.includes("bottle")
    ) {
      return t("taskTemplates.estimatedTime.min3");
    }

    if (
      templateName.includes("tea") ||
      templateName.includes("coffee")
    ) {
      return t("taskTemplates.estimatedTime.min8");
    }

    if (
      templateName.includes("guest") ||
      templateName.includes("snack")
    ) {
      return t("taskTemplates.estimatedTime.min10");
    }

    if (
      templateName.includes("package") ||
      templateName.includes("pickup")
    ) {
      return t("taskTemplates.estimatedTime.min5");
    }

    if (
      templateName.includes("clean") ||
      templateName.includes("room")
    ) {
      return t("taskTemplates.estimatedTime.min15");
    }

    return t("taskTemplates.estimatedTime.min10");
  };

  // ------------------------------------------
  // EDIT TEMPLATE
  // ------------------------------------------
  const handleEditTemplate = (templateId) => {
    navigate(
      `/tasks/create?templateId=${templateId}`
    );
  };

  // ------------------------------------------
  // DIRECT ASSIGN
  // ------------------------------------------
 const handleDirectAssign = async (template) => {

    try {

        setAssigningId(template.id);

        const token = localStorage.getItem("token");

        const response = await fetch(
            `${API_URL}/tasks`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    template_id: template.id,
                    title: template.name,
                    description: template.description || null,
                    priority: template.priority || "Medium",
                    due_date: template.due_date || null,
                    location: template.location || null,
                    custom_fields: template.custom_fields || null,
                    assignment_mode: "direct"
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to assign task"
            );
        }

        console.log(
            "Direct assignment successful:",
            data
        );

        // NOTE: this previously hardcoded a specific name ("Bharat bhaiya").
        // Since the assignee isn't guaranteed to be that one person, this
        // now uses a generic translated confirmation instead. If you want
        // to show the ACTUAL assigned Butler's name, swap {{name}} below
        // to reference data.assigned_to_name (whatever your API returns)
        // instead of template.name.
        alert(
          t("taskTemplates.assignedSuccess", { name: template.name })
        );

        navigate("/tasks");

    } catch (error) {

        console.error(
            "Direct assignment error:",
            error
        );

        alert(error.message);

    } finally {

        setAssigningId(null);

    }
};

const requestDeleteTemplate = (template) => {
    setTemplateToDelete(template);
};
const [deleteError, setDeleteError] = useState("");

const confirmDeleteTemplate = async () => {
    if (!templateToDelete) return;

    try {
        setDeletingId(templateToDelete.id);
        setDeleteError("");

        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/task-templates/${templateToDelete.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to delete template");
        }

        setTemplates((prev) => prev.filter((tpl) => tpl.id !== templateToDelete.id));
        setTemplateToDelete(null);

    } catch (error) {
        console.error("Delete template error:", error);
        setDeleteError(error.message); // 👈 shown inline in the modal instead of alert()
    } finally {
        setDeletingId(null);
    }
};

const cancelDeleteTemplate = () => {
    setTemplateToDelete(null);
    setDeleteError("");
};
  // ------------------------------------------
  // CREATE NEW TEMPLATE
  // ------------------------------------------
  const handleCreateTemplate = () => {
    navigate("/task-templates/create");
  };

  // ------------------------------------------
  // LOADING
  // ------------------------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">

        <div className="flex items-center gap-3 text-slate-500">

          <Loader2 className="w-5 h-5 animate-spin" />

          <span>
            {t("taskTemplates.loading")}
          </span>

        </div>

      </div>
    );
  }

  // ------------------------------------------
  // PAGE
  // ------------------------------------------
  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex items-start justify-between gap-6">

        <div>

          <h1 className="text-4xl font-black text-ink tracking-tight">
            {t("taskTemplates.pageTitle")}
          </h1>

          <p className="text-slate-400 text-lg mt-1">
            {t("taskTemplates.pageSubtitle")}
          </p>

        </div>

        <button
          onClick={handleCreateTemplate}
          className="
            flex
            items-center
            gap-2
            px-5
            py-3
            rounded-xl
            bg-slate-900
            text-white
            font-bold
            hover:opacity-90
            transition-opacity
          "
        >
          <Plus className="w-5 h-5" />
          {t("taskTemplates.createTemplate")}
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="
          bg-red-50
          border
          border-red-100
          text-red-600
          rounded-xl
          px-4
          py-3
        ">
          {error}
        </div>
      )}

      {/* EMPTY */}

      {!error && templates.length === 0 && (
        <div className="
          bg-white
          border
          border-slate-200
          rounded-2xl
          p-12
          text-center
        ">

          <ClipboardList
            className="
              w-12
              h-12
              mx-auto
              text-slate-300
              mb-4
            "
          />

          <h2 className="
            text-xl
            font-bold
            text-slate-700
          ">
            {t("taskTemplates.emptyTitle")}
          </h2>

          <p className="
            text-slate-400
            mt-2
          ">
            {t("taskTemplates.emptyDescription")}
          </p>

        </div>
      )}

      {/* TEMPLATE CARDS — name/description are translated live via
    useTranslatedText (translated on-demand, cached in translations_cache)
    when the active language isn't English */}

      {templates.length > 0 && (

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        ">

         {templates.map((template) => {
  const templateIcon = getTemplateIcon(template.name);
  const isAssigning = assigningId === template.id;
  const isDeleting = deletingId === template.id;

  return (
  <TemplateCard
  key={template.id}
  template={template}
  templateIcon={templateIcon}
  isAssigning={isAssigning}
  isDeleting={isDeleting}
  onAssign={handleDirectAssign}
  onEdit={handleEditTemplate}
  onDelete={requestDeleteTemplate}
  getEstimatedTime={getEstimatedTime}
  t={t}
/>
  );
})}

          {/* CREATE TEMPLATE */}

          <div
            onClick={handleCreateTemplate}
            className="
              group
              min-h-[300px]
              rounded-3xl
              border-2
              border-dashed
              border-slate-200
              flex
              flex-col
              items-center
              justify-center
              cursor-pointer
              transition-all
              duration-200
              hover:border-violet-300
              hover:bg-violet-50/30
            "
          >

            <div className="
              w-14
              h-14
              rounded-full
              bg-slate-100
              text-slate-300
              flex
              items-center
              justify-center
              mb-4
              group-hover:bg-violet-100
              group-hover:text-violet-500
              transition-colors
            ">
              <Plus className="w-8 h-8" />
            </div>

            <h3 className="
              font-bold
              text-slate-500
              group-hover:text-violet-600
            ">
              {t("taskTemplates.createTemplate")}
            </h3>

            <p className="
              text-sm
              text-slate-400
              mt-1
            ">
              {t("taskTemplates.createTemplateSub")}
            </p>

          </div>

        </div>
      )}


     {templateToDelete && (
  <DeleteConfirmModal
    template={templateToDelete}
    isDeleting={deletingId === templateToDelete.id}
    errorMessage={deleteError}
    onConfirm={confirmDeleteTemplate}
    onCancel={cancelDeleteTemplate}
    t={t}
  />
)}

    </div>
  );
}

export default TaskTemplates;