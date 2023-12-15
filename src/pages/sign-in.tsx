import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import {
  type ClientSafeProvider,
  type LiteralUnion,
  getProviders,
} from "next-auth/react";
import { type BuiltInProviderType } from "next-auth/providers/index";

import { H3, Muted, Small, Text } from "@/components/atoms/Typography";

import { Logo } from "@/components/molecules/Logo";

import { UserAuthForm } from "@/components/organisms/AuthForm";

import { values } from "@/utils/object";
import { getServerAuthSession } from "@/server/auth";

const SignInPage = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="container relative grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted bg-zinc-900 p-10 text-white dark:border-r lg:flex">
        <Logo className="relative z-20" />
        <div className="relative z-20 mt-auto">
          <blockquote>
            <Text className="mb-2">&ldquo;TODO: Some quote&rdquo;</Text>
            <Small>Karol Waliszewski</Small>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <H3>Welcome on Photogram</H3>
            <Muted>Use one of provided platform to access the app</Muted>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Platforms
              </span>
            </div>
          </div>

          <UserAuthForm providers={values(providers)} />
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: {
      providers:
        providers ??
        ({} as Record<
          LiteralUnion<BuiltInProviderType, string>,
          ClientSafeProvider
        >),
    },
  };
}

export default SignInPage;
