// "use server";

// import { WpSite } from "@/types";
// import { revalidatePath } from "next/cache";

// export async function runSFTPHealthCheck(
//   site: WpSite
// ): Promise<{ success: boolean; message: string }> {
//   const sftp = new Client();
//   try {
//     if (
//       !site.sftp_credentials?.host ||
//       !site.sftp_credentials?.port ||
//       !site.sftp_credentials?.username
//     ) {
//       return { success: false, message: "SFTP credentials not found" };
//     }
//     await sftp.connect({
//       host: site.sftp_credentials.host,
//       port: site.sftp_credentials.port,
//       username: site.sftp_credentials.username,
//       password: site.sftp_credentials.password,
//     });

//     // If connection is successful, try to list the root directory
//     await sftp.list("/");

//     return { success: true, message: "SFTP connection successful" };
//   } catch (error) {
//     console.error("SFTP Health Check Error:", error);
//     return {
//       success: false,
//       message: `SFTP connection failed: ${(error as Error).message}`,
//     };
//   } finally {
//     sftp.end();
//   }
// }

// export async function findWpContentViaSFTP(
//   host: string,
//   port: number,
//   username: string,
//   password: string
// ) {
//   const sftp = new Client();
//   try {
//     await sftp.connect({
//       host,
//       port,
//       username,
//       password,
//     });

//     // Start from the root directory and search for wp-content
//     const wpContentPath = await findWpContentRecursive(sftp, "/");

//     if (wpContentPath) {
//       return { success: true, path: wpContentPath };
//     } else {
//       return { success: false, error: "wp-content directory not found" };
//     }
//   } catch (error) {
//     console.error("SFTP Error:", error);
//     return {
//       success: false,
//       error: "Failed to connect or search for wp-content",
//     };
//   } finally {
//     sftp.end();
//     revalidatePath("/");
//   }
// }

// async function findWpContentRecursive(
//   sftp: Client,
//   currentPath: string
// ): Promise<string | null> {
//   const list = await sftp.list(currentPath);

//   for (const item of list) {
//     if (item.type === "d" && item.name === "wp-content") {
//       return `${currentPath}${item.name}`;
//     }

//     if (item.type === "d" && !item.name.startsWith(".")) {
//       const nestedPath = `${currentPath}${item.name}/`;
//       const result = await findWpContentRecursive(sftp, nestedPath);
//       if (result) return result;
//     }
//   }

//   return null;
// }
