import { Head, usePage } from "@inertiajs/react";
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

  return (
    <>
      {props.custom_styles ? (
        <Head>
          <style type="text/css">{props.custom_styles}</style>
        </Head>
      ) : null}
      <Profile {...props} />
    </>
  );
}

UsersShowPage.loggedInUserLayout = true;
