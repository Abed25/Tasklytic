import { Outlet, useLocation } from "react-router-dom";
import SubHeader from "../component/Subheader";
import SubFooter from "../component/SubFooter";

const ProtectedLayout = () => {
  const location = useLocation();

  return (
    <div>
      {/* Only show SubHeader if not on /home */}
      {location.pathname !== "/home" && <SubHeader />}

      <div className="protected-content">
        <Outlet />
      </div>

      {location.pathname !== "/home" && <SubFooter />}
    </div>
  );
};

export default ProtectedLayout;
