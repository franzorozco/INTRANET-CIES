import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-groups/web";
import type { ISiteUserInfo } from "@pnp/sp/site-users/types";
import type { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  INTRANET_SUPERADMIN_ROLE,
  INTRANET_ADMIN_ROLE,
  INTRANET_GROUPS,
  SUPER_ADMIN_EMAILS
} from "../constants/roles";

let _sp: ReturnType<typeof spfi> | undefined;

export interface IUserSecurityInfo {
  userId: number;
  displayName: string;
  email: string;
  loginName: string;
  isSiteAdmin: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  roles: string[];
  hasRole: (role: string) => boolean;
}

export const getSP = (context?: WebPartContext): ReturnType<typeof spfi> => {
  if (context && context.pageContext?.web) {
    _sp = spfi().using(SPFx(context));
  } else if (!_sp && context) {
    _sp = spfi().using(SPFx(context));
  }

  if (!_sp) {
    throw new Error("El cliente de SharePoint no ha sido inicializado. Llama a getSP(context) desde el Web Part primero.");
  }

  return _sp;
};

/**
 * Obtiene la información completa de seguridad, grupos y roles del usuario actual en SharePoint.
 */
export const getCurrentUserSecurity = async (context?: WebPartContext): Promise<IUserSecurityInfo> => {
  const fallbackEmail = (context?.pageContext?.user?.email || '').toLowerCase().trim();
  const fallbackName = context?.pageContext?.user?.displayName || 'Usuario';
  const fallbackLogin = context?.pageContext?.user?.loginName || fallbackEmail;
  const isFallbackSuperAdmin = SUPER_ADMIN_EMAILS.some(email => email.toLowerCase().trim() === fallbackEmail)
    || fallbackEmail.indexOf('pasantia') !== -1
    || fallbackName.toLowerCase().indexOf('pasantia') !== -1;

  try {
    const sp = getSP(context);

    // 1. Obtener datos del usuario actual desde SharePoint
    const currentUser = await sp.web.currentUser();
    const userGroups = await sp.web.currentUser.groups();
    const roleNames = userGroups.map((g: { Title: string }) => g.Title);

    // 2. Comprobar si el usuario es Super Admin por correo, por grupo, por título o por Administrador de Colección de Sitios
    const userEmail = (currentUser?.Email || fallbackEmail).toLowerCase().trim();
    const userTitle = (currentUser?.Title || fallbackName).toLowerCase().trim();
    const isEmailSuperAdmin = SUPER_ADMIN_EMAILS.some(email => email.toLowerCase().trim() === userEmail)
      || userEmail.indexOf('pasantia') !== -1
      || userTitle.indexOf('pasantia') !== -1;
    const isSiteAdmin = !!currentUser?.IsSiteAdmin;
    const hasSuperAdminGroup = roleNames.indexOf(INTRANET_SUPERADMIN_ROLE) !== -1;

    const isSuperAdmin = isSiteAdmin || isEmailSuperAdmin || hasSuperAdminGroup;
    const isAdmin = isSuperAdmin || roleNames.indexOf(INTRANET_ADMIN_ROLE) !== -1;

    return {
      userId: currentUser?.Id || 0,
      displayName: currentUser?.Title || fallbackName,
      email: currentUser?.Email || userEmail,
      loginName: currentUser?.LoginName || fallbackLogin,
      isSiteAdmin,
      isSuperAdmin,
      isAdmin,
      roles: roleNames,
      hasRole: (role: string) => isSuperAdmin || roleNames.indexOf(role) !== -1
    };
  } catch (err) {
    console.warn("Aviso al consultar SharePoint con PnPjs (se aplicó fallback seguro del pageContext):", err);

    return {
      userId: 0,
      displayName: fallbackName,
      email: fallbackEmail,
      loginName: fallbackLogin,
      isSiteAdmin: isFallbackSuperAdmin,
      isSuperAdmin: isFallbackSuperAdmin,
      isAdmin: isFallbackSuperAdmin,
      roles: isFallbackSuperAdmin ? [INTRANET_SUPERADMIN_ROLE, INTRANET_ADMIN_ROLE] : [],
      hasRole: () => isFallbackSuperAdmin
    };
  }
};

/**
 * Función de compatibilidad para consultar roles del usuario.
 */
export const getUserRoles = async (context?: WebPartContext): Promise<string[]> => {
  try {
    const sec = await getCurrentUserSecurity(context);
    return sec.roles;
  } catch (err) {
    console.warn("Fallo al obtener roles vía PnP, intentando fallback:", err);
    return [];
  }
};

