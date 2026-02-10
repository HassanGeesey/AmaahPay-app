import React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarParticipant {
  id: string;
  name: string;
  image?: string;
  initials?: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
}

interface AvatarGroupProps {
  participants: AvatarParticipant[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

export function AvatarGroup({
  participants,
  max = 5,
  size = 'md',
  showLabels = false,
  className
}: AvatarGroupProps) {
  const visibleParticipants = participants.slice(0, max);
  const remainingCount = participants.length - max;

  const sizeClasses = {
    sm: { avatar: "w-7 h-7 text-xs", offset: "-ml-2" },
    md: { avatar: "w-8 h-8 text-xs", offset: "-ml-2.5" },
    lg: { avatar: "w-10 h-10 text-sm", offset: "-ml-3" }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status?: string) => {
    const colors = {
      online: "bg-[#10B981] ring-2 ring-white",
      busy: "bg-[#EF4444] ring-2 ring-white",
      away: "bg-[#F59E0B] ring-2 ring-white",
      offline: "bg-[#9CA3AF] ring-2 ring-white"
    };
    return colors[status as keyof typeof colors] || colors.offline;
  };

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex items-center">
        {visibleParticipants.map((participant, index) => (
          <div
            key={participant.id}
            className={cn(
              "relative rounded-full overflow-hidden",
              sizeClasses[size].avatar,
              index !== 0 && sizeClasses[size].offset,
              "ring-2 ring-white"
            )}
            title={participant.name}
          >
            {participant.image ? (
              <img
                src={participant.image}
                alt={participant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-medium">
                {participant.initials || getInitials(participant.name)}
              </div>
            )}
            {participant.status && (
              <div className={cn(
                "absolute bottom-0 right-0 rounded-full",
                size === 'sm' ? "w-2 h-2" : size === 'md' ? "w-2.5 h-2.5" : "w-3 h-3",
                getStatusColor(participant.status)
              )} />
            )}
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className={cn(
              "relative rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] font-medium",
              sizeClasses[size].avatar,
              sizeClasses[size].offset,
              "ring-2 ring-white"
            )}
          >
            <span>+{remainingCount}</span>
          </div>
        )}
      </div>
      {showLabels && (
        <div className="ml-2.5">
          <p className="text-sm font-medium text-[#1A1A1A]">{participants.length} participants</p>
        </div>
      )}
    </div>
  );
}

interface SingleAvatarProps {
  participant: AvatarParticipant;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  className?: string;
}

export function SingleAvatar({
  participant,
  size = 'md',
  showName = false,
  className
}: SingleAvatarProps) {
  const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
    xl: "w-14 h-14 text-base"
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative">
        <div className={cn(
          "relative rounded-full overflow-hidden",
          sizeClasses[size]
        )}>
          {participant.image ? (
            <img
              src={participant.image}
              alt={participant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-medium">
              {participant.initials || getInitials(participant.name)}
            </div>
          )}
          {participant.status && (
            <div className={cn(
              "absolute bottom-0 right-0 rounded-full",
              size === 'sm' ? "w-2 h-2" : size === 'md' ? "w-2 h-2" : size === 'lg' ? "w-2.5 h-2.5" : "w-3 h-3",
              participant.status === 'online' ? "bg-[#10B981] ring-2 ring-white" :
              participant.status === 'busy' ? "bg-[#EF4444] ring-2 ring-white" :
              participant.status === 'away' ? "bg-[#F59E0B] ring-2 ring-white" : "bg-[#9CA3AF] ring-2 ring-white"
            )} />
          )}
        </div>
      </div>
      {showName && (
        <div>
          <p className="text-sm font-medium text-[#1A1A1A]">{participant.name}</p>
          {participant.status && (
            <p className="text-xs text-[#9CA3AF] capitalize">{participant.status}</p>
          )}
        </div>
      )}
    </div>
  );
}
