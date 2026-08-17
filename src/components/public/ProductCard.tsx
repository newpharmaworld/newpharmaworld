import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowRight, Pill } from 'lucide-react';
import { Product } from '../../types';
import { Badge } from '../common/Badge';
import { useSite } from '../../context/SiteContext';
import { getWhatsAppUrl, getProductWhatsAppMessage } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onEnquire?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEnquire }) => {
  const { settings } = useSite();

  const getAvailabilityBadgeVariant = (status: Product['availability']) => {
    switch (status) {
      case 'In Stock':
        return 'emerald';
      case 'Available on Order':
        return 'teal';
      case 'Limited Stock':
        return 'amber';
      case 'Out of Stock':
      default:
        return 'red';
    }
  };

  const whatsappMessage = getProductWhatsAppMessage(product.name, product.genericName);
  const whatsappUrl = getWhatsAppUrl(settings.whatsapp, whatsappMessage);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-teal-400 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group h-full">
      <div>
        {/* Product Image Area */}
        <div className="relative h-48 bg-slate-50 overflow-hidden flex items-center justify-center p-4 border-b border-slate-100">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop'}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=600&auto=format&fit=crop';
            }}
          />

          {/* Availability Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant={getAvailabilityBadgeVariant(product.availability)} size="sm">
              {product.availability}
            </Badge>
          </div>

          {/* Category Tag */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="navy" size="sm">
              {product.category}
            </Badge>
          </div>
        </div>

        {/* Product Meta */}
        <div className="p-5 space-y-2.5">
          <div className="text-xs font-semibold text-teal-700 uppercase tracking-wide">
            {product.brand}
          </div>

          <Link to={`/products/${product.id}`} className="block group-hover:text-teal-700 transition-colors">
            <h3 className="text-base font-bold text-navy-900 font-display line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Pill className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="font-medium text-slate-700 truncate">
              {product.genericName}
            </span>
          </div>

          {product.dosageForm && (
            <p className="text-xs text-slate-500">
              Form: <span className="text-slate-700">{product.dosageForm}</span>
              {product.strength && <span> • {product.strength}</span>}
            </p>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0 flex items-center gap-2">
        <Link
          to={`/products/${product.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-navy-900 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-all flex items-center justify-center"
          title="WhatsApp Enquiry"
          aria-label={`WhatsApp Enquiry for ${product.name}`}
        >
          <MessageSquare className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
