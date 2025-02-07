import SubHeader from "../component/Subheader";
import SubFooter from "../component/SubFooter";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  return (
    <div>
      <SubHeader />
      <div className="protected-content">
        <Outlet />
      </div>
      <SubFooter />
    </div>
  );
};

export default ProtectedLayout;
