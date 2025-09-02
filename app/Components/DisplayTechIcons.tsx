import React from 'react';
import Image from 'next/image';
import { cn, getTechLogos } from '@/lib/utils';
import { Code2, Plus } from 'lucide-react';

interface TechIconProps {
  techStack: string[];
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const DisplayTechIcons: React.FC<TechIconProps> = async ({ 
  techStack, 
  maxDisplay = 3, 
  size = 'md', 
  showTooltip = true 
}) => {
  const techIcons = await getTechLogos(techStack);
  const remainingCount = Math.max(0, techStack.length - maxDisplay);

  const sizeClasses = {
    sm: { container: 'w-8 h-8', icon: 'size-4', text: 'text-xs' },
    md: { container: 'w-10 h-10', icon: 'size-5', text: 'text-sm' },
    lg: { container: 'w-12 h-12', icon: 'size-6', text: 'text-base' }
  };

  const currentSize = sizeClasses[size];

  if (!techIcons || techIcons.length === 0) {
    return (
      <div className="flex items-center space-x-2">
        <div className={cn(
          'bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200',
          currentSize.container
        )}>
          <Code2 className="text-gray-400" size={16} />
        </div>
        <span className="text-gray-500 text-sm">No tech stack specified</span>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {techIcons.slice(0, maxDisplay).map(({ tech, url }, index) => (
          <div
            key={tech}
            className={cn(
              'relative group rounded-full border-2 border-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 hover:scale-110 hover:z-10',
              'bg-white flex items-center justify-center',
              currentSize.container,
              index >= 1 && '-ml-2'
            )}
          >
            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 whitespace-nowrap">
                {tech}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
            
            <Image 
              src={url} 
              alt={tech} 
              width={100} 
              height={100} 
              className={cn(currentSize.icon, 'rounded-lg object-contain')}
              onError={(e) => {
                // Fallback to text if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `
                  <span class="font-semibold text-blue-600 ${currentSize.text}">
                    ${tech.charAt(0).toUpperCase()}
                  </span>
                `;
              }}
            />
          </div>
        ))}
        
        {/* Show remaining count if there are more items */}
        {remainingCount > 0 && (
          <div className={cn(
            'relative group rounded-full border-2 border-white shadow-sm bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-700 font-semibold hover:shadow-md transition-all duration-200 hover:-translate-y-1 hover:scale-110',
            currentSize.container,
            '-ml-2'
          )}>
            {/* Tooltip for remaining items */}
            {showTooltip && (
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 whitespace-nowrap">
                {techStack.slice(maxDisplay).join(', ')}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
            
            <span className={cn('font-bold', currentSize.text)}>
              +{remainingCount}
            </span>
          </div>
        )}
      </div>

      {/* Tech stack summary for screen readers */}
      <div className="sr-only">
        Technologies: {techStack.join(', ')}
      </div>
    </div>
  );
};

export default DisplayTechIcons;
