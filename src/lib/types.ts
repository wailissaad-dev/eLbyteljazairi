export type Locale = "ar" | "fr" | "en";

export type Localized = Record<Locale, string>;

export type CategoryId = "salons" | "tables" | "rooms";

export interface ProductImage {
  src: string;
  caption?: Localized;
}

export interface Product {
  /** stable group id used in the markup (p1…p9, t1…) */
  id: string;
  /** short reference code shown to customers (AY-1, MD-3, …) */
  ref: string;
  slug: string;
  category: CategoryId;
  name: Localized;
  color: Localized;
  images: ProductImage[];
  /** optional listed price in DZD; when set, the card shows it instead of "request price" */
  price?: number;
  /** salons/tables are orderable; rooms are "coming soon" */
  status: "available" | "coming_soon";
}

export interface PackItem {
  label: Localized;
}

export interface Pack {
  id: string;
  name: Localized;
  subtitle: Localized;
  icon: string;
  items: PackItem[];
  highlight: Localized;
  featured?: boolean;
  badge?: Localized;
  /** the plain-text label sent to WhatsApp / stored as the order line */
  orderLabel: Localized;
}

export interface GalleryItem {
  src: string;
  caption: Localized;
}

/* ── site data delivered to the public UI (DB or static) ── */

export interface TableProduct extends Product {
  swatchHex: string;
  icon: string;
  badge?: Localized;
}

export interface RoomItem {
  id: string;
  icon: string;
  name: Localized;
  desc: Localized;
}

export interface SiteSettings {
  whatsappPhone: string;
  phones: { display: string; tel: string }[];
  email: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  addressLocality: string;
  addressRegion: string;
  mapsUrl: string;
}

export interface SiteData {
  salons: Product[];
  tables: TableProduct[];
  rooms: RoomItem[];
  swatch: Record<string, string>;
  packs: Pack[];
  settings: SiteSettings;
}

export interface Fabric {
  src: string;
  caption: Localized;
}

/* ── order / request payloads (shared client ⇄ server) ── */

export interface OrderLine {
  productSlug?: string;
  ref?: string;
  name: string;
  color?: string;
  quantity: number;
  price?: number;
}

export interface OrderPayload {
  fullName: string;
  wilaya: string;
  commune: string;
  address: string;
  phone1: string;
  phone2?: string;
  notes?: string;
  locale: Locale;
  items: OrderLine[];
}

export interface CustomRequestPayload {
  fullName: string;
  phone: string;
  requestType?: string;
  preferredColor?: string;
  details: string;
  locale: Locale;
}

export interface PriceRequestPayload {
  productSlug?: string;
  ref?: string;
  name: string;
  color?: string;
  locale: Locale;
}

export interface ApiResult {
  ok: boolean;
  recordId?: string;
  orderCode?: string;
  whatsappUrl: string;
  /** true when the lead was persisted to Supabase; false = WhatsApp-only fallback */
  saved: boolean;
  message?: string;
}
