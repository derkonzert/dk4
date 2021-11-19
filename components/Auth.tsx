import { SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useTranslation } from "../lib/TranslationContextProvider";
import { styled } from "../stitches.config";
import { Button } from "./Button";
import { Flex } from "./Flex";
import {
  FloatingPanelContent,
  FloatingPanelList,
  FloatingPanelTabs,
  FloatingPanelTrigger,
} from "./FloatingPanel";
import { Input } from "./Input";
import { Label } from "./Label";
import { Loader } from "./Loader";
import { Separator } from "./Separator";
import { TypoText } from "./Typo";

const AuthLink = styled("a", {
  display: "block",
  textAlign: "center",
  paddingBlock: "$1",
  color: "$text",
});

interface AuthProps {
  action: string | string[];
  supabaseClient: SupabaseClient;
}

function Auth(props: AuthProps) {
  const router = useRouter();
  const { supabaseClient, action } = props;
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabaseClient.auth.signIn(
      {
        email,
        password,
      },
      { redirectTo: document.location.origin }
    );
    if (signInError) setError(signInError.message);

    setLoading(false);
  };
  const handleSignInWithGoogle = async (e) => {
    setError("");
    setLoading(true);

    const { error: signInError } = await supabaseClient.auth.signIn(
      {
        provider: "google",
      },
      { redirectTo: document.location.origin }
    );
    if (signInError) setError(signInError.message);

    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signUpError } = await supabaseClient.auth.signUp(
      {
        email,
        password,
      },
      { redirectTo: document.location.origin }
    );
    if (signUpError) setError(signUpError.message);

    setLoading(false);
  };

  const handleSignUpWithGoogle = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signUpError } = await supabaseClient.auth.signIn(
      {
        provider: "google",
      },
      { redirectTo: document.location.origin }
    );
    if (signUpError) setError(signUpError.message);

    setLoading(false);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const { error } = await supabaseClient.auth.api.resetPasswordForEmail(
      email,
      { redirectTo: document.location.origin }
    );
    if (error) setError(error.message);
    else setMessage("Check your email for the password reset link");
    setLoading(false);
  };

  const handleMagicLinkSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const { error } = await supabaseClient.auth.signIn(
      { email },
      { redirectTo: document.location.origin }
    );
    if (error) setError(error.message);
    else setMessage("Check your email for the magic link");
    setLoading(false);
  };

  return (
    <>
      {loading && <h3>Loading..</h3>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {message && <div style={{ color: "green" }}>{message}</div>}

      {(action === "sign-in" || action === "sign-up") && (
        <FloatingPanelTabs
          value={action}
          onValueChange={(newAction) =>
            router.replace(`/account/${newAction}`, `/account/${newAction}`, {
              shallow: true,
            })
          }
        >
          <FloatingPanelList aria-label="tabs">
            <FloatingPanelTrigger value="sign-in">
              {t("auth.action.signIn")}
            </FloatingPanelTrigger>
            <FloatingPanelTrigger value="sign-up">
              {t("auth.action.signUp")}
            </FloatingPanelTrigger>
          </FloatingPanelList>

          <FloatingPanelContent value="sign-in">
            <Flex direction="column" gap="5">
              <form onSubmit={(e) => handleSignIn(e)}>
                <Flex direction="column" gap="3">
                  <Flex direction="column" gap="1">
                    <Label htmlFor="sign-in__email">
                      {t("auth.input.email.label")}
                    </Label>
                    <Input
                      id="sign-in__email"
                      title={t("auth.input.email.label")}
                      autoComplete="email"
                      placeholder={t("auth.input.email.placeholder")}
                      defaultValue={email}
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Label htmlFor="sign-in__password">
                      {t("auth.input.password.label")}
                    </Label>
                    <Input
                      id="sign-in__password"
                      title={t("auth.input.email.label")}
                      type="password"
                      defaultValue={password}
                      autoComplete="current-password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Flex>
                  <Button type="submit">{t("auth.action.signIn")}</Button>
                  <Flex gap="3" align="center">
                    <Separator decorative />
                    <TypoText css={{ color: "$slate10" }}>
                      {t("global.or")}
                    </TypoText>
                    <Separator decorative />
                  </Flex>
                  <Button type="button" onClick={handleSignInWithGoogle}>
                    {t("auth.action.withGoogle")}
                  </Button>
                </Flex>
              </form>
              <Flex direction="column" gap="1">
                <Link href="/account/magic-link" passHref>
                  <Button as="a" variant="ghost">
                    {t("auth.action.magicLink")}
                  </Button>
                </Link>
                <Link href="/account/forgotten-password" passHref>
                  <Button as="a" variant="ghost">
                    {t("auth.action.forgotPassword")}
                  </Button>
                </Link>
              </Flex>
            </Flex>
          </FloatingPanelContent>
          <FloatingPanelContent value="sign-up">
            <form onSubmit={(e) => handleSignUp(e)}>
              <Flex direction="column" gap="3">
                <Flex direction="column" gap="1">
                  <Label htmlFor="sign-up__email">
                    {t("auth.input.email.label")}
                  </Label>
                  <Input
                    id="sign-up__email"
                    title={t("auth.input.email.label")}
                    type="email"
                    autoComplete="email"
                    placeholder={t("auth.input.email.placeholder")}
                    defaultValue={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Flex>

                <Flex direction="column" gap="1">
                  <Label htmlFor="sign-up__password">
                    {t("auth.input.password.label")}
                  </Label>
                  <Input
                    id="sign-up__password"
                    title={t("auth.input.password.label")}
                    type="password"
                    defaultValue={password}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Flex>
                <Button type="submit">{t("auth.action.signUp")}</Button>
                <Flex gap="3" align="center">
                  <Separator decorative />
                  <TypoText css={{ color: "$slate10" }}>or</TypoText>
                  <Separator decorative />
                </Flex>
                <Button type="button" onClick={handleSignUpWithGoogle}>
                  {t("auth.action.withGoogle")}
                </Button>
              </Flex>
            </form>
          </FloatingPanelContent>
        </FloatingPanelTabs>
      )}

      {action === "forgotten-password" && (
        <Flex direction="column" gap="5">
          <form onSubmit={handlePasswordReset}>
            <Flex direction="column" gap="3">
              <Flex direction="column" gap="1">
                <Label htmlFor="forgotten_password__email">
                  {t("auth.input.email.label")}
                </Label>
                <Input
                  id="forgotten_password__email"
                  title={t("auth.input.email.label")}
                  type="email"
                  autoComplete="email"
                  placeholder={t("auth.input.email.placeholder")}
                  defaultValue={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Flex>
              <Button type="submit">
                {t("auth.action.sendPasswordReset")}
              </Button>
            </Flex>
          </form>

          <Flex direction="column" gap="1">
            <Link href="/account/magic-link" passHref>
              <AuthLink>{t("auth.action.magicLink")}</AuthLink>
            </Link>
          </Flex>
        </Flex>
      )}

      {action === "magic-link" && (
        <Flex direction="column" gap="5">
          <form onSubmit={handleMagicLinkSignIn}>
            <Flex direction="column" gap="3">
              <Flex direction="column" gap="1">
                <Label>{t("auth.input.email.label")}</Label>
                <Input
                  title={t("auth.input.email.label")}
                  autoComplete="email"
                  type="email"
                  placeholder={t("auth.input.email.placeholder")}
                  defaultValue={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Flex>
              <Button type="submit">{t("auth.action.sendMagicLink")}</Button>
            </Flex>
          </form>
        </Flex>
      )}
    </>
  );
}

function UpdatePassword({ supabaseClient }) {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const { error } = await supabaseClient.auth.update({ password });
    if (error) setError(error.message);
    else setMessage("Your password has been updated");
    setLoading(false);
  };

  return (
    <>
      {loading && <Loader />}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {message && <div style={{ color: "green" }}>{message}</div>}
      <form onSubmit={handlePasswordReset}>
        <Flex gap="5" direction="column">
          <Flex direction="column" gap="1">
            <Label htmlFor="update-password__pw">
              {t("auth.input.newPassword.label")}
            </Label>

            <Input
              id="update-password__pw"
              title={t("auth.input.newPassword.label")}
              placeholder={t("auth.input.newPassword.placeholder")}
              type="password"
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Flex>

          <Button type="submit">{t("auth.action.updatePassword")}</Button>
        </Flex>
      </form>
    </>
  );
}

Auth.UpdatePassword = UpdatePassword;
export default Auth;
