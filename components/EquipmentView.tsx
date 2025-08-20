import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { Profile, Equipment } from '../types';

interface EquipmentViewProps {
  profile: Profile;
}

const EquipmentView: React.FC<EquipmentViewProps> = ({ profile }) => {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchEquipment = async () => {
            if (!supabase) return;
            setLoading(true);
            setError(null);
            try {
                const { data, error } = await supabase
                    .from('equipment')
                    .select('*')
                    .order('name', { ascending: true });

                if (error) throw error;
                setEquipment(data || []);
            } catch (error) {
                const err = error as { message: string };
                setError(`Failed to load equipment. Have you run the setup SQL? Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, []);

    const filteredEquipment = useMemo(() => {
        return equipment.filter(item => 
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.category.toLowerCase().includes(search.toLowerCase()) ||
            item.serial_number?.toLowerCase().includes(search.toLowerCase())
        );
    }, [equipment, search]);

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-4">Equipment Catalog</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name, category, or serial..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-sm bg-base-300 text-white placeholder-gray-500 px-4 py-2 rounded-md border-2 border-base-300 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary/50 transition"
                />
            </div>

            {loading && <p>Loading equipment...</p>}
            {error && <p className="text-red-400">{error}</p>}
            
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEquipment.length > 0 ? filteredEquipment.map(item => (
                        <div key={item.id} className="bg-base-300 p-4 rounded-lg border border-transparent hover:border-brand-primary transition-colors">
                           <div className="aspect-video bg-base-100 rounded-md mb-3 flex items-center justify-center">
                                <span className="text-gray-500 text-sm">Image</span>
                           </div>
                           <h3 className="font-bold text-white text-lg">{item.name}</h3>
                           <p className="text-sm text-brand-secondary">{item.category}</p>
                           <p className="text-xs text-gray-500 mt-1">S/N: {item.serial_number || 'N/A'}</p>
                           <p className="text-content mt-2 text-sm">{item.description}</p>
                        </div>
                    )) : (
                        <p className="text-gray-500 md:col-span-3">No equipment found. You can add some via the Supabase dashboard.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default EquipmentView;
