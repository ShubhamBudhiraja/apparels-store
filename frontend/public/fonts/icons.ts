export type IconsId =
  | "youtube"
  | "wishlist"
  | "wallet"
  | "user"
  | "twitter"
  | "tick"
  | "star"
  | "star-half"
  | "star-filled"
  | "search"
  | "right"
  | "replace"
  | "person"
  | "logout"
  | "left"
  | "instagram"
  | "heart"
  | "heart-filled"
  | "facebook"
  | "eye"
  | "eye-slash"
  | "down"
  | "delivery"
  | "delete"
  | "cross"
  | "copy"
  | "bag"
  | "bag-filled";

export type IconsKey =
  | "Youtube"
  | "Wishlist"
  | "Wallet"
  | "User"
  | "Twitter"
  | "Tick"
  | "Star"
  | "StarHalf"
  | "StarFilled"
  | "Search"
  | "Right"
  | "Replace"
  | "Person"
  | "Logout"
  | "Left"
  | "Instagram"
  | "Heart"
  | "HeartFilled"
  | "Facebook"
  | "Eye"
  | "EyeSlash"
  | "Down"
  | "Delivery"
  | "Delete"
  | "Cross"
  | "Copy"
  | "Bag"
  | "BagFilled";

export enum Icons {
  Youtube = "youtube",
  Wishlist = "wishlist",
  Wallet = "wallet",
  User = "user",
  Twitter = "twitter",
  Tick = "tick",
  Star = "star",
  StarHalf = "star-half",
  StarFilled = "star-filled",
  Search = "search",
  Right = "right",
  Replace = "replace",
  Person = "person",
  Logout = "logout",
  Left = "left",
  Instagram = "instagram",
  Heart = "heart",
  HeartFilled = "heart-filled",
  Facebook = "facebook",
  Eye = "eye",
  EyeSlash = "eye-slash",
  Down = "down",
  Delivery = "delivery",
  Delete = "delete",
  Cross = "cross",
  Copy = "copy",
  Bag = "bag",
  BagFilled = "bag-filled",
}

export const ICONS_CODEPOINTS: { [key in Icons]: string } = {
  [Icons.Youtube]: "61697",
  [Icons.Wishlist]: "61698",
  [Icons.Wallet]: "61699",
  [Icons.User]: "61700",
  [Icons.Twitter]: "61701",
  [Icons.Tick]: "61702",
  [Icons.Star]: "61703",
  [Icons.StarHalf]: "61704",
  [Icons.StarFilled]: "61705",
  [Icons.Search]: "61706",
  [Icons.Right]: "61707",
  [Icons.Replace]: "61708",
  [Icons.Person]: "61709",
  [Icons.Logout]: "61710",
  [Icons.Left]: "61711",
  [Icons.Instagram]: "61712",
  [Icons.Heart]: "61713",
  [Icons.HeartFilled]: "61714",
  [Icons.Facebook]: "61715",
  [Icons.Eye]: "61716",
  [Icons.EyeSlash]: "61717",
  [Icons.Down]: "61718",
  [Icons.Delivery]: "61719",
  [Icons.Delete]: "61720",
  [Icons.Cross]: "61721",
  [Icons.Copy]: "61722",
  [Icons.Bag]: "61723",
  [Icons.BagFilled]: "61724",
};
