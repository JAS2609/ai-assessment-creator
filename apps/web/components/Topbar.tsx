import { Bell, ChevronDown, ArrowLeft } from "lucide-react";

interface TopBarProps {
  title?: string;
  breadcrumb?: string;
}

export function TopBar({
  title = "Assignment",
  breadcrumb,
}: TopBarProps) {
  return (
    <div className="px-5 py-3 bg-transparent">
      <header
        className="
          h-[56px]
          w-full
          bg-white/100
          rounded-2xl
          px-6 pr-3
          flex
          items-center
          justify-between
        "
         style={{ boxShadow: '0px 4px 12px 0px #0000001A' }}
      >
        
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition">
            <ArrowLeft size={22} className="text-[#555]" />
          </button>

          <div className="flex items-center gap-1 text-[15px]">
            <span className="font-medium text-[#A3A3A3]">
              {title}
            </span>

            {breadcrumb && (
              <>
                <span className="text-[#D4D4D4]">/</span>
                <span className="font-medium text-[#444]">
                  {breadcrumb}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full hover:bg-white transition">
            <Bell size={22} className="text-[#444]" />

            <span
              className="
                absolute
                top-[6px]
                right-[7px]
                w-2.5
                h-2.5
                rounded-full
                bg-[#FF6B3D]
                border-2 border-[#F7F7F7]
              "
            />
          </button>

          <button
            className="
              flex
              items-center
              gap-3
              rounded-full
              px-2
              py-1.5
              hover:bg-white
              transition
            "
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
              <img
                src="/Avatar.png"
                alt="John Doe"
                className="w-full h-full object-cover"
              />
            </div>

            <span className="text-[15px] font-semibold text-[#333]">
              John Doe
            </span>

            <ChevronDown
              size={18}
              className="text-[#555]"
            />
          </button>
        </div>
      </header>
    </div>
  );
}