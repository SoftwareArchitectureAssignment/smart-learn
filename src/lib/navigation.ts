let navigateFn: (path: string) => void;

export const setNavigator = (navigator: any) => {
  navigateFn = navigator;
};

export const navigate = (path: string) => {
  if (navigateFn) {
    navigateFn(path);
  } else {
    console.warn("Navigator function is not set.");
  }
};

const PRIVATE_PREFIXES = ["/teacher", "/student", "/admin"];
export const isPublicRoute = (path: string) => {
  return !PRIVATE_PREFIXES.some((prefix) => path.startsWith(prefix));
};
