import { Color, Graphics } from 'java.awt';
import { Transfer } from 'DCourt.Screens.Template.Transfer';
import { itHero } from 'DCourt.Items.List.itHero';
import { Screen } from 'DCourt.Screens.Screen';
import { Tools } from 'DCourt.Tools.Tools';

class arStorage extends Transfer {
  constructor(from: Screen) {
    super(from, `Storage at ${from.getTitle()}`);
    this.setBackground(new Color(0, 0, 128));
    this.setForeground(Color.white);
    const h = Tools.getHero();
    this.setValues(h.storeMax(), Screen.getPack(), h.getStore());
  }

  localPaint(g: Graphics): void {
    super.localPaint(g);
    this.updateTools();
    g.setFont(Tools.statusF);
    g.setColor(this.getForeground());
    g.drawString(
      `Backpack ${Screen.getPack().getCount()}/${Screen.getHero().packMax()}`,
      30,
      65
    );
    g.drawString(
      `Storage ${this.stashCount()}/${this.getLimit()}`,
      230,
      65
    );
  }
}
