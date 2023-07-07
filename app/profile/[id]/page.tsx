import { UserProfile } from "@/common.types";
import { ProfilePage } from "@/components/ProfilePage";
import { getUserProject } from "@/lib/actions";

type Props = {
  params: {
    id: string;
  };
};

export default async function UserProfile({ params }: Props) {
  const result = (await getUserProject(params.id, 100)) as {
    user: UserProfile;
  };

  if (!result) return <p>Failed to fetch user info</p>;

  return <ProfilePage user={result?.user} />;
}
