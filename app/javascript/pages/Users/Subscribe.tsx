import { Head, usePage } from "@inertiajs/react";
import * as React from "react";
import { cast } from "ts-safe-cast";

import { CreatorProfile } from "$app/parsers/profile";
import { FollowFormBlockInertia } from "$app/components/Profile/FollowFormInertia";
import { Layout } from "$app/components/Profile/Layout";

type Props = {
  creator_profile: CreatorProfile;
  custom_styles?: string;
};

export default function UsersSubscribePage() {
  const { creator_profile, custom_styles } = cast<Props>(usePage().props);
  return (
    <>
      {custom_styles ? (
        <Head>
          <style type="text/css">{custom_styles}</style>
        </Head>
      ) : null}
      <Layout hideFollowForm creatorProfile={creator_profile}>
        <FollowFormBlockInertia creatorProfile={creator_profile} className="px-4" />
      </Layout>
    </>
  );
}

UsersSubscribePage.loggedInUserLayout = true;
