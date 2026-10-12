import React from "react";
import '../styles/layout.css';

function Layout({children}) {
 return (
        <div>
        <div className="Layout-header">
        <header>
          <p>
            SIGO-GN Unidad 82
          </p>
        </header>
        </div>
        <div className="Layout-content">
        {children} 
        </div>
        </div>
 ); 
}
export default Layout;
