import React from 'react';
import type { Zone as ZoneType } from '../types.js';
interface LayoutContextProps {
    availableHeight: number;
    rowIndex: number;
    totalRows: number;
}
interface ZoneComponentProps {
    zone: ZoneType;
    width: string | number;
    innerWidth: number;
    height: string | number | 'auto';
    layoutContext: LayoutContextProps;
}
export declare const ZoneComponent: React.FC<ZoneComponentProps>;
export {};
//# sourceMappingURL=zone-component.d.ts.map