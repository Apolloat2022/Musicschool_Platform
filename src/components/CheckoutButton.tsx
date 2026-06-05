"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

interface CheckoutButtonProps {
    mode: "subscription" | "payment";
    priceId?: string; // For existing Stripe products
    priceCents?: number; // For ad-hoc masterclass pricing
    name?: string; // Product name for ad-hoc
    metadata?: any;
    label?: string;
    className?: string;
    icon?: boolean;
}

export default function CheckoutButton({ 
    mode, 
    priceId, 
    priceCents, 
    name, 
    metadata, 
    label = "Checkout", 
    className,
    icon = false
}: CheckoutButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode,
                    priceId,
                    priceCents,
                    name,
                    metadata
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No URL returned");
            }
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Checkout failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button 
            onClick={handleCheckout} 
            disabled={isLoading}
            className={className || "w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex justify-center items-center gap-2"}
        >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : label}
            {!isLoading && icon && <ArrowRight size={18} />}
        </button>
    );
}
