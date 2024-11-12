export type IconsId =
  | "youtube"
  | "wishlist"
  | "user"
  | "twitter"
  | "search"
  | "right"
  | "person"
  | "logout"
  | "left"
  | "instagram"
  | "heart"
  | "heart-filled"
  | "facebook"
  | "down"
  | "bag"
  | "bag-filled";

export type IconsKey =
  | "Youtube"
  | "Wishlist"
  | "User"
  | "Twitter"
  | "Search"
  | "Right"
  | "Person"
  | "Logout"
  | "Left"
  | "Instagram"
  | "Heart"
  | "HeartFilled"
  | "Facebook"
  | "Down"
  | "Bag"
  | "BagFilled";

export enum Icons {
  Youtube = "youtube",
  Wishlist = "wishlist",
  User = "user",
  Twitter = "twitter",
  Search = "search",
  Right = "right",
  Person = "person",
  Logout = "logout",
  Left = "left",
  Instagram = "instagram",
  Heart = "heart",
  HeartFilled = "heart-filled",
  Facebook = "facebook",
  Down = "down",
  Bag = "bag",
  BagFilled = "bag-filled",
}

export const ICONS_CODEPOINTS: { [key in Icons]: string } = {
  [Icons.Youtube]: "61697",
  [Icons.Wishlist]: "61698",
  [Icons.User]: "61699",
  [Icons.Twitter]: "61700",
  [Icons.Search]: "61701",
  [Icons.Right]: "61702",
  [Icons.Person]: "61703",
  [Icons.Logout]: "61704",
  [Icons.Left]: "61705",
  [Icons.Instagram]: "61706",
  [Icons.Heart]: "61707",
  [Icons.HeartFilled]: "61708",
  [Icons.Facebook]: "61709",
  [Icons.Down]: "61710",
  [Icons.Bag]: "61711",
  [Icons.BagFilled]: "61712",
};
