const NAV_ITEMS = [
  { id: 'hero',            label: 'Top' },
  { id: 'product-info',   label: 'Info' },
  { id: 'mouthfeels',     label: 'Taste' },
  { id: 'flavor-notes',   label: 'Flavor' },
  { id: 'availability',   label: 'Buy' },
  { id: 'recipes',        label: 'Pairs' },
  { id: 'recommendations',label: 'More' },
];

const SidebarNav = ({ activeSection }) => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="sidebar-nav" aria-label="Page sections">
      {NAV_ITEMS.map(({ id, label }) => (
        <button
          key={id}
          id={`nav-${id}`}
          className={`sidebar-nav__dot ${activeSection === id ? 'active' : ''}`}
          data-label={label}
          onClick={() => scrollTo(id)}
          aria-label={`Jump to ${label} section`}
        />
      ))}
    </nav>
  );
};

export default SidebarNav;
