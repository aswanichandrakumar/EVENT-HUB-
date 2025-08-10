import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

export interface BackButtonProps extends ButtonProps {
  /**
   * When there is no history to go back to, navigate to this path
   * instead. Defaults to "/".
   */
  fallbackPath?: string;
  /** Hide the leading arrow icon */
  hideIcon?: boolean;
}

const BackButton = React.forwardRef<HTMLButtonElement, BackButtonProps>(
  (
    { children, className, onClick, fallbackPath = "/", hideIcon = false, ...rest },
    ref,
  ) => {
    const navigate = useNavigate();

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
      // Allow consumer handlers to run first
      onClick?.(event);
      if (event.defaultPrevented) return;

      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate(fallbackPath);
      }
    };

    return (
      <Button ref={ref} onClick={handleClick} className={className} {...rest}>
        {!hideIcon && <ArrowLeft className="mr-2" />}
        {children ?? "Go back"}
      </Button>
    );
  },
);

BackButton.displayName = "BackButton";

export default BackButton;


