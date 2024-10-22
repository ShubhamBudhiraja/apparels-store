export type IconsId =
  | "youtube"
  | "wishlist"
  | "twitter"
  | "person"
  | "instagram"
  | "facebook"
  | "down"
  | "bag";

export type IconsKey =
  | "Youtube"
  | "Wishlist"
  | "Twitter"
  | "Person"
  | "Instagram"
  | "Facebook"
  | "Down"
  | "Bag";

export enum Icons {
  Youtube = "youtube",
  Wishlist = "wishlist",
  Twitter = "twitter",
  Person = "person",
  Instagram = "instagram",
  Facebook = "facebook",
  Down = "down",
  Bag = "bag",
}

export const ICONS_CODEPOINTS: { [key in Icons]: string } = {
  [Icons.Youtube]: "61697",
  [Icons.Wishlist]: "61698",
  [Icons.Twitter]: "61699",
  [Icons.Person]: "61700",
  [Icons.Instagram]: "61701",
  [Icons.Facebook]: "61702",
  [Icons.Down]: "61703",
  [Icons.Bag]: "61704",
};
