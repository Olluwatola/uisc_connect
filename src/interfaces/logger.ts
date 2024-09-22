export interface LogInfo {
  level: string;
  message: string;
  timestamp?: string;
  environment?: string; // Add environment to log info type
  [key: string]: any;
}
