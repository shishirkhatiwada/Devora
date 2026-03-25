"use client"
import { Extension } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { php } from "@codemirror/lang-php";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import { yaml } from "@codemirror/lang-yaml";
import { sass } from "@codemirror/lang-sass";
import { vue } from "@codemirror/lang-vue";
import { angular } from "@codemirror/lang-angular";
import { StreamLanguage } from "@codemirror/language";
import { go } from "@codemirror/legacy-modes/mode/go";
import { ruby } from "@codemirror/legacy-modes/mode/ruby";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import { swift } from "@codemirror/legacy-modes/mode/swift";
import { kotlin } from "@codemirror/legacy-modes/mode/clike";
import { toml } from "@codemirror/legacy-modes/mode/toml";
import { dockerFile } from "@codemirror/legacy-modes/mode/dockerfile";
import { lua } from "@codemirror/legacy-modes/mode/lua";
import { r } from "@codemirror/legacy-modes/mode/r";

export const getLanguageExtension = (filename: string): Extension => {
  const ext = filename.split(".").pop()?.toLowerCase();

  // Handle special filenames with no extension
  const basename = filename.split("/").pop()?.toLowerCase();
  if (basename === "dockerFile") return StreamLanguage.define(dockerFile);

  switch (ext) {
    // JavaScript family
    case "js":
      return javascript();
    case "jsx":
      return javascript({ jsx: true });
    case "ts":
      return javascript({ typescript: true });
    case "tsx":
      return javascript({ typescript: true, jsx: true });
    case "mjs":
    case "cjs":
      return javascript();

    // Web
    case "html":
    case "htm":
      return html();
    case "css":
      return css();
    case "scss":
      return sass({ indented: false });
    case "sass":
      return sass({ indented: true });
    case "vue":
      return vue();
    case "angular":
      return angular();

    // Data / config
    case "json":
    case "jsonc":
      return json();
    case "xml":
    case "svg":
    case "plist":
      return xml();
    case "yaml":
    case "yml":
      return yaml();
    case "toml":
      return StreamLanguage.define(toml);

    // Docs
    case "md":
    case "mdx":
      return markdown();

    // Systems languages
    case "rs":
      return rust();
    case "cpp":
    case "cc":
    case "cxx":
    case "h":
    case "hpp":
      return cpp();
    case "c":
      return cpp(); // close enough for syntax highlighting
    case "java":
      return java();
    case "swift":
      return StreamLanguage.define(swift);
    case "kt":
    case "kts":
      return StreamLanguage.define(kotlin);

    // Scripting
    case "py":
    case "pyw":
      return python();
    case "rb":
      return StreamLanguage.define(ruby);
    case "go":
      return StreamLanguage.define(go);
    case "lua":
      return StreamLanguage.define(lua);
    case "r":
      return StreamLanguage.define(r);
    case "php":
      return php();

    // Shell
    case "sh":
    case "bash":
    case "zsh":
      return StreamLanguage.define(shell);

    // SQL
    case "sql":
      return sql();

    default:
      return [];
  }
};