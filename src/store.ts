import { atom } from "jotai";

import { type Post } from "@prisma/client";

export const postToBeDeletedIdAtom = atom<Post["id"] | null>(null);

export const isPostCreateDialogOpenAtom = atom(false);
export const isPostDeleteDialogOpenAtom = atom(
  (get) => !!get(postToBeDeletedIdAtom),
);
