export interface IAppError extends Error {
  statusCode?: number;
  status?: string;
  code?: string;
}