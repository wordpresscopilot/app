"use client";
import { ArtifactUI } from "@/components/pipelines/artifact-ui";

type ArtifactToolArgs = {
  hi: string;
};

// export const ArtifactToolUI = makeAssistantToolUI<ArtifactToolArgs, {}>({
//   toolName: "artifact",
//   render: ({ part: { args } }) => {
//     console.log("ArtifactToolUI render test", args);
//     return (
//       <Card className="p-4">
//         <h3 className="text-lg font-semibold mb-4">Plugin Actions</h3>
//         <div className="flex space-x-4">
//           <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
//             Install
//           </button>
//           <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
//             Download
//           </button>
//         </div>
//       </Card>
//     );
//   },
// });
export const ArtifactsView = () => {
  return (
    <div
      className={
        "h-full flex p-3 justify-stretch transition-[width] flex-grow basis-full relative"
      }
    >
      <div className="border rounded-lg w-full h-full overflow-hidden">
        <ArtifactUI />
      </div>
    </div>
  );
};
