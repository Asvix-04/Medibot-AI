import React from 'react';
import { Sparkles, Crown, Check } from "lucide-react";

const SubscriptionPlanOption = ({ label, subLabel, selectedPlan, onSelect, bgSelected, darkMode }) => {
    const isSelected = selectedPlan === label;

    return (
        <div
            onClick={() => {
                onSelect(label)
            }}
            className={`flex items-start p-3 rounded-lg cursor-pointer transition-colors
                  ${isSelected ? `${bgSelected} text-white` : "bg-white dark:bg-[#272f51] text-gray-800 dark:text-gray-100 hover:bg-[#2a2d3c] hover:text-white"} 
            border border-gray-200 dark:border-[#2c2f3a]`}
        >
            <div className="w-6 flex flex-col items-center">
                <div className="relative">
                    {label === "Premium Plan" ? (
                        <Crown className="w-4 h-4 text-yellow-400" />
                    ) : (
                        <Sparkles className="w-4 h-4 text-blue-500" />
                    )}

                    {isSelected && (
                        <Check className="absolute -left-1 bottom-0 w-3.5 h-3.5 text-white" />
                    )}
                </div>
                {isSelected && <Check className="w-4 h-4 text-green-400 mt-1" />}
            </div>
            <div className="ml-3">
                <p className={`font-semibold ${isSelected ? 'text-white' : 'group-hover:text-white'}`}>{label}</p>
                <p className={`text-sm ${isSelected ? 'text-gray-200' : 'text-gray-500 group-hover:text-white'}`}>{subLabel}</p>
            </div>
        </div>
    );
};

export default SubscriptionPlanOption;