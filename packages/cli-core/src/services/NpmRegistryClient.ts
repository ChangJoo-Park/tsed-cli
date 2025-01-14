import {Inject, Injectable} from "@tsed/di";
import {IPackageInfo} from "../interfaces/IPackageJson";
import {CliHttpClient} from "./CliHttpClient";

const HOST = require("registry-url")();

@Injectable()
export class NpmRegistryClient {
  @Inject(CliHttpClient)
  private httpClient: CliHttpClient;

  /**
   * Search a module on npm registry
   * @param text
   * @param options
   */
  async search(text: string, options: {size?: number; from?: number; quality?: number; popularity?: number; maintenance?: number} = {}) {
    const {objects: result} = await this.httpClient.get(`${HOST}-/v1/search`, {
      qs: {
        text,
        size: 100,
        from: 0,
        quality: 0.65,
        popularity: 0.98,
        maintenance: 0.5,
        ...options
      }
    });

    return result;
  }

  async info(packageName: string): Promise<IPackageInfo> {
    try {
      return await this.httpClient.get(`${HOST}${encodeURIComponent(packageName)}`);
    } catch (er) {
      const [{package: pkg}] = await this.search(packageName);

      return {
        ...pkg,
        "dist-tags": {
          latest: pkg.version
        }
      };
    }
  }
}
