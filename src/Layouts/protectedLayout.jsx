import { Outlet, useLocation } from "react-router-dom";
import SubHeader from "../component/Subheader";
import SubFooter from "../component/SubFooter";
import BottomNav from "../component/BottomNav";
import { useState, useEffect } from "react";

const ProtectedLayout = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {/* Only show SubHeader if not on /home */}
      {location.pathname !== "/home" && <SubHeader />}

      <div className="protected-content">
        <Outlet />
      </div>

      {location.pathname !== "/home" && <SubFooter />}
      {isMobile && <BottomNav />}
    </div>
  );
};

export default ProtectedLayout;
