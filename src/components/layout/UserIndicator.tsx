
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAdminVerification } from '@/hooks/useAdminVerification';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Shield } from 'lucide-react';

const UserIndicator = () => {
  const { user, isAuthenticated } = useAuth();
  const { isAdmin } = useAdminVerification();

  if (!isAuthenticated || !user) {
    return null;
  }

  const getUserDisplayName = () => {
    if (user.email === 'contact@automatizalo.co') {
      return 'Administrator';
    }
    return user.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleColor = () => {
    return isAdmin ? 'bg-blue-500' : 'bg-green-500';
  };

  const getRoleText = () => {
    return isAdmin ? 'Admin' : 'Client';
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
      <Avatar className="h-7 w-7">
        <AvatarImage src="" alt={getUserDisplayName()} />
        <AvatarFallback className={`text-xs text-white ${getRoleColor()}`}>
          {getUserInitials()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900 leading-tight">
          {getUserDisplayName()}
        </span>
        <Badge 
          variant="secondary" 
          className={`text-xs h-4 px-1.5 ${getRoleColor()} text-white border-0`}
        >
          {isAdmin && <Shield className="h-3 w-3 mr-1" />}
          {!isAdmin && <User className="h-3 w-3 mr-1" />}
          {getRoleText()}
        </Badge>
      </div>
    </div>
  );
};

export default UserIndicator;
