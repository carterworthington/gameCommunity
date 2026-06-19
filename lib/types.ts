// Database types
export type User = {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Console = {
  id: string;
  name: string;
};

export type Game = {
  id: string;
  igdbId?: number;
  title: string;
  coverImage?: string;
  genre?: string;
  platforms?: string;
};

export type UserGame = {
  id: string;
  userId: string;
  gameId: string;
  consoleId: string;
  addedAt: Date;
};

export type AvailabilityStatus = {
  id: string;
  userId: string;
  status: "available" | "away" | "offline";
  consoles: string; // JSON array of console IDs
  updatedAt: Date;
};

export type Friend = {
  id: string;
  userId: string;
  friendId: string;
  createdAt: Date;
};

export type FriendRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  status: "pending" | "accepted" | "rejected" | "blocked";
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithRelations = User & {
  games?: (UserGame & { game: Game; console: Console })[];
  availabilityStatus?: AvailabilityStatus;
  friends?: Friend[];
};
