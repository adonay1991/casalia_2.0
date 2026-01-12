"use client";

import {
	TextB as BoldIcon,
	ListBullets as BulletListIcon,
	TextHOne as H1Icon,
	TextHTwo as H2Icon,
	TextHThree as H3Icon,
	Minus as HorizontalRuleIcon,
	Image as ImageIcon,
	TextItalic as ItalicIcon,
	Link as LinkIcon,
	ListNumbers as NumberListIcon,
	Quotes as QuoteIcon,
	ArrowClockwise as RedoIcon,
	TextStrikethrough as StrikeIcon,
	ArrowCounterClockwise as UndoIcon,
	LinkBreak as UnlinkIcon,
} from "@phosphor-icons/react";
import TiptapImage from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
	disabled?: boolean;
}

export function RichTextEditor({
	content,
	onChange,
	placeholder = "Escribe el contenido aqui...",
	disabled = false,
}: RichTextEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3],
				},
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: "text-[var(--casalia-orange)] underline",
				},
			}),
			TiptapImage.configure({
				HTMLAttributes: {
					class: "rounded-lg max-w-full h-auto",
				},
			}),
			Placeholder.configure({
				placeholder,
			}),
		],
		content,
		editable: !disabled,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class:
					"prose prose-zinc max-w-none min-h-[300px] p-4 focus:outline-none",
			},
		},
	});

	// Update content when prop changes externally
	useEffect(() => {
		if (editor && content !== editor.getHTML()) {
			editor.commands.setContent(content);
		}
	}, [content, editor]);

	const setLink = useCallback(() => {
		if (!editor) return;

		const previousUrl = editor.getAttributes("link").href;
		const url = window.prompt("URL del enlace:", previousUrl);

		// cancelled
		if (url === null) return;

		// empty
		if (url === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}

		// update link
		editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
	}, [editor]);

	const addImage = useCallback(() => {
		if (!editor) return;

		const url = window.prompt("URL de la imagen:");

		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	}, [editor]);

	if (!editor) {
		return (
			<div className="border border-input rounded-md min-h-[350px] animate-pulse bg-muted" />
		);
	}

	return (
		<div
			className={cn(
				"border border-input rounded-md overflow-hidden",
				disabled && "opacity-50",
			)}
		>
			{/* Toolbar */}
			<div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/50">
				{/* Text formatting */}
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBold().run()}
					isActive={editor.isActive("bold")}
					disabled={disabled}
					title="Negrita"
				>
					<BoldIcon className="h-4 w-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleItalic().run()}
					isActive={editor.isActive("italic")}
					disabled={disabled}
					title="Cursiva"
				>
					<ItalicIcon className="h-4 w-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleStrike().run()}
					isActive={editor.isActive("strike")}
					disabled={disabled}
					title="Tachado"
				>
					<StrikeIcon className="h-4 w-4" />
				</ToolbarButton>

				<ToolbarDivider />

				{/* Headings */}
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					isActive={editor.isActive("heading", { level: 1 })}
					disabled={disabled}
					title="Titulo 1"
				>
					<H1Icon className="h-4 w-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					isActive={editor.isActive("heading", { level: 2 })}
					disabled={disabled}
					title="Titulo 2"
				>
					<H2Icon className="h-4 w-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					isActive={editor.isActive("heading", { level: 3 })}
					disabled={disabled}
					title="Titulo 3"
				>
					<H3Icon className="h-4 w-4" />
				</ToolbarButton>

				<ToolbarDivider />

				{/* Lists */}
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					isActive={editor.isActive("bulletList")}
					disabled={disabled}
					title="Lista de puntos"
				>
					<BulletListIcon className="h-4 w-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					isActive={editor.isActive("orderedList")}
					disabled={disabled}
					title="Lista numerada"
				>
					<NumberListIcon className="h-4 w-4" />
				</ToolbarButton>

				<ToolbarDivider />

				{/* Block elements */}
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					isActive={editor.isActive("blockquote")}
					disabled={disabled}
					title="Cita"
				>
					<QuoteIcon className="h-4 w-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().setHorizontalRule().run()}
					disabled={disabled}
					title="Linea horizontal"
				>
					<HorizontalRuleIcon className="h-4 w-4" />
				</ToolbarButton>

				<ToolbarDivider />

				{/* Links and images */}
				<ToolbarButton
					onClick={setLink}
					isActive={editor.isActive("link")}
					disabled={disabled}
					title="Insertar enlace"
				>
					<LinkIcon className="h-4 w-4" />
				</ToolbarButton>
				{editor.isActive("link") && (
					<ToolbarButton
						onClick={() => editor.chain().focus().unsetLink().run()}
						disabled={disabled}
						title="Quitar enlace"
					>
						<UnlinkIcon className="h-4 w-4" />
					</ToolbarButton>
				)}
				<ToolbarButton
					onClick={addImage}
					disabled={disabled}
					title="Insertar imagen"
				>
					<ImageIcon className="h-4 w-4" />
				</ToolbarButton>

				<ToolbarDivider />

				{/* Undo/Redo */}
				<ToolbarButton
					onClick={() => editor.chain().focus().undo().run()}
					disabled={disabled || !editor.can().undo()}
					title="Deshacer"
				>
					<UndoIcon className="h-4 w-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().redo().run()}
					disabled={disabled || !editor.can().redo()}
					title="Rehacer"
				>
					<RedoIcon className="h-4 w-4" />
				</ToolbarButton>
			</div>

			{/* Editor content */}
			<EditorContent editor={editor} />

			{/* Hidden input for form submission */}
			<input type="hidden" name="content" value={editor.getHTML()} />
		</div>
	);
}

interface ToolbarButtonProps {
	onClick: () => void;
	isActive?: boolean;
	disabled?: boolean;
	title?: string;
	children: React.ReactNode;
}

function ToolbarButton({
	onClick,
	isActive = false,
	disabled = false,
	title,
	children,
}: ToolbarButtonProps) {
	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			onClick={onClick}
			disabled={disabled}
			title={title}
			className={cn("h-8 w-8", isActive && "bg-muted text-foreground")}
		>
			{children}
		</Button>
	);
}

function ToolbarDivider() {
	return <div className="w-px h-6 bg-border mx-1 self-center" />;
}
