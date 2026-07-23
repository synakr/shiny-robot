import * as FileSystem from "expo-file-system/legacy";
import { Linking } from "react-native";

const NOTES_DIR = `${FileSystem.documentDirectory}notes/`;

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[<>:"/\\|?*]/g, "_");
}

async function ensureDirectory() {
  const info = await FileSystem.getInfoAsync(NOTES_DIR);

  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(NOTES_DIR, {
      intermediates: true,
    });
  }
}

export async function getLocalUri(fileName: string) {
  await ensureDirectory();

  return `${NOTES_DIR}${sanitizeFileName(fileName)}`;
}

export async function isDownloaded(fileName: string) {
  const localUri = await getLocalUri(fileName);

  const info = await FileSystem.getInfoAsync(localUri);

  return info.exists;
}

export async function downloadNote(
  fileUrl: string,
  fileName: string,
): Promise<string> {
  const localUri = await getLocalUri(fileName);

  const info = await FileSystem.getInfoAsync(localUri);

  if (info.exists) {
    return localUri;
  }

  try {
    const result = await FileSystem.downloadAsync(fileUrl, localUri);

    console.log("Download status:", result.status);
    console.log("Saved URI:", result.uri);

    const info = await FileSystem.getInfoAsync(result.uri);

    console.log(info);

    return result.uri;
  } catch (error) {
    console.error("Download failed:", error);

    try {
      const exists = await FileSystem.getInfoAsync(localUri);

      if (exists.exists) {
        await FileSystem.deleteAsync(localUri);
      }
    } catch {}

    throw new Error("Failed to download note.");
  }
}

export async function openLocalNote(fileName: string) {
  const localUri = await getLocalUri(fileName);

  const info = await FileSystem.getInfoAsync(localUri);

  if (!info.exists) {
    throw new Error("File not downloaded.");
  }

  const contentUri = await FileSystem.getContentUriAsync(localUri);

  const canOpen = await Linking.canOpenURL(contentUri);

  if (!canOpen) {
    throw new Error("No compatible application found.");
  }

  await Linking.openURL(contentUri);
}

// For expo go; work with this

// export async function openLocalNote(fileName: string) {
//   const localUri = await getLocalUri(fileName);

//   const info = await FileSystem.getInfoAsync(localUri);

//   if (!info.exists) {
//     throw new Error("File not downloaded.");
//   }

//   const available = await Sharing.isAvailableAsync();

//   if (!available) {
//     throw new Error("Sharing is not available on this device.");
//   }

//   await Sharing.shareAsync(localUri);
// }

export async function openNote(fileUrl: string, fileName: string) {
  await downloadNote(fileUrl, fileName);

  await openLocalNote(fileName);
}

export async function deleteDownloadedNote(fileName: string) {
  const localUri = await getLocalUri(fileName);

  const info = await FileSystem.getInfoAsync(localUri);

  if (info.exists) {
    await FileSystem.deleteAsync(localUri);
  }
}
