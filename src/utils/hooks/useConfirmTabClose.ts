import React from "react";

const confirmationMessage = "You have unsaved changes. Continue?";

const useConfirmTabClose = (isUnsafeTabClose: boolean) => {
  React.useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isUnsafeTabClose) {
        event.preventDefault();
        event.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isUnsafeTabClose]);
};

export default useConfirmTabClose;
