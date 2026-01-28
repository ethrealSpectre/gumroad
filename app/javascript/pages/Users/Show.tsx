import { usePage } from "@inertiajs/react";
import * as React from "react";
import { cast } from "ts-safe-cast";

import { Profile, Props as ProfileProps } from "$app/components/server-components/Profile";

type Props = ProfileProps & {
  card_data_handling_mode: string;
  paypal_merchant_currency: string;
  custom_styles?: string;
};

export default function UsersShowPage() {
  const props = cast<Props>(usePage().props);

  React.useEffect(() => {
    if (props.custom_styles) {
      const styleElement = document.createElement("style");
      styleElement.id = "custom-seller-styles";
      styleElement.textContent = props.custom_styles;
      document.head.appendChild(styleElement);
      return () => {
        document.getElementById("custom-seller-styles")?.remove();
      };
    }
  }, [props.custom_styles]);

  return <Profile {...props} />;
}

UsersShowPage.loggedInUserLayout = true;
