import React, { useState } from "react";
import { ChevronDown } from 'lucide-react';

const ModelSelector = () => {
    const [open, setOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState('Gemini 2.0 Flash');

    const models = ['Gemini 2.0 Flash', 'GPT-4o', 'MediBot'];

    const toggleDropdown = () => setOpen(!open);

    const handleSelect = (model) => {
        setSelectedModel(model);
        setOpen(false);
    };

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                onClick={toggleDropdown}
                className="flex w-full items-center justify-between rounded-md border border-input px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 h-8 bg-gray-100 dark:bg-gray-700 dark:text-white text-sm border-none focus:ring-1 focus:ring-blue-500"
            >
                <span>{selectedModel}</span>
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </button>

            {open && (
                <div className="absolute bottom-full mb-2 w-52 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white text-sm shadow-lg border border-gray-700 z-50">
                    {models.map((model) => (
                        <button
                            key={model}
                            onClick={() => handleSelect(model)}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${selectedModel === model ? 'font-semibold' : ''
                                }`}
                        >
                            {selectedModel === model ? '✓ ' : ''}{model}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ModelSelector;