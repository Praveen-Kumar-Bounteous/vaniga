import { Badge } from "@/components/ui/badge";

interface Props { status: string }

export default function OrderStatusBadge({ status }: Props) {
  const variants: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
    SHIPPED: "bg-purple-100 text-purple-700 border-purple-200",
    DELIVERED: "bg-green-100 text-green-700 border-green-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <Badge className={`${variants[status] || "bg-slate-100"} px-3 py-1 rounded-full uppercase text-[10px] font-black italic border`}>
      {status}
    </Badge>
  );
}