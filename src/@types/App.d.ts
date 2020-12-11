type signedInUser = {
  email: string;
  uid: string;
};

type RootStackParamList = {
  Chat: { user: signedInUser };
  SignIn: undefined;
  SignUp: { user: signedUpUser };
  Register: undefined;
};

type Message = {
  text: string;
  createdAt: firebase.firestore.Timestamp;
  userId: string;
};

declare module "*.png";

type Users = {
  name: string;
  createdAt: firebase.firestore.Timestamp;
  userId: string;
};

type signedUpUser = {
  name: string;
  uid: string;
};

