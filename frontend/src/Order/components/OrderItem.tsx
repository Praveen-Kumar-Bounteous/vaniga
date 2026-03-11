export default function OrderItem({ item }: any) {
  const formatINR = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(p);

  return (
    <div className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0">
      <div className="space-y-1">
        <p className="font-black italic uppercase text-slate-800 tracking-tighter">{item.name}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase">Quantity: {item.quantity}</p>
      </div>
      <div className="text-right">
        <p className="font-black italic text-primary">{formatINR(item.price)}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase">Each</p>
      </div>
    </div>
  );
}