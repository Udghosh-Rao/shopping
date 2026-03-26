import { Package, Truck, CheckCircle, Clock } from "lucide-react";

const steps = [
  { label: "Order Placed", icon: Clock, key: "Processing" },
  { label: "Packed", icon: Package, key: "Packed" },
  { label: "Shipped", icon: Truck, key: "Shipped" },
  { label: "Delivered", icon: CheckCircle, key: "Delivered" },
] as const;

export default function OrderTracker({ status }: { status: string }) {
  const safeStatus = status === "Processing" ? "Processing" : status;
  const currentIndex = Math.max(0, steps.findIndex((s) => s.key === safeStatus));

  return (
    <div className="relative flex items-start justify-between gap-2">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
      <div
        className="absolute top-5 left-0 h-0.5 bg-[#E63946] z-0 transition-all duration-700"
        style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
      />

      {steps.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <div key={step.key} className="relative z-10 flex flex-col items-center gap-2 flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                done ? "bg-[#E63946] text-white" : "bg-gray-100 text-gray-400"
              }`}
            >
              <step.icon size={18} />
            </div>
            <span className={`text-[10px] font-bold tracking-widest text-center ${done ? "text-[#0A0A0A]" : "text-gray-400"}`}>
              {step.label.toUpperCase()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
