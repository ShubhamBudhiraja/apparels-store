export type IconsId =
  | "youtube"
  | "wishlist"
  | "user"
  | "twitter"
  | "search"
  | "right"
  | "person"
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
  [Icons.Left]: "61704",
  [Icons.Instagram]: "61705",
  [Icons.Heart]: "61706",
  [Icons.HeartFilled]: "61707",
  [Icons.Facebook]: "61708",
  [Icons.Down]: "61709",
  [Icons.Bag]: "61710",
  [Icons.BagFilled]: "61711",
};
