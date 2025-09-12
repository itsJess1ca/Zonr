import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import stringWidth from 'string-width';
import { globalEventEmitter } from '../events.js';
import { LayoutCalculator } from '../layout/calculator.js';
export const ZoneComponent = ({ zone, width, height, layoutContext }) => {
    const [messages, setMessages] = useState([]);
    // Work around Ink's wide character layout bug by using generous padding
    const padTextToWidth = (text, maxWidth) => {
        // If text is too long, truncate it first
        if (stringWidth(text) > maxWidth) {
            // Simple truncation - keep removing characters until it fits
            let truncated = text;
            while (stringWidth(truncated + '...') > maxWidth && stringWidth(truncated) > 0) {
                truncated = truncated.slice(0, -1);
            }
            text = truncated + '...';
        }
        // Ink has a bug with wide character layout - use generous padding to force consistency
        // This ensures all lines fill the zone completely, preventing border misalignment
        const baseWidth = stringWidth(text);
        const generousPadding = Math.max(0, maxWidth - baseWidth + 8); // Extra padding to fill completely
        return text + ' '.repeat(generousPadding);
    };
    useEffect(() => {
        const handleMessage = (logMessage) => {
            if (logMessage.zoneName === zone.name) {
                if (logMessage.level === 'clear') {
                    setMessages([]);
                }
                else {
                    setMessages(prev => [...prev, logMessage]);
                }
            }
        };
        globalEventEmitter.on(handleMessage);
        return () => {
            globalEventEmitter.off(handleMessage);
        };
    }, [zone.name]);
    const getColorForLevel = (level) => {
        switch (level) {
            case 'error': return 'red';
            case 'warn': return 'yellow';
            case 'debug': return 'gray';
            default: return 'white';
        }
    };
    const calculateOptimalHeight = () => {
        if (height !== 'auto')
            return height;
        // Use the new layout calculator
        const zoneInfo = {
            zone,
            width,
            height,
            rowIndex: layoutContext.rowIndex,
            isAutoHeight: true
        };
        const result = LayoutCalculator.calculateZoneAutoHeight(zoneInfo, messages.length, layoutContext.availableHeight);
        return result.calculatedHeight;
    };
    const getMaxDisplayableMessages = () => {
        if (height !== 'auto') {
            // For fixed height, still calculate overhead properly
            const zoneInfo = {
                zone,
                width,
                height,
                rowIndex: layoutContext.rowIndex,
                isAutoHeight: false
            };
            const result = LayoutCalculator.calculateZoneAutoHeight(zoneInfo, messages.length, layoutContext.availableHeight);
            return result.maxDisplayableMessages;
        }
        // For auto height, use the calculated maximum
        const zoneInfo = {
            zone,
            width,
            height,
            rowIndex: layoutContext.rowIndex,
            isAutoHeight: true
        };
        const result = LayoutCalculator.calculateZoneAutoHeight(zoneInfo, messages.length, layoutContext.availableHeight);
        return result.maxDisplayableMessages;
    };
    const actualHeight = calculateOptimalHeight();
    const maxMessages = getMaxDisplayableMessages();
    const messagesToShow = messages.slice(-maxMessages);
    return (_jsxs(Box, { width: width, height: actualHeight, position: "relative", children: [_jsx(Box, { width: "100%", height: "100%", borderStyle: "round", borderColor: zone.borderColor, paddingLeft: 1, paddingRight: 1, paddingBottom: 1, paddingTop: zone.showHeader ? 0 : 1, children: _jsx(Box, { flexDirection: "column", marginTop: zone.showHeader ? 1 : 0, children: messagesToShow.map((msg, index) => (_jsx(Text, { color: getColorForLevel(msg.level), children: padTextToWidth(msg.message, zone.innerWidth) }, index))) }) }), zone.showHeader && (_jsx(Box, { position: "absolute", children: _jsx(Text, { bold: true, color: "cyan", children: ` ${zone.name} ` }) }))] }));
};
//# sourceMappingURL=zone-component.js.map