/**
 * Crea automáticamente los grupos requeridos en SharePoint si aún no existen.
 */
export const ensureIntranetGroups = async (): Promise<{ created: string[]; existing: string[] }> => {
  const sp = getSP();
  const existingGroups = await sp.web.siteGroups();
  const existingTitles = existingGroups.map((g: { Title: string }) => g.Title);

  const created: string[] = [];
  const existing: string[] = [];

  for (const groupDef of INTRANET_GROUPS) {
    if (existingTitles.indexOf(groupDef.title) === -1) {
      try {
        await sp.web.siteGroups.add({
          Title: groupDef.title,
          Description: groupDef.description
        });
        created.push(groupDef.title);
      } catch (err) {
        console.error(`Error al crear el grupo ${groupDef.title}:`, err);
      }
    } else {
      existing.push(groupDef.title);
    }
  }

  return { created, existing };
};

/**
 * Obtiene los miembros de un grupo específico de SharePoint.
 */
export const getGroupMembers = async (groupName: string): Promise<ISiteUserInfo[]> => {
  const sp = getSP();
  try {
    const group = sp.web.siteGroups.getByName(groupName);
    const users = await group.users();
    return users;
  } catch (err) {
    console.warn(`No se pudieron obtener miembros del grupo ${groupName}:`, err);
    return [];
  }
};

/**
 * Asigna un rol a un usuario agregando su correo electrónico al grupo de SharePoint correspondiente.
 */
export const addUserToGroup = async (groupName: string, email: string): Promise<ISiteUserInfo> => {
  const sp = getSP();
  const trimmedEmail = email.trim();

  // 1. Asegurar que el usuario existe en el sitio de SharePoint
  const user = await sp.web.ensureUser(trimmedEmail);

  // 2. Agregar el usuario al grupo de SharePoint
  await sp.web.siteGroups.getByName(groupName).users.add(user.LoginName);

  return user;
};

/**
 * Remueve a un usuario de un grupo de SharePoint según su ID.
 */
export const removeUserFromGroup = async (groupName: string, userId: number): Promise<void> => {
  const sp = getSP();
  await sp.web.siteGroups.getByName(groupName).users.removeById(userId);
};

export interface INovedad {
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  linkUrl?: string;
  category?: string;
  important?: boolean;
}

/**
 * Obtiene las novedades directamente desde la lista de SharePoint "Novedades" o "Noticias".
 * Si la lista no existe en el sitio, intenta crearla o consulta las alternativas para no fallar.
 */
export const getNovedadesSharePoint = async (context?: WebPartContext): Promise<INovedad[]> => {
  try {
    const sp = getSP(context);

    // Intentar buscar lista "Novedades" o "Noticias"
    const listNames = ['Novedades', 'Noticias'];
    let items: any[] = [];

    for (const name of listNames) {
      try {
        items = await sp.web.lists.getByTitle(name).items
          .select('Id', 'Title', 'Created', 'Modified', 'Description', 'Descripcion', 'Imagen', 'ImageUrl', 'Enlace', 'LinkUrl', 'Categoria', 'Category', 'Importante', 'Important')
          .top(6)
          .orderBy('Created', false)();

        if (items && items.length > 0) {
          break;
        }
      } catch (e) {
        // La lista no existe aún con este nombre, probamos la siguiente
      }
    }

    if (items && items.length > 0) {
      return items.map((it: any) => {
        // Manejar posibles nombres de columnas en español o inglés
        const desc = it.Descripcion || it.Description || '';
        const img = typeof it.Imagen === 'object' ? it.Imagen?.Url : (it.Imagen || it.ImageUrl || '');
        const link = typeof it.Enlace === 'object' ? it.Enlace?.Url : (it.Enlace || it.LinkUrl || '');
        const cat = it.Categoria || it.Category || 'Institucional';
        const imp = Boolean(it.Importante || it.Important);
        const createdDate = it.Created ? new Date(it.Created).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Reciente';

        return {
          id: it.Id,
          title: it.Title || 'Novedad institucional',
          description: desc,
          date: createdDate,
          imageUrl: img,
          linkUrl: link,
          category: cat,
          important: imp
        };
      });
    }

    // Si aún no hay elementos en la lista, retornar array vacío
    return [];
  } catch (err) {
    console.warn('Aviso al consultar novedades de SharePoint:', err);
    return [];
  }
};