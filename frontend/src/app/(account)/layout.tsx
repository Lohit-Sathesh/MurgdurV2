export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-6 py-section md:grid-cols-[220px_1fr]">
      <nav className="grid h-fit gap-3 border-r border-mist pr-6 text-sm uppercase tracking-[0.18em]">
        <a href="/profile">Profile</a>
        <a href="/orders">Orders</a>
        <a href="/wishlist">Wishlist</a>
        <a href="/addresses">Addresses</a>
      </nav>
      <div>{children}</div>
    </div>
  );
}
