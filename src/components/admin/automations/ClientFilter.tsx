
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Client {
  id: string;
  email: string;
}

interface ClientFilterProps {
  selectedClientId: string | null;
  onClientChange: (clientId: string | null) => void;
}

const ClientFilter: React.FC<ClientFilterProps> = ({
  selectedClientId,
  onClientChange
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Get unique client IDs from client_automations
        const { data: clientAutomations, error: automationsError } = await supabase
          .from('client_automations')
          .select('client_id')
          .eq('status', 'active');

        if (automationsError) throw automationsError;

        // Get unique client IDs
        const uniqueClientIds = [...new Set(clientAutomations?.map(ca => ca.client_id) || [])];

        // Fetch user details for these clients
        const clientsData = await Promise.all(
          uniqueClientIds.map(async (clientId) => {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('id, email')
              .eq('id', clientId)
              .single();
            
            return userError ? 
              { id: clientId, email: 'Unknown Client' } : 
              userData;
          })
        );

        setClients(clientsData.sort((a, b) => a.email.localeCompare(b.email)));
      } catch (error) {
        console.error('Error fetching clients:', error);
        setClients([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleClearFilter = () => {
    onClientChange(null);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <Select
        value={selectedClientId || ""}
        onValueChange={(value) => onClientChange(value || null)}
        disabled={isLoading}
      >
        <SelectTrigger className="w-64">
          <SelectValue placeholder={isLoading ? "Loading clients..." : "Filter by client"} />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedClientId && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilter}
          className="flex items-center gap-1"
        >
          <X className="h-3 w-3" />
          Clear
        </Button>
      )}
    </div>
  );
};

export default ClientFilter;
