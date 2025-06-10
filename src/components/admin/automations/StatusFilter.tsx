
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface StatusFilterProps {
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
  statusCounts?: {
    pending: number;
    in_progress: number;
    completed: number;
    total: number;
  };
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  selectedStatus,
  onStatusChange,
  statusCounts
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Filter by Setup Status</label>
      <Select value={selectedStatus || 'all'} onValueChange={(value) => onStatusChange(value === 'all' ? null : value)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center justify-between w-full">
              <span>All Statuses</span>
              {statusCounts && (
                <Badge variant="outline" className="ml-2">
                  {statusCounts.total}
                </Badge>
              )}
            </div>
          </SelectItem>
          <SelectItem value="completed">
            <div className="flex items-center justify-between w-full">
              <span>Ready to Use</span>
              {statusCounts && (
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
                  {statusCounts.completed}
                </Badge>
              )}
            </div>
          </SelectItem>
          <SelectItem value="in_progress">
            <div className="flex items-center justify-between w-full">
              <span>Setup In Progress</span>
              {statusCounts && (
                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
                  {statusCounts.in_progress}
                </Badge>
              )}
            </div>
          </SelectItem>
          <SelectItem value="pending">
            <div className="flex items-center justify-between w-full">
              <span>Setup Pending</span>
              {statusCounts && (
                <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700">
                  {statusCounts.pending}
                </Badge>
              )}
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusFilter;
