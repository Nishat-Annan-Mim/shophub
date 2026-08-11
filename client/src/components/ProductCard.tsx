// import { Link } from "react-router-dom";
// import type { Product } from "../types";

// export default function ProductCard({ product }: { product: Product }) {
//   return (
//     <Link
//       to={`/products/${product.id}`}
//       className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
//     >
//       <div className="h-40 bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center text-brand-600 text-3xl font-bold">
//         {product.title.charAt(0)}
//       </div>
//       <div className="p-4">
//         <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide">
//           {product.category?.name}
//         </p>
//         <h3 className="mt-1 font-semibold text-slate-900 group-hover:text-brand-700">
//           {product.title}
//         </h3>
//         <div className="mt-2 flex items-center justify-between">
//           <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
//           <span
//             className={`text-xs px-2 py-1 rounded-full ${
//               product.stock > 0
//                 ? "bg-emerald-100 text-emerald-700"
//                 : "bg-red-100 text-red-700"
//             }`}
//           >
//             {product.stock > 0 ? "In stock" : "Out of stock"}
//           </span>
//         </div>
//       </div>
//     </Link>
//   );
// }
import { Link } from "react-router-dom";
import type { Product } from "../types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="h-40 bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center text-brand-600 text-3xl font-bold overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          product.title.charAt(0)
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide">
          {product.category?.name}
        </p>
        <h3 className="mt-1 font-semibold text-slate-900 group-hover:text-brand-700">
          {product.title}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              product.stock > 0
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {product.stock > 0 ? "In stock" : "Out of stock"}
          </span>
        </div>
      </div>
    </Link>
  );
}
