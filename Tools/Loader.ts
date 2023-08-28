class Buffer {
  constructor(data: string) {}
}

class Item {
  static factory(data: string): Item {
    return new Item();
  }
}

class Tools {
  static getCgibin(): string {
    return ""; // Implement this function as needed
  }

  static getConfig(): string {
    return ""; // Implement this function as needed
  }

  static getJvmVersion(): number {
    return 0; // Implement this function as needed
  }
}

class Loader {
  text: string = "";

  static readonly EXECFILE: string = "DCcgi17.exe";
  static readonly FINDHERO: string = "dbFind";
  static readonly SAVEHERO: string = "dbSaveIt";
  static readonly READHERO: string = "dbLoad";
  static readonly READRANK: string = "dbRank";
  static readonly SAVESCORE: string = "dbScore";
  static readonly SENDMAIL: string = "dbMail";
  static readonly TAKEMAIL: string = "dbTake";
  static readonly LISTMAIL: string = "dbList";
  static readonly MESSAGE: string = "dbMessage";
  static readonly PEEKCLAN: string = "dbPeekClan";
  static readonly MAKECLAN: string = "dbMakeClan";
  static readonly KILLCLAN: string = "dbKillClan";

  static cgiBuffer(action: string, data: string): Buffer {
    return new Buffer(Loader.cgi(action, data));
  }

  static cgiItem(action: string, data: string): Item {
    return Item.factory(Loader.cgi(action, data));
  }

  static cgi(action: string, data: string): string {
    console.log(action + " : " + data);
    return "";
    /*
    try {
      return operate(
              new URL(
                  String.valueOf(
                      String.valueOf(
                          new StringBuffer(String.valueOf(String.valueOf(Tools.getCgibin())))
                              .append("/")
                              .append(EXECFILE)
                              .append("?")
                              .append("cfg=")
                              .append(Tools.getConfig())
                              .append("&act=")
                              .append(action)))),
              data)
          .trim();
    } catch (MalformedURLException ex) {
      console.error(
          String.valueOf(
              String.valueOf(new StringBuffer("Loader Exception: [").append(ex).append("]"))));
      return "";
    }
    */
  }

  getText(): string {
    return this.text;
  }

  isError(): boolean {
    return this.text.startsWith("Error:");
  }

  static operate(path: URL, send: string): string {
    try {
      /*
      const con = path.openConnection();
      con.setDoInput(true);
      con.setUseCaches(false);
      con.setRequestProperty("content-type", "text/plain");
      con.setDoOutput(true);
      const buf = getBytes(send);
      con.setRequestProperty(
          "content-length", "".concat(String.valueOf(String.valueOf(buf.length))));
      try {
        const out = new DataOutputStream(con.getOutputStream());
        out.write(buf);
        out.flush();
        out.close();
        const size = con.getContentLength();
        if (size < 0 && Tools.getJvmVersion() > 0) {
          return "";
        }
        try {
          const in = new DataInputStream(con.getInputStream());
          return decrypt(size >= 0 ? newLoad(in, size) : oldLoad(in));
        } catch (Exception ex) {
          console.error(
              String.valueOf(
                  String.valueOf(new StringBuffer("Loader Exception [").append(ex).append("]"))));
          ex.printStackTrace();
          return "Loader.read() Exception: ".concat(String.valueOf(String.valueOf(ex)));
        }
      } catch (Exception ex2) {
        console.error(
            String.valueOf(
                String.valueOf(new StringBuffer("Loader Exception [").append(ex2).append("]"))));
        ex2.printStackTrace();
        return "Loader.send() Exception: ".concat(String.valueOf(String.valueOf(ex2)));
      }
      */
      return ""; // Implement this function as needed
    } catch (Exception ex3) {
      console.error(
          String.valueOf(
              String.valueOf(new StringBuffer("Loader Exception [").append(ex3).append("]"))));
      ex3.printStackTrace();
      return "Loader.open() Exception: ".concat(String.valueOf(String.valueOf(ex3)));
    }
  }

  static getBytes(msg: string): Uint8Array {
    if (msg === null) {
      return new Uint8Array(0);
    }
    const msg2 = encrypt(msg);
    if (Tools.getJvmVersion() > 0) {
      return new TextEncoder().encode(msg2);
    }
    const buf = new Uint8Array(msg2.length);
    for (let i = 0; i < msg2.length; i++) {
      buf[i] = msg2.charCodeAt(i);
    }
    return buf;
  }

  static newLoad(inStream: DataInputStream, size: number): string {
    const buf = new Uint8Array(size);
    inStream.readFully(buf);
    inStream.close();
    if (Tools.getJvmVersion() > 0) {
      return new TextDecoder().decode(buf);
    }
    let msg = "";
    for (const b of buf) {
      msg += String.fromCharCode(b);
    }
    return msg;
  }

  static oldLoad(inStream: DataInputStream): string {
    let msg = "";
    while (true) {
      const line = inStream.readLine();
      if (line === null) {
        break;
      }
      msg += line + "\n";
    }
    if (Tools.getJvmVersion() < 1) {
      const cut = msg.indexOf("\n\n");
      if (cut >= 0) {
        msg = msg.substring(cut + 2);
      }
    }
    return msg;
  }

  static encrypt(from: string): string {
    let result = "";
    const size = from.length;
    let dx = 0;
    for (let ix = 0; ix < size; ix++) {
      const temp = (from.charCodeAt(ix) + 128) & 127;
      if (temp < 32) {
        result += String.fromCharCode(temp);
      } else {
        result +=
          String.fromCharCode(((temp - 32 + ((size + dx) % 96)) % 96) + 32);
        dx++;
      }
    }
    return result;
  }

  static decrypt(from: string): string {
    let result = "";
    const size = from.length;
    let dx = 0;
    for (let ix = 0; ix < size; ix++) {
      const temp = (from.charCodeAt(ix) + 128) & 127;
      if (temp < 32) {
        result += String.fromCharCode(temp);
      } else {
        result +=
          String.fromCharCode(
            ((((temp - 32 + 96) - ((size + dx) % 96)) % 96) + 32)
          );
        dx++;
      }
    }
    return result;
  }
}
