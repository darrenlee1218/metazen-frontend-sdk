class ConnectedHostInfo {
  private _hostDomain: string;
  constructor() {
    this._hostDomain = '';
  }

  public setHostDomin(hostDomain: string) {
    this._hostDomain = hostDomain;
  }

  public getHostDomain(): string {
    return this._hostDomain;
  }
}

export const connectedHostInfo = Object.seal(new ConnectedHostInfo());
