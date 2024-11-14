export type IconsId =
  | "youtube"
  | "wishlist"
  | "user"
  | "twitter"
  | "tick"
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
  | "cross"
  | "bag"
  | "bag-filled";

export type IconsKey =
  | "Youtube"
  | "Wishlist"
  | "User"
  | "Twitter"
  | "Tick"
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
  | "Cross"
  | "Bag"
  | "BagFilled";

export enum Icons {
  Youtube = "youtube",
  Wishlist = "wishlist",
  User = "user",
  Twitter = "twitter",
  Tick = "tick",
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
  Cross = "cross",
  Bag = "bag",
  BagFilled = "bag-filled",
}

export const ICONS_CODEPOINTS: { [key in Icons]: string } = {
  [Icons.Youtube]: "61697",
  [Icons.Wishlist]: "61698",
  [Icons.User]: "61699",
  [Icons.Twitter]: "61700",
  [Icons.Tick]: "61701",
  [Icons.Search]: "61702",
  [Icons.Right]: "61703",
  [Icons.Person]: "61704",
  [Icons.Logout]: "61705",
  [Icons.Left]: "61706",
  [Icons.Instagram]: "61707",
  [Icons.Heart]: "61708",
  [Icons.HeartFilled]: "61709",
  [Icons.Facebook]: "61710",
  [Icons.Down]: "61711",
  [Icons.Cross]: "61712",
  [Icons.Bag]: "61713",
  [Icons.BagFilled]: "61714",
};
