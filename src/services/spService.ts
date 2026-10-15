import type { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient } from "@microsoft/sp-http";

interface ISharePointGroup {
  Title: string;
}

interface ISharePointGroupsResponse {
  value?: ISharePointGroup[];
  d?: {
    results: ISharePointGroup[];
  };
}

export const getUserRoles = async (context: WebPartContext): Promise<string[]> => {
  const webUrl = context.pageContext && context.pageContext.web && context.pageContext.web.absoluteUrl;
  if (!webUrl) {
    throw new Error("No se pudo obtener la dirección del sitio de SharePoint desde el contexto del Web Part.");
  }

  const response = await context.spHttpClient.get(
    `${webUrl}/_api/web/currentuser/groups?$select=Title`,
    SPHttpClient.configurations.v1
  );

  if (!response.ok) {
    throw new Error(`SharePoint rechazó la consulta de grupos (HTTP ${response.status} ${response.statusText}).`);
  }

  const result = await response.json() as ISharePointGroupsResponse;
  const groups = result.value || (result.d && result.d.results);
  if (!groups) {
    throw new Error("SharePoint devolvió una respuesta de grupos con un formato no reconocido.");
  }

  return groups.map((group) => group.Title);
};