import type { Accept } from "react-dropzone";

/** File type presets matching react-dropzone Accept type */
export const ACCEPT_PRESETS: Record<string, Accept> = {
	"image/*": { "image/*": [] },
	"image/jpeg": { "image/jpeg": [".jpeg", ".jpg"] },
	"image/png": { "image/png": [".png"] },
	"image/webp": { "image/webp": [".webp"] },
	"image/gif": { "image/gif": [".gif"] },
	"application/pdf": { "application/pdf": [".pdf"] },
	"images-and-pdf": {
		"image/*": [],
		"application/pdf": [".pdf"],
	},
};

export const ACCEPT_PRESET_LABELS: Record<string, string> = {
	"image/*": "All images",
	"image/jpeg": "JPEG only",
	"image/png": "PNG only",
	"image/webp": "WebP only",
	"image/gif": "GIF only",
	"application/pdf": "PDF only",
	"images-and-pdf": "Images and PDF",
};

export function getAcceptPresetKey(accept: Accept | string | undefined): string {
	if (accept == null) return "image/*";
	if (typeof accept === "string")
		return accept in ACCEPT_PRESETS ? accept : "image/*";
	if (Object.keys(accept).length === 0) return "image/*";
	const key = Object.keys(ACCEPT_PRESETS).find((presetKey) => {
		const preset = ACCEPT_PRESETS[presetKey];
		const aKeys = Object.keys(accept).sort().join(",");
		const pKeys = Object.keys(preset).sort().join(",");
		if (aKeys !== pKeys) return false;
		return Object.keys(preset).every(
			(k) =>
				Array.from(accept[k] ?? []).sort().join(",") ===
				Array.from(preset[k]).sort().join(","),
		);
	});
	return key ?? "image/*";
}
