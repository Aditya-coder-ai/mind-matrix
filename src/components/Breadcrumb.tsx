import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  isCurrentPage?: boolean;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex ${className}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = item.isCurrentPage || isLast;

          return (
            <li key={index} className="flex items-center gap-2">
              <div 
                className={`flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-wider transition-colors cursor-default ${
                  isCurrent 
                    ? 'text-primary-container' 
                    : 'text-primary-navy'
                }`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </div>
              
              {!isLast && (
                <ChevronRight size={14} className="text-outline-variant shrink-0" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
