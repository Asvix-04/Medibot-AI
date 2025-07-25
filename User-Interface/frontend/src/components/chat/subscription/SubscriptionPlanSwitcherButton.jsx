import React, { useState } from "react";
import { ChevronDown, Sparkles, Crown, Check } from "lucide-react";
import SubscriptionPlanOption from "./SubscriptionPlanOptions";
import BasePlanToastContainer from "./BasePlanToastContainer";
import PremiumPlanToastContainer from "./PremiumPlanToastContainer";

const SubscriptionPlanSwitcherButton = ({ darkMode, isBackgroundBlur, setIsBackgroundBlur }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("Base Plan");
    const [showBasePopup, setShowBasePopup] = useState(false);
    const [showPremiumPopup, setShowPremiumPopup] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (plan) => {
        setSelectedPlan(plan);
        setIsOpen(false);
        setIsBackgroundBlur(true)
        if (plan === "Base Plan") { setShowBasePopup(true); }
        else if (plan === "Premium Plan") {
            setShowPremiumPopup(true);
        }
    };

    const mainIcon = (plan) =>
        plan === "Premium Plan" ? (
            <Crown className="w-4 h-4 text-yellow-400" />
        ) : (
            <Sparkles className="w-4 h-4 text-blue-500" />
        );

    return (
        <div className="relative w-full md:w-[240px]">
            <button
                onClick={toggleDropdown}
                type="button"
                className="flex items-center justify-between py-2 ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 h-10 bg-gray-100 dark:bg-gray-700 text-sm font-semibold text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-full px-4 hover:bg-gray-200/70 dark:hover:bg-gray-600/60 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full md:w-[240px]"
            >
                <div className="flex items-center gap-2">
                    {mainIcon(selectedPlan)}
                    <span>{selectedPlan}</span>
                </div>
                <ChevronDown className="w-4 h-4 opacity-60" />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full rounded-xl border border-[#2c2f3a] dark:bg-[#1c1f2b] bg-white text-gray-800 dark:text-gray-100 shadow-lg">
                    <div className="p-2 space-y-1">
                        <SubscriptionPlanOption
                            label="Premium Plan"
                            subLabel="₹100 / $2 per month"
                            selectedPlan={selectedPlan}
                            onSelect={handleSelect}
                            bgSelected="bg-[#2d3748]"
                            darkMode={darkMode}
                            isBackgroundBlur={isBackgroundBlur}
                        />
                        <SubscriptionPlanOption
                            label="Base Plan"
                            subLabel="Free access (Current plan)"
                            selectedPlan={selectedPlan}
                            onSelect={handleSelect}
                            bgSelected="bg-[#263d66]"
                            darkMode={darkMode}
                        />
                    </div>
                </div>
            )}

            {showBasePopup && (
                <div>
                    <BasePlanToastContainer onClose={() => {
                        setShowBasePopup(false);
                        setIsBackgroundBlur(false);
                    }
                    }
                        darkMode={darkMode}
                        isBackgroundBlur={isBackgroundBlur} />
                </div>
            )}
            {showPremiumPopup && (
                <div>
                    <PremiumPlanToastContainer onClose={() => {
                        setShowPremiumPopup(false);
                        setIsBackgroundBlur(false);
                    }}
                        darkMode={darkMode}
                        isBackgroundBlur={isBackgroundBlur} />
                </div>
            )}
        </div>
    );
};
export default SubscriptionPlanSwitcherButton;
