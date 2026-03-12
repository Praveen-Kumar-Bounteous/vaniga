import { Link } from "react-router-dom";

interface CategoryCardProps {
  name: string;
  image: string;
}

export default function CategoryCard({ name, image }: CategoryCardProps) {
  return (
    <Link 
      to={`/products?category=${name}`}
      className="group relative h-64 flex items-end overflow-hidden rounded-2xl shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1"
    >
      {/* Background Image */}
      <img 
        src={image} 
        alt={name} 
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      {/* Overlay: Purple Gradient for branding */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative p-6 w-full">
        <h3 className="text-xl font-black italic text-white uppercase tracking-tighter leading-none">
          {name}
        </h3>
        <p className="text-[10px] font-bold text-purple-200 uppercase tracking-[0.2em] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          Explore Collection +
        </p>
      </div>
    </Link>
  );
}