export type IconsId =
  | "youtube"
  | "wishlist"
  | "wallet"
  | "user"
  | "twitter"
  | "tick"
  | "star"
  | "star-solid"
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
  | "calendar-days"
  | "bag"
  | "bag-filled"
  | "arrow-right"
  | "arrow-left";

export type IconsKey =
  | "Youtube"
  | "Wishlist"
  | "Wallet"
  | "User"
  | "Twitter"
  | "Tick"
  | "Star"
  | "StarSolid"
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
  | "CalendarDays"
  | "Bag"
  | "BagFilled"
  | "ArrowRight"
  | "ArrowLeft";

export enum Icons {
  Youtube = "youtube",
  Wishlist = "wishlist",
  Wallet = "wallet",
  User = "user",
  Twitter = "twitter",
  Tick = "tick",
  Star = "star",
  StarSolid = "star-solid",
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
  CalendarDays = "calendar-days",
  Bag = "bag",
  BagFilled = "bag-filled",
  ArrowRight = "arrow-right",
  ArrowLeft = "arrow-left",
}

export const ICONS_CODEPOINTS: { [key in Icons]: string } = {
  [Icons.Youtube]: "61697",
  [Icons.Wishlist]: "61698",
  [Icons.Wallet]: "61699",
  [Icons.User]: "61700",
  [Icons.Twitter]: "61701",
  [Icons.Tick]: "61702",
  [Icons.Star]: "61703",
  [Icons.StarSolid]: "61704",
  [Icons.StarHalf]: "61705",
  [Icons.StarFilled]: "61706",
  [Icons.Search]: "61707",
  [Icons.Right]: "61708",
  [Icons.Replace]: "61709",
  [Icons.Person]: "61710",
  [Icons.Logout]: "61711",
  [Icons.Left]: "61712",
  [Icons.Instagram]: "61713",
  [Icons.Heart]: "61714",
  [Icons.HeartFilled]: "61715",
  [Icons.Facebook]: "61716",
  [Icons.Eye]: "61717",
  [Icons.EyeSlash]: "61718",
  [Icons.Down]: "61719",
  [Icons.Delivery]: "61720",
  [Icons.Delete]: "61721",
  [Icons.Cross]: "61722",
  [Icons.Copy]: "61723",
  [Icons.CalendarDays]: "61724",
  [Icons.Bag]: "61725",
  [Icons.BagFilled]: "61726",
  [Icons.ArrowRight]: "61727",
  [Icons.ArrowLeft]: "61728",
};
