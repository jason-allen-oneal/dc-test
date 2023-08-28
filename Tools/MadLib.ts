class Hashtable {
  put(key: string, value: string): void {}
  get(key: string): string {}
  clone(): Hashtable {
    return new Hashtable();
  }
}

class MadLib {
  gender: string[][];
  table: Hashtable;
  text: string;

  constructor(msg: string) {
    this.gender = [
      ["$HE$", "he", "she"],
      ["$HIM$", "him", "her"],
      ["$HIS$", "his", "her"],
      ["$MAN$", "man", "woman"],
      ["$BOY$", "boy", "girl"],
    ];
    this.table = new Hashtable();
    this.text = "";
    this.append(msg);
    this.replace("$CR$", "\n");
    this.replace("$TB$", "\t");
    this.replace("$$", "$");
  }

  clone(): MadLib {
    return new MadLib(this);
  }

  getReplace(key: string): string {
    return this.table.get(key);
  }

  getText(): string {
    return this.update(this.text);
  }

  getFinal(): string {
    this.text = this.update(this.text);
    return this.text;
  }

  replace(key: string, val: string): void {
    this.table.put(key, val);
  }

  replace(key: string, num: number): void {
    this.table.put(key, `${num}`);
  }

  append(val: string): void {
    if (this.text == null) {
      this.text = "";
    }
    this.text += val;
  }

  genderize(male: boolean): void {
    const sex = male ? 1 : 2;
    for (const gender of this.gender) {
      this.replace(gender[0], gender[sex]);
    }
  }

  capitalize(): void {
    const work = this.text.split('');
    let spaces = 0;
    for (let ix = 0; ix < this.text.length; ix++) {
      const c = work[ix];
      if (c > ' ') {
        if (spaces > 1 && c >= 'a' && c <= 'z') {
          work[ix] = String.fromCharCode((c.charCodeAt(0) - 'a'.charCodeAt(0)) + 'A'.charCodeAt(0));
        }
        spaces = 0;
      } else {
        spaces++;
      }
    }
    this.text = work.join('');
  }

  update(from: string): string {
    let result = "";
    let ix = 0;
    while (true) {
      const dx = from.indexOf('$', ix);
      if (dx < 0) {
        break;
      }
      result += from.substring(ix, dx);
      ix = dx;
      const dx2 = from.indexOf('$', dx + 1);
      if (dx2 < 0) {
        break;
      }
      const sub = from.substring(ix, dx2 + 1);
      ix = dx2 + 1;
      const put = this.getReplace(sub);
      result += put == null ? sub : this.update(put);
    }
    result += from.substring(ix);
    return result;
  }
}
