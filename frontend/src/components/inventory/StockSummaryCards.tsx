import React from 'react';
import { IInventory } from '../../store/inventory/inventory.types';
import { Package, Truck, Layers, Hash } from 'lucide-react';

interface Props {
  latestInventory: IInventory | null;
}

export const StockSummaryCards: React.FC<Props> = ({ latestInventory }) => {
  const formatNumber = (val: number | null | undefined) => {
    if (val === null || val === undefined) return '0.00';
    return Number(val).toFixed(2);
  };

  const cards = [
    {
      title: 'Car Tires',
      value: formatNumber(latestInventory?.carTiresCount),
      icon: <Package className="w-5 h-5" />,
    },
    {
      title: 'Truck Tires',
      value: formatNumber(latestInventory?.truckTiresCount),
      icon: <Truck className="w-5 h-5" />,
    },
    {
      title: 'Mixed Tires',
      value: formatNumber(latestInventory?.mixedTiresCount),
      icon: <Layers className="w-5 h-5" />,
    },
    {
      title: 'Bales',
      value: formatNumber(latestInventory?.bales),
      icon: <Hash className="w-5 h-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-[#1E1E1E] border border-[#2A2A2A] dark:border-[#2E2E2E] shadow-sm rounded-xl p-6 transition-colors duration-150 hover:border-[#D4AF37] dark:hover:border-[#D4AF37]"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-ink-600 dark:text-cream-400">
                {card.title}
              </h3>
              <p className="text-3xl font-bold text-ink-900 dark:text-cream-100">
                {card.value}
              </p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0DFA0] dark:bg-[#2A2200] text-[#D4AF37]">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
