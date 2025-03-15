// Hapus import yang tidak digunakan
declare module "next/server" {
  export interface RouteParams {
    params: Record<string, string>;
  }
}
