import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-groups/web";
import { WebPartContext } from "@microsoft/sp-webpart-base";

let _sp: ReturnType<typeof spfi> | null = null;

export const getSP = (context?: WebPartContext) => {
  if (!_sp && context) {
    _sp = spfi().using(SPFx(context));
  }
  return _sp!;
};

export const getUserRoles = async (): Promise<string[]> => {
  const sp = getSP();
  const groups = await sp.web.currentUser.groups();
  return groups.map((g: { Title: string }) => g.Title);
};