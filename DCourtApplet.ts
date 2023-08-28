import { Component } from '@angular/core';

import { arLoading } from './DCourt.Screens.Command/arLoading';
import { Screen } from './DCourt.Screens/Screen';
import { arNotice } from './DCourt.Screens.Utility/arNotice';
import { StaticLayout } from './DCourt.Tools/StaticLayout';
import { Tools } from './DCourt.Tools/Tools';

@Component({
  selector: 'app-dcourt-applet',
  template: '',
})
export class DCourtApplet {
  private artpath: string;
  private config: string;
  private cgibin: string;
  private today: string;
  private tools: Tools;
  static readonly badAccess = 'badAccess';
  private inBrowser = true;
  private playtest = false;
  region: Screen | null = null;

  constructor() {}

  prefferedSize(): Dimension {
    return new Dimension(Tools.DEFAULT_WIDTH, Tools.DEFAULT_HEIGHT);
  }

  init(): void {
    console.log('Dragon Court version 1.2');
    // Set layout and initialize variables
    this.setLayout(new StaticLayout());

    if (this.inBrowser) {
      const host: string = this.getCodeBase().getHost();
      this.config = this.getParameter('CONFIG');
      this.cgibin = `http://${host}${this.getParameter('CGIBIN')}`;
      this.artpath = `http://${host}${this.getParameter('ARTPATH')}`;
    } else {
      this.config = 'DCourt';
      this.cgibin = 'http://205.238.11.118/cgibin';
      this.artpath = 'Images';
    }

    this.playtest = this.config === 'DCourtWork';
    this.tools = new Tools(this);
    
    if (this.pirateTest()) {
      this.setRegion(new arNotice(null, DCourtApplet.badAccess));
    } else {
      this.setRegion(new arLoading(this, this.tools));
    }
  }

  getArtpath(): string {
    return this.artpath;
  }

  getConfig(): string {
    return this.config;
  }

  getCgibin(): string {
    return this.cgibin;
  }

  getToday(): string {
    return this.today;
  }

  isInBrowser(): boolean {
    return this.inBrowser;
  }

  setInBrowser(val: boolean): void {
    this.inBrowser = val;
  }

  isPlaytest(): boolean {
    return this.playtest;
  }

  setPlaytest(val: boolean): void {
    this.playtest = val;
  }

  getRegion(): Screen {
    return this.region;
  }

  setRegion(next: Screen): void {
    if (next !== null) {
      this.enable(false);
      this.removeAll();
      this.region = next;
      this.region.init();
      this.add(this.region);
      this.enable(true);
      this.region.repaint();
    }
  }

  update(g: Graphics): void {
    this.paint(g);
  }

  pirateTest(): boolean {
    if (!this.inBrowser) {
      return false;
    }
    const doc: URL = this.getDocumentBase();
    const code: URL = this.getCodeBase();
    if (doc === null || code === null) {
      return true;
    }
    const chost: string = code.getHost();
    const dhost: string = doc.getHost();
    return chost === null || dhost === null || !dhost.equalsIgnoreCase(chost);
  }
}
