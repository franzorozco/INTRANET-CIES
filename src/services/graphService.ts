import { WebPartContext } from '@microsoft/sp-webpart-base';
import { MSGraphClientV3 } from '@microsoft/sp-http-msgraph';
import { ResponseType } from '@microsoft/microsoft-graph-client';

export interface IUserGraphProfile {
  displayName: string;
  mail: string;
  userPrincipalName: string;
  jobTitle: string;
  department: string;
  officeLocation: string;
  mobilePhone?: string;
  companyName?: string;
  photoUrl?: string;
  isGraphConnected: boolean;
}

/**
 * Obtiene el perfil completo del usuario autenticado en Microsoft 365 vía Microsoft Graph.
 * Incluye nombre, correo, cargo, departamento, teléfono y foto oficial de Microsoft 365.
 */
export const getUserGraphProfile = async (context: WebPartContext): Promise<IUserGraphProfile> => {
  const fallbackEmail = context.pageContext?.user?.email || '';
  const fallbackName = context.pageContext?.user?.displayName || 'Usuario';
  const fallbackLogin = context.pageContext?.user?.loginName || fallbackEmail;

  try {
    // 1. Obtener cliente v3 de Microsoft Graph proporcionado por SPFx
    const client: MSGraphClientV3 = await context.msGraphClientFactory.getClient('3');

    // 2. Consultar el endpoint /me
    const me = await client.api('/me')
      .select('displayName,mail,userPrincipalName,jobTitle,department,officeLocation,mobilePhone,companyName')
      .get();

    let photoUrl: string | undefined = undefined;

    // 3. Intentar obtener la foto de perfil en Microsoft 365
    try {
      const photoBlob: Blob = await client.api('/me/photo/$value')
        .responseType(ResponseType.BLOB)
        .get();

      if (photoBlob && photoBlob.size > 0) {
        photoUrl = URL.createObjectURL(photoBlob);
      }
    } catch {
      // Si el usuario no tiene foto asignada en Microsoft 365, photoUrl queda undefined
    }

    return {
      displayName: me.displayName || fallbackName,
      mail: me.mail || me.userPrincipalName || fallbackEmail,
      userPrincipalName: me.userPrincipalName || fallbackLogin,
      jobTitle: me.jobTitle || 'Colaborador CIES',
      department: me.department || 'General',
      officeLocation: me.officeLocation || 'Oficina Nacional',
      mobilePhone: me.mobilePhone || undefined,
      companyName: me.companyName || 'CIES Salud Sexual Salud Reproductiva',
      photoUrl,
      isGraphConnected: true
    };
  } catch (err) {
    console.warn('No se pudo conectar directamente con Microsoft Graph (posible entorno local o permisos pendientes). Usando datos de SharePoint:', err);

    return {
      displayName: fallbackName,
      mail: fallbackEmail,
      userPrincipalName: fallbackLogin,
      jobTitle: 'Colaborador CIES',
      department: 'General',
      officeLocation: 'Oficina Nacional',
      mobilePhone: undefined,
      companyName: 'CIES Salud Sexual Salud Reproductiva',
      photoUrl: undefined,
      isGraphConnected: false
    };
  }
};
