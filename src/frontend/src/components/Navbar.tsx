import { ChevronLeft, ChevronRight } from "lucide-react";

const Navbar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <header className="border-b border-gray-700 fixed w-full top-0 z-40 backdrop-blur-lg bg-bar-dark text-white">
      <div className="max-w mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-white hover:text-gray-400 transition-all"
            >
              {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
            </button>
            <span className="text-xl font-bold">Fraktal</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
