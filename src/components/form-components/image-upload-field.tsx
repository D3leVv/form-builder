"use client";

import { File, Trash } from "lucide-react";
import React, { ChangeEvent, DragEvent } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/utils";
import { ImageUpload } from "@/types/form-types";



type Files = {
	value?: File[];
	multiple: boolean;
	onChange: (files: File[]) => void;
}


export function FileUpload(props: ImageUpload & Files) {

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: (acceptedFiles) => props.onChange(acceptedFiles),
		accept: props.accept,
		multiple: props.multiple,
		maxFiles: props.maxFiles,
		maxSize: props.maxSize,
	});

	console.log(props.value);

	const filesList = props.value && props.value?.map((file) => (
		<li key={file.name} className="relative">
			<Card className="relative p-4">
				<div className="absolute right-4 top-1/2 -translate-y-1/2">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label="Remove file"
						onClick={() =>
							props.onChange(
								(props.value ?? []).filter((prevFile) => prevFile.name !== file.name)
							)
						}
					>
						<Trash className="h-5 w-5" aria-hidden={true} />
					</Button>
				</div>
				<CardContent className="flex items-center space-x-3 p-0">
					<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
						<File className="h-5 w-5 text-foreground" aria-hidden={true} />
					</span>
					<div>
						<p className="text-pretty font-medium text-foreground">{file.name}</p>
						<p className="text-pretty mt-0.5 text-sm text-muted-foreground">
							{file.size} bytes
						</p>
					</div>
				</CardContent>
			</Card>
		</li>
	));

	return (

		<div className="">
			<Label htmlFor={props.name} className="font-medium">
				{props.label}
			</Label>
			<div
				{...getRootProps()}
				className={cn(
					isDragActive
						? "border-primary bg-primary/10 ring-2 ring-primary/20"
						: "border-border",
					"mt-2 flex justify-center rounded-md border border-dashed px-6 py-20 transition-colors duration-200"
				)}
			>
				<div>
					<File
						className="mx-auto h-12 w-12 text-muted-foreground/80"
						aria-hidden={true}
					/>
					<div className="mt-4 flex text-muted-foreground">
						<p>Drag and drop or</p>
						<label
							htmlFor="file"
							className="relative cursor-pointer rounded-sm pl-1 font-medium text-primary hover:text-primary/80 hover:underline hover:underline-offset-4"
						>
							<span>choose file(s)</span>
							<input
								{...getInputProps()}
								id={props.name}
								name={props.name}
								type="file"
								className="sr-only"
							/>
						</label>
						<p className="text-pretty pl-1">to upload</p>
					</div>
				</div>
			</div>
			<p className="text-pretty mt-2 text-sm leading-5 text-muted-foreground sm:flex sm:items-center sm:justify-between">
				<span>All file types are allowed to upload.</span>
				<span className="pl-1 sm:pl-0">Max. size per file: 50MB</span>
			</p>
			{filesList?.length && filesList.length > 0 && (
				<ul role="list" className="mt-4 space-y-4">
					{filesList}
				</ul>
			)}
		</div>


	);
}
