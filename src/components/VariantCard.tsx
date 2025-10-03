/**
 * Helper to safely extract and format price values.
 */
function formatPrice(tp: any) {
  if (!tp) return {};
  return {
    cur: tp.currency,
    orig: tp.total_price,
    newP: tp.discounted_price,
  };
}

export default function VariantCard({ variant }: { variant: any }) {
  const tp = formatPrice(variant.total_price);

  // Calculate discount percentage if original & discounted prices exist
  const discountPct =
    tp.orig && tp.newP ? Math.round((1 - tp.newP / tp.orig) * 100) : null;

  return (
    <div className="variant-card">
      {/* Left side: Variant details */}
      <div className="variant-left">
        <div className="variant-title">{variant.name}</div>
        
        {/* Render extra properties like meals, bed type, occupancy */}
        {variant.display_properties?.map((prop: any) => (
          <div key={prop.name} className="variant-sub">
            {prop.value}
          </div>
        ))}
      </div>

      {/* Right side: Price & actions */}
      <div className="variant-right">
        <div className="price-line">
          {tp.orig && (
            <span className="orig">
              {tp.cur} {tp.orig}
            </span>
          )}
          {tp.newP && (
            <span className="new">
              {tp.cur} {tp.newP}
            </span>
          )}
        </div>

        {/* Discount badge */}
        {discountPct && <div className="badge">{discountPct}% off</div>}

        {/* Action button */}
        <button className="select-btn">Select</button>
      </div>
    </div>
  );
}
