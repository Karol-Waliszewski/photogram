import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/Avatar";
import { H1, Large } from "@/components/atoms/Typography";

import { Layout } from "@/views/Layout";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
  const { data: sessionData } = useSession();

  return (
    <Layout className="pt-10">
      <H1>Profile</H1>
      {sessionData?.user && (
        <div className="mt-8 flex flex-row items-center gap-4">
          {sessionData.user.image && (
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={sessionData?.user.image}
                alt={sessionData?.user.name ?? ""}
              />
              <AvatarFallback />
            </Avatar>
          )}
          <Large>
            {sessionData.user.name} ({sessionData.user.email})
          </Large>
        </div>
      )}
    </Layout>
  );
};

export default ProfilePage;
