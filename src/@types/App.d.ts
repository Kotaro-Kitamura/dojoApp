type signedInUser = {
  email: string;
  uid: string;
};

type RootStackParamList = {
  Chat: undefined;
  SignIn: undefined;
  SignUp: { user: signedUpUser };
  Register: { user: signedInUser };
};

type Message = {
  text: string;
  createdAt: firebase.firestore.Timestamp;
  userId: string;
};

declare module "*.png";

type signedUpUser = {
  email: string;
  uid: string;
};

type RegisteredUser = {
  name: string;
  uid: string;
};
