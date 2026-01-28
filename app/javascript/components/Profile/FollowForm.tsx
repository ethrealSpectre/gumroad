import cx from "classnames";
import * as React from "react";

import { CreatorProfile } from "$app/parsers/profile";
import { classNames } from "$app/utils/classNames";
import { isValidEmail } from "$app/utils/email";
import { assertResponseError, request } from "$app/utils/request";

import { Button } from "$app/components/Button";
import { ButtonColor } from "$app/components/design";
import { useLoggedInUser } from "$app/components/LoggedInUser";
import { showAlert } from "$app/components/server-components/Alert";

export const FollowForm = ({
  creatorProfile,
  buttonColor,
  buttonLabel,
}: {
  creatorProfile: CreatorProfile;
  buttonColor?: ButtonColor;
  buttonLabel?: string;
}) => {
  const loggedInUser = useLoggedInUser();
  const isOwnProfile = loggedInUser?.id === creatorProfile.external_id;
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const [email, setEmail] = React.useState(isOwnProfile ? "" : (loggedInUser?.email ?? ""));
  const [isInvalid, setIsInvalid] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  React.useEffect(() => setIsInvalid(false), [email]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      emailInputRef.current?.focus();
      setIsInvalid(true);
      showAlert(
        email.trim() === "" ? "Please enter your email address." : "Please enter a valid email address.",
        "error",
      );
      return;
    }

    if (isOwnProfile) {
      showAlert("As the creator of this profile, you can't follow yourself!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await request({
        method: "POST",
        accept: "json",
        url: Routes.follow_user_path(),
        data: { email, seller_id: creatorProfile.external_id },
      });
      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        showAlert(result.message, "success");
      } else {
        showAlert(result.message || "Sorry, something went wrong. Please try again.", "error");
      }
    } catch (e) {
      assertResponseError(e);
      showAlert("Sorry, something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => void submit(e)} style={{ flexGrow: 1 }} noValidate>
      <fieldset className={cx({ danger: isInvalid })}>
        <div className="flex gap-2">
          <input
            ref={emailInputRef}
            type="email"
            value={email}
            className="flex-1"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
          />
          <Button color={buttonColor} disabled={isSubmitting || isSuccess} type="submit">
            {buttonLabel && buttonLabel !== "Subscribe"
              ? buttonLabel
              : isSuccess
                ? "Subscribed"
                : isSubmitting
                  ? "Subscribing..."
                  : "Subscribe"}
          </Button>
        </div>
      </fieldset>
    </form>
  );
};

export const FollowFormBlock = ({
  creatorProfile,
  className,
}: {
  creatorProfile: CreatorProfile;
  className?: string;
}) => (
  <div className={classNames("flex grow flex-col justify-center", className)}>
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
      <h1>Subscribe to receive email updates from {creatorProfile.name}.</h1>
      <div className="max-w-lg">
        <FollowForm creatorProfile={creatorProfile} buttonColor="primary" />
      </div>
    </div>
  </div>
);
