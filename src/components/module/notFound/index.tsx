import React from "react";
import Link from "next/link";

import Button from "../../ui/button";

const NotFoundComponent = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col justify-center items-center gap-24">
        <h2 className="text-45 font-extrabold text-primary text-center">Error</h2>
        <h5 className="text-24 text-center">#404 - Page not found</h5>
        <Link href="/">
          <Button label="Go Back" className="w-120 font-bold" />
        </Link>
      </div>
    </div>
  );
};

export default NotFoundComponent;
