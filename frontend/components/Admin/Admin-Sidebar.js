import { useState } from "react";
import Link from "next/link";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleProductDropdown = () => {
    setProductDropdownOpen(!productDropdownOpen);
  };

  const toggleCategoriesDropdown = () => {
    setCategoriesDropdownOpen(!categoriesDropdownOpen);
  };

  const HomeIcon = () => <span>🏠</span>;
  const StoreIcon = () => <span>🛒</span>;
  const OrdersIcon = () => <span>📦</span>;
  const BalanceIcon = () => <span>💰</span>;
  const SettingsIcon = () => <span>⚙️</span>;
  const ChevronIcon = () => <span>⬇️</span>;
  const MenuIcon = () => <span>🍔</span>;
  const CloseIcon = () => <span>❌</span>;
  const AddProductIcon = () => <span>➕</span>;
  const AddCategoriesIcon = () => <span>📋</span>;
  const SubCategoriesIcon = () => <span>📂</span>;
  const OffersIcon = () => <span>🎁</span>;

  const navItems = [
    { to: "/admin/dashboard", icon: <HomeIcon />, label: "Home" },
    {
      label: "Product",
      icon: <StoreIcon />,
      children: [
        {
          to: "/admin/All-Products",
          label: "All Products",
        },
        {
          to: "/admin/Add-Product",
          label: "Add Product",
          icon: <AddProductIcon />,
        },
      ],
    },
    {
      label: "Categories",
      icon: <StoreIcon />,
      children: [
        {
          to: "/admin/Add-Catagories",
          label: "Add Categories",
          icon: <AddCategoriesIcon />,
        },
        {
          to: "/admin/Sub-Catagories",
          label: "Sub Categories",
          icon: <SubCategoriesIcon />,
        },
      ],
    },
    { to: "/admin/orders", icon: <OrdersIcon />, label: "Orders" },
    // { to: "/admin/EditOffer", icon: <OffersIcon />, label: "Offer" },
    { to: "/admin/AllUsers", label: "AllUsers" },
    // { to: "/user-dashboard/balance", icon: <BalanceIcon />, label: "Balance" },
    { to: "/admin/Contacts", icon: <BalanceIcon />, label: "Contact" },
    // {
    //   to: "/user-dashboard/settings",
    //   icon: <SettingsIcon />,
    //   label: "Settings",
    // },
  ];

  return (
    <aside className="bg-[#f8fafc] col-span-2 h-screen sticky left-0 top-0 overflow-auto p-4 lg:p-5">
      <div className="lg:hidden flex justify-center mb-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 focus:outline-none"
        >
          {isOpen ? (
            <CloseIcon className="text-2xl" />
          ) : (
            <MenuIcon className="text-2xl" />
          )}
        </button>
      </div>
      <div className={`lg:block ${isOpen ? "block" : "hidden"}`}>
        <nav className="flex flex-col gap-2">
          {navItems.map((item, index) => (
            <div key={index}>
              {item.children ? (
                <div>
                  <div
                    className="md:p-3 bg-white rounded-sm border shadow-sm font-semibold text-black transition-all flex gap-2 cursor-pointer"
                    onClick={
                      item.label === "Product"
                        ? toggleProductDropdown
                        : toggleCategoriesDropdown
                    }
                  >
                    <div className="mx-auto md:mx-0 md:truncate md:flex gap-2">
                      <div className="shrink-0">{item.icon}</div>
                      <span className="truncate hidden md:block">
                        {item.label}
                      </span>
                      <div
                        className={`ml-auto transition-transform ${
                          item.label === "Product"
                            ? productDropdownOpen
                              ? "rotate-180"
                              : ""
                            : categoriesDropdownOpen
                            ? "rotate-180"
                            : ""
                        }`}
                      >
                        <ChevronIcon />
                      </div>
                    </div>
                  </div>
                  {item.label === "Product" && productDropdownOpen && (
                    <div className="ml-4 mt-2">
                      {item.children.map((child, childIndex) => (
                        <Link key={childIndex} href={child.to}>
                          <div className="md:p-3 bg-gray-100 rounded-sm border shadow-sm font-semibold text-black transition-all flex gap-2 cursor-pointer">
                            <div className="mx-auto md:mx-0 md:truncate md:flex gap-2">
                              <div className="shrink-0">{child.icon}</div>
                              <span className="truncate hidden md:block">
                                {child.label}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {item.label === "Categories" && categoriesDropdownOpen && (
                    <div className="ml-4 mt-2">
                      {item.children.map((child, childIndex) => (
                        <Link key={childIndex} href={child.to}>
                          <div className="md:p-3 bg-gray-100 rounded-sm border shadow-sm font-semibold text-black transition-all flex gap-2 cursor-pointer">
                            <div className="mx-auto md:mx-0 md:truncate md:flex gap-2">
                              <div className="shrink-0">{child.icon}</div>
                              <span className="truncate hidden md:block">
                                {child.label}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link href={item.to}>
                  <div className="md:p-3 bg-white rounded-sm border shadow-sm font-semibold text-black transition-all flex gap-2 cursor-pointer">
                    <div className="mx-auto md:mx-0 md:truncate md:flex gap-2">
                      <div className="shrink-0">{item.icon}</div>
                      <span className="truncate hidden md:block">
                        {item.label}
                      </span>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
