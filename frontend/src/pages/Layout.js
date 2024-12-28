  import { Outlet, Link } from "react-router-dom";
  import { useState } from 'react';
  import Offcanvas from 'react-bootstrap/Offcanvas';
  import dayjs from 'dayjs';

  const Layout = () => {
    return (
      <div>
        <Outlet />
      </div>
    )
  };

  export default Layout;  