import React from 'react';
import { cn } from '@/lib/utils';

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type?: string;
  icon?: React.ReactNode;
  uploadedAt?: string;
  url?: string;
}

interface FileAttachmentListProps {
  files: FileAttachment[];
  showSize?: boolean;
  showDate?: boolean;
  onRemove?: (file: FileAttachment) => void;
  onDownload?: (file: FileAttachment) => void;
  className?: string;
}

export function FileAttachmentList({
  files,
  showSize = true,
  showDate = false,
  onRemove,
  onDownload,
  className
}: FileAttachmentListProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: FileAttachment) => {
    if (file.icon) return file.icon;

    const type = file.type?.toLowerCase() || '';
    if (type.includes('image')) {
      return (
        <svg className="w-5 h-5 text-[#A855F7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    if (type.includes('pdf')) {
      return (
        <svg className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  if (files.length === 0) {
    return (
      <div className={cn("py-8 text-center text-[#9CA3AF]", className)}>
        <svg className="w-10 h-10 mx-auto mb-3 text-[#E5E5E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <p className="text-sm">No attachments</p>
      </div>
    );
  }

  return (
    <ul className={cn("divide-y divide-[#F0F0F0]", className)}>
      {files.map((file) => (
        <li
          key={file.id}
          className="flex items-center justify-between py-2.5 -mx-2.5 px-2.5 hover:bg-[#FAFAFA] rounded-lg transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0">
              {getFileIcon(file)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#1A1A1A] truncate">{file.name}</p>
              <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                {showSize && <span>{formatFileSize(file.size)}</span>}
                {showDate && file.uploadedAt && (
                  <>
                    <span>•</span>
                    <span>{file.uploadedAt}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {onDownload && (
              <button
                onClick={() => onDownload(file)}
                className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#F3F4F6] opacity-0 group-hover:opacity-100 transition-all"
                title="Download"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            )}
            {onRemove && (
              <button
                onClick={() => onRemove(file)}
                className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#FEF2F2] opacity-0 group-hover:opacity-100 transition-all"
                title="Remove"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("py-10 text-center", className)}>
      {icon && <div className="mx-auto mb-3">{icon}</div>}
      <h3 className="text-sm font-medium text-[#1A1A1A]">{title}</h3>
      {description && <p className="text-xs text-[#9CA3AF] mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
