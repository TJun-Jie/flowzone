import Profile from "./profile";

export type ProfilePage = {};

const ProfilePage: React.FC = () => {
  return (
    <div className="flex flex-col w-full items-center mt-5">
      <h1>User Profile</h1>
      <Profile />
    </div>
  );
};

export default ProfilePage;