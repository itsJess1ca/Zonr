export declare class ANSIRenderer {
    static clearScreen(): string;
    static moveCursor(row: number, col: number): string;
    static hideCursor(): string;
    static showCursor(): string;
    static setColor(color: string): string;
    static drawBox(x: number, y: number, width: number, height: number, color?: string): string;
    static drawText(x: number, y: number, text: string, color?: string, maxWidth?: number): string;
    static drawZoneHeader(x: number, y: number, title: string, width: number, color?: string): string;
    static render(content: string): void;
    static getTerminalSize(): {
        width: number;
        height: number;
    };
}
//# sourceMappingURL=ansi-renderer.d.ts.map