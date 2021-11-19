export class Token {
  type: string;
  value: any;
  plugin: BasePlugin;

  static create({ plugin, value }) {
    return new Token({ plugin, value });
  }

  constructor({ plugin, value }) {
    this.type = plugin.name;
    this.value = value;
    this.plugin = plugin;
  }

  render(props) {
    return this.plugin.render(this, props);
  }
}

interface TestPayload {
  word: string;
  wordIndex: number;
  wordCount: number;
  line: string;
}

export class BasePlugin {
  name: string;
  test: (payload: TestPayload) => undefined | unknown;
  renderer: (token: Token, props: any) => unknown;
  priority?: number;
  meta?: unknown;

  static create: (
    options: Pick<BasePlugin, "name" | "test" | "renderer" | "priority">
  ) => BasePlugin;

  constructor({
    name,
    test,
    renderer,
    priority = 0,
    meta,
  }: Pick<BasePlugin, "name" | "test" | "renderer" | "priority" | "meta">) {
    this.name = name;
    this.test = test;
    this.renderer = renderer;
    this.priority = priority;
    this.meta = meta;
  }

  createCopy({ name, test, priority, renderer, meta }: Partial<BasePlugin>) {
    return new BasePlugin({
      name: name || this.name,
      test: test || this.test,
      renderer: renderer || this.renderer,
      priority: priority || this.priority,
      meta: meta || this.meta,
    });
  }

  render(token, props) {
    return this.renderer(token, props);
  }
}

BasePlugin.create = ({ name, test, renderer, priority = 0 }) =>
  new BasePlugin({
    name,
    test,
    renderer,
    priority,
  });
