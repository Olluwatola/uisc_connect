export interface CloudinaryUploadOptions {
  folder: string;
  public_id: string;
  transformation?: [
    {
      width?: number;
      height?: number;
      crop?: string;
      gravity?: string;
    }
  ];
  use_filename?: boolean;
  unique_filename?: boolean;
  overwrite?: boolean;
  resource_type: "auto" | "raw" | "image" | "video" | undefined;
}
