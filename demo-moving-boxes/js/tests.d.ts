/// <reference path="demo.d.ts" />
declare var require: any;
declare var global: any;
declare module turn {
    function include(f: any): void;
}
declare module turn {
    function format(msg: string, ...args: string[]): string;
    var BLACK: string;
    var RED: string;
    var GREEN: string;
    var YELLOW: string;
    var BLUE: string;
    var MAGENTA: string;
    var CYAN: string;
    var WHITE: string;
    var RESET: string;
}
declare module turn {
    interface TestResult {
        label: string;
        tests: number;
        failed: number;
        failures: string[];
    }
}
declare module turn {
    interface TestLogger {
        (msg: any): void;
    }
}
declare module turn {
    interface Testable {
        label: string;
        execute(log: TestLogger): TestResult;
    }
}
declare module turn {
    class Assert {
        public true(a: boolean): void;
        public false(a: boolean): void;
        public equals(a: any, b: any): void;
        public instanceof(a: any, b: any): void;
        public near(a: number, b: number, fuz?: number): void;
        public array: ArrayAssert;
    }
    class ArrayAssert {
        public equals(a: any[], b: any[]): void;
    }
}
declare module turn {
    class TestCase implements Testable {
        public label: string;
        public assert: Assert;
        constructor(label: string);
        public execute(log: TestLogger): TestResult;
    }
}
declare module turn {
    class TestRunner {
        public tests: Testable[];
        public results: TestResult[];
        public total: number;
        public failed: number;
        public failures: string[];
        public log: TestLogger;
        constructor(log: TestLogger);
        public execute(): void;
        public register(t: Testable): void;
        public load(mod: any): void;
        public report(): void;
    }
}
declare module tests {
    class TestDummy extends turn.TestCase {
        public test_can_dummy(): void;
    }
}
declare var runner: turn.TestRunner;
