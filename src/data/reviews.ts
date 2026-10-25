// Add reviews here only from real buyers, with their permission (a WhatsApp
// message or photo is enough). Invented reviews are an unfair trade practice
// under the Consumer Protection Act, and the first sceptical customer who
// checks will tell everyone. The section shows an invitation while this is empty.

export type Review = {
  name: string;
  place: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** e.g. "Bought 3 pods". Shown under the name. */
  purchase: string;
};

export const reviews: Review[] = [];
