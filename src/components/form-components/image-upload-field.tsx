"use client";

import { UploadIcon, XIcon, ImageIcon } from "lucide-react";
import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { useFileUpload, formatBytes } from "@/hooks/use-file-upload";
import type { FileWithPreview } from "@/hooks/use-file-upload";

interface ImageUploadFieldProps {
	name: string;
	label?: string;
	description?: string;
	required?: boolean;
	disabled?: boolean;
	value?: FileWithPreview[];
	onChange?: (files: FileWithPreview[]) => void;
	maxFiles?: number;
	maxSize?: number;
	accept?: string;
	className?: string;
}

export function ImageUploadField({
	name,
	label,
	description,
	required,
	disabled,
	value,
	onChange,
	maxFiles = 10,
	maxSize = 5 * 1024 * 1024, // 5MB default
	accept = "image/*",
	className,
}: ImageUploadFieldProps) {
	const [
		{ files, isDragging, errors },
		{
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			openFileDialog,
			removeFile,
			getInputProps,
		},
	] = useFileUpload({
		maxFiles,
		maxSize,
		accept,
		multiple: true,
		onFilesChange: onChange,
	});

	// Sync external value with internal state
	useEffect(() => {
		if (value && value.length > 0 && files.length === 0) {
			// External value provided, but we don't have a direct way to set files
			// This is handled by the onChange callback
		}
	}, [value, files.length]);

	const handleRemove = useCallback(
		(id: string) => {
			removeFile(id);
		},
		[removeFile],
	);

	return (
		<div className={cn("w-full space-y-2", className)}>
			{label && (
				<label htmlFor={name} className="text-sm font-medium leading-none">
					{label}
					{required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}

			{/* Drop zone */}
			<div
				role="button"
				tabIndex={disabled ? -1 : 0}
				aria-disabled={disabled}
				onClick={() => {
					if (!disabled) openFileDialog();
				}}
				onKeyDown={(e) => {
					if (disabled) return;
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						openFileDialog();
					}
				}}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				data-dragging={isDragging || undefined}
				className={cn(
					"border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50",
					"has-[input:focus]:border-ring has-[input:focus]:ring-ring/50",
					"flex min-h-32 flex-col items-center justify-center rounded-lg border border-dashed p-6",
					"transition-colors has-disabled:pointer-events-none has-disabled:opacity-50",
					"has-[input:focus]:ring-[3px] cursor-pointer",
					disabled && "opacity-50 cursor-not-allowed",
				)}
			>
				<input
					{...getInputProps()}
					name={name}
					disabled={disabled}
					className="sr-only"
					aria-label="Upload images"
				/>

				<div className="flex flex-col items-center justify-center text-center gap-2">
					<ImageIcon className="size-8 text-muted-foreground" />
					<div className="space-y-1">
						<p className="text-sm font-medium">
							Drag images here or click to upload
						</p>
						<p className="text-xs text-muted-foreground">
							{accept === "image/*"
								? "Supports all image formats"
								: `Accepts: ${accept}`}
							{maxSize && ` (max ${formatBytes(maxSize)} per file)`}
							{maxFiles && maxFiles > 1 && ` (up to ${maxFiles} files)`}
						</p>
					</div>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="mt-2"
						disabled={disabled}
					>
						<UploadIcon className="size-4 mr-2" />
						Select Images
					</Button>
				</div>
			</div>

			{/* Error messages */}
			{errors.length > 0 && (
				<div className="space-y-1">
					{errors.map((error, index) => (
						<p key={index} className="text-sm text-destructive">
							{error}
						</p>
					))}
				</div>
			)}

			{/* Image previews */}
			{files.length > 0 && (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
					{files.map((fileWithPreview) => (
						<div
							key={fileWithPreview.id}
							className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted"
						>
							{fileWithPreview.preview ? (
								<img
									src={fileWithPreview.preview}
									alt={
										fileWithPreview.file instanceof File
											? fileWithPreview.file.name
											: fileWithPreview.file.name
									}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center">
									<ImageIcon className="size-8 text-muted-foreground" />
								</div>
							)}
							{!disabled && (
								<button
									type="button"
									onClick={() => handleRemove(fileWithPreview.id)}
									className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
									aria-label="Remove image"
								>
									<XIcon className="size-4" />
								</button>
							)}
							<div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
								{fileWithPreview.file instanceof File
									? fileWithPreview.file.name
									: fileWithPreview.file.name}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Description */}
			{description && (
				<p className="text-xs text-muted-foreground">{description}</p>
			)}
		</div>
	);
}
