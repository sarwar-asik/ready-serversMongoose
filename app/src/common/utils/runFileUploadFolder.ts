import fs from 'fs';
import path from 'path';

export interface IDirectoryManager {
  ensureDirectoriesExist(baseDir?: string, folders?: string[]): void;
}

export class DirectoryManager implements IDirectoryManager {
  private readonly defaultBaseDir: string;
  private readonly defaultFolders: string[];

  constructor() {
    this.defaultBaseDir = path.join(__dirname, '../../../uploadFile');
    this.defaultFolders = [
      'images',
      'audios',
      'pdfs',
      'videos',
      'docs',
      'others',
    ];
  }

  /**
   * Ensures that the specified directories exist, creating them if necessary.
   * @param baseDir Optional custom base directory.
   * @param folders Optional list of folder names to create inside the base directory.
   */
  public ensureDirectoriesExist(baseDir?: string, folders?: string[]): void {
    const targetBaseDir = baseDir
      ? path.join(__dirname, baseDir)
      : this.defaultBaseDir;
    const targetFolders = folders || this.defaultFolders;

    this.createDirectoryIfNotExists(targetBaseDir);

    targetFolders.forEach(folder => {
      const folderPath = path.join(targetBaseDir, folder);
      this.createDirectoryIfNotExists(folderPath);
    });
  }

  /**
   * Creates a directory if it does not already exist.
   * @param dirPath The path of the directory to create.
   */
  private createDirectoryIfNotExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
      console.log(`Created directory: ${dirPath}`);
    }
  }
}

// Singleton instance for ease of use
export const directoryManager = new DirectoryManager();
