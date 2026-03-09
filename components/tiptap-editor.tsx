'use client';

import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  UnderlineIcon,
  Undo2,
  Unlink,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { uploadBlogImage } from '@/services/blog';

// ─── Types ────────────────────────────────────────────────────────────────────
interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
}

// ─── Toolbar button ───────────────────────────────────────────────────────────
function ToolbarButton({
  onClick,
  isActive,
  disabled,
  tooltip,
  children,
  className,
}: {
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  tooltip: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'h-8 w-8 shrink-0 rounded-md transition-all',
            isActive
              ? 'bg-primary/10 text-primary hover:bg-primary/15'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted',
            className,
          )}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side='bottom' className='text-xs'>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

// ─── Toolbar divider ──────────────────────────────────────────────────────────
function ToolbarDivider() {
  return <div className='w-px h-5 bg-border shrink-0 mx-0.5' />;
}

// ─── Word count ───────────────────────────────────────────────────────────────
function WordCount({ text }: { text: string }) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  return (
    <span className='text-xs text-muted-foreground tabular-nums'>
      {words} word{words !== 1 ? 's' : ''} · {chars} char
      {chars !== 1 ? 's' : ''}
    </span>
  );
}

// ─── Editor ───────────────────────────────────────────────────────────────────
export function TipTapEditor({
  content,
  onChange,
  editable = true,
  placeholder = 'Start writing your post…',
}: TipTapEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Link Popover States
  const [linkUrl, setLinkUrl] = useState('');
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full mx-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-2 cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: content ? JSON.parse(content) : '',
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
  });

  // ── Image upload ────────────────────────────────────────────────────────────
  const handleImageUpload = useCallback(async () => {
    if (!editor) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setIsUploading(true);
      try {
        const { url } = await uploadBlogImage(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch {
        toast.error('Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    };
    input.click();
  }, [editor]);

  // ── Link Logic ─────────────────────────────────────────────────────────────
  const applyLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      let url = linkUrl;
      if (!/^https?:\/\//i.test(url) && !url.startsWith('/')) {
        url = `https://${url}`;
      }
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }

    setLinkUrl('');
    setIsLinkPopoverOpen(false);
  }, [editor, linkUrl]);

  const handleLinkButtonClick = useCallback(() => {
    if (!editor) return;
    // If a link is active, load its URL into the input field
    if (editor.isActive('link')) {
      const existingUrl = editor.getAttributes('link').href || '';
      setLinkUrl(existingUrl);
    } else {
      setLinkUrl('');
    }
    setIsLinkPopoverOpen(true);
  }, [editor]);

  const removeLink = useCallback(() => {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    setLinkUrl('');
    setIsLinkPopoverOpen(false);
  }, [editor]);

  if (!mounted || !editor) return null;

  return (
    <TooltipProvider delayDuration={400}>
      <div
        className={cn(
          'rounded-xl border border-border bg-background overflow-hidden transition-all duration-200',
          editable &&
            'focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40',
        )}
      >
        {/* ── Toolbar ──────────────────────────────────────────────────── */}
        {editable && (
          <div className='flex items-center gap-0.5 px-3 py-2 border-b border-border bg-muted/30 flex-wrap'>
            {/* History */}
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              tooltip='Undo (⌘Z)'
            >
              <Undo2 className='w-3.5 h-3.5' />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              tooltip='Redo (⌘⇧Z)'
            >
              <Redo2 className='w-3.5 h-3.5' />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Headings */}
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              isActive={editor.isActive('heading', { level: 1 })}
              tooltip='Heading 1'
            >
              <Heading1 className='w-3.5 h-3.5' />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              isActive={editor.isActive('heading', { level: 2 })}
              tooltip='Heading 2'
            >
              <Heading2 className='w-3.5 h-3.5' />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              isActive={editor.isActive('heading', { level: 3 })}
              tooltip='Heading 3'
            >
              <Heading3 className='w-3.5 h-3.5' />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Inline formatting */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              tooltip='Bold (⌘B)'
            >
              <Bold className='w-3.5 h-3.5' />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              tooltip='Italic (⌘I)'
            >
              <Italic className='w-3.5 h-3.5' />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              tooltip='Underline (⌘U)'
            >
              <UnderlineIcon className='w-3.5 h-3.5' />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              tooltip='Strikethrough'
            >
              <Strikethrough className='w-3.5 h-3.5' />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive('code')}
              tooltip='Inline code'
            >
              <Code className='w-3.5 h-3.5' />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Alignment */}
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
              tooltip='Align left'
            >
              <AlignLeft className='w-3.5 h-3.5' />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().setTextAlign('center').run()
              }
              isActive={editor.isActive({ textAlign: 'center' })}
              tooltip='Align center'
            >
              <AlignCenter className='w-3.5 h-3.5' />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
              tooltip='Align right'
            >
              <AlignRight className='w-3.5 h-3.5' />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Lists & blocks */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              tooltip='Bullet list'
            >
              <List className='w-3.5 h-3.5' />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              tooltip='Numbered list'
            >
              <ListOrdered className='w-3.5 h-3.5' />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              tooltip='Blockquote'
            >
              <Quote className='w-3.5 h-3.5' />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive('codeBlock')}
              tooltip='Code block'
            >
              <Code className='w-3.5 h-3.5' />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              tooltip='Divider'
            >
              <Minus className='w-3.5 h-3.5' />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Link Popover Integration */}
            <Popover
              open={isLinkPopoverOpen}
              onOpenChange={setIsLinkPopoverOpen}
            >
              <PopoverTrigger asChild>
                <div className='inline-block'>
                  <ToolbarButton
                    onClick={handleLinkButtonClick}
                    isActive={editor.isActive('link')}
                    tooltip={editor.isActive('link') ? 'Edit link' : 'Add link'}
                  >
                    <LinkIcon className='w-3.5 h-3.5' />
                  </ToolbarButton>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className='w-80 p-3'
                align='start'
                sideOffset={10}
              >
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <h4 className='text-sm font-medium leading-none'>
                      {editor.isActive('link') ? 'Edit Link' : 'Insert Link'}
                    </h4>
                    {editor.isActive('link') && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={removeLink}
                        className='h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10'
                      >
                        <Unlink className='w-3 h-3 mr-1' />
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className='flex gap-2'>
                    <Input
                      placeholder='example.com'
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className='h-8 text-xs'
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          applyLink();
                        }
                      }}
                      autoFocus
                    />
                    <Button
                      size='sm'
                      className='h-8 px-3 text-xs'
                      onClick={applyLink}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <ToolbarButton
              onClick={handleImageUpload}
              disabled={isUploading}
              tooltip='Insert image'
            >
              {isUploading ? (
                <Loader2 className='w-3.5 h-3.5 animate-spin' />
              ) : (
                <ImageIcon className='w-3.5 h-3.5' />
              )}
            </ToolbarButton>
          </div>
        )}

        {/* ── Editor area ──────────────────────────────────────────────── */}
        <EditorContent
          editor={editor}
          className={cn(
            'min-h-[360px] px-6 py-5',
            '[&_.ProseMirror]:min-h-[320px] [&_.ProseMirror]:outline-none',
            '[&_.ProseMirror_h1]:font-display [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mt-8 [&_.ProseMirror_h1]:mb-4 [&_.ProseMirror_h1]:leading-tight [&_.ProseMirror_h1]:tracking-tight',
            '[&_.ProseMirror_h2]:font-display [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mt-7 [&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_h2]:leading-snug',
            '[&_.ProseMirror_h3]:font-display [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mt-5 [&_.ProseMirror_h3]:mb-2',
            '[&_.ProseMirror_p]:leading-7 [&_.ProseMirror_p]:mb-4 [&_.ProseMirror_p]:text-foreground',
            '[&_.ProseMirror_strong]:font-semibold',
            '[&_.ProseMirror_em]:italic',
            '[&_.ProseMirror_u]:underline [&_.ProseMirror_u]:underline-offset-2',
            '[&_.ProseMirror_s]:line-through [&_.ProseMirror_s]:text-muted-foreground',
            '[&_.ProseMirror_:not(pre)>code]:bg-muted [&_.ProseMirror_:not(pre)>code]:px-1.5 [&_.ProseMirror_:not(pre)>code]:py-0.5 [&_.ProseMirror_:not(pre)>code]:rounded [&_.ProseMirror_:not(pre)>code]:text-sm [&_.ProseMirror_:not(pre)>code]:font-mono [&_.ProseMirror_:not(pre)>code]:text-primary',
            '[&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:rounded-lg [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:my-5 [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:text-sm [&_.ProseMirror_pre]:font-mono',
            '[&_.ProseMirror_pre_code]:bg-transparent [&_.ProseMirror_pre_code]:p-0 [&_.ProseMirror_pre_code]:text-foreground',
            '[&_.ProseMirror_blockquote]:border-l-[3px] [&_.ProseMirror_blockquote]:border-primary/40 [&_.ProseMirror_blockquote]:pl-5 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-muted-foreground [&_.ProseMirror_blockquote]:my-5 [&_.ProseMirror_blockquote]:bg-primary/3 [&_.ProseMirror_blockquote]:py-1 [&_.ProseMirror_blockquote]:rounded-md',
            '[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:mb-4 [&_.ProseMirror_ul]:space-y-1.5',
            '[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:mb-4 [&_.ProseMirror_ol]:space-y-1.5',
            '[&_.ProseMirror_li]:leading-7',
            '[&_.ProseMirror_hr]:border-border [&_.ProseMirror_hr]:my-8',
            '[&_.ProseMirror_img]:rounded-lg [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:my-5 [&_.ProseMirror_img]:mx-auto [&_.ProseMirror_img]:block [&_.ProseMirror_img]:shadow-sm',
            '[&_.ProseMirror_a]:text-primary [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:underline-offset-2 [&_.ProseMirror_a]:cursor-pointer',
            '[&_.ProseMirror.is-editor-empty:first-child_p:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror.is-editor-empty:first-child_p:first-child::before]:text-muted-foreground/40 [&_.ProseMirror.is-editor-empty:first-child_p:first-child::before]:float-left [&_.ProseMirror.is-editor-empty:first-child_p:first-child::before]:pointer-events-none [&_.ProseMirror.is-editor-empty:first-child_p:first-child::before]:h-0',
            '[&_.ProseMirror_*::selection]:bg-primary/15',
          )}
        />

        {/* ── Status bar ───────────────────────────────────────────────── */}
        {editable && (
          <div className='flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20'>
            <WordCount text={editor.getText()} />
            {isUploading && (
              <span className='text-xs text-muted-foreground flex items-center gap-1.5'>
                <Loader2 className='w-3 h-3 animate-spin' />
                Uploading image…
              </span>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
