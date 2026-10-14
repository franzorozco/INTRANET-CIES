import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-groups/web";
import type { WebPartContext } from "@microsoft/sp-webpart-base";

let _sp: ReturnType<typeof spfi> | undefined;

export const getSP = (context?: WebPartContext): ReturnType<typeof spfi> => {
  if (!_sp && context) {
    _sp = spfi().using(SPFx(context));
  }

  if (!_sp) {
    throw new Error("El cliente de SharePoint no ha sido inicializado. Llama a getSP(context) desde el Web Part primero.");
  }

  return _sp;
};

export const getUserRoles = async (): Promise<string[]> => {
  const sp = getSP();
  const groups = await sp.web.currentUser.groups();
  return groups.map((g: { Title: string }) => g.Title);
